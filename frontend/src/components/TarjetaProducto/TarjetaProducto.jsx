import React from 'react';

export default function TarjetaProducto({ item, onView }) {
  if (!item) return null;

  const priceFormatted = item.price?.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) ?? '0.00';

  return (
    <article className="w-full h-full bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col p-4">
      <div className="relative mb-3">
        <img src={item.image} alt={item.name} className="w-full h-44 object-cover rounded-lg" loading="lazy"/>
        {typeof item.stock === 'number' && item.stock < 30 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
            Pocas unidades
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <header>
          <h3 className="text-base font-semibold text-orange-600 mb-1 truncate">{item.name}</h3>
          <p className="text-sm text-zinc-700 mb-2 line-clamp-2" title={item.description}>{item.description}</p>
        </header>

        <div className="mt-1 mb-3">
          <p className="text-xs text-zinc-500">Proveedor: {item.proveedorNombre}</p>
          <p className="text-xs text-zinc-400">Stock: {item.stock} unidades</p>
        </div>

        <footer className="pt-3 mt-auto border-t border-zinc-100">
          <p className="text-lg font-bold text-zinc-900 mb-3">${priceFormatted}</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => onView?.(item)}
              className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition">
              Ver detalle
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
}


