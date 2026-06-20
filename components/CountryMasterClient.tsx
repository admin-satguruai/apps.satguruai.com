'use client';

import { FormEvent, useMemo, useState } from 'react';
import { CountryMasterRecord } from '@/lib/countries';

type CountryFormState = Omit<CountryMasterRecord, 'id'>;
type ModalMode = 'create' | 'view' | 'edit' | null;
type CountryColumnKey = keyof CountryMasterRecord;

type CountryColumn = {
  key: CountryColumnKey;
  label: string;
  locked?: boolean;
  defaultVisible?: boolean;
};

const columns: CountryColumn[] = [
  { key: 'countryName', label: 'Country Name', locked: true },
  { key: 'countryId', label: 'Country ID', locked: true },
  { key: 'iso2', label: 'ISO-2' },
  { key: 'iso3', label: 'ISO-3' },
  { key: 'dialingCode', label: 'Dialing Code' },
  { key: 'continent', label: 'Continent' },
  { key: 'subcontinent', label: 'Subcontinent' },
  { key: 'presenceStatus', label: 'Presence' },
  { key: 'timeZones', label: 'Time Zones', defaultVisible: false },
  { key: 'status', label: 'Status' },
  { key: 'owner', label: 'Owner', defaultVisible: false },
  { key: 'createdBy', label: 'Created By' },
  { key: 'lastModifiedBy', label: 'Last Modified By' },
  { key: 'remarks', label: 'Remarks', defaultVisible: false }
];

const emptyForm: CountryFormState = {
  countryId: '',
  countryName: '',
  iso2: '',
  iso3: '',
  dialingCode: '',
  continent: '',
  subcontinent: '',
  presenceStatus: 'No',
  timeZones: '',
  status: 'Active',
  owner: 'admin@satguruai.com',
  createdBy: 'admin@satguruai.com',
  lastModifiedBy: 'admin@satguruai.com',
  remarks: ''
};

const searchKeys: CountryColumnKey[] = ['countryName', 'countryId', 'iso2', 'iso3', 'dialingCode', 'continent', 'subcontinent', 'owner', 'remarks'];

function Badge({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const active = normalized === 'active' || normalized === 'yes';
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
      {value || '-'}
    </span>
  );
}

function normalizeInput(value: string) {
  return value.trim();
}

