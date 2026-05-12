import { useState, useMemo } from 'react';

export function useTableControls(data, searchKeys, filterKey) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filterOptions = useMemo(() =>
    filterKey ? [...new Set(data.map((d) => d[filterKey]).filter(Boolean))].sort() : [],
    [data, filterKey]
  );

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((row) => searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(q)));
    }
    if (filter) result = result.filter((row) => row[filterKey] === filter);
    return result;
  }, [data, search, filter, searchKeys, filterKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  // Reset to page 1 on search/filter change
  const handleSearch = (v) => { setSearch(v); setPage(1); };
  const handleFilter = (v) => { setFilter(v); setPage(1); };

  return { search, setSearch: handleSearch, filter, setFilter: handleFilter, filterOptions, page: safePage, setPage, perPage, setPerPage, paginated, filtered, totalPages };
}

export function TableControls({ search, onSearch, filter, onFilter, filterOptions, filterLabel, perPage, onPerPage }) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <div className="relative flex-1 min-w-48">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Cari..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
        />
      </div>

      {filterOptions.length > 0 && (
        <select
          value={filter}
          onChange={(e) => onFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-slate-700"
        >
          <option value="">Semua {filterLabel}</option>
          {filterOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}

      <select
        value={perPage}
        onChange={(e) => onPerPage(Number(e.target.value))}
        className="text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-slate-700"
      >
        {[5, 10, 25, 50].map((n) => <option key={n} value={n}>{n} per halaman</option>)}
      </select>
    </div>
  );
}

export function Pagination({ page, totalPages, onPage, total, perPage }) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
      <span>Menampilkan {from}–{to} dari {total} data</span>
      <div className="flex gap-1">
        <button onClick={() => onPage(page - 1)} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">‹</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button key={p} onClick={() => onPage(p)} className={`px-3 py-1.5 rounded-lg border transition-colors ${p === page ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 hover:bg-slate-50'}`}>{p}</button>
        ))}
        <button onClick={() => onPage(page + 1)} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">›</button>
      </div>
    </div>
  );
}
