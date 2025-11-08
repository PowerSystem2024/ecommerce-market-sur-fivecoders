// import { useAuth } from "../content/AuthContext.jsx";
// import { Link } from "react-router-dom";
// import { Container } from "../components/ui/Container.jsx";


// function HomePage() {
// const { isAuth, user } = useAuth();
//   return(

//  <Container className="min-h-screen flex items-center justify-center">
//       <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
//         {/* Hero Section */}
//         <div className="space-y-4">
//           <h1 className="text-3xl font-bold text-green-600 text-center">
//             BIENVENIDOS A PROYECTO PERN BY FIVECODERS
//           </h1>
//           <p className="text-2xl text-gray-500">
//             APLICACIÓN DE GESTIÓN DE TAREAS
//           </p>
//         </div>

//         {/* Descripción */}
//         <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
//           <p className="text-xl text-gray-300 leading-relaxed">
//               Aplicación full-stack construida con <span className="text-amber-500 font-semibold">PostgreSQL</span>,{" "}
//             <span className="text-green-400 font-semibold">Express</span>,{" "}
//             <span className="text-blue-400 font-semibold">React</span> y{" "}
//             <span className="text-amber-500 font-semibold">Node.js</span>
//           </p>
//         </div>

//         {/* Call to Action */}
//         {isAuth ? (
//           <div className="space-y-4">
//             <p className="text-xl text-white">
//               Hola, <span className="text-sky-400 font-semibold">{user?.name}</span>! 👋
//             </p>
//             <Link
//               to="/tareas"
//               className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-4 rounded-lg text-lg transition-all transform hover:scale-105"
//             >
//               Ver mis Tareas
//             </Link>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             <p className="text-xl text-gray-500">
//               Estás a un paso de mejorar tu productividad. ¡Únete ahora!
//             </p>
//             <div className="flex gap-4 justify-center">
//               <Link
//                 to="/login"
//                 className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-4 rounded-lg text-lg transition-all transform hover:scale-105"
//               >
//                 Iniciar Sesión
//               </Link>
//               <Link
//                 to="/register"
//                 className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-8 py-4 rounded-lg text-lg border border-zinc-700 transition-all transform hover:scale-105"
//               >
//                 Registrarse
//               </Link>
//             </div>
//           </div>
//         )}

//       </div>
//     </Container>
//   )
  
// }

// export default HomePage


import React from "react";
import { useAuth } from "../content/AuthContext.jsx";
import { Link } from "react-router-dom";
import { Container } from "../components/ui/Container.jsx";

