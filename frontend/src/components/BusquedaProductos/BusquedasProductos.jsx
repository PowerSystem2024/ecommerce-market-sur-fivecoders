import React from 'react';

export default function BusquedasProductos({ query, setQuery, onSearch }) {
  return (
    <>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
        placeholder="Buscar en mis productos..."
        className="flex-1 px-4 py-3 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <button
        onClick={onSearch}
        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition whitespace-nowrap"
      >
        Buscar
      </button>
    </>
  );
}
