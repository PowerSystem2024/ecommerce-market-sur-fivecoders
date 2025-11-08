import { pool } from "../db/db.js";

export const obtenerProductos = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM productos where usuario_id = $1",
    [req.usuarioId]
  );
  console.log("Productos obtenidos:", result);
  return res.json(result.rowCount > 0 ? result.rows : []);
};

export const obtenerProductoPorId = async (req, res) => {
  const result = await pool.query("SELECT * FROM productos where id = $1 ", [
    req.params.id,
  ]);

  if (result.rows.length === 0) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }
  return res.json(result.rows[0]);
};

export const cargarProducto = async (req, res, next) => {
  const { nombre, descripcion, precio, img, stock, categoria_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO productos (usuario_id, nombre, descripcion , precio, img ,stock, categoria_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [req.usuarioId, nombre, descripcion, precio, img, stock, categoria_id]
    );

    res.json(result.rows);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "El producto ya existe",
      });
    }
    next(error);
  }
};

export const modificarProducto = async (req, res, next) => {
  const { nombre, descripcion, precio, img, stock } = req.body;
  const id = req.params.id;
  const result = await pool.query(
    "UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, img = $4, stock = $5 WHERE id = $6 RETURNING *",
    [nombre, descripcion, precio, img, stock, id]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  return res.json(result.rows);
};

export const eliminarProducto = async (req, res) => {
  const id = req.params.id;
  const result = pool.query("DELETE from productos where id = $1 RETURNING*", [
    id,
  ]);
  if (result === 0) {
    return res.status(404).json({
      message: "No existe el producto",
    });
  }
  return res.json(result.rows);
};
