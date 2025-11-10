import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar/SideBar';
import TarjetaProducto from '../components/TarjetaProducto/TarjetaProducto';
import ProductDetailModal from '../components/ModalDetalles/ModalDetalles';
import { useAuth } from '../context/AuthContext.jsx';
import { useProductos } from '../context/ProductosContext';
import { useCart } from '../context/CartContext.jsx';
import BusquedasProductos from '../components/BusquedaProductos/BusquedasProductos';
import FiltroCategoriasProductos from '../components/BusquedaProductos/FiltroCategoriasProductos';
import FiltroRelevanciasProductos from '../components/BusquedaProductos/FiltroRelevanciasProductos';

export default function PaginaDescubrirProductos() {
  const { productos, obtenerProductosPublico } = useProductos();
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('relevance');  

  const [results, setResults] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [query, setQuery] = useState('');

  // 📦 Mapeo de categorías

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
    { key: 'construccion', label: 'Construcción', value: 10 },
  ];

  const CATEGORY_MAP = { 
    1:'papeleria',
    2:'electronica',
    3:'computacion',
    4:'ferreteria',
    5:'panificacion',
    6:'maderas',
    7:'herramientas',
    8:'metalmecanica',
    9:'gastronomia',
    10:'construccion' 
  };

  // Traer catálogo público al montar
  useEffect(() => {
    (async () => {
      try {
        await obtenerProductosPublico();
      } catch (err) {
        console.error('Error en obtenerProductosPublico():', err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Transformar productos
  const transformarProductos = (productosDB) => {
    return productosDB.map(p => ({
      id: p.id,
      //usuario_id: p.usuario_id,
      name: p.nombre,
      description: p.descripcion,
      category: CATEGORY_MAP[p.categoria_id] || 'otros',
      price: parseFloat(p.precio),
      currency: 'ARS',
      provider: p.usuario_id ? `Proveedor #${p.usuario_id}` : 'Sin proveedor',
      stock: p.stock,
      image: p.img,
      categoria_id: p.categoria_id,
    }));
  };

 // 🔍 Filtrado y búsqueda de productos
  function doSearch() {
    if (!productos || productos.length === 0) return;

    const productosTransformados = transformarProductos(productos);
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

  // 🔁 Ejecutar búsqueda automáticamente cuando cambian filtros o query
  useEffect(() => {
    doSearch();
  }, [productos, query, category, sort]);

  useEffect(() => {
    // DEBUG: ver qué nos devuelve el contexto
    console.log('Productos desde contexto (públicos):', productos);
    if (!productos || productos.length === 0) {
      setResults([]);
      return;
    }

    // Transformamos *todos* los productos (sin filtrar)
    const transformed = productos.map(p => {
      const proveedorNombre = (user && Number(p.usuario_id) === Number(user.id)) 
        ? user.nombre 
        : `Proveedor #${p.usuario_id}`;

      return {
        id: p.id,
        name: p.nombre,
        description: p.descripcion,
        category: CATEGORY_MAP[p.categoria_id] || 'otros',
        price: Number(p.precio),
        stock: p.stock,
        image: p.img,
        proveedorNombre,
        usuario_id: p.usuario_id,
        raw: p // para depuración si lo necesitás
      };
    });

    // Guardar todos (no filtrar)
    setResults(transformed);
  }, [productos, user]);

  const handleAddToCart = (product, quantity) => {
    const inCart = cartItems.find(item => item.id === product.id);
    const totalQty = (inCart?.qty || 0) + quantity;
    if (totalQty > product.stock) {
      alert(`No se puede agregar más de ${product.stock} unidades.`);
      return;
    }
    addToCart(product, quantity);
    alert(`${product.name} agregado al carrito (cantidad: ${quantity})`);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // 📈 Cargar más productos
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  return (
    <div className="flex min-h-screen bg-orange-50 text-zinc-800 overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 ml-0 sm:ml-64 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Descubrí productos</h1>

          {/* 🔍 Controles de búsqueda */}
          <div className="mb-6 space-y-3">
            <div className="flex gap-3">
              <BusquedasProductos query={query} setQuery={setQuery} onSearch={doSearch} />
            </div>
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

          {/* 🛍️ Productos */}
          {results.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
                {results.slice(0, visibleCount).map(product => (
                  <TarjetaProducto
                    key={product.id}
                    item={product}
                    onView={() => handleViewProduct(product)}
                  />
                ))}
              </div>
              {visibleCount < results.length && (
                <div className="flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
                  >
                    Cargar más
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-zinc-600 text-lg mt-10">
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
          )}
        </div>
      </main>

      <ProductDetailModal
        open={modalOpen}
        product={selectedProduct}
        onClose={() => setModalOpen(false)}
        onAddToCart={(qty) => handleAddToCart(selectedProduct, qty)}
      />
    </div>
  );
}
