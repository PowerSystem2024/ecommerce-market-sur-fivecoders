import  Router  from "express";
import  {estaAutenticado}  from "../middlewares/autenticar_usuario_middleware.js";
import { obtenerCategorias } from "../controllers/categorias_controller.js";

const router = Router();
router.get("/", estaAutenticado,obtenerCategorias);

export  default router;