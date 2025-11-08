import { MdAddTask } from 'react-icons/md';
import { BiTask, BiUserCircle } from 'react-icons/bi';

import CartIcon from '../../assets/cart.svg';

export const PublicRoutes = [
  { name: 'Descubrir', path: '/ProductDiscoveryPage'},
  { name: 'Home', path: '/' },
  { name: 'Nosotros', path: '/about' },
  { name: 'Iniciar Sesion', path: '/login' },
  { name: 'Registro', path: '/register' }
];

export const PrivateRoutes = [
  { name: 'Descubrir', path: '/ProductDiscoveryPage'},
  { name: "Perfil", path: "/profile", icon: <BiUserCircle /> },
  { name: "Tareas", path: "/tareas", icon: <BiTask /> },
  { name: "Agregar", path: "/tareas/crear", icon: <MdAddTask /> },
  { name: 'Carrito', path: "/cart", icon: CartIcon}
];