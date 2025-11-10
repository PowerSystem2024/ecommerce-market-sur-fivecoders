import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

// Íconos SVG
import VenderIcon from "../../assets/receipt.svg";
//import InboxIcon from "../../assets/message.svg";
import SettingsIcon from "../../assets/settings.svg";
import LogoutIcon from "../../assets/logout.svg";
import ProfileIcon from "../../assets/user.svg";
import ProductIcon from "../../assets/object.svg";
import ShoppingBag from "../../assets/shopping.svg";

const sidebarItems = [
  { label: "Mi Perfil", hyperlink: "/pagina-usuario", icon: ProfileIcon },
  { label: "Mis Productos", hyperlink: "/producto", icon: ProductIcon },
  { label: "Mis Ventas", hyperlink: "/mis-ventas", icon: VenderIcon },
  { label: "Mis Ordenes", hyperlink: "/mis-ordenes", icon: ShoppingBag },
  { label: "Configuración", hyperlink: "/configuracion", icon: SettingsIcon },
  { label: "Cerrar sesión", icon: LogoutIcon, action: "logout" }, // Usamos action
];

function Sidebar() {
  const [open, setOpen] = useState(false);
  const { signout } = useAuth();
  const navigate = useNavigate();

  // Bloquea el scroll del body cuando el sidebar móvil está abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleLinkClick = (item) => {
    setOpen(false);
    if (item.action === "logout") {
      if (window.confirm("¿Estás seguro de cerrar sesión?")) {
        signout();
        navigate('/'); // redirige al inicio
      }
    }
  };

  return (
    <>
      {/* Botón hamburguesa móvil */}
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 rounded-md shadow"
        aria-label="Abrir menú"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-200 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } sm:hidden`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 w-64 transform transition-transform duration-200
          bg-gray-900 text-white border-r border-gray-800
          ${open ? 'translate-x-0' : '-translate-x-full'}
          sm:translate-x-0 sm:static sm:sticky sm:top-0
          h-screen sm:min-h-screen sm:overflow-y-auto
        `}
        aria-label="Sidebar"
      >
        <div className="h-full px-4 py-6 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
              <div className="w-8 h-8 bg-orange-500 rounded" />
              <span className="text-lg font-semibold text-white">USUARIO</span>
            </Link>

            <button
              onClick={() => setOpen(false)}
              className="sm:hidden p-2 rounded-md bg-gray-800 hover:bg-gray-700"
              aria-label="Cerrar menú"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-2 text-sm font-medium">
              {sidebarItems.map((item) => (
                <li key={item.label}>
                  {item.hyperlink ? (
                    <Link
                      to={item.hyperlink}
                      className="flex items-center p-2 rounded-md text-gray-200 hover:bg-gray-800 hover:text-white transition"
                      onClick={() => handleLinkClick(item)}
                    >
                      <img src={item.icon} alt={`${item.label} icon`} className="w-5 h-5 invert brightness-200" />
                      <span className="ml-2">{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleLinkClick(item)}
                      className="w-full text-left flex items-center p-2 rounded-md text-gray-200 hover:bg-gray-800 hover:text-white transition"
                    >
                      <img src={item.icon} alt={`${item.label} icon`} className="w-5 h-5 invert brightness-200" />
                      <span className="ml-2">{item.label}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6 text-xs text-gray-400">
            <div>v0.1 • Tu app</div>
            <div className="mt-2">soporte@tuapp.local</div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;