function LandingTopFromTemplate({ isAuth, user }) {
  return (
     <header className="w-full bg-gradient-to-b from-zinc-900 via-neutral-900 to-black">
       <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28">
    {/* //     Navbar (simple)
    //     <nav className="flex items-center justify-between mb-12">
    //       <div className="flex items-center gap-3">
    //         <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center font-bold text-black">MS</div>
    //         <span className="text-white font-semibold">Market Sur</span>
    //       </div>
    //       <div className="flex items-center gap-4">
    //         <Link to="/explorar" className="text-zinc-300 hover:text-white">Explorar</Link>
    //         <Link to="/about" className="text-zinc-300 hover:text-white">Nosotros</Link>
    //         {isAuth ? ( */}
    {/* //           <Link to="/dashboard" className="px-4 py-2 rounded-md bg-sky-500 text-white font-semibold">Mi cuenta</Link>
    //         ) : (
    //           <>
    //             <Link to="/login" className="text-zinc-300 hover:text-white">Iniciar sesión</Link>
    //             <Link to="/register" className="px-4 py-2 rounded-md bg-sky-500 text-white font-semibold">Registrarse</Link>
    //           </>
    //         )}
    //       </div>
    //     </nav> */}

        {/* Hero principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-sky-400 to-green-400 leading-tight">
              Lanza y gestiona tu producto con Market Sur
            </h1>
            <p className="mt-6 text-lg text-zinc-300 max-w-xl">
              Publica productos, administra ventas y coordina proveedores desde una sola plataforma pensada para emprendedores y comercios.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to={isAuth ? "/dashboard" : "/explorar"}
                className="inline-block px-6 py-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold"
              >
                {isAuth ? "Ir al Panel" : "Explorar Productos"}
              </Link>

              <Link
                to="/register"
                className="inline-block px-6 py-3 rounded-lg text-zinc-200 border border-zinc-700 bg-transparent hover:bg-zinc-800"
              >
                Registrarse
              </Link>
            </div>

            {/* Trust / tiny features row */}
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-zinc-400">
              <div className="px-3 py-2 bg-zinc-900/40 border border-zinc-800 rounded-md">Soporte 24/7</div>
              <div className="px-3 py-2 bg-zinc-900/40 border border-zinc-800 rounded-md">Pagos seguros</div>
              <div className="px-3 py-2 bg-zinc-900/40 border border-zinc-800 rounded-md">Integración rápida</div>
            </div>
          </div>

          {/* Right: illustration + feature cards */}
          <div className="flex flex-col items-center lg:items-end gap-6">
            <img
              src="../src/assets/Market.png"
              alt="Ilustración comercio"
              className="w-80 lg:w-96 object-contain rounded-lg shadow-2xl"
              loading="lazy"
            />

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg">
                <h4 className="text-amber-400 font-semibold">Publicar productos</h4>
                <p className="text-zinc-300 text-sm mt-1">Crea fichas con fotos y descripciones en segundos.</p>
              </div>
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg">
                <h4 className="text-green-400 font-semibold">Panel de ventas</h4>
                <p className="text-zinc-300 text-sm mt-1">Controla pedidos, envíos y estadísticas.</p>
              </div>
            </div>
          </div>
        </div>

        {/* About / Features (equivalente al "features" de la plantilla) */}
        <section className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <h3 className="text-amber-400 font-semibold">Fácil de usar</h3>
            <p className="mt-2 text-zinc-300 text-sm">Interfaz sencilla pensada para comerciantes y emprendedores.</p>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <h3 className="text-green-400 font-semibold">Escalable</h3>
            <p className="mt-2 text-zinc-300 text-sm">Desde un emprendimiento hasta tiendas con alto volumen.</p>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <h3 className="text-sky-400 font-semibold">Conectividad</h3>
            <p className="mt-2 text-zinc-300 text-sm">Integra proveedores, stock y pasarelas de pago.</p>
          </div>
        </section>

        {/* About extended (equivalent to “about” section before "Our Services") */}
        <section className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">¿Por qué elegir Market Sur?</h2>
            <p className="mt-4 text-zinc-300">Optimiza la gestión de tu catálogo, acelera ventas y centraliza la comunicación con proveedores para que te concentres en crecer.</p>

            <ul className="mt-6 space-y-3 text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-semibold">•</span>
                <span>Panel intuitivo con métricas en tiempo real.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-semibold">•</span>
                <span>Control de inventario y notificaciones automáticas.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-400 font-semibold">•</span>
                <span>Soporte y documentación para comenzar rápido.</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-center">
            <img
              src="../src/assets/adminis.png"
              alt="Administración y analytics"
              className="w-72 lg:w-96 object-contain"
              loading="lazy"
            />
          </div>
        </section>

        {/* Aquí termina la plantilla hasta "Nuestros servicios" */}
      </div>
    </header>
  );
}

export default function HomePage() {
  const { isAuth, user } = useAuth();

  return (
    <Container className="min-h-screen px-0">
      {/* Landing top (template up to "Nuestros servicios") */}
      <LandingTopFromTemplate isAuth={isAuth} user={user} />

      {/* Aquí puedes continuar con tu contenido personalizado (órbitas, CTA, footer, etc.) */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        {/* Ejemplo: footer breve */}
        <div className="mt-8 text-center text-sm text-zinc-500">
          Diseñado por FiveCoders · Experiencia reactiva, diseño y animaciones simples para mejorar la presentación
        </div>
      </section>
    </Container>
  );
}