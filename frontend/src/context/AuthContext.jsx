/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
import cliente from '../api/axios.js'; // axios con withCredentials

// Context
export const AuthContext = createContext();

// Hook personalizado
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// AuthProvider
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(true);

    // Login
    const signin = async (data) => {
        try {
            setErrors(null);
            const res = await cliente.post('/ingresar', data);
            setUser(res.data.user);
            setIsAuth(true);
            return res.data.user;
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(
                    Array.isArray(error.response.data) 
                        ? error.response.data 
                        : [error.response.data]
                );
            } else {
                setErrors([{ message: 'Error de conexión. Verifica que el servidor esté corriendo.' }]);
            }
            throw error;
        }
    };

    // Registro
    const signup = async (data) => {
        try {
            setErrors(null);
            const res = await cliente.post('/registro', data);
            setUser(res.data.user);
            setIsAuth(true);
            return res.data.user;
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(
                    Array.isArray(error.response.data)
                        ? error.response.data
                        : [error.response.data]
                );
            } else {
                setErrors([{ message: 'Error de red' }]);
            }
            throw error;
        }
    };

    // Actualizar datos del usuario
    const updateUser = async (datos) => {
        try {
            const res = await cliente.put('/modificar-perfil', datos);
            setUser(res.data.usuario); // Actualiza el estado con los datos del backend
            return res.data.usuario;
        } catch (error) {
            if (error.response && error.response.data) {
                throw new Error(
                    Array.isArray(error.response.data)
                        ? error.response.data.join(', ')
                        : error.response.data.message || 'Error al actualizar los datos.'
                );
            }
            throw error;
        }
    };

    // Cerrar sesión
    const signout = async () => {
        try {
            await cliente.post('/cerrar-sesion');
            setUser(null);
            setIsAuth(false);
        } catch (error) {
            console.log('❌ Error al cerrar sesión:', error);
        }
    };

    // Verificar sesión al montar
    useEffect(() => {
        const verificarSesion = async () => {
            try {
                const res = await cliente.get('/perfil'); // cookie HttpOnly se envía automáticamente
                setUser(res.data.user);
                setIsAuth(true);
            } catch (err) {
                setUser(null);
                setIsAuth(false);
            } finally {
                setLoading(false);
            }
        };
        verificarSesion();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuth,
                errors,
                loading,
                signin,
                signup,
                signout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

