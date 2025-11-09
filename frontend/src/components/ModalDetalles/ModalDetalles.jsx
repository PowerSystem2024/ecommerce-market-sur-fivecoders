import React, { useEffect, useState } from "react";

/**
 * ProductDetailModal (componente único y autónomo)
 *
 * Props:
 * - open: boolean -> si el modal está abierto
 * - product: object -> producto a mostrar (puede ser null)
 * - onClose: function -> callback para cerrar el modal
 * - onAddToCart: function -> callback cuando se agrega al carrito recibe { ...product, quantity }
 *
 * Ejemplo de uso:
 * <ProductDetailModal open={open} product={selected} onClose={close} onAddToCart={handleAdd} />
 */
export default function ProductDetailModal({ open, product, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (open) {
      setQty(1);
      const onKey = (e) => {
        if (e.key === "Escape") onClose?.();
      };
      document.addEventListener("keydown", onKey);
      // bloquear scroll del body mientras el modal esté abierto
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prevOverflow;
      };
    }
    // si el modal no está abierto, aseguramos que el body tenga overflow normal
    return undefined;
  }, [open, onClose]);

  if (!open) return null;
  if (!product) return null;

  const priceFormatted = product.price?.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) ?? '0.00';

  const changeQty = (next) => {
    setQty(q => {
      const n = Number(q) || 0;
      const candidate = Math.max(1, n + next);
      // opcional: no permitir cantidad mayor al stock
      if (typeof product.stock === 'number') return Math.min(candidate, product.stock);
      return candidate;
    });
  };

  const handleInputQty = (value) => {
    const n = Math.max(1, Number(value) || 1);
    if (typeof product.stock === 'number') {
      setQty(Math.min(n, product.stock));
    } else {
      setQty(n);
    }
  };

  const handleAdd = () => {
    const quantity = Math.max(1, Number(qty) || 1);
    if (product.stock === 0) {
      // no permitir agregar si está sin stock
      return;
    }
    onAddToCart?.({ ...product, quantity });
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${product.id}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex-1 min-w-0">
            <h2 id={`modal-title-${product.id}`} className="text-lg font-semibold text-zinc-900 truncate">
              {product.name}
            </h2>
            <p className="text-sm text-zinc-500 truncate">{product.provider}</p>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <span className="text-sm text-zinc-700 font-medium">
              ${priceFormatted}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-md hover:bg-zinc-100"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Imagen */}
            <div className="rounded-lg overflow-hidden border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-72 md:h-80 object-cover"
                loading="lazy"
              />
            </div>

            {/* Información */}
            <div className="flex flex-col">
              <div className="mb-4">
                <p className="text-sm text-zinc-500">Categoría: <span className="text-zinc-700 font-medium">{product.category}</span></p>
                <p className="text-sm text-zinc-500">ID: <span className="text-zinc-700 font-medium">{product.id}</span></p>
                {product.currency && <p className="text-sm text-zinc-500">Moneda: <span className="text-zinc-700 font-medium">{product.currency}</span></p>}
              </div>

              <div className="mb-4">
                <p className="text-zinc-700">{product.description}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-zinc-500">Stock disponible: <span className="text-zinc-700 font-medium">{product.stock}</span></p>
              </div>

              {/* Cantidad y acciones */}
              <div className="mt-auto">
                <label className="block text-sm text-zinc-600 mb-2">Cantidad</label>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => changeQty(-1)}
                      className="px-3 py-2 hover:bg-zinc-100"
                      aria-label="Disminuir cantidad"
                    >−</button>

                    <input
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => handleInputQty(e.target.value)}
                      className="w-20 text-center px-2 py-2 outline-none"
                      aria-label="Cantidad"
                    />

                    <button
                      type="button"
                      onClick={() => changeQty(1)}
                      className="px-3 py-2 hover:bg-zinc-100"
                      aria-label="Aumentar cantidad"
                    >+</button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    className={`px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition ${
                      product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={product.stock === 0}
                  >
                    Agregar al carrito
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border rounded-lg hover:bg-zinc-50"
                  >
                    Cerrar
                  </button>
                </div>

                <p className="text-xs text-zinc-500 mt-3">
                  Pago y envío se gestionan en el checkout. Ajustá la cantidad antes de añadir al carrito.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
