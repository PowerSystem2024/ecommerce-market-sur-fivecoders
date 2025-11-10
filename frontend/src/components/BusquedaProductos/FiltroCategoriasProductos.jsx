import React from 'react';

export default function FiltroCategoriasProductos({ category, setCategory, categories }) {
  return (
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 bg-white text-sm"
    >
      {categories.map((c) => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </select>
  );
}
