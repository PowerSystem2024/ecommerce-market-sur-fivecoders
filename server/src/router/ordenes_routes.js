import Router  from "express-promise-router";
import { obtenerOrdenesCompra } from "../controllers/ordenes_controller.js";

const router = Router();

router.get('/obtener-ordenes', obtenerOrdenesCompra)

export default router;