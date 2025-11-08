import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import PaginaNosotros from './pages/PaginaNosotros.jsx'
import PaginaRegistro from './pages/PaginaRegistro.jsx'
import PaginaUsuario from './pages/PaginaUsuario.jsx'
import PaginaPerfil from './pages/PaginaPerfil.jsx'
import PaginaInicioSesion from './pages/PaginaInicioSesion.jsx'
import NotFound from './pages/NotFound.jsx'
import Navbar from './components/navbar/Navbar.jsx';
import {Container} from './components/ui/Container.jsx';
import {ProtectedRoutes} from './components/ProtectedRoutes.jsx';
import { useAuth } from './content/AuthContext.jsx';
import PaginaProducto from './pages/PaginaProducto.jsx' 
import PaginaDescubrirProductos from './pages/PaginaDescubrirProductos.jsx'   

function App() {
  const { isAuth } = useAuth();
 

  return (
    <Navbar>
      <Container className="py-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nosotros" element={<PaginaNosotros/>} />
          <Route path="/inicio-de-sesion" element={<PaginaInicioSesion/>} />
          <Route path="/registro" element={<PaginaRegistro />} />
          <Route path="/producto" element={<PaginaProducto/>}/>
          <Route path="/descubrir-productos" element={<PaginaDescubrirProductos/>}/>

          <Route element={<ProtectedRoutes isAllowed={isAuth} redirectTo="/inicio-de-sesion"/>}>
            <Route path="/perfil" element={<PaginaPerfil/>} />
            <Route path="/pagina-usuario" element={<PaginaUsuario/>}/>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </Navbar >
  )
}

export default App