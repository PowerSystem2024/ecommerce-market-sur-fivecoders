import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar/SideBar';
import cliente from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useProductos } from '../context/ProductosContext.jsx';

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
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-11/12 p-6 z-10"
      >
        <div className="flex justify-between items-start mb-4">
          <h2 id="modal-title" className="text-xl font-semibold">
            Detalle de la venta — Orden #{order.orden_id}
          </h2>
          <button onClick={onClose} aria-label="Cerrar modal" className="text-gray-500 hover:text-gray-800 text-2xl leading-none">
            ✕
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          <p className="text-sm text-gray-600 mb-2">
            Fecha: {new Date(order.fecha_orden).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Ingresos por esta orden: <span className="font-medium">${Number(order.total_mio || 0).toFixed(2)}</span>
          </p>

          <div className="space-y-3">
            {order.items && order.items.length > 0 ? (
              order.items.map(item => (
                <div key={item.item_id} className="border rounded-lg p-3 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{item.nombre_producto || `Producto #${item.producto_id}`}</p>
                    <p className="text-sm text-gray-600">ID producto: {item.producto_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Cantidad: <span className="font-semibold">{item.cantidad}</span></p>
                    <p className="text-sm">Precio unitario: <span className="font-semibold">${Number(item.precio_unitario).toFixed(2)}</span></p>
                    <p className="text-sm mt-1">Subtotal: <span className="font-semibold">${(Number(item.cantidad) * Number(item.precio_unitario)).toFixed(2)}</span></p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No hay ítems tuyos en esta orden.</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-zinc-200 hover:bg-zinc-300 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaginaVentas() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { productos, obtenerProductos, loading: productosLoading } = useProductos();
  const [ventas, setVentas] = useState([]); // ventas mías filtradas
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);

  // RUTA de órdenes (usa cliente baseURL -> /api)
  const RUTA_ORDENES = '/obtener-ordenes';

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setLoading(false);
        setVentas([]);
      } else {
        // asegurarnos de tener productos en cache
        const aseg = async () => {
          try {
            if (!productos || productos.length === 0) {
              await obtenerProductos();
            }
            await cargarVentas();
          } catch (err) {
            console.error('Error inicializando pagina de ventas:', err);
          }
        };
        aseg();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const cargarVentas = async () => {
    try {
      setLoading(true);
      setError(null);

      // build productoMap desde productos del contexto
      const productoMap = Object.create(null);
      for (const p of productos || []) {
        productoMap[p.id] = p; // p.usuario_id debe estar presente
      }

      // traer órdenes (lo que tu endpoint entregue)
      const ordRes = await cliente.get(RUTA_ORDENES);
      const ordenes = Array.isArray(ordRes.data) ? ordRes.data : [];

      // filtrar ítems que sean de mi propiedad (producto.usuario_id === user.id)
      const ventasFiltradas = ordenes
        .map(o => {
          const itemsMios = (o.items || []).filter(it => {
            const prod = productoMap[it.producto_id];
            return prod ? Number(prod.usuario_id) === Number(user.id) : false;
          }).map(it => ({
            ...it,
            nombre_producto: it.nombre_producto || productoMap[it.producto_id]?.nombre || null
          }));

          const totalMio = itemsMios.reduce((s, it) => s + Number(it.cantidad) * Number(it.precio_unitario), 0);

          return {
            ...o,
            items: itemsMios,
            total_mio: totalMio
          };
        })
        .filter(o => o.items && o.items.length > 0);

      setVentas(ventasFiltradas);
    } catch (err) {
      console.error('Error cargando ventas (frontend):', err);
      setError('No se pudieron cargar las ventas. Revisa la consola.');
      setVentas([]);
    } finally {
      setLoading(false);
    }
  };

  const ingresosTotales = ventas.reduce((acc, v) => acc + Number(v.total_mio || 0), 0);

  const abrirDetalle = (venta) => setSelectedOrder(venta);
  const cerrarDetalle = () => setSelectedOrder(null);

  if (authLoading || productosLoading) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Necesitas iniciar sesión para ver tus ventas.</p>
          <button onClick={() => navigate('/inicio-de-sesion')} className="mt-4 px-4 py-2 bg-orange-600 text-white rounded">Iniciar sesión</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 ml-0 sm:ml-64 min-h-screen bg-orange-50 text-zinc-800 px-6 py-10">
        <header className="max-w-6xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-1">Mis ventas</h1>
          <p className="text-sm text-zinc-600">Productos tuyos que se han vendido — vendedor: {user?.nombre || `#${user?.id}`}</p>
          <div className="mt-4 flex items-center gap-4">
            <p className="font-semibold">Ingresos totales mostrados:</p>
            <p className="text-2xl font-bold text-green-600">${ingresosTotales.toFixed(2)}</p>
          </div>
        </header>

        <div className="max-w-6xl mx-auto space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-800"></div>
              <p className="mt-4 text-gray-600">Cargando ventas...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded">{error}</div>
          ) : ventas.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border border-zinc-200 p-12 text-center">
              <h3 className="text-xl font-semibold text-zinc-800 mb-2">No hay ventas registradas</h3>
              <p className="text-zinc-600 mb-6">Cuando alguien compre alguno de tus productos aquí aparecerá la venta.</p>
              <button onClick={() => navigate('/descubrir-productos')} className="px-6 py-3 bg-orange-600 text-white rounded-xl shadow hover:bg-orange-700">Publicar/Ver productos</button>
            </div>
          ) : (
            ventas.map(venta => (
              <div key={venta.orden_id} className="bg-white rounded-2xl shadow-md border border-zinc-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <p className="font-semibold text-xl text-orange-600">Orden #{venta.orden_id}</p>
                    <p className="text-sm text-gray-600">{new Date(venta.fecha_orden).toLocaleString('es-AR', { dateStyle: 'long', timeStyle: 'short' })}</p>
                    <p className="text-xs text-gray-500">Comprador ID: {venta.comprador_id || '—'}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Ingresos por esta orden</p>
                      <p className="font-bold text-2xl text-zinc-900">${Number(venta.total_mio || 0).toFixed(2)}</p>
                    </div>
                    <button onClick={() => abrirDetalle(venta)} className="px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700">Ver detalle</button>
                  </div>
                </div>

                <div className="border-t border-zinc-200 pt-4">
                  <p className="text-xs text-gray-500 mb-2">PRODUCTOS VENDIDOS (preview)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {venta.items && venta.items.length > 0 ? (
                      venta.items.slice(0, 3).map(item => (
                        <div key={item.item_id} className="text-sm bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="font-medium text-zinc-800 truncate">{item.nombre_producto || `Producto #${item.producto_id}`}</p>
                          <p className="text-xs text-gray-600 mt-1">{item.cantidad} × ${Number(item.precio_unitario).toFixed(2)}</p>
                          <p className="text-xs text-gray-500 mt-2">Subtotal: ${(Number(item.cantidad) * Number(item.precio_unitario)).toFixed(2)}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 italic col-span-full">Sin ítems registrados</div>
                    )}

                    {venta.items && venta.items.length > 3 && (
                      <div className="text-sm bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-center text-gray-600">
                        +{venta.items.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <OrderDetailModal open={!!selectedOrder} onClose={cerrarDetalle} order={selectedOrder} />
    </div>
  );
}
