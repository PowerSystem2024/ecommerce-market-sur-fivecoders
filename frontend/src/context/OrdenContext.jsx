/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';
import cliente from '../api/axios.js';

export const OrdenesContext = createContext();

export const useOrdenes = () => {
    const context = useContext(OrdenesContext);
    if (!context) {
        throw new Error("useOrdenes must be used within an OrdenesProvider");
    }
    return context;
}

export function OrdenesProvider({ children }) {
    const [ordenes, setOrdenes] = useState([]);
    const [ordenActual, setOrdenActual] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    // Obtener todas las órdenes del usuario autenticado
    const obtenerOrdenes = async () => {
        try {
            setLoading(true);
            setErrors(null);
            const res = await cliente.get('/obtener-ordenes');
            setOrdenes(res.data);
            return res.data;
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(Array.isArray(error.response.data) 
                    ? error.response.data 
                    : [error.response.data]);
            } else {
                setErrors([{ message: 'Error al obtener órdenes' }]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }

    // Obtener orden por ID
    const obtenerOrdenPorId = async (id) => {
        try {
            setLoading(true);
            setErrors(null);
            // Buscar en las órdenes ya cargadas
            const ordenExistente = ordenes.find(orden => orden.orden_id === id);
            if (ordenExistente) {
                setOrdenActual(ordenExistente);
                return ordenExistente;
            }
            
            // Si no está en el estado, recargar todas las órdenes
            const res = await cliente.get('/obtener-ordenes');
            const orden = res.data.find(o => o.orden_id === id);
            
            if (!orden) {
                setErrors([{ message: 'Orden no encontrada' }]);
                throw new Error('Orden no encontrada');
            }
            
            setOrdenActual(orden);
            return orden;
        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.status === 404) {
                    setErrors([{ message: 'Orden no encontrada' }]);
                } else {
                    setErrors(Array.isArray(error.response.data) 
                        ? error.response.data 
                        : [error.response.data]);
                }
            } else if (!error.message?.includes('Orden no encontrada')) {
                setErrors([{ message: 'Error al obtener la orden' }]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }

    // Crear nueva orden
    const crearOrden = async (items) => {
        try {
            setLoading(true);
            setErrors(null);
            const res = await cliente.post('/crear-orden', { items });
            console.log('Orden creada:', res.data);
            
            // Recargar órdenes para obtener la lista actualizada
            await obtenerOrdenes();
            
            return res.data;
        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.status === 400) {
                    const errorMsg = Array.isArray(error.response.data) 
                        ? error.response.data 
                        : [error.response.data];
                    setErrors(errorMsg);
                } else {
                    setErrors(Array.isArray(error.response.data) 
                        ? error.response.data 
                        : [error.response.data]);
                }
            } else {
                setErrors([{ message: 'Error de conexión. Verifica que el servidor esté corriendo.' }]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }

    // Limpiar errores
    const limpiarErrores = () => setErrors(null);

    // Limpiar orden actual
    const limpiarOrdenActual = () => setOrdenActual(null);

    // Limpiar todas las órdenes (útil al cerrar sesión)
    const limpiarOrdenes = () => {
        setOrdenes([]);
        setOrdenActual(null);
        setErrors(null);
    };

    return (
        <OrdenesContext.Provider value={{
            ordenes,
            ordenActual,
            loading,
            errors,
            obtenerOrdenes,
            obtenerOrdenPorId,
            crearOrden,
            limpiarErrores,
            limpiarOrdenActual,
            limpiarOrdenes
        }}>
            {children}
        </OrdenesContext.Provider>
    );
}