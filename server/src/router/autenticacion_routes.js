import Router from "express-promise-router";
import { estaAutenticado } from "../middlewares/autenticar_usuario_middleware.js";
import { ingresar, registrar, cerrarSesion, perfil, modificarPerfil } from "../controllers/autenticacion_controller.js";
import { validarEsquema } from "../middlewares/validar_esquema_middleware.js";
import { ingresarSchema, loginSchema } from "../schemas/autenticacion_schema.js";

const router = Router();
router.post('/ingresar', validarEsquema(ingresarSchema),ingresar);
router.post('/registro', validarEsquema(loginSchema),registrar);
router.post('/cerrar-sesion', cerrarSesion);
router.get('/perfil',estaAutenticado, perfil)
router.put('/modificar-perfil', estaAutenticado, modificarPerfil)


export default router;