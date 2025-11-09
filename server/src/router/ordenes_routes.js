import Router  from "express-promise-router";
import { obtenerOrdenesCompra,obtenerOrdenPorId, crearOrden, modificarOrden } from "../controllers/ordenes_controller.js";
import { estaAutenticado } from "../middlewares/autenticar_usuario_middleware.js";
const router = Router();

router.get('/obtener-ordenes',estaAutenticado, obtenerOrdenesCompra)
router.get("/orden/:id", estaAutenticado, obtenerOrdenPorId); 
router.post("/crear-orden", estaAutenticado, crearOrden); 
router.put("/modificar-orden/:id", estaAutenticado, modificarOrden); 

export default router;