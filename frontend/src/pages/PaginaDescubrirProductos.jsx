import { useEffect } from 'react';
import { useProductos } from '../context/ProductosContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function PaginaDescubrirProductos() {
    const { 
        productos, 
        loading: loadingProductos, 
        errors, 
        obtenerProductos, 
        eliminarProducto 
    } = useProductos();
    
    const { isAuth, loading: loadingAuth } = useAuth(); // ← Importante: loading del auth
    const navigate = useNavigate();

    useEffect(() => {
        // Solo cargar productos cuando termine de verificar auth Y esté autenticado
        if (!loadingAuth && isAuth) {
            obtenerProductos();
        }
    }, [loadingAuth, isAuth]); // ← Dependencias importantes

    // 1. Primero: Esperar a que termine de verificar la autenticación
    if (loadingAuth) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Verificando sesión...</p>
            </div>
        );
    }

    // 2. Segundo: Si no está autenticado, redirigir o mostrar mensaje
    if (!isAuth) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p>Debes iniciar sesión para ver los productos</p>
                <button 
                    onClick={() => navigate('/login')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Ir a Login
                </button>
            </div>
        );
    }

    // 3. Tercero: Mostrar loading de productos
    if (loadingProductos) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Cargando productos...</p>
            </div>
        );
    }

    // 4. Finalmente: Mostrar productos
    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                await eliminarProducto(id);
                alert('Producto eliminado exitosamente');
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Descubrir Productos</h2>
                <button 
                    onClick={() => navigate('/productos/crear')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Crear Nuevo
                </button>
            </div>
            
            {errors && errors.length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {errors.map((error, index) => (
                        <p key={index}>{error.message || error.mensaje}</p>
                    ))}
                </div>
            )}

            {productos.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No hay productos disponibles</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productos.map((producto) => (
                        <div key={producto.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {producto.img && (
                                <img 
                                    src={producto.img} 
                                    alt={producto.nombre}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-2">{producto.nombre}</h3>
                                <p className="text-gray-600 mb-3">{producto.descripcion}</p>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-2xl font-bold text-green-600">
                                        ${producto.precio}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Stock: {producto.stock}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => navigate(`/productos/editar/${producto.id}`)}
                                        className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleEliminar(producto.id)}
                                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PaginaDescubrirProductos;