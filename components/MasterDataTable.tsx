'use client';

import { FormEvent, useMemo, useState } from 'react';

type Status = 'Active' | 'Inactive' | string;
type ModalMode = 'create' | 'view' | 'edit' | null;

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

function Badge({ value }: { value: Status }) {
  const text = String(value || '-');
  const active = text.toLowerCase() === 'active' || text.toLowerCase() === 'yes' || text.toLowerCase() === 'presence';
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black ring-1 ${active ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : 'bg-orange-50 text-orange-700 ring-orange-100'}`}>
      {text}
    </span>
  );
}

function StatusSwitch({ value }: { value: Status }) {
  const active = String(value).toLowerCase() === 'active';
  return (
    <span className={`inline-flex h-6 w-11 items-center rounded-full p-1 transition ${active ? 'bg-emerald-600' : 'bg-slate-300'}`}>
      <span className={`h-4 w-4 rounded-full bg-white shadow transition ${active ? 'translate-x-5' : 'translate-x-0'}`} />
    </span>
  );
}

function toCsvValue(value: unknown) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv<T extends { id: string }>(title: string, columns: MasterColumn<T>[], rows: T[], suffix = 'Export') {
  const header = columns.map((column) => column.label).join(',');
  const body = rows.map((row) => columns.map((column) => toCsvValue(row[column.key])).join(',')).join('\n');
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/\s+/g, '_')}_${suffix}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function normalize(value: unknown) {
  return String(value ?? '').trim();
}

function rowValue<T extends { id: string }>(row: T, key: string) {
  return String((row as Record<string, unknown>)[key] ?? '');
}

function nextCountryId<T extends { id: string }>(rows: T[]) {
  const max = rows.reduce((highest, row) => {
    const match = rowValue(row, 'countryId').match(/CN-(\d+)/i);
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

  if (!countryName || !countryId || !iso2 || !iso3 || !dialingCode || !normalize(draft.continent)) return 'Country Name, Country ID, ISO-2, ISO-3, Dialing Code and Continent are mandatory.';
  if (iso2.length !== 2) return 'ISO-2 must be exactly 2 characters.';
  if (iso3.length !== 3) return 'ISO-3 must be exactly 3 characters.';
  if (!dialingCode.startsWith('+')) return 'Dialing Code must start with +.';

  const duplicate = rows.find((row) => row.id !== currentId && (
    rowValue(row, 'countryName').toLowerCase() === countryName.toLowerCase() ||
    rowValue(row, 'countryId').toLowerCase() === countryId.toLowerCase() ||
    rowValue(row, 'iso2').toLowerCase() === iso2.toLowerCase() ||
    rowValue(row, 'iso3').toLowerCase() === iso3.toLowerCase()
  ));

  return duplicate ? 'Duplicate Country Name, Country ID, ISO-2 or ISO-3 is not allowed.' : '';
}

function visiblePages(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const pages = new Set([1, total, current, Math.max(1, current - 1), Math.min(total, current + 1)]);
  return Array.from(pages).sort((a, b) => a - b);
}

export function MasterDataTable<T extends { id: string; status?: Status }>({ title, description, createLabel, searchPlaceholder, columns, rows, searchKeys, filters, primaryKey }: MasterDataTableProps<T>) {
  const [tableRows, setTableRows] = useState(rows);
  const [query, setQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState(() => new Set(columns.filter((column) => column.locked || column.defaultVisible !== false).map((column) => column.key)));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [message, setMessage] = useState('');
  const [showColumns, setShowColumns] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [goToPage, setGoToPage] = useState('1');

  const filteredRows = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return tableRows.filter((row) => {
      const searchPool = searchKeys.map((key) => String(row[key] ?? '').toLowerCase()).join(' ');
      const matchesSearch = terms.length === 0 || terms.every((term) => searchPool.includes(term));
      const matchesFilters = filters.every((filter) => !filterValues[filter.key] || rowValue(row, filter.key) === filterValues[filter.key]);
      return matchesSearch && matchesFilters;
    });
  }, [filterValues, filters, query, searchKeys, tableRows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginatedRows = filteredRows.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);
  const activeColumns = columns.filter((column) => visibleColumns.has(column.key));
  const defaultColumns = columns.filter((column) => column.locked || column.defaultVisible !== false);
  const selectedRows = tableRows.filter((row) => selectedIds.has(row.id));
  const activeCount = tableRows.filter((row) => String(row.status || '').toLowerCase() === 'active').length;
  const inactiveCount = tableRows.filter((row) => String(row.status || '').toLowerCase() === 'inactive').length;
  const presenceCount = tableRows.filter((row) => rowValue(row, 'presenceStatus').toLowerCase() === 'yes').length;
  const continentCount = new Set(tableRows.map((row) => rowValue(row, 'continent')).filter(Boolean)).size;
  const subcontinentCount = new Set(tableRows.map((row) => rowValue(row, 'subcontinent')).filter(Boolean)).size;
  const isFiltered = Boolean(query.trim()) || Object.values(filterValues).some(Boolean);

  function resetFilters() { setQuery(''); setFilterValues({}); setPage(1); }
  function openCreate() { setMessage(''); setSelectedRow(null); setFormValues(buildEmptyRecord(columns, tableRows)); setModalMode('create'); }
  function openRow(row: T, mode: 'view' | 'edit') {
    const values: Record<string, string> = {};
    columns.forEach((column) => { values[column.key] = String(row[column.key] ?? ''); });
    setMessage(''); setSelectedRow(row); setFormValues(values); setModalMode(mode);
  }
  async function persistCountry(row: T, mode: 'create' | 'edit') {
    if (title !== 'Country Master') return;
    const endpoint = mode === 'create' ? '/api/admin/countries' : `/api/admin/countries/${encodeURIComponent(row.id)}`;
    await fetch(endpoint, { method: mode === 'create' ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(row) }).catch(() => null);
  }
  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title === 'Country Master') {
      const validation = validateCountryRecord(tableRows, selectedRow?.id, formValues);
      if (validation) { setMessage(validation); return; }
    }
    const normalized = { ...(selectedRow || {}), ...formValues } as Record<string, unknown>;
    normalized.id = selectedRow?.id || `country-${String(formValues.countryId || Date.now()).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    normalized.countryId = rowValue(normalized as T, 'countryId').toUpperCase();
    normalized.iso2 = rowValue(normalized as T, 'iso2').toUpperCase();
    normalized.iso3 = rowValue(normalized as T, 'iso3').toUpperCase();
    normalized.lastModifiedBy = 'admin@satguruai.com';
    if (!normalized.createdBy) normalized.createdBy = 'admin@satguruai.com';
    const draft = normalized as T;
    if (modalMode === 'create') { setTableRows((current) => [draft, ...current]); await persistCountry(draft, 'create'); setMessage('Country created. No-delete policy is active; use Inactivate when required.'); }
    if (modalMode === 'edit') { setTableRows((current) => current.map((row) => row.id === draft.id ? draft : row)); await persistCountry(draft, 'edit'); setMessage('Country updated.'); }
    setModalMode(null); setSelectedRow(null);
  }
  async function toggleStatus(row: T) {
    const next = { ...row, status: row.status === 'Inactive' ? 'Active' : 'Inactive', lastModifiedBy: 'admin@satguruai.com' } as T;
    setTableRows((current) => current.map((item) => item.id === row.id ? next : item));
    await persistCountry(next, 'edit');
  }
  function toggleSelection(id: string) { setSelectedIds((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; }); }
  function toggleVisibleSelection() { setSelectedIds((current) => { const next = new Set(current); const all = paginatedRows.length > 0 && paginatedRows.every((row) => next.has(row.id)); paginatedRows.forEach((row) => all ? next.delete(row.id) : next.add(row.id)); return next; }); }
  function exportRows(mode: 'selected' | 'default' | 'view' | 'all') {
    if (mode === 'selected') { if (!selectedRows.length) { setMessage('No rows selected for export.'); return; } downloadCsv(title, activeColumns, selectedRows, 'Selected'); }
    if (mode === 'default') downloadCsv(title, defaultColumns, filteredRows, 'Default_View');
    if (mode === 'view') downloadCsv(title, activeColumns, filteredRows, 'My_View');
    if (mode === 'all') downloadCsv(title, columns, tableRows, 'All');
    setShowExport(false);
  }
  function jumpToPage() { const numeric = Number(goToPage); if (!Number.isFinite(numeric)) return; setPage(Math.min(Math.max(1, Math.floor(numeric)), totalPages)); }

  const isViewMode = modalMode === 'view';
  const pageNumbers = visiblePages(safePage, totalPages);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <div className="flex items-center gap-2 text-sm font-black text-slate-400"><span>Master Data</span><span>/</span><span className="text-emerald-700">Country</span></div>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">{title}</h1>
          <p className="mt-2 max-w-4xl text-sm font-medium leading-6 text-slate-500">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary" onClick={openCreate}>{createLabel}</button>
          <div className="relative">
            <button className="btn-secondary" onClick={() => setShowExport((value) => !value)}>Export</button>
            {showExport ? <div className="absolute right-0 z-40 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"><button className="block w-full rounded-xl px-4 py-3 text-left text-sm font-bold hover:bg-emerald-50" onClick={() => exportRows('selected')}>Export Current Selections</button><button className="block w-full rounded-xl px-4 py-3 text-left text-sm font-bold hover:bg-emerald-50" onClick={() => exportRows('default')}>Export Default View</button><button className="block w-full rounded-xl px-4 py-3 text-left text-sm font-bold hover:bg-emerald-50" onClick={() => exportRows('view')}>Export My View</button><button className="block w-full rounded-xl px-4 py-3 text-left text-sm font-bold hover:bg-emerald-50" onClick={() => exportRows('all')}>Export All</button></div> : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[['Total Countries', tableRows.length, 'bg-emerald-50 text-emerald-700'], ['Active Countries', activeCount, 'bg-teal-50 text-teal-700'], ['Inactive Countries', inactiveCount, 'bg-orange-50 text-orange-700'], ['Continents', continentCount, 'bg-blue-50 text-blue-700'], ['Subcontinents', subcontinentCount, 'bg-violet-50 text-violet-700']].map(([label, value, tone]) => <div className="card card-hover flex items-center gap-4" key={String(label)}><div className={`grid h-14 w-14 place-items-center rounded-2xl ${tone as string}`}><span className="h-3 w-3 rounded-full bg-current" /></div><div><p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-3xl font-black text-slate-950">{value}</p></div></div>)}
      </div>

      {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800 shadow-sm">{message}</div> : null}

      <div className="card space-y-4">
        <div className="grid gap-3 xl:grid-cols-[1.2fr_2fr_auto] xl:items-end">
          <div><label className="text-xs font-black uppercase tracking-wide text-slate-400">Search</label><input className="input mt-1 h-12" placeholder={searchPlaceholder} value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></div>
          <div className="grid gap-3 md:grid-cols-3">{filters.map((filter) => <label className="text-xs font-black uppercase tracking-wide text-slate-400" key={filter.key}>{filter.label}<select className="input mt-1 h-12" value={filterValues[filter.key] || ''} onChange={(event) => { setFilterValues((current) => ({ ...current, [filter.key]: event.target.value })); setPage(1); }}><option value="">All</option>{filter.options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>)}</div>
          <div className="flex flex-wrap justify-end gap-2"><button className="btn-secondary" onClick={() => setShowFilters((value) => !value)}>More Filters</button><button className="btn-secondary" onClick={() => setShowColumns((value) => !value)}>Columns</button><button className="rounded-xl px-4 py-2 text-sm font-black text-emerald-700 hover:bg-emerald-50" onClick={resetFilters}>Clear All</button></div>
        </div>
        {isFiltered || selectedIds.size ? <div className="flex flex-wrap gap-2">{query ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Search: {query}</span> : null}{Object.entries(filterValues).filter(([, value]) => value).map(([key, value]) => <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700" key={key}>{key}: {value}</span>)}{selectedIds.size ? <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">Selected: {selectedIds.size}</span> : null}</div> : null}
        {showColumns ? <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-black text-slate-950">Column Selection</p><div className="mt-3 grid gap-2 md:grid-cols-3 xl:grid-cols-4">{columns.map((column) => <label className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold shadow-sm" key={column.key}><input type="checkbox" checked={visibleColumns.has(column.key)} disabled={column.locked} onChange={(event) => setVisibleColumns((current) => { const next = new Set(current); event.target.checked ? next.add(column.key) : next.delete(column.key); return next; })} />{column.label}{column.locked ? ' (locked)' : ''}</label>)}</div></div> : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 text-sm font-bold text-slate-500"><span>{filteredRows.length ? `Showing ${paginatedRows.length ? (safePage - 1) * rowsPerPage + 1 : 0} to ${Math.min(safePage * rowsPerPage, filteredRows.length)} of ${filteredRows.length} entries${isFiltered ? ` (Total: ${tableRows.length})` : ''}` : 'No records found'}</span><span>No-delete policy: use Inactivate</span></div>
        <div className="table-scrollbar max-h-[650px] overflow-auto">
          <table className="w-full min-w-[1280px] text-left text-sm"><thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 shadow-sm"><tr><th className="px-5 py-4"><input type="checkbox" checked={paginatedRows.length > 0 && paginatedRows.every((row) => selectedIds.has(row.id))} onChange={toggleVisibleSelection} /></th>{activeColumns.map((column) => <th className="px-5 py-4" key={column.key}>{column.label}</th>)}<th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody>{paginatedRows.map((row, index) => <tr className={`border-t border-slate-100 transition hover:bg-emerald-50/50 ${selectedIds.has(row.id) ? 'bg-emerald-50' : index % 2 ? 'bg-slate-50/30' : 'bg-white'} ${row.status === 'Inactive' ? 'text-slate-500' : ''}`} key={row.id}><td className="px-5 py-4"><input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleSelection(row.id)} /></td>{activeColumns.map((column) => { const value = row[column.key]; const raw = String(value ?? '-'); let content = column.render ? column.render(value, row) : column.key === 'status' ? <StatusSwitch value={raw} /> : column.key === 'presenceStatus' ? <Badge value={raw === 'Yes' ? 'Presence' : 'Non-Presence'} /> : column.key === 'iso2' ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{raw}</span> : raw; return <td className="px-5 py-4" key={column.key}>{column.key === primaryKey ? <button className="font-black text-slate-950 underline-offset-4 hover:text-emerald-700 hover:underline" onClick={() => openRow(row, 'view')}>{content}</button> : content}</td>; })}<td className="px-5 py-4"><div className="flex justify-end gap-2"><button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black hover:bg-emerald-50" onClick={() => openRow(row, 'view')}>View</button><button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black hover:bg-emerald-50" onClick={() => openRow(row, 'edit')}>Edit</button><button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black hover:bg-emerald-50" onClick={() => toggleStatus(row)}>{row.status === 'Inactive' ? 'Activate' : 'Inactivate'}</button></div></td></tr>)}</tbody></table>
          {paginatedRows.length === 0 ? <div className="grid place-items-center p-12 text-center"><h3 className="text-lg font-black text-slate-950">No countries found</h3><p className="mt-2 max-w-md text-sm text-slate-500">Create your first country record or modify search and filters.</p><button className="btn-primary mt-5" onClick={openCreate}>Create Country</button></div> : null}
        </div>
        <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 text-sm text-slate-600 xl:flex-row xl:items-center xl:justify-between"><div className="flex items-center gap-2"><span className="font-semibold">Rows per page</span><select className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold" value={rowsPerPage} onChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(1); }}>{[25, 50, 75, 100].map((value) => <option key={value} value={value}>{value}</option>)}</select></div>{totalPages > 1 ? <div className="flex flex-wrap items-center gap-2"><button className="h-9 rounded-xl border border-slate-200 px-3 font-bold disabled:opacity-40" disabled={safePage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Prev</button>{pageNumbers.map((number, index) => <span className="flex items-center gap-2" key={number}>{index > 0 && number - pageNumbers[index - 1] > 1 ? <span className="px-1 text-slate-400">...</span> : null}<button className={`h-9 w-9 rounded-xl border text-sm font-black ${number === safePage ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-emerald-50'}`} onClick={() => setPage(number)}>{number}</button></span>)}<button className="h-9 rounded-xl border border-slate-200 px-3 font-bold disabled:opacity-40" disabled={safePage >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</button><span className="ml-2 font-semibold">Go to</span><input className="h-9 w-16 rounded-xl border border-slate-200 text-center font-black outline-none focus:border-emerald-700" value={goToPage} onChange={(event) => setGoToPage(event.target.value.replace(/[^0-9]/g, ''))} onKeyDown={(event) => { if (event.key === 'Enter') jumpToPage(); }} onBlur={jumpToPage} /></div> : null}</div>
      </div>

      {modalMode && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"><form className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[1.35rem] bg-white p-6 shadow-[0_25px_60px_rgba(15,23,42,0.22)]" onSubmit={submitForm}><div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5"><div><p className="text-sm font-black uppercase tracking-wide text-emerald-700">{title} / {modalMode === 'create' ? 'Create' : modalMode === 'edit' ? 'Edit' : 'Read View'}</p><h2 className="mt-1 text-2xl font-black text-slate-950">{formValues[primaryKey] || 'New Record'}</h2></div><button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold" onClick={() => setModalMode(null)} type="button">Close</button></div><div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]"><section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5"><h3 className="text-base font-black text-slate-950">Basic Information</h3><div className="mt-4 grid gap-4 md:grid-cols-2">{columns.filter((column) => !['presenceStatus', 'status', 'owner', 'createdBy', 'lastModifiedBy', 'remarks'].includes(column.key)).map((column) => <label className="grid gap-1 text-sm font-bold text-slate-700" key={column.key}>{column.label}<input className="input" disabled={isViewMode || (modalMode === 'edit' && column.key === 'countryId')} value={formValues[column.key] || ''} onChange={(event) => setFormValues((current) => ({ ...current, [column.key]: event.target.value }))} /></label>)}</div></section><section className="space-y-5"><div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="text-base font-black text-slate-950">Status & Ownership</h3><div className="mt-4 grid gap-4"><label className="grid gap-1 text-sm font-bold text-slate-700">Presence Status<select className="input" disabled={isViewMode} value={formValues.presenceStatus || 'No'} onChange={(event) => setFormValues((current) => ({ ...current, presenceStatus: event.target.value }))}><option>Yes</option><option>No</option></select></label><label className="grid gap-1 text-sm font-bold text-slate-700">Status<select className="input" disabled={isViewMode} value={formValues.status || 'Active'} onChange={(event) => setFormValues((current) => ({ ...current, status: event.target.value }))}><option>Active</option><option>Inactive</option></select></label><label className="grid gap-1 text-sm font-bold text-slate-700">Owner<input className="input" disabled={isViewMode} value={formValues.owner || ''} onChange={(event) => setFormValues((current) => ({ ...current, owner: event.target.value }))} /></label></div></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="text-base font-black text-slate-950">Audit Information</h3><div className="mt-4 grid gap-4"><label className="grid gap-1 text-sm font-bold text-slate-700">Created By<input className="input" disabled value={formValues.createdBy || ''} /></label><label className="grid gap-1 text-sm font-bold text-slate-700">Last Modified By<input className="input" disabled value={formValues.lastModifiedBy || ''} /></label></div></div></section></div><section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5"><h3 className="text-base font-black text-slate-950">Remarks</h3><textarea className="input mt-4 min-h-[110px]" disabled={isViewMode} value={formValues.remarks || ''} onChange={(event) => setFormValues((current) => ({ ...current, remarks: event.target.value }))} /></section>{message ? <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">{message}</p> : null}<div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">{modalMode === 'view' && selectedRow ? <button className="btn-secondary" type="button" onClick={() => openRow(selectedRow, 'edit')}>Edit Country</button> : null}{modalMode !== 'view' ? <button className="btn-primary" type="submit">Save Country</button> : null}<button className="btn-secondary" type="button" onClick={() => setModalMode(null)}>Cancel</button></div></form></div>}
    </div>
  );
}
