// src/components/ModalDetalles/ModalDetalles.jsx
import React, { useState, useEffect } from "react";

export default function ProductDetailModal({ open, product, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) setQty(1); // Resetear cantidad al abrir modal
  }, [product]);

  if (!open || !product) return null;

  const handleIncrease = () => setQty(prev => Math.min(prev + 1, product.stock));
  const handleDecrease = () => setQty(prev => Math.max(prev - 1, 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 sm:w-3/4 md:w-1/2 max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-800 font-bold text-lg"
        >
          ×
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-full md:w-1/2 h-64 object-cover rounded"
          />
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-zinc-800">{product.name}</h2>
              <p className="text-sm text-zinc-500 mt-2">{product.description}</p>
              <p className="text-lg font-bold text-green-600 mt-3">${product.price.toFixed(2)}</p>
              <p className="text-xs text-zinc-400 mt-1">Stock disponible: {product.stock}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center border border-zinc-300 rounded">
                <button
                  onClick={handleDecrease}
                  className="px-2 py-1 text-zinc-700 hover:bg-zinc-100"
                >
                  -
                </button>
                <span className="px-3">{qty}</span>
                <button
                  onClick={handleIncrease}
                  className="px-2 py-1 text-zinc-700 hover:bg-zinc-100"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => onAddToCart(qty)}
                className="bg-amber-400 text-zinc-900 font-semibold px-4 py-2 rounded hover:bg-amber-300"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

