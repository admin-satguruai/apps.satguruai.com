'use client';

import { useMemo, useState } from 'react';

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

function Badge({ value }: { value: Status }) {
  const isActive = String(value).toLowerCase() === 'active' || String(value).toLowerCase() === 'yes';
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
      {value}
    </span>
  );
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
  const [query, setQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState(
    () => new Set(columns.filter((column) => column.locked || column.defaultVisible !== false).map((column) => column.key))
  );
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [showColumns, setShowColumns] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const terms = normalizedQuery.split(/\s+/).filter(Boolean);

    return rows.filter((row) => {
      const searchPool = searchKeys.map((key) => String(row[key] ?? '').toLowerCase()).join(' ');
      const matchesSearch = terms.length === 0 || terms.every((term) => searchPool.includes(term));
      const matchesFilters = filters.every((filter) => {
        const selected = filterValues[filter.key];
        if (!selected) return true;
        return String(row[filter.key as keyof T] ?? '') === selected;
      });
      return matchesSearch && matchesFilters;
    });
  }, [filterValues, filters, query, rows, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginatedRows = filteredRows.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);
  const activeColumns = columns.filter((column) => visibleColumns.has(column.key));

  function resetFilters() {
    setFilterValues({});
    setPage(1);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-saffron">Settings / Master Data</p>
          <h1 className="text-3xl font-black text-navy">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">{description}</p>
        </div>
        <button className="btn-primary whitespace-nowrap">{createLabel}</button>
      </div>

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
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => setShowFilters((value) => !value)}>
              Filters
            </button>
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold" onClick={() => setShowColumns((value) => !value)}>
              Columns
            </button>
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold">Export</button>
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
            <div className="flex items-end">
              <button className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-navy" onClick={resetFilters}>Reset</button>
            </div>
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
          <table className="w-full min-w-[1100px] text-left text-sm">
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
                          <button className="font-bold text-navy underline-offset-4 hover:underline" onClick={() => setSelectedRow(row)}>{content}</button>
                        ) : content}
                      </td>
                    );
                  })}
                  <td className="whitespace-nowrap px-4 py-3 text-navy">View · Edit · {row.status === 'Inactive' ? 'Activate' : 'Inactivate'}</td>
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
              {[25, 50, 100].map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
            <button className="rounded-lg border border-slate-200 px-3 py-1" disabled={safePage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Prev</button>
            <span>Page {safePage} of {totalPages}</span>
            <button className="rounded-lg border border-slate-200 px-3 py-1" disabled={safePage >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</button>
          </div>
        </div>
      </div>

      {selectedRow && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-saffron">Read View</p>
                <h2 className="text-2xl font-black text-navy">{String(selectedRow[primaryKey])}</h2>
              </div>
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold" onClick={() => setSelectedRow(null)}>Close</button>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {columns.map((column) => (
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4" key={column.key}>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{column.label}</p>
                  <div className="mt-1 text-sm font-semibold text-slate-700">{String(selectedRow[column.key] ?? '-')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
