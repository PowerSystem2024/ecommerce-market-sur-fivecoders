import {pool} from "../db/db.js";


export const obtenerCategorias = async (req, res, next) => {
    const result = await pool.query("SELECT * FROM categorias");

    return res.json(result.rows);
}