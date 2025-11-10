import { z } from "zod";

export const loginSchema = z.object({
  nombre: z.string({
    required_error: "El nombre es obligatorio",
    invalid_type_error: "El nombre debe ser una cadena de texto",
  }).min(1, {
    message: "El nombre debe tener al menos 1 carácter",
  }).max(255, {
    message: "El nombre debe tener como máximo 255 caracteres",
  }),
  correo: z.string({
    required_error: "El email es obligatorio",
    invalid_type_error: "El email debe ser una cadena de texto",
  }).email({
    message: "El email no es válido",
  }),
  contrasenia: z.string({
    required_error: "La contraseña es obligatoria",
    invalid_type_error: "La contraseña debe ser una cadena de texto",
  }).min(3, {
    message: "La contraseña debe tener al menos 3 caracteres",
  }).max(255, {
    message: "La contraseña debe tener como máximo 255 caracteres",
  }),
});

export const ingresarSchema = z.object({
  correo: z.string({
    required_error: "El email es obligatorio",
    invalid_type_error: "El email debe ser una cadena de texto",
  }).email({
    message: "El email no es válido",
  }),
  contrasenia: z.string({
    required_error: "La contraseña es obligatoria",
    invalid_type_error: "La contraseña debe ser una cadena de texto",
  }).min(3, {
    message: "La contraseña debe tener al menos 3 caracteres",
  }).max(255, {
    message: "La contraseña debe tener como máximo 255 caracteres",
  }),
});
