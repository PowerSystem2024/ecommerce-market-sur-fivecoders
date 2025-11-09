import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/sidebar/SideBar.jsx';

function PaginaConfiguracion() {
  const { user, updateUser } = useAuth();
  const [nombre, setNombre] = useState(user.nombre);
  const [correo, setCorreo] = useState(user.correo);
  const [nuevaContrasenia, setNuevaContrasenia] = useState('');
  const [contraseniaActual, setContraseniaActual] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGuardar = async () => {
    if (!contraseniaActual) {
      setError('Debes ingresar tu contraseña actual para guardar cambios');
      return;
    }

    try {
      const datos = {
        nombre,
        correo,
        contrasenia: nuevaContrasenia ? nuevaContrasenia : undefined,
        contraseniaActual
      };
      await updateUser(datos);
      setSuccess('Datos actualizados correctamente');
      setError('');
      setContraseniaActual('');
      setNuevaContrasenia('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-0 sm:ml-64 bg-orange-50 px-6 py-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <header className="text-center mb-6">
            <h1 className="text-3xl font-bold text-orange-600">Configuración</h1>
            <p className="text-zinc-600">Actualiza tu información personal y contraseña</p>
          </header>

          {error && <p className="text-red-600 text-center">{error}</p>}
          {success && <p className="text-green-600 text-center">{success}</p>}

          <div className="bg-white rounded-2xl shadow-md border border-zinc-200 p-6 space-y-4">
            <div>
              <label className="block mb-1 font-medium">Nombre</label>
              <input
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Correo</label>
              <input
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Nueva contraseña (opcional)</label>
              <input
                type="password"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={nuevaContrasenia}
                onChange={(e) => setNuevaContrasenia(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Contraseña actual *</label>
              <input
                type="password"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={contraseniaActual}
                onChange={(e) => setContraseniaActual(e.target.value)}
              />
            </div>

            <button
              onClick={handleGuardar}
              className="w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PaginaConfiguracion;


