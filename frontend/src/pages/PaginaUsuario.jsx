import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar/SideBar';
import { useAuth } from '../context/AuthContext.jsx';
import { useProductos } from '../context/ProductosContext';

function PaginaPerfil() {
  const navigate = useNavigate();
  const { user, signout } = useAuth();
  const { productos, obtenerProductos } = useProductos();
  const [stats, setStats] = useState({ stockTotal: 0, valorInventario: 0 });

  useEffect(() => {
    if (user) obtenerProductos();
  }, [user]);

  useEffect(() => {
    if (productos && user) {
      const misProductos = productos.filter(p => p.usuario_id === user.id);
      const stockTotal = misProductos.reduce((acc, p) => acc + p.stock, 0);
      const valorInventario = misProductos.reduce((acc, p) => acc + p.precio * p.stock, 0);
      setStats({ stockTotal, valorInventario });
    }
  }, [productos, user]);

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de cerrar sesión?')) {
      await signout();
    }
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
          <h1 className="text-4xl font-bold mb-2">Mi Perfil</h1>
          <p className="text-lg text-zinc-600">Tu información personal y estadísticas</p>
        </header>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Perfil */}
          <div className="bg-white rounded-2xl shadow-md border border-zinc-200 p-6 flex flex-col items-center space-y-4">
            <img
              src={user?.gravatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-sky-500 shadow-lg"
            />
            <h2 className="text-2xl font-bold text-orange-600">{user?.nombre}</h2>
            <p className="text-zinc-600">{user?.correo}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-4 border-t border-zinc-200">
              <div>
                <p className="text-gray-400 text-sm">ID de Usuario</p>
                <p className="font-medium text-zinc-900">{user?.id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Fecha de Registro</p>
                <p className="font-medium text-zinc-900">
                  {user?.fecha_registro
                    ? new Date(user.fecha_registro).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-zinc-200 text-center">
              <p className="text-gray-500 text-sm">Stock Total</p>
              <p className="text-2xl font-bold">{stats.stockTotal}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-zinc-200 text-center">
              <p className="text-gray-500 text-sm">Valor Inventario</p>
              <p className="text-2xl font-bold">
                ${stats.valorInventario.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <button
              className="p-4 bg-white border border-zinc-200 rounded-xl shadow hover:shadow-lg transition font-medium text-zinc-700"
              onClick={() => navigate('/producto')}
            >
              Mis Productos
            </button>
            <button
              className="p-4 bg-white border border-zinc-200 rounded-xl shadow hover:shadow-lg transition font-medium text-zinc-700"
              onClick={() => navigate('/descubrir-productos')}
            >
              Descubrir
            </button>
            <button
              className="p-4 bg-red-50 border border-red-200 rounded-xl shadow hover:shadow-lg transition font-medium text-red-700"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PaginaPerfil;

