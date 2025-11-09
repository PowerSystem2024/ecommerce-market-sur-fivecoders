import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar/SideBar';
import TarjetaProducto from '../components/TarjetaProducto/TarjetaProducto';
import ProductDetailModal from '../components/ModalDetalles/ModalDetalles';
import { useProductos } from '../context/ProductosContext';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function PaginaDescubrirProductos() {
  const { productos, obtenerProductos } = useProductos();
  const { addToCart, cartItems } = useCart();
  const { getUserById } = useAuth();

  const [results, setResults] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const CATEGORY_MAP = { 1:'papeleria',2:'electronica',3:'computacion',4:'ferreteria',5:'panificacion',6:'maderas',7:'herramientas',8:'metalmecanica',9:'gastronomia',10:'construccion' };

  useEffect(() => { obtenerProductos(); }, []);

  useEffect(() => {
    if (productos && productos.length > 0) {
      const fetchProveedores = async () => {
        const transformed = await Promise.all(
          productos.map(async p => {
            const proveedor = await getUserById(p.usuario_id);
            return {
              id: p.id,
              name: p.nombre,
              description: p.descripcion,
              category: CATEGORY_MAP[p.categoria_id] || 'otros',
              price: parseFloat(p.precio),
              stock: p.stock,
              image: p.img,
              proveedorNombre: proveedor?.nombre || `Proveedor #${p.usuario_id}`,
            };
          })
        );
        setResults(transformed);
      };
      fetchProveedores();
    }
  }, [productos]);

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

  return (
    <div className="flex min-h-screen bg-orange-50 text-zinc-800 overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 ml-0 sm:ml-64 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Descubrí productos</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
            {results.map(product => (
              <TarjetaProducto
                key={product.id}
                item={product}
                onView={() => handleViewProduct(product)}
              />
            ))}
          </div>
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
