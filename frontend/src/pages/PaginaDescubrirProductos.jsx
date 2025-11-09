import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar/SideBar';
import TarjetaProducto from '../components/TarjetaProducto/TarjetaProducto';
import ProductDetailModal from '../components/ModalDetalles/ModalDetalles';
import { useProductos } from '../context/ProductosContext';

export default function PaginaDescubrirProductos() {
  const { productos, obtenerProductos, loading, errors } = useProductos();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('relevance');
  const [results, setResults] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Mapeo de categorías de DB a nombres amigables
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

  
  const CATEGORIES = [
    { key: 'all', label: 'Todas' },
    { key: 'papeleria', label: 'Papelería' },
    { key: 'electronica', label: 'Electrónica' },
    { key: 'computacion', label: 'Computación' },
    { key: 'ferreteria', label: 'Ferretería' },
    { key: 'panificacion', label: 'Panificación' },
    { key: 'maderas', label: 'Maderas' },
    { key: 'herramientas', label: 'Herramientas' },
    { key: 'metalmecanica', label: 'Metal Mecánica' },
    { key: 'gastronomia', label: 'Gastronomía' },
    { key: 'construccion', label: 'Construcción' }
  ];

  // Cargar productos de la DB al montar el componente
  useEffect(() => {
    obtenerProductos();
  }, []);

  // Transformar productos de DB al formato esperado por las tarjetas
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
      image: p.img
    }));
  };

  // Actualizar results cuando cambien los productos del contexto
  useEffect(() => {
    if (productos && productos.length > 0) {
      const productosTransformados = transformarProductos(productos);
      setResults(productosTransformados);
      setVisibleCount(12);
    }
  }, [productos]);

  useEffect(() => {
    doSearch();
  }, [category, sort]);

  function doSearch() {
    if (!productos || productos.length === 0) return;

    const productosTransformados = transformarProductos(productos);
    const q = (query || '').trim().toLowerCase();
    
    let filtered = productosTransformados.filter(p => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || 
             p.description.toLowerCase().includes(q) || 
             p.provider.toLowerCase().includes(q);
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
    // Aquí puedes integrar con tu contexto de carrito
    alert(`${productWithQuantity.name} agregado al carrito (cantidad: ${productWithQuantity.quantity})`);
  }

  return (
    <div className="flex min-h-screen bg-orange-50 text-zinc-800 overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 ml-0 sm:ml-64 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <header className="mb-8 pt-2">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Descubrí productos</h1>
            <p className="text-base sm:text-lg text-zinc-600">Buscá insumos, compará proveedores y guardá favoritos.</p>
          </header>

          {/* Controles de búsqueda */}
          <div className="mb-6 space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && doSearch()}
                placeholder="Buscar productos, proveedores..."
                className="flex-1 px-4 py-3 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button 
                onClick={doSearch} 
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition whitespace-nowrap"
              >
                Buscar
              </button>
            </div>

            <div className="flex gap-3">
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 bg-white text-sm"
              >
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>

              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value)} 
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 bg-white text-sm"
              >
                <option value="relevance">Relevancia</option>
                <option value="price_asc">Precio ↑</option>
                <option value="price_desc">Precio ↓</option>
              </select>
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
              <p className="text-center text-zinc-500 py-12">No hay resultados. Probá otra búsqueda o categoría.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
                  {results.slice(0, visibleCount).map(item => (
                    <TarjetaProducto 
                      key={item.id} 
                      item={item} 
                      onView={handleViewProduct}
                    />
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
    </div>
  );
}