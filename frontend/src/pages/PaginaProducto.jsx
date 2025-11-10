import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar/SideBar';
import TarjetaProducto from '../components/TarjetaProducto/TarjetaProducto';
import ProductDetailModal from '../components/ModalDetalles/ModalDetalles';
import { useProductos } from '../context/ProductosContext';
import { useAuth } from '../context/AuthContext';
import BusquedasProductos from '../components/BusquedaProductos/BusquedasProductos';
import FiltroCategoriasProductos from '../components/BusquedaProductos/FiltroCategoriasProductos';
import FiltroRelevanciasProductos from '../components/BusquedaProductos/FiltroRelevanciasProductos';

export default function PaginaMisProductos() {
  const { productos, obtenerProductos, cargarProducto, modificarProducto, eliminarProducto, loading, errors } = useProductos();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('relevance');
  const [results, setResults] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Mapeo de categorías
  const CATEGORY_MAP = {
    1: 'papeleria',
    2: 'electronica',
    3: 'computacion',
    4: 'ferreteria',
    5: 'panificacion',
    6: 'maderas',
    7: 'herramientas',
    8: 'metalmecanica',
    9: 'gastronomia',
    10: 'construccion'
  };

  const REVERSE_CATEGORY_MAP = {
    'papeleria': 1,
    'electronica': 2,
    'computacion': 3,
    'ferreteria': 4,
    'panificacion': 5,
    'maderas': 6,
    'herramientas': 7,
    'metalmecanica': 8,
    'gastronomia': 9,
    'construccion': 10
  };

  const CATEGORIES = [
    { key: 'all', label: 'Todas', value: null },
    { key: 'papeleria', label: 'Papelería', value: 1 },
    { key: 'electronica', label: 'Electrónica', value: 2 },
    { key: 'computacion', label: 'Computación', value: 3 },
    { key: 'ferreteria', label: 'Ferretería', value: 4 },
    { key: 'panificacion', label: 'Panificación', value: 5 },
    { key: 'maderas', label: 'Maderas', value: 6 },
    { key: 'herramientas', label: 'Herramientas', value: 7 },
    { key: 'metalmecanica', label: 'Metal Mecánica', value: 8 },
    { key: 'gastronomia', label: 'Gastronomía', value: 9 },
    { key: 'construccion', label: 'Construcción', value: 10 }
  ];

  // Cargar productos al montar
  useEffect(() => {
    obtenerProductos();
  }, []);

  // Transformar productos de DB
  const transformarProductos = (productosDB) => {
    return productosDB.map(p => ({
      id: p.id,
      usuario_id: p.usuario_id,
      name: p.nombre,
      description: p.descripcion,
      category: CATEGORY_MAP[p.categoria_id] || 'otros',
      price: parseFloat(p.precio),
      currency: 'ARS',
      provider: p.usuario_id ? `Proveedor #${p.usuario_id}` : 'Sin proveedor',
      stock: p.stock,
      image: p.img,
      categoria_id: p.categoria_id
    }));
  };

  // Filtrar solo productos del usuario actual
  useEffect(() => {
    if (productos && productos.length > 0 && user) {
      const misProductos = productos.filter(p => p.usuario_id === user.id);
      const productosTransformados = transformarProductos(misProductos);
      setResults(productosTransformados);
      setVisibleCount(12);
    }
  }, [productos, user]);

  useEffect(() => {
    doSearch();
  }, [category, sort]);

  function doSearch() {
    if (!productos || productos.length === 0 || !user) return;

    const misProductos = productos.filter(p => p.usuario_id === user.id);
    const productosTransformados = transformarProductos(misProductos);
    const q = (query || '').trim().toLowerCase();
    
    let filtered = productosTransformados.filter(p => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || 
             p.description.toLowerCase().includes(q);
    });

    if (sort === 'price_asc') filtered = filtered.sort((a,b) => a.price - b.price);
    if (sort === 'price_desc') filtered = filtered.sort((a,b) => b.price - a.price);

    setResults(filtered);
    setVisibleCount(12);
  }

  function loadMore() {
    setVisibleCount(c => c + 12);
  }

  function handleViewProduct(product) {
    setSelectedProduct(product);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setSelectedProduct(null);
  }

  function handleAddToCart(productWithQuantity) {
    console.log('Producto agregado al carrito:', productWithQuantity);
    alert(`${productWithQuantity.name} agregado al carrito (cantidad: ${productWithQuantity.quantity})`);
  }

  function handleOpenFormModal(product = null) {
    setEditingProduct(product);
    setFormModalOpen(true);
  }

  function handleCloseFormModal() {
    setFormModalOpen(false);
    setEditingProduct(null);
  }

  async function handleDeleteProduct(productId) {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      await eliminarProducto(productId);
      alert('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar el producto');
    }
  }

  return (
    <div className="flex min-h-screen bg-orange-50 text-zinc-800 overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 ml-0 sm:ml-64 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <header className="mb-8 pt-2">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl sm:text-4xl font-bold">Mis Productos</h1>
              <button
                onClick={() => handleOpenFormModal()}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition flex items-center gap-2"
              >
                <span className="text-xl">+</span>
                Nuevo Producto
              </button>
            </div>
            <p className="text-base sm:text-lg text-zinc-600">
              Administrá tus productos en venta
            </p>
          </header>

          {/* Controles de búsqueda */}
          <div className="mb-6 space-y-3">
            <BusquedasProductos 
              query={query}
              setQuery={setQuery}
              onSearch={doSearch}
            />

            <div className="flex gap-3">
              <FiltroCategoriasProductos 
                category={category}
                setCategory={setCategory}
                categories={CATEGORIES}
              />
              <FiltroRelevanciasProductos 
                sort={sort}
                setSort={setSort}
              />
            </div>
          </div>


          {/* Resultados */}
          <section>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-zinc-600">Cargando productos...</p>
                </div>
              </div>
            ) : errors ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 font-medium">Error al cargar productos:</p>
                <ul className="list-disc list-inside text-red-500 text-sm mt-2">
                  {errors.map((error, index) => (
                    <li key={index}>{error.message || 'Error desconocido'}</li>
                  ))}
                </ul>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-zinc-500 text-lg mb-2">No tenés productos publicados</p>
                <p className="text-zinc-400 text-sm mb-4">Comenzá agregando tu primer producto</p>
                <button
                  onClick={() => handleOpenFormModal()}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition"
                >
                  Agregar Producto
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
                  {results.slice(0, visibleCount).map(item => (
                    <div key={item.id} className="relative">
                      <TarjetaProducto 
                        item={item} 
                        onView={handleViewProduct}
                      />
                      {/* Botones de acción superpuestos */}
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => handleOpenFormModal(item)}
                          className="p-2 bg-white rounded-lg shadow hover:shadow-md transition"
                          title="Editar"
                        >
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(item.id)}
                          className="p-2 bg-white rounded-lg shadow hover:shadow-md transition"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {visibleCount < results.length && (
                  <div className="flex justify-center">
                    <button 
                      onClick={loadMore} 
                      className="px-8 py-3 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition font-medium"
                    >
                      Cargar más productos ({results.length - visibleCount} restantes)
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {/* Modal de detalles */}
      <ProductDetailModal
        open={modalOpen}
        product={selectedProduct}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />

      {/* Modal de formulario */}
      {formModalOpen && (
        <FormularioProductoModal
          open={formModalOpen}
          product={editingProduct}
          categories={CATEGORIES.filter(c => c.key !== 'all')}
          onClose={handleCloseFormModal}
          onSave={async (data) => {
            try {
              if (editingProduct) {
                await modificarProducto(editingProduct.id, data);
                alert('Producto modificado exitosamente');
              } else {
                await cargarProducto(data);
                alert('Producto creado exitosamente');
              }
              handleCloseFormModal();
              obtenerProductos();
            } catch (error) {
              console.error('Error:', error);
            }
          }}
        />
      )}
    </div>
  );
}

// Componente Modal de Formulario
function FormularioProductoModal({ open, product, categories, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    img: '',
    stock: '',
    categoria_id: categories[0]?.value || 1
  });

  useEffect(() => {
    if (open) {
      if (product) {
        setFormData({
          nombre: product.name || '',
          descripcion: product.description || '',
          precio: product.price || '',
          img: product.image || '',
          stock: product.stock || '',
          categoria_id: product.categoria_id || categories[0]?.value || 1
        });
      } else {
        setFormData({
          nombre: '',
          descripcion: '',
          precio: '',
          img: '',
          stock: '',
          categoria_id: categories[0]?.value || 1
        });
      }
    }
  }, [open, product, categories]);

  const handleSubmit = () => {
    // Validaciones básicas
    if (!formData.nombre || !formData.descripcion || !formData.precio || !formData.stock) {
      alert('Por favor completá todos los campos obligatorios');
      return;
    }

    const dataToSend = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      categoria_id: parseInt(formData.categoria_id)
    };

    onSave(dataToSend);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-zinc-900">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-zinc-100">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Nombre del producto *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Descripción *
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Precio (ARS) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) => setFormData({...formData, precio: e.target.value})}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Categoría *
            </label>
            <select
              value={formData.categoria_id}
              onChange={(e) => setFormData({...formData, categoria_id: e.target.value})}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            >
              {categories.map(cat => (
                <option key={cat.key} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              URL de la imagen
            </label>
            <input
              type="url"
              value={formData.img}
              onChange={(e) => setFormData({...formData, img: e.target.value})}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {formData.img && (
              <img src={formData.img} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition"
            >
              {product ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}