/* eslint-disable react-refresh/only-export-components */
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

    // Obtener todos los productos
    const obtenerProductos = async () => {
        try {
            setLoading(true);
            setErrors(null);
            const res = await cliente.get('/productos/obtener-productos');
            setProductos(res.data);
            return res.data;
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(Array.isArray(error.response.data) 
                    ? error.response.data 
                    : [error.response.data]);
            } else {
                setErrors([{ message: 'Error al obtener productos' }]);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }

    // Obtener producto por ID
    const obtenerProductoPorId = async (id) => {
        try {
            setLoading(true);
            setErrors(null);
            const res = await cliente.get(`/productos/obtener-producto/${id}`);
            setProductoActual(res.data);
            return res.data;
        } catch (error) {
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

    // Cargar nuevo producto
    const cargarProducto = async (data) => {
        try {
            setLoading(true);
            setErrors(null);
            const res = await cliente.post('/productos/cargar', data);
            console.log('Producto creado:', res.data);
            
            // Actualizar la lista de productos
            setProductos(prev => [...prev, ...res.data]);
            return res.data;
        } catch (error) {
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

    // Modificar producto
    const modificarProducto = async (id, data) => {
        try {
            setLoading(true);
            setErrors(null);
            const res = await cliente.put(`/productos/modificar-producto/${id}`, data);
            console.log('Producto modificado:', res.data);
            
            // Actualizar el producto en la lista
            setProductos(prev => 
                prev.map(producto => 
                    producto.id === id ? res.data : producto
                )
            );
            
            // Actualizar el producto actual si es el mismo
            if (productoActual && productoActual.id === id) {
                setProductoActual(res.data);
            }
            
            return res.data;
        } catch (error) {
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

    // Eliminar producto
    const eliminarProducto = async (id) => {
        try {
            setLoading(true);
            setErrors(null);
            const res = await cliente.delete(`/productos/borrar-producto/${id}`);
            console.log('Producto eliminado:', res.data);
            
            // Remover el producto de la lista
            setProductos(prev => prev.filter(producto => producto.id !== id));
            
            // Limpiar el producto actual si es el mismo
            if (productoActual && productoActual.id === id) {
                setProductoActual(null);
            }
            
            return res.data;
        } catch (error) {
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

    // Limpiar errores
    const limpiarErrores = () => setErrors(null);

    // Limpiar producto actual
    const limpiarProductoActual = () => setProductoActual(null);

    return (
        <ProductosContext.Provider value={{
            productos,
            productoActual,
            loading,
            errors,
            obtenerProductos,
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