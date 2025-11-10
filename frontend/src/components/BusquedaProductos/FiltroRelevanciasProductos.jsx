import React from 'react';

export default function FiltroRelevanciasProductos({ sort, setSort }) {
  return (
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 bg-white text-sm"
    >
      <option value="relevance">Relevancia</option>
      <option value="price_asc">Precio ↑</option>
      <option value="price_desc">Precio ↓</option>
    </select>
  );
}
