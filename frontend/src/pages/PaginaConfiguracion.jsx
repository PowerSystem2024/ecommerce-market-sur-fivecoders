// src/pages/PaginaConfiguracion.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/sidebar/SideBar.jsx';

function PaginaConfiguracion() {
  const { user, updateUser } = useAuth();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [nuevaContrasenia, setNuevaContrasenia] = useState('');
  const [contraseniaActual, setContraseniaActual] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setNombre(user.nombre || '');
      setCorreo(user.correo || '');
    }
  }, [user]);

  const handleGuardar = async () => {
    setError('');
    setSuccess('');

    // SIEMPRE pedir la contraseña actual para cualquier cambio (seguridad)
    if (!contraseniaActual || contraseniaActual.trim() === '') {
      setError('Debes ingresar tu contraseña actual para guardar cambios');
      return;
    }

    if (!nombre.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }
    if (!correo.trim()) {
      setError('El correo no puede estar vacío');
      return;
    }

    // Armamos el payload - SIEMPRE incluimos contraseniaActual
    const payload = {
      nombre: nombre.trim(),
      correo: correo.trim(),
      contraseniaActual: contraseniaActual.trim()
    };

    // Si hay nueva contraseña, usarla. Si no, usar la actual (no cambia nada)
    if (nuevaContrasenia && nuevaContrasenia.trim() !== '') {
      payload.contrasenia = nuevaContrasenia.trim();
    } else {
      payload.contrasenia = contraseniaActual.trim();
    }

    console.log('PaginaConfiguracion -> payload a enviar:', payload);

    try {
      setIsSaving(true);
      await updateUser(payload);
      setSuccess('Datos actualizados correctamente');
      setContraseniaActual('');
      setNuevaContrasenia('');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Error al actualizar los datos';
      setError(msg);
    } finally {
      setIsSaving(false);
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
                type="text"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Correo</label>
              <input
                type="email"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold text-lg mb-3">Cambiar contraseña (opcional)</h3>
              
              <div>
                <label className="block mb-1 font-medium">Nueva contraseña</label>
                <input
                  type="password"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={nuevaContrasenia}
                  onChange={(e) => setNuevaContrasenia(e.target.value)}
                  placeholder="Dejar vacío si no quieres cambiar la contraseña"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block mb-1 font-medium">Contraseña actual *</label>
              <input
                type="password"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={contraseniaActual}
                onChange={(e) => setContraseniaActual(e.target.value)}
                placeholder="Requerida para confirmar cualquier cambio"
              />
              <p className="text-sm text-zinc-500 mt-1">
                Por seguridad, necesitamos verificar tu identidad para guardar cambios
              </p>
            </div>

            <button
              onClick={handleGuardar}
              disabled={isSaving}
              className={`w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition ${
                isSaving ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PaginaConfiguracion;