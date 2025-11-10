/* src/context/ProductosContext.jsx */
import { createContext, useState, useContext, useEffect } from 'react';
import cliente from '../api/axios.js';

export const ProductosContext = createContext();

export const useProductos = () => {
    const context = useContext(ProductosContext);
    if (!context) {
        throw new Error("useProductos must be used within a ProductosProvider");
    }
    return context;
}

export function ProductosProvider({ children }) {
    const [productos, setProductos] = useState([]);
    const [productoActual, setProductoActual] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    // Obtener todos los productos del usuario autenticado (existente)
    const obtenerProductos = async () => {
        try {
            setLoading(true);
            setErrors(null);
            console.debug('[ProductosContext] GET /productos/obtener-productos, baseURL=', cliente.defaults?.baseURL);
            const res = await cliente.get('/productos/obtener-productos');
            if (!res || !Array.isArray(res.data)) {
                console.warn('[ProductosContext] Respuesta inesperada al obtener productos:', res);
                setProductos([]);
                return [];
            }
            setProductos(res.data);
            console.debug('[ProductosContext] Productos (privados) cargados:', res.data.length);
            return res.data;
        } catch (error) {
            console.error('[ProductosContext] Error al obtener productos:', error?.response?.status, error?.response?.data || error.message);
            if (error.response && error.response.data) {
                setErrors(Array.isArray(error.response.data) 
                    ? error.response.data 
                    : [error.response.data]);
            } else {
                setErrors([{ message: 'Error al obtener productos' }]);
            }
            setProductos([]);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    // Obtener catálogo público (nueva función)
    const obtenerProductosPublico = async () => {
        try {
            setLoading(true);
            setErrors(null);
            console.debug('[ProductosContext] GET /productos/obtener-productos-publico, baseURL=', cliente.defaults?.baseURL);
            const res = await cliente.get('/productos/obtener-productos-publico');
            if (!res || !Array.isArray(res.data)) {
                console.warn('[ProductosContext] Respuesta inesperada al obtener productos públicos:', res);
                setProductos([]);
                return [];
            }
            setProductos(res.data);
            console.debug('[ProductosContext] Productos (públicos) cargados:', res.data.length);
            return res.data;
        } catch (error) {
            console.error('[ProductosContext] Error al obtener productos públicos:', error?.response?.status, error?.response?.data || error.message);
            if (error.response && error.response.data) {
                setErrors(Array.isArray(error.response.data) 
                    ? error.response.data 
                    : [error.response.data]);
            } else {
                setErrors([{ message: 'Error al obtener productos públicos' }]);
            }
            setProductos([]);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const obtenerProductoPorId = async (id) => {
        try {
            setLoading(true);
            setErrors(null);
            const res = await cliente.get(`/productos/obtener-producto/${id}`);
            setProductoActual(res.data);
            return res.data;
        } catch (error) {
            console.error('[ProductosContext] obtenerProductoPorId error:', error);
            if (error.response && error.response.data) {
                if (error.response.status === 404) {
                    setErrors([{ message: 'Producto no encontrado' }]);
                } else {
                    setErrors(Array.isArray(error.response.data) 
                        ? error.response.data 
                        : [error.response.data]);
                }
            } else {
                setErrors([{ message: 'Error al obtener el producto' }]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const cargarProducto = async (data) => {
        try {
            setLoading(true);
            setErrors(null);
            const res = await cliente.post('/productos/cargar', data);
            console.log('[ProductosContext] Producto creado:', res.data);
            setProductos(prev => [...prev, ...res.data]);
            return res.data;
        } catch (error) {
            console.error('[ProductosContext] cargarProducto error:', error);
            if (error.response && error.response.data) {
                if (error.response.status === 409) {
                    setErrors([{ message: 'El producto ya existe' }]);
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

    const modificarProducto = async (id, data) => {
        try {
            setLoading(true);
            setErrors(null);
            const res = await cliente.put(`/productos/modificar-producto/${id}`, data);
            console.log('[ProductosContext] Producto modificado:', res.data);
            setProductos(prev => prev.map(producto => producto.id === id ? res.data : producto));
            if (productoActual && productoActual.id === id) setProductoActual(res.data);
            return res.data;
        } catch (error) {
            console.error('[ProductosContext] modificarProducto error:', error);
            if (error.response && error.response.data) {
                if (error.response.status === 404) {
                    setErrors([{ message: 'Producto no encontrado' }]);
                } else if (error.response.status === 403) {
                    setErrors([{ message: 'No tienes permiso para modificar este producto' }]);
                } else {
                    setErrors(Array.isArray(error.response.data) 
                        ? error.response.data 
                        : [error.response.data]);
                }
            } else {
                setErrors([{ message: 'Error al modificar el producto' }]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const eliminarProducto = async (id) => {
        try {
            setLoading(true);
            setErrors(null);
            const res = await cliente.delete(`/productos/borrar-producto/${id}`);
            console.log('[ProductosContext] Producto eliminado:', res.data);
            setProductos(prev => prev.filter(producto => producto.id !== id));
            if (productoActual && productoActual.id === id) setProductoActual(null);
            return res.data;
        } catch (error) {
            console.error('[ProductosContext] eliminarProducto error:', error);
            if (error.response && error.response.data) {
                if (error.response.status === 404) {
                    setErrors([{ message: 'Producto no encontrado' }]);
                } else {
                    setErrors(Array.isArray(error.response.data) 
                        ? error.response.data 
                        : [error.response.data]);
                }
            } else {
                setErrors([{ message: 'Error al eliminar el producto' }]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const limpiarErrores = () => setErrors(null);
    const limpiarProductoActual = () => setProductoActual(null);

    // Auto-fetch al montar el provider (mantiene el comportamiento actual: carga productos privados por defecto)
useEffect(() => {
  // Intencionalmente vacío: las páginas llaman explícitamente obtenerProductos() u obtenerProductosPublico()
}, []);

    return (
        <ProductosContext.Provider value={{
            productos,
            productoActual,
            loading,
            errors,
            obtenerProductos,
            obtenerProductosPublico, // <-- expuesto aquí
            obtenerProductoPorId,
            cargarProducto,
            modificarProducto,
            eliminarProducto,
            limpiarErrores,
            limpiarProductoActual
        }}>
            {children}
        </ProductosContext.Provider>
    );
}
