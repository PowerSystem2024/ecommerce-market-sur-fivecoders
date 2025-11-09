import express from "express";
import autenticacionRoutes from  "./router/autenticacion_routes.js";
import productosRoutes from "./router/productos_routes.js";
import categoriasRoutes from "./router/categorias_router.js";
import ordenesRoutes from "./router/ordenes_routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from 'morgan';


dotenv.config();

const app = express();//acá estoy creando el servidor; encargado de recibir las peticiones y devolver respuestas
const port = process.env.PORT || 3000; 
app.use(morgan("dev"));

app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Configurar CORS

app.use(express.json()); //middleware que permite que el servidor entienda JSON en las peticiones
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/api', autenticacionRoutes); //middleware para las rutas de autenticación
app.use('/api/productos', productosRoutes); //middleware para las rutas de productos
app.use('/api/categorias', categoriasRoutes)
app.use('/api', ordenesRoutes)

app.use((err, req, res, next) =>{
    res.status(500).json({
        status: 'error',
        message: err.message
    });
});

export default app;