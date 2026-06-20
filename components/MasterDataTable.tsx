'use client';

import { FormEvent, useMemo, useState } from 'react';

type Status = 'Active' | 'Inactive' | string;

export type MasterColumn<T> = {
  key: keyof T & string;
  label: string;
  locked?: boolean;
  defaultVisible?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

export type MasterFilter = {
  key: string;
  label: string;
  options: string[];
};

type MasterDataTableProps<T extends { id: string; status?: Status }> = {
  title: string;
  description: string;
  createLabel: string;
  searchPlaceholder: string;
  columns: MasterColumn<T>[];
  rows: T[];
  searchKeys: (keyof T & string)[];
  filters: MasterFilter[];
  primaryKey: keyof T & string;
};

type ModalMode = 'create' | 'view' | 'edit' | null;

function Badge({ value }: { value: Status }) {
  const isActive = String(value).toLowerCase() === 'active' || String(value).toLowerCase() === 'yes';
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
      {value || '-'}
    </span>
  );
}

function toCsvValue(value: unknown) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv<T extends { id: string }>(title: string, columns: MasterColumn<T>[], rows: T[]) {
  const header = columns.map((column) => column.label).join(',');
  const body = rows.map((row) => columns.map((column) => toCsvValue(row[column.key])).join(',')).join('\n');
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function normalize(value: unknown) {
  return String(value ?? '').trim();
}

function nextCountryId<T extends { id: string }>(rows: T[]) {
  const max = rows.reduce((highest, row) => {
    const value = String((row as Record<string, unknown>).countryId || '');
    const match = value.match(/CN-(\d+)/i);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return `CN-${String(max + 1).padStart(3, '0')}`;
}

function buildEmptyRecord<T extends { id: string; status?: Status }>(columns: MasterColumn<T>[], rows: T[]) {
  const record: Record<string, string> = {};
  columns.forEach((column) => {
    if (column.key === 'countryId') record[column.key] = nextCountryId(rows);
    else if (column.key === 'presenceStatus') record[column.key] = 'No';
    else if (column.key === 'status') record[column.key] = 'Active';
    else if (column.key === 'owner' || column.key === 'createdBy' || column.key === 'lastModifiedBy') record[column.key] = 'admin@satguruai.com';
    else record[column.key] = '';
  });
  record.id = `row-${Date.now()}`;
  return record;
}

function validateCountryRecord<T extends { id: string }>(rows: T[], currentId: string | undefined, draft: Record<string, string>) {
  const countryName = normalize(draft.countryName);
  const countryId = normalize(draft.countryId).toUpperCase();
  const iso2 = normalize(draft.iso2).toUpperCase();
  const iso3 = normalize(draft.iso3).toUpperCase();
  const dialingCode = normalize(draft.dialingCode);

  if (!countryName || !countryId || !iso2 || !iso3 || !dialingCode || !normalize(draft.continent)) {
    return 'Country Name, Country ID, ISO-2, ISO-3, Dialing Code and Continent are mandatory.';
  }
  if (iso2.length !== 2) return 'ISO-2 must be exactly 2 characters.';
  if (iso3.length !== 3) return 'ISO-3 must be exactly 3 characters.';
  if (!dialingCode.startsWith('+')) return 'Dialing Code must start with +.';

  const duplicate = rows.find((row) => {
    const data = row as Record<string, unknown>;
    return row.id !== currentId && (
      String(data.countryName || '').toLowerCase() === countryName.toLowerCase() ||
      String(data.countryId || '').toLowerCase() === countryId.toLowerCase() ||
      String(data.iso2 || '').toLowerCase() === iso2.toLowerCase() ||
      String(data.iso3 || '').toLowerCase() === iso3.toLowerCase()
    );
  });

  return duplicate ? 'Duplicate Country Name, Country ID, ISO-2 or ISO-3 is not allowed.' : '';
}

export function MasterDataTable<T extends { id: string; status?: Status }>({
  title,
  description,
  createLabel,
  searchPlaceholder,
  columns,
  rows,
  searchKeys,
  filters,
  primaryKey
}: MasterDataTableProps<T>) {
  const [tableRows, setTableRows] = useState(rows);
  const [query, setQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState(
    () => new Set(columns.filter((column) => column.locked || column.defaultVisible !== false).map((column) => column.key))
  );
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [message, setMessage] = useState('');
  const [showColumns, setShowColumns] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const terms = normalizedQuery.split(/\s+/).filter(Boolean);

    return tableRows.filter((row) => {
      const searchPool = searchKeys.map((key) => String(row[key] ?? '').toLowerCase()).join(' ');
      const matchesSearch = terms.length === 0 || terms.every((term) => searchPool.includes(term));
      const matchesFilters = filters.every((filter) => {
        const selected = filterValues[filter.key];
        if (!selected) return true;
        return String(row[filter.key as keyof T] ?? '') === selected;
      });
      return matchesSearch && matchesFilters;
    });
  }, [filterValues, filters, query, searchKeys, tableRows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginatedRows = filteredRows.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);
  const activeColumns = columns.filter((column) => visibleColumns.has(column.key));
  const activeCount = tableRows.filter((row) => String(row.status || '').toLowerCase() === 'active').length;
  const inactiveCount = tableRows.filter((row) => String(row.status || '').toLowerCase() === 'inactive').length;
  const presenceCount = tableRows.filter((row) => String((row as Record<string, unknown>).presenceStatus || '').toLowerCase() === 'yes').length;

  function resetFilters() {
    setQuery('');
    setFilterValues({});
    setPage(1);
  }

  function openCreate() {
    setMessage('');
    setSelectedRow(null);
    setFormValues(buildEmptyRecord(columns, tableRows));
    setModalMode('create');
  }

  function openRow(row: T, mode: 'view' | 'edit') {
    const values: Record<string, string> = {};
    columns.forEach((column) => { values[column.key] = String(row[column.key] ?? ''); });
    setMessage('');
    setSelectedRow(row);
    setFormValues(values);
    setModalMode(mode);
  }

  async function persistCountry(row: T, mode: 'create' | 'edit') {
    if (title !== 'Country Master') return;
    const endpoint = mode === 'create' ? '/api/admin/countries' : `/api/admin/countries/${encodeURIComponent(row.id)}`;
    await fetch(endpoint, {
      method: mode === 'create' ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    }).catch(() => null);
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (title === 'Country Master') {
      const validation = validateCountryRecord(tableRows, selectedRow?.id, formValues);
      if (validation) {
        setMessage(validation);
        return;
      }
    }

    const normalized = { ...(selectedRow || {}), ...formValues } as Record<string, unknown>;
    normalized.id = selectedRow?.id || `country-${String(formValues.countryId || Date.now()).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    normalized.countryId = String(normalized.countryId || '').toUpperCase();
    normalized.iso2 = String(normalized.iso2 || '').toUpperCase();
    normalized.iso3 = String(normalized.iso3 || '').toUpperCase();
    normalized.lastModifiedBy = 'admin@satguruai.com';
    if (!normalized.createdBy) normalized.createdBy = 'admin@satguruai.com';

    const draft = normalized as T;

    if (modalMode === 'create') {
      setTableRows((current) => [draft, ...current]);
      await persistCountry(draft, 'create');
      setMessage('Country created. No-delete policy is active; use Inactivate when required.');
    }

    if (modalMode === 'edit') {
      setTableRows((current) => current.map((row) => row.id === draft.id ? draft : row));
      await persistCountry(draft, 'edit');
      setMessage('Country updated.');
    }

    setModalMode(null);
    setSelectedRow(null);
  }

  async function toggleStatus(row: T) {
    const next = { ...row, status: row.status === 'Inactive' ? 'Active' : 'Inactive', lastModifiedBy: 'admin@satguruai.com' } as T;
    setTableRows((current) => current.map((item) => item.id === row.id ? next : item));
    await persistCountry(next, 'edit');
  }

  const isViewMode = modalMode === 'view';

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-saffron">Settings / Master Data</p>
          <h1 className="text-3xl font-black text-navy">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">{description}</p>
        </div>
        <button className="btn-primary whitespace-nowrap" onClick={openCreate}>{createLabel}</button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="card"><p className="text-xs font-bold uppercase text-slate-400">Total</p><p className="mt-2 text-3xl font-black text-navy">{tableRows.length}</p></div>
        <div className="card"><p className="text-xs font-bold uppercase text-slate-400">Active</p><p className="mt-2 text-3xl font-black text-emerald-700">{activeCount}</p></div>
        <div className="card"><p className="text-xs font-bold uppercase text-slate-400">Presence</p><p className="mt-2 text-3xl font-black text-navy">{presenceCount}</p></div>
        <div className="card"><p className="text-xs font-bold uppercase text-slate-400">Inactive</p><p className="mt-2 text-3xl font-black text-slate-500">{inactiveCount}</p></div>
      </div>

      {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">{message}</div> : null}

      <div className="card space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input
            className="input lg:max-w-md"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => setShowFilters((value) => !value)}>Filters</button>
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => setShowColumns((value) => !value)}>Columns</button>
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => downloadCsv(title, columns, filteredRows)}>Export CSV</button>
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={resetFilters}>Reset</button>
          </div>
        </div>

        {showFilters && (
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">
            {filters.map((filter) => (
              <label className="text-sm font-semibold text-slate-600" key={filter.key}>
                {filter.label}
                <select
                  className="input mt-1"
                  value={filterValues[filter.key] || ''}
                  onChange={(event) => {
                    setFilterValues((current) => ({ ...current, [filter.key]: event.target.value }));
                    setPage(1);
                  }}
                >
                  <option value="">All</option>
                  {filter.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            ))}
            <div className="flex items-end text-sm font-semibold text-slate-500">No delete allowed. Inactivate records instead.</div>
          </div>
        )}

        {showColumns && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-navy">Column Selection</p>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {columns.map((column) => (
                <label className="flex items-center gap-2 text-sm" key={column.key}>
                  <input
                    type="checkbox"
                    checked={visibleColumns.has(column.key)}
                    disabled={column.locked}
                    onChange={(event) => {
                      setVisibleColumns((current) => {
                        const next = new Set(current);
                        if (event.target.checked) next.add(column.key);
                        else next.delete(column.key);
                        return next;
                      });
                    }}
                  />
                  {column.label}{column.locked ? ' (locked)' : ''}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Select</th>
                {activeColumns.map((column) => <th className="px-4 py-3" key={column.key}>{column.label}</th>)}
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row) => (
                <tr className={`border-t ${row.status === 'Inactive' ? 'bg-slate-50 text-slate-500' : ''}`} key={row.id}>
                  <td className="px-4 py-3"><input type="checkbox" /></td>
                  {activeColumns.map((column) => {
                    const value = row[column.key];
                    const content = column.render ? column.render(value, row) : column.key === 'status' || column.key === 'presenceStatus' ? <Badge value={String(value)} /> : String(value ?? '-');
                    return (
                      <td className="px-4 py-3" key={column.key}>
                        {column.key === primaryKey ? (
                          <button className="font-bold text-navy underline-offset-4 hover:underline" onClick={() => openRow(row, 'view')}>{content}</button>
                        ) : content}
                      </td>
                    );
                  })}
                  <td className="whitespace-nowrap px-4 py-3 text-navy">
                    <button className="font-bold hover:underline" onClick={() => openRow(row, 'view')}>View</button>
                    <span className="px-2 text-slate-300">|</span>
                    <button className="font-bold hover:underline" onClick={() => openRow(row, 'edit')}>Edit</button>
                    <span className="px-2 text-slate-300">|</span>
                    <button className="font-bold hover:underline" onClick={() => toggleStatus(row)}>{row.status === 'Inactive' ? 'Activate' : 'Inactivate'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginatedRows.length === 0 && <div className="p-8 text-center text-sm text-slate-500">No matching records found.</div>}
        </div>

        <div className="flex flex-col justify-between gap-3 text-sm text-slate-600 md:flex-row md:items-center">
          <span>Showing {paginatedRows.length ? (safePage - 1) * rowsPerPage + 1 : 0} to {Math.min(safePage * rowsPerPage, filteredRows.length)} of {filteredRows.length} entries</span>
          <div className="flex items-center gap-2">
            <select className="rounded-lg border border-slate-200 px-2 py-1" value={rowsPerPage} onChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(1); }}>
              {[10, 25, 50, 100].map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
            <button className="rounded-lg border border-slate-200 px-3 py-1 disabled:opacity-40" disabled={safePage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Prev</button>
            <span>Page {safePage} of {totalPages}</span>
            <button className="rounded-lg border border-slate-200 px-3 py-1 disabled:opacity-40" disabled={safePage >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</button>
          </div>
        </div>
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <form className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl" onSubmit={submitForm}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-saffron">{title} / {modalMode === 'create' ? 'Create' : modalMode === 'edit' ? 'Edit' : 'Read View'}</p>
                <h2 className="text-2xl font-black text-navy">{formValues[primaryKey] || 'New Record'}</h2>
              </div>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold" onClick={() => setModalMode(null)} type="button">Close</button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {columns.map((column) => {
                const isSelect = column.key === 'presenceStatus' || column.key === 'status';
                const disabled = isViewMode || (modalMode === 'edit' && column.key === 'countryId') || column.key === 'createdBy' || column.key === 'lastModifiedBy';
                return (
                  <label className="grid gap-1 text-sm font-bold text-slate-700" key={column.key}>
                    {column.label}
                    {isSelect ? (
                      <select className="input" disabled={disabled} value={formValues[column.key] || ''} onChange={(event) => setFormValues((current) => ({ ...current, [column.key]: event.target.value }))}>
                        {(column.key === 'presenceStatus' ? ['Yes', 'No'] : ['Active', 'Inactive']).map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    ) : column.key === 'remarks' ? (
                      <textarea className="input min-h-[90px]" disabled={disabled} value={formValues[column.key] || ''} onChange={(event) => setFormValues((current) => ({ ...current, [column.key]: event.target.value }))} />
                    ) : (
                      <input className="input" disabled={disabled} value={formValues[column.key] || ''} onChange={(event) => setFormValues((current) => ({ ...current, [column.key]: event.target.value }))} />
                    )}
                  </label>
                );
              })}
            </div>

            {message ? <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">{message}</p> : null}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              {modalMode === 'view' && selectedRow ? <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-navy" type="button" onClick={() => openRow(selectedRow, 'edit')}>Edit</button> : null}
              {modalMode !== 'view' ? <button className="btn-primary" type="submit">Save</button> : null}
              <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-navy" type="button" onClick={() => setModalMode(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
