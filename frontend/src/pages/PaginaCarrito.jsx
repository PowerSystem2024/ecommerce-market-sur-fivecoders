import React, { useMemo, useState } from "react";
import { FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useOrdenes } from "../context/OrdenContext.jsx"; // <-- hook desde tu OrdenContext

export default function PaginaCarrito() {
  const { cartItems, removeFromCart, updateQty, clearCart } = useCart();
  const { crearOrden } = useOrdenes();
  const navigate = useNavigate();
  const shipping = 20;
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const subtotal = useMemo(() => cartItems.reduce((acc, it) => acc + it.price * it.qty, 0), [cartItems]);
  const total = subtotal + (cartItems.length > 0 ? shipping : 0);

  const changeQty = (id, delta) => {
    const item = cartItems.find(it => it.id === id);
    if (!item) return;
    const nuevaQty = Math.min(Math.max(item.qty + delta, 0), item.stock);
    if (nuevaQty <= 0) removeFromCart(id);
    else updateQty(id, nuevaQty);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("No hay productos en el carrito.");
      return;
    }

    // Preparar items en el formato que espera tu backend
    const itemsPayload = cartItems.map(it => ({
      producto_id: it.id,
      cantidad: it.qty,
      precio_unitario: Number(it.price),
    }));

    setCheckoutLoading(true);
    try {
      const res = await crearOrden(itemsPayload);
      // res puede contener message, orden, items según tu controller
      console.log("Orden creada:", res);
      alert("Compra realizada exitosamente.");

      clearCart();
      // redirigir a la página de órdenes para ver la orden creada
      navigate("/mis-ordenes");
    } catch (err) {
      console.error("Error creando la orden:", err);
      const serverErrors = err.response?.data;
      if (serverErrors) {
        // si el backend devuelve un array de mensajes
        if (Array.isArray(serverErrors)) alert(serverErrors.join("\n"));
        else alert(JSON.stringify(serverErrors));
      } else {
        alert("Ocurrió un error al crear la orden. Ver consola.");
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-zinc-900 via-neutral-900 to-black min-h-screen flex justify-center py-10 text-zinc-200">
      <div className="bg-zinc-900/60 rounded-lg border border-zinc-800 shadow-xl p-6 w-full max-w-5xl grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <button onClick={() => navigate('/descubrir-productos')} className="flex items-center text-sky-400 hover:text-sky-300 mb-2">
            <FaArrowLeft className="mr-2" /> Continuar Comprando
          </button>

          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-sky-400 to-green-400 mb-2">
            Carrito de compras
          </h2>
          <p className="text-zinc-400 text-sm">Tienes {cartItems.length} items en el carrito</p>

          <div className="mt-4 space-y-3">
            {cartItems.length === 0 ? (
              <p className="text-zinc-400 text-center py-12">El carrito está vacío.</p>
            ) : cartItems.map(it => (
              <div key={it.id} className="flex justify-between items-center bg-zinc-800/50 rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-3">
                  <img src={it.image} alt={it.name} className="w-12 h-12 rounded" />
                  <div>
                    <p className="font-semibold text-zinc-200">{it.name}</p>
                    <p className="text-xs text-zinc-400">{it.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <button onClick={() => changeQty(it.id, -1)} className="px-2 py-1 bg-zinc-700 rounded text-zinc-200 hover:bg-zinc-600">-</button>
                    <span className="px-3">{it.qty}</span>
                    <button onClick={() => changeQty(it.id, +1)} className="px-2 py-1 bg-zinc-700 rounded text-zinc-200 hover:bg-zinc-600">+</button>
                  </div>
                  <span className="font-semibold text-green-400">${(it.price * it.qty).toFixed(2)}</span>
                  <FaTrash onClick={() => removeFromCart(it.id)} className="text-zinc-500 hover:text-red-500 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg p-5 font-semibold border border-zinc-700">
          <div className="text-sm space-y-1 mb-3">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Envío</span><span>${cartItems.length > 0 ? shipping.toFixed(2) : '0.00'}</span></div>
            <div className="flex justify-between font-bold"><span>Total</span><span>${cartItems.length > 0 ? total.toFixed(2) : '0.00'}</span></div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkoutLoading || cartItems.length === 0}
            className={`bg-amber-400 text-zinc-900 font-bold w-full py-2 rounded flex justify-between items-center hover:bg-amber-300 ${checkoutLoading ? 'opacity-60 cursor-wait' : ''}`}
          >
            <span>{checkoutLoading ? 'Procesando...' : `$${cartItems.length > 0 ? total.toFixed(2) : '0.00'}`}</span>
            <span className="flex items-center gap-1">Pagar <FaArrowRight /></span>
          </button>
        </div>
      </div>
    </div>
  );
}

