import { pool } from "../db/db.js";


export const obtenerOrdenesCompra = async (req, res) => {
 try {
    const result = await pool.query(
      "SELECT * FROM ordenes WHERE usuario_id = $1 ORDER BY fecha_orden DESC",
      [req.usuarioId]
    );
    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener órdenes de compra:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }

};

export const obtenerOrdenPorId = async (req, res) => {

};

export const crearOrden = async (req, res, next) => {
  
  const { items } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json(["La orden debe contener al menos un item." ]);
  }
  
  let totalOrden = 0;
  for(const item of items){
    if(item.cantidad <= 0 || item.precio_unitario < 0){
        return res.status(400).json(["Cantidad o precio inválido"])
    }
    totalOrden += item.cantidad * item.precio_unitario;
  }

  try {

    const result = await pool.query(
      "INSERT INTO ordenes (usuario_id, total) VALUES ($1, $2) RETURNING *",
      [req.usuarioId, totalOrden]
    );

    const ordenId = result.rows[0].id;
     const itemsOrdenPromises = items.map(item =>
      pool.query(
        "INSERT INTO items_orden (orden_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4) RETURNING *",
        [ordenId, item.producto_id, item.cantidad, item.precio_unitario]
      )
    );

    const itemsOrdenResult = await Promise.all(itemsOrdenPromises);
    res.status(201).json({
      message: "Orden creada exitosamente",
      orden: result.rows[0],
      items: itemsOrdenResult.map(res => res.rows[0])
    });

} catch (error) {
    await pool.query('ROLLBACK'); // Si algo falla, revertimos la transacción
    console.error("Error al cargar la orden:", error);
    next(error); // Pasamos el error al manejador de errores global
  } 
};

export const modificarOrden = async(req, res) =>{

}