import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProductosProvider } from './context/ProductosContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductosProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ProductosProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
