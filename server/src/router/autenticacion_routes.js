import Router  from "express-promise-router";
import { estaAutenticado } from "../middlewares/autenticar_usuario_middleware.js";
import { ingresar, registrar, cerrarSesion, perfil } from "../controllers/autenticacion_controller.js";

const router = Router();
router.post('/ingresar', ingresar);
router.post('/registro', registrar);
router.post('/cerrar-sesion', cerrarSesion);
router.get('/perfil',estaAutenticado, perfil)


export default router;