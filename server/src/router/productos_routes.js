import Router  from "express-promise-router";
import { obtenerProductos, obtenerProductosPublico, obtenerProductoPorId, cargarProducto, modificarProducto, eliminarProducto } from "../controllers/productos_controller.js";
import { estaAutenticado } from "../middlewares/autenticar_usuario_middleware.js";

const router = Router();
router.get('/obtener-productos', estaAutenticado, obtenerProductos);
router.get('/obtener-productos-publico', obtenerProductosPublico)
router.get('/obtener-producto/:id', estaAutenticado, obtenerProductoPorId)
router.post('/cargar', estaAutenticado, cargarProducto)
router.put('/modificar-producto/:id', estaAutenticado, modificarProducto)
router.delete('/borrar-producto/:id', estaAutenticado, eliminarProducto)
export default router;