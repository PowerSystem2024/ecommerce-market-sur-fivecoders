import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import { generarToken } from "../libs/jwt.js";
import md5 from "md5";

export const ingresar = async (req, res) => {
  const { correo, contrasenia } = req.body;

  console.log(correo, contrasenia);

  const result = await pool.query("SELECT * FROM usuarios WHERE correo = $1 ", [
    correo,
  ]);
  
  const datosUsuario = result.rows[0];

  if (result.rows.length === 0) {
    return res.status(404).json([ "Usuario no encontrado"]);
  }

  const validarContrasenia = await bcrypt.compare(
    contrasenia,
    datosUsuario.contrasenia
  );


  if (!validarContrasenia) {
    return res.status(401).json(["Contraseña incorrecta"]);
  }

  const token = await generarToken({
    id: datosUsuario.id,
    rol: datosUsuario.rol,
  });
  res.cookie("token", token, {
    // httpOnly: true,
    secure: false, //en producción debe ser true
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 1000, //1 dia
  });

  const {
    id,
    nombre: nombreUsuario,
    correo: emailUsuario,
    rol,
    fecha_registro,
  } = datosUsuario;

  return res.json({
    message: "Ingreso exitoso",
    user: {
      id,
      nombre: nombreUsuario,
      correo: emailUsuario,
      rol,
      fecha_registro,
    },
  });
};

export const registrar = async (req, res, next) => {
  const { nombre, correo, contrasenia } = req.body;
  try {
    const hashedContrasenia = await bcrypt.hash(contrasenia, 10); //acá se hashea la contraseña antes de guardarla
    const gravatar = "https://www.gravatar.com/avatar/" + md5(correo);
    console.log("hashedContrasenia:", hashedContrasenia);
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, correo, contrasenia, gravatar) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, correo, hashedContrasenia, gravatar]
    );

    const nuevoUsuario = result.rows[0];
    const token = await generarToken({
      id: nuevoUsuario.id,
      rol: nuevoUsuario.rol,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 1000, //1 dia
    });

    const {
      id,
      nombre: nombreUsuario,
      correo: emailUsuario,
      rol,
      fecha_registro,
    } = nuevoUsuario;
    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id,
        nombre: nombreUsuario,
        correo: emailUsuario,
        rol,
        fecha_registro,
        gravatar
      },
    });
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está en uso" });
    }
    next(error);
  }
};

export const cerrarSesion = async (req, res) => {
  res.clearCookie("token");
  return res.json("Cierre de sesión exitoso");
};

export const perfil = async (req, res) => {
  const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [
    req.usuarioId,
  ]);
  const datosUsuario = result.rows[0];

  if (!datosUsuario) {
    return res.status(404).json({
      message: "Perfil de usuario no encontrado.",
    });
  }
  const {
    id,
    nombre: nombreUsuario,
    correo: emailUsuario,
    contrasenia: contraseniaUsuario,
    rol,
    fecha_registro,
  } = datosUsuario;

  return res.json({
    user: {
      id,
      nombre: nombreUsuario,
      correo: emailUsuario,
      contrasenia: contraseniaUsuario,
      rol,
      fecha_registro,
    },
  });
};

export const modificarPerfil = async (req, res, next) => {
  const { nombre, correo, contrasenia } = req.body;
  const idUsuario = req.usuarioId;
  let hashedContrasenia
  if(contrasenia){
    hashedContrasenia  = await bcrypt.hash(contrasenia, 10);
    console.log('contraseña hasheada ', hashedContrasenia)
  }
  
  const fechaActual = new Date();
  try {
    const result = await pool.query(
      "UPDATE usuarios SET nombre = $1 , correo = $2, contrasenia = $3, fecha_modificacion = $4  WHERE id = $5 RETURNING id, nombre, correo, rol, fecha_modificacion",
      [nombre, correo, hashedContrasenia, fechaActual ,idUsuario]
    );
    const usuario = result.rows[0];
    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }
    return res.status(200).json({
      message: "Datos del usuario actualizados con éxito",
      usuario: usuario,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        message: "El correo electrónico ya está en uso",
      });
    }
    next(error);
  }
};
