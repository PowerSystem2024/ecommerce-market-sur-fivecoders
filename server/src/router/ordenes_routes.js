import Router  from "express-promise-router";
import { obtenerOrdenesCompra, crearOrden } from "../controllers/ordenes_controller.js";
import { estaAutenticado } from "../middlewares/autenticar_usuario_middleware.js";
const router = Router();

router.get('/obtener-ordenes',estaAutenticado, obtenerOrdenesCompra)
router.post("/crear-orden", estaAutenticado, crearOrden); 
export default router;