function generateCountryId(rows: CountryMasterRecord[]) {
  const max = rows.reduce((highest, row) => {
    const match = row.countryId.match(/CN-(\d+)/i);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return `CN-${String(max + 1).padStart(3, '0')}`;
}

function toCsvValue(value: unknown) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv(rows: CountryMasterRecord[]) {
  const header = columns.map((column) => column.label).join(',');
  const body = rows.map((row) => columns.map((column) => toCsvValue(row[column.key])).join(',')).join('\n');
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `country-master-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function Field({
  label,
  value,
  onChange,
  required,
  disabled,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1 text-sm font-bold text-slate-700">
      {label}{required ? <span className="text-red-500"> *</span> : null}
      <input
        className="input"
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  disabled
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-1 text-sm font-bold text-slate-700">
      {label}
      <select className="input" disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

export function CountryMasterClient({ initialRows }: { initialRows: CountryMasterRecord[] }) {
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState('');
  const [continentFilter, setContinentFilter] = useState('');
  const [presenceFilter, setPresenceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [showColumns, setShowColumns] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(() => new Set(columns.filter((column) => column.locked || column.defaultVisible !== false).map((column) => column.key)));
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedRow, setSelectedRow] = useState<CountryMasterRecord | null>(null);
  const [form, setForm] = useState<CountryFormState>(emptyForm);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const continents = useMemo(() => Array.from(new Set(rows.map((row) => row.continent).filter(Boolean))).sort(), [rows]);
  const activeCount = rows.filter((row) => row.status === 'Active').length;
  const presenceCount = rows.filter((row) => row.presenceStatus === 'Yes').length;
  const inactiveCount = rows.filter((row) => row.status === 'Inactive').length;

  const filteredRows = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return rows.filter((row) => {
      const searchPool = searchKeys.map((key) => String(row[key] ?? '').toLowerCase()).join(' ');
      const matchesSearch = terms.length === 0 || terms.every((term) => searchPool.includes(term));
      const matchesContinent = !continentFilter || row.continent === continentFilter;
      const matchesPresence = !presenceFilter || row.presenceStatus === presenceFilter;
      const matchesStatus = !statusFilter || row.status === statusFilter;
      return matchesSearch && matchesContinent && matchesPresence && matchesStatus;
    });
  }, [continentFilter, presenceFilter, query, rows, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const pageRows = filteredRows.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);
  const activeColumns = columns.filter((column) => visibleColumns.has(column.key));

  function updateForm<K extends keyof CountryFormState>(key: K, value: CountryFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreate() {
    setMessage('');
    setSelectedRow(null);
    setForm({ ...emptyForm, countryId: generateCountryId(rows) });
    setModalMode('create');
  }

  function openView(row: CountryMasterRecord) {
    setMessage('');
    setSelectedRow(row);
    setForm({ ...row });
    setModalMode('view');
  }

  function openEdit(row: CountryMasterRecord) {
    setMessage('');
    setSelectedRow(row);
    setForm({ ...row });
    setModalMode('edit');
  }

  function validateForm() {
    const countryName = normalizeInput(form.countryName);
    const countryId = normalizeInput(form.countryId).toUpperCase();
    const iso2 = normalizeInput(form.iso2).toUpperCase();
    const iso3 = normalizeInput(form.iso3).toUpperCase();
    const dialingCode = normalizeInput(form.dialingCode);
    const currentId = selectedRow?.id;

    if (!countryName || !countryId || !iso2 || !iso3 || !dialingCode || !form.continent.trim()) {
      return 'Country Name, Country ID, ISO-2, ISO-3, Dialing Code and Continent are mandatory.';
    }

    if (iso2.length !== 2) return 'ISO-2 must be exactly 2 characters.';
    if (iso3.length !== 3) return 'ISO-3 must be exactly 3 characters.';
    if (!dialingCode.startsWith('+')) return 'Dialing Code must start with +.';

    const duplicate = rows.find((row) => row.id !== currentId && (
      row.countryName.toLowerCase() === countryName.toLowerCase() ||
      row.countryId.toLowerCase() === countryId.toLowerCase() ||
      row.iso2.toLowerCase() === iso2.toLowerCase() ||
      row.iso3.toLowerCase() === iso3.toLowerCase()
    ));

    if (duplicate) return 'Duplicate Country Name, Country ID, ISO-2 or ISO-3 is not allowed.';
    return '';
  }

  async function persistCountry(record: CountryMasterRecord, mode: 'create' | 'edit') {
    const endpoint = mode === 'create' ? '/api/admin/countries' : `/api/admin/countries/${encodeURIComponent(record.id)}`;
    await fetch(endpoint, {
      method: mode === 'create' ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    }).catch(() => null);
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateForm();
    if (validation) {
      setMessage(validation);
      return;
    }

    setIsSaving(true);
    const nowUser = 'admin@satguruai.com';
    const normalized: CountryMasterRecord = {
      id: selectedRow?.id || `country-${form.countryId.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      countryId: normalizeInput(form.countryId).toUpperCase(),
      countryName: normalizeInput(form.countryName),
      iso2: normalizeInput(form.iso2).toUpperCase(),
      iso3: normalizeInput(form.iso3).toUpperCase(),
      dialingCode: normalizeInput(form.dialingCode),
      continent: normalizeInput(form.continent),
      subcontinent: normalizeInput(form.subcontinent),
      presenceStatus: form.presenceStatus,
      timeZones: normalizeInput(form.timeZones),
      status: form.status,
      owner: normalizeInput(form.owner) || nowUser,
      createdBy: selectedRow?.createdBy || nowUser,
      lastModifiedBy: nowUser,
      remarks: normalizeInput(form.remarks)
    };

    if (modalMode === 'create') {
      setRows((current) => [normalized, ...current]);
      await persistCountry(normalized, 'create');
      setMessage('Country created successfully. No-delete policy is applied; use Inactivate when needed.');
    } else if (modalMode === 'edit') {
      setRows((current) => current.map((row) => row.id === normalized.id ? normalized : row));
      await persistCountry(normalized, 'edit');
      setMessage('Country updated successfully.');
    }

    setIsSaving(false);
    setModalMode(null);
    setSelectedRow(null);
  }

  async function toggleStatus(row: CountryMasterRecord) {
    const next: CountryMasterRecord = {
      ...row,
      status: row.status === 'Active' ? 'Inactive' : 'Active',
      lastModifiedBy: 'admin@satguruai.com'
    };
    setRows((current) => current.map((item) => item.id === row.id ? next : item));
    await persistCountry(next, 'edit');
  }

  function resetFilters() {
    setQuery('');
    setContinentFilter('');
    setPresenceFilter('');
    setStatusFilter('');
    setPage(1);
  }

  const isViewMode = modalMode === 'view';

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-saffron">Settings / Master Data</p>
          <h1 className="text-3xl font-black text-navy">Country Master</h1>
          <p className="mt-2 max-w-4xl text-sm text-slate-600">
            Central country reference master for Satguru business lines, branches, reporting, dropdowns, and future access segmentation. Country remains independent and follows the table-first reusable master-module framework.
          </p>
        </div>
        <button className="btn-primary whitespace-nowrap" onClick={openCreate}>+ Create Country</button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="card"><p className="text-xs font-bold uppercase text-slate-400">Total Countries</p><p className="mt-2 text-3xl font-black text-navy">{rows.length}</p></div>
        <div className="card"><p className="text-xs font-bold uppercase text-slate-400">Active</p><p className="mt-2 text-3xl font-black text-emerald-700">{activeCount}</p></div>
        <div className="card"><p className="text-xs font-bold uppercase text-slate-400">Presence</p><p className="mt-2 text-3xl font-black text-navy">{presenceCount}</p></div>
        <div className="card"><p className="text-xs font-bold uppercase text-slate-400">Inactive</p><p className="mt-2 text-3xl font-black text-slate-500">{inactiveCount}</p></div>
      </div>

      {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">{message}</div> : null}

      <div className="card space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input
            className="input lg:max-w-lg"
            placeholder="Search countries by name, ID, ISO code, dialing code, continent, owner, or remarks..."
            value={query}
            onChange={(event) => { setQuery(event.target.value); setPage(1); }}
          />
          <div className="flex flex-wrap gap-2">
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold" onClick={() => setShowFilters((value) => !value)}>Filters</button>
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold" onClick={() => setShowColumns((value) => !value)}>Columns</button>
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold" onClick={() => downloadCsv(filteredRows)}>Export CSV</button>
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold" onClick={resetFilters}>Reset</button>
          </div>
        </div>

        {showFilters ? (
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">
            <SelectField label="Continent" value={continentFilter} onChange={(value) => { setContinentFilter(value); setPage(1); }} options={['', ...continents]} />
            <SelectField label="Presence Status" value={presenceFilter} onChange={(value) => { setPresenceFilter(value); setPage(1); }} options={['', 'Yes', 'No']} />
            <SelectField label="Country Status" value={statusFilter} onChange={(value) => { setStatusFilter(value); setPage(1); }} options={['', 'Active', 'Inactive']} />
            <div className="flex items-end text-sm font-semibold text-slate-500">No delete allowed. Use status change.</div>
          </div>
        ) : null}

        {showColumns ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-black text-navy">Column Selection</p>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {columns.map((column) => (
                <label className="flex items-center gap-2 text-sm" key={column.key}>
                  <input
                    type="checkbox"
                    checked={visibleColumns.has(column.key)}
                    disabled={column.locked}
                    onChange={(event) => setVisibleColumns((current) => {
                      const next = new Set(current);
                      if (event.target.checked) next.add(column.key);
                      else next.delete(column.key);
                      return next;
                    })}
                  />
                  {column.label}{column.locked ? ' (locked)' : ''}
                </label>
              ))}
            </div>
          </div>
        ) : null}

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[1300px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Select</th>
                {activeColumns.map((column) => <th className="px-4 py-3" key={column.key}>{column.label}</th>)}
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr className={`border-t ${row.status === 'Inactive' ? 'bg-slate-50 text-slate-500' : ''}`} key={row.id}>
                  <td className="px-4 py-3"><input type="checkbox" /></td>
                  {activeColumns.map((column) => {
                    const value = String(row[column.key] ?? '-');
                    const content = column.key === 'status' || column.key === 'presenceStatus' ? <Badge value={value} /> : value;
                    return (
                      <td className="px-4 py-3" key={column.key}>
                        {column.key === 'countryName' ? (
                          <button className="font-black text-navy underline-offset-4 hover:underline" onClick={() => openView(row)}>{content}</button>
                        ) : content}
                      </td>
                    );
                  })}
                  <td className="whitespace-nowrap px-4 py-3">
                    <button className="font-bold text-navy hover:underline" onClick={() => openView(row)}>View</button>
                    <span className="px-2 text-slate-300">|</span>
                    <button className="font-bold text-navy hover:underline" onClick={() => openEdit(row)}>Edit</button>
                    <span className="px-2 text-slate-300">|</span>
                    <button className="font-bold text-navy hover:underline" onClick={() => toggleStatus(row)}>{row.status === 'Inactive' ? 'Activate' : 'Inactivate'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pageRows.length === 0 ? <div className="p-8 text-center text-sm text-slate-500">No matching records found.</div> : null}
        </div>

        <div className="flex flex-col justify-between gap-3 text-sm text-slate-600 md:flex-row md:items-center">
          <span>Showing {pageRows.length ? (safePage - 1) * rowsPerPage + 1 : 0} to {Math.min(safePage * rowsPerPage, filteredRows.length)} of {filteredRows.length} entries</span>
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

      {modalMode ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <form className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl" onSubmit={submitForm}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-saffron">Country Master / {modalMode === 'create' ? 'Create' : modalMode === 'edit' ? 'Edit' : 'Read View'}</p>
                <h2 className="text-2xl font-black text-navy">{form.countryName || 'New Country'}</h2>
              </div>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold" onClick={() => setModalMode(null)} type="button">Close</button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Field label="Country ID" value={form.countryId} onChange={(value) => updateForm('countryId', value)} required disabled={isViewMode || modalMode === 'edit'} placeholder="CN-007" />
              <Field label="Country Name" value={form.countryName} onChange={(value) => updateForm('countryName', value)} required disabled={isViewMode} placeholder="Tanzania" />
              <Field label="ISO-2" value={form.iso2} onChange={(value) => updateForm('iso2', value.toUpperCase().slice(0, 2))} required disabled={isViewMode} placeholder="TZ" />
              <Field label="ISO-3" value={form.iso3} onChange={(value) => updateForm('iso3', value.toUpperCase().slice(0, 3))} required disabled={isViewMode} placeholder="TZA" />
              <Field label="Dialing Code" value={form.dialingCode} onChange={(value) => updateForm('dialingCode', value)} required disabled={isViewMode} placeholder="+255" />
              <Field label="Continent" value={form.continent} onChange={(value) => updateForm('continent', value)} required disabled={isViewMode} placeholder="Africa" />
              <Field label="Subcontinent / Region" value={form.subcontinent} onChange={(value) => updateForm('subcontinent', value)} disabled={isViewMode} placeholder="East Africa" />
              <Field label="Time Zones" value={form.timeZones} onChange={(value) => updateForm('timeZones', value)} disabled={isViewMode} placeholder="Africa/Dar_es_Salaam" />
              <Field label="Owner" value={form.owner} onChange={(value) => updateForm('owner', value)} disabled={isViewMode} />
              <SelectField label="Presence Status" value={form.presenceStatus} onChange={(value) => updateForm('presenceStatus', value as 'Yes' | 'No')} options={['Yes', 'No']} disabled={isViewMode} />
              <SelectField label="Status" value={form.status} onChange={(value) => updateForm('status', value as 'Active' | 'Inactive')} options={['Active', 'Inactive']} disabled={isViewMode} />
              <Field label="Last Modified By" value={form.lastModifiedBy} onChange={(value) => updateForm('lastModifiedBy', value)} disabled />
            </div>

            <label className="mt-4 grid gap-1 text-sm font-bold text-slate-700">
              Remarks
              <textarea className="input min-h-[100px]" disabled={isViewMode} value={form.remarks} onChange={(event) => updateForm('remarks', event.target.value)} />
            </label>

            {message ? <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">{message}</p> : null}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              {modalMode === 'view' && selectedRow ? <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-navy" type="button" onClick={() => openEdit(selectedRow)}>Edit</button> : null}
              {modalMode !== 'view' ? <button className="btn-primary" disabled={isSaving} type="submit">{isSaving ? 'Saving...' : 'Save Country'}</button> : null}
              <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-navy" type="button" onClick={() => setModalMode(null)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
