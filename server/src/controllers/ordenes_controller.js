import { pool } from "../db/db.js";

export const obtenerOrdenesCompra = async (req, res) => {
 try {
    const result = await pool.query(
         `SELECT
          o.id AS orden_id,
          o.fecha_orden,
          o.total,
          json_agg(
              json_build_object(
                  'item_id', io.id,
                  'producto_id', io.producto_id,
                  'nombre_producto', p.nombre, -- Asumiendo que quieres el nombre del producto
                  'cantidad', io.cantidad,
                  'precio_unitario', io.precio_unitario
              )
              ORDER BY io.id
          ) AS items
      FROM ordenes AS o
      JOIN items_orden AS io ON o.id = io.orden_id
      JOIN productos AS p ON io.producto_id = p.id
      WHERE o.usuario_id = $1
      GROUP BY o.id, o.fecha_orden, o.total
      ORDER BY o.fecha_orden DESC;`,
      [req.usuarioId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener órdenes de compra:", error);
    return res.status(500).json(["Error interno del servidor"]);
  }

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
    await pool.query('ROLLBACK'); 
    console.error("Error al cargar la orden:", error);
    next(error); 
  } 
};
