import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar/SideBar';
import cliente from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

function OrderDetailModal({ open, onClose, order }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onClose]);

  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-11/12 p-6 z-10"
      >
        <div className="flex justify-between items-start mb-4">
          <h2 id="modal-title" className="text-xl font-semibold">
            Detalle de la orden #{order.orden_id}
          </h2>
          <button 
            onClick={onClose}
            aria-label="Cerrar modal"
            className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          <p className="text-sm text-gray-600 mb-2">
            Fecha: {new Date(order.fecha_orden).toLocaleString('es-AR', { 
              dateStyle: 'medium', 
              timeStyle: 'short' 
            })}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Total: ${Number(order.total).toFixed(2)}
          </p>

          <div className="space-y-3">
            {order.items && order.items.length > 0 ? (
              order.items.map(item => (
                <div 
                  key={item.item_id} 
                  className="border rounded-lg p-3 flex items-center gap-4"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {item.nombre_producto || `Producto #${item.producto_id}`}
                    </p>
                    <p className="text-sm text-gray-600">ID: {item.producto_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      Cantidad: <span className="font-semibold">{item.cantidad}</span>
                    </p>
                    <p className="text-sm">
                      Precio unitario: <span className="font-semibold">
                        ${Number(item.precio_unitario).toFixed(2)}
                      </span>
                    </p>
                    <p className="text-sm mt-1">
                      Subtotal: <span className="font-semibold">
                        ${(Number(item.cantidad) * Number(item.precio_unitario)).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No hay ítems registrados para esta orden.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg bg-zinc-200 hover:bg-zinc-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function PaginaOrdenes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      obtenerOrdenes();
    } else {
      setLoading(false);
    }
  }, [user]);

  const obtenerOrdenes = async () => {
    try {
      setLoading(true);
      const res = await cliente.get('/obtener-ordenes');
      setOrdenes(res.data || []);
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      setOrdenes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  if (!user) return null;

  return (
    <div className="flex">
      <Sidebar />

      {/* Imagen decorativa lateral */}
      <div className="hidden lg:block fixed left-64 top-32 h-[calc(100vh-3.5rem)] w-60 z-10 pointer-events-none">
        <img
          src="../src/assets/Mendoza1887.webp"
          alt="Decoración lateral"
          className="h-full w-full object-cover opacity-80"
          loading="lazy"
        />
      </div>

      <main className="flex-1 ml-0 sm:ml-64 min-h-screen bg-orange-50 text-zinc-800 px-6 py-10">
        {/* Encabezado */}
        <header className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Mis Órdenes</h1>
          <p className="text-lg text-zinc-600">Historial de compras de {user?.nombre}</p>
        </header>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-800"></div>
              <p className="mt-4 text-gray-600">Cargando órdenes...</p>
            </div>
          ) : ordenes.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border border-zinc-200 p-12 text-center">
              <svg 
                className="w-20 h-20 mx-auto text-gray-400 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                />
              </svg>
              <h3 className="text-xl font-semibold text-zinc-800 mb-2">
                No tenés órdenes aún
              </h3>
              <p className="text-zinc-600 mb-6">
                Tus compras aparecerán aquí cuando realices un pedido
              </p>
              <button
                onClick={() => navigate('/descubrir-productos')}
                className="px-6 py-3 bg-orange-600 text-white rounded-xl shadow hover:bg-orange-700 transition font-medium"
              >
                Explorar Productos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {ordenes.map(order => (
                <div 
                  key={order.orden_id} 
                  className="bg-white rounded-2xl shadow-md border border-zinc-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <p className="font-semibold text-xl text-orange-600">
                        Orden #{order.orden_id}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.fecha_orden).toLocaleString('es-AR', { 
                          dateStyle: 'long', 
                          timeStyle: 'short' 
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-bold text-2xl text-zinc-900">
                          ${Number(order.total).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleOpenOrder(order)}
                        className="px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>

                  {/* Preview de items */}
                  <div className="border-t border-zinc-200 pt-4">
                    <p className="text-xs text-gray-500 mb-2">PRODUCTOS</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {order.items && order.items.length > 0 ? (
                        order.items.slice(0, 3).map(item => (
                          <div 
                            key={item.item_id} 
                            className="text-sm bg-gray-50 rounded-lg p-3 border border-gray-200"
                          >
                            <p className="font-medium text-zinc-800 truncate">
                              {item.nombre_producto || `Producto #${item.producto_id}`}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {item.cantidad} × ${Number(item.precio_unitario).toFixed(2)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 italic col-span-full">
                          Sin ítems registrados
                        </div>
                      )}
                      {order.items && order.items.length > 3 && (
                        <div className="text-sm bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-center text-gray-600">
                          +{order.items.length - 3} más
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <OrderDetailModal 
        open={!!selectedOrder} 
        onClose={handleCloseModal} 
        order={selectedOrder} 
      />
    </div>
  );
}

export default PaginaOrdenes;