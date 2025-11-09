import { MdAddTask } from 'react-icons/md';
import { BiTask, BiUserCircle } from 'react-icons/bi';

import CartIcon from '../../assets/cart.svg';

export const PublicRoutes = [
  { name: 'Descubrir', path: '/descubrir-productos'},
  { name: 'Home', path: '/' },
  { name: 'Nosotros', path: '/nosotros' },
  { name: 'Iniciar Sesion', path: '/inicio-de-sesion' },
  { name: 'Registro', path: '/registro' }
];

export const PrivateRoutes = [
  { name: 'Descubrir', path: '/descubrir-productos'},
  { name: "Perfil", path: "/pagina-usuario", icon: <BiUserCircle /> },
  //{ name: "Agregar", path: "/tareas/crear", icon: <MdAddTask /> },
  { name: 'Carrito', path: "/cart", icon: CartIcon}
];