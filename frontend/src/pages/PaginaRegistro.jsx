import { Card, Button, Input, Label } from "../components/ui";
import {  useForm } from "react-hook-form";
import { Link , useNavigate} from "react-router-dom";
import {  useAuth } from "../context/AuthContext.jsx";

function PaginaRegistro() {
  const {register, handleSubmit, formState: { errors }} = useForm();

  const {signup, errors: setUserErrors} = useAuth();
  const navigate = useNavigate();
  const onSubmit = handleSubmit(async(data) => {
  const user  = await signup(data);
    if(user){
      navigate("/pagina-usuario");
    }
  });

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center px-4">
      <Card>
        {setUserErrors && setUserErrors.map((error) =>(
            <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">{error}</p>
          ))}

        <h2 className="text-gray-800 text-2xl font-semibold mb-6 text-center">Registro</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            placeholder="Ingrese su nombre"
            {...register("nombre", { required: true })}
          />
          {errors.nombre && (
            <span className="text-red-500 text-xs">Este campo es obligatorio</span>
          )}
          <Label htmlFor="correo">Email</Label>
          <Input
            type="email"
            placeholder="Ingrese su email"
            {...register("correo", { required: true })}
          />
          {errors.correo && (
            <span className="text-red-500 text-xs">Este campo es obligatorio</span>
          )}
          <Label htmlFor="contrasenia">Contraseña</Label>
          <Input
            type="password"
            placeholder="Ingrese su contraseña"
            {...register("contrasenia", { required: true })}
          />
          {errors.contrasenia && (
            <span className="text-red-500 text-xs">Este campo es obligatorio</span>
          )}

          <div className="mt-6">
            <Button>Registrarse</Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">¿Ya tienes cuenta?{" "}
            <Link to="/inicio-de-sesion" className="text-blue-500 hover:text-blue-600 font-medium">
              Iniciar sesión
            </Link>
          </p>

        </div>
      </Card>
    </div>
  );
}

export default PaginaRegistro;
