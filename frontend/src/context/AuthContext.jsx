/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
import cliente from '../api/axios.js'; // axios con withCredentials

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(true);

    const signin = async (data) => {
        try {
            setErrors(null);
            const res = await cliente.post('/ingresar', data);
            setUser(res.data.user);
            setIsAuth(true);
            return res.data.user;
        } catch (error) {
            setErrors(error.response?.data ? (Array.isArray(error.response.data) ? error.response.data : [error.response.data]) : [{ message: 'Error de conexión' }]);
            throw error;
        }
    };

    const signup = async (data) => {
        try {
            setErrors(null);
            const res = await cliente.post('/registro', data);
            setUser(res.data.user);
            setIsAuth(true);
            return res.data.user;
        } catch (error) {
            setErrors(error.response?.data ? (Array.isArray(error.response.data) ? error.response.data : [error.response.data]) : [{ message: 'Error de red' }]);
            throw error;
        }
    };

    const updateUser = async (datos) => {
        try {
            const res = await cliente.put('/modificar-perfil', datos);
            setUser(res.data.usuario);
            return res.data.usuario;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al actualizar datos.');
        }
    };

    const signout = async () => {
        try {
            await cliente.post('/cerrar-sesion');
            setUser(null);
            setIsAuth(false);
        } catch (error) {
            console.log('Error al cerrar sesión', error);
        }
    };

    // ⭐ Nueva función para obtener/refrescar datos del perfil
    const obtenerPerfil = async () => {
        try {
            const res = await cliente.get('/perfil');
            setUser(res.data.user);
            setIsAuth(true);
            return res.data.user;
        } catch (error) {
            console.error('Error al obtener perfil:', error);
            setUser(null);
            setIsAuth(false);
            throw error;
        }
    };

    useEffect(() => {
        const verificarSesion = async () => {
            try {
                const res = await cliente.get('/perfil');
                setUser(res.data.user);
                setIsAuth(true);
            } catch {
                setUser(null);
                setIsAuth(false);
            } finally {
                setLoading(false);
            }
        };
        verificarSesion();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isAuth,
            errors,
            loading,
            signin,
            signup,
            signout,
            updateUser,
            obtenerPerfil, // ⭐ Exportar la nueva función
        }}>
            {children}
        </AuthContext.Provider>
    );
}
