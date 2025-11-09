// // src/Cart.jsx
// import React, { useState, useMemo } from "react";
// import { FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import { useNavigate } from 'react-router-dom';

// export default function Cart() {
//   const [items, setItems] = useState([
//     {
//       id: 1,
//       title: "iPhone 11 Pro",
//       spec: "256GB, Navy Blue",
//       img: "https://i.imgur.com/QRwjbm5.jpg",
//       price: 900,
//       qty: 2,
//     },
//     {
//       id: 2,
//       title: "OnePlus 7T",
//       spec: "256GB, Navy Blue",
//       img: "https://i.imgur.com/GQnIUfs.jpg",
//       price: 900,
//       qty: 2,
//     },
//     {
//       id: 3,
//       title: "Google Pixel 4 XL",
//       spec: "256GB, Axe Black",
//       img: "https://i.imgur.com/o2fKskJ.jpg",
//       price: 800,
//       qty: 1,
//     },
//     {
//       id: 4,
//       title: "Samsung Galaxy Note 10",
//       spec: "256GB, Navy Blue",
//       img: "https://i.imgur.com/Tja5H1c.jpg",
//       price: 999,
//       qty: 1,
//     },
//   ]);

//   const [cardType, setCardType] = useState("mastercard");
//   const [cardName, setCardName] = useState("");
//   const [cardNumber, setCardNumber] = useState("");
//   const [cardDate, setCardDate] = useState("");
//   const [cardCvv, setCardCvv] = useState("");
//   const navigate = useNavigate();

//   const shipping = 20;
//   const subtotal = useMemo(
//     () => items.reduce((acc, it) => acc + it.price * it.qty, 0),
//     [items]
//   );
//   const total = subtotal + shipping;

//   const changeQty = (id, delta) => {
//     setItems((prev) =>
//       prev
//         .map((it) =>
//           it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it
//         )
//         .filter((it) => it.qty > 0)
//     );
//   };

//   const removeItem = (id) => {
//     setItems((prev) => prev.filter((it) => it.id !== id));
//   };

//   const handleCheckout = () => {
//     const order = {
//       items,
//       subtotal,
//       shipping,
//       total,
//       payment: { cardType, cardName, cardNumber, cardDate, cardCvv },
//     };
//     console.log("Checkout:", order);
//     alert("Gracias por su compra. Revisa la consola para ver el pedido.\nVolviendo a su perfil...");
//     navigate('/perfil');
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen flex justify-center py-10">
//       <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-5xl grid md:grid-cols-3 gap-6">
//         {/* --- Lista de productos --- */}
//         <div className="md:col-span-2">
//           <div className="flex items-center text-blue-600 cursor-pointer">
//             <button
//               onClick={() => navigate('/descubrir-productos')}
//               className="flex items-center text-blue-600 hover:text-blue-800 transition mb-2"
//             >
//               <FaArrowLeft className="mr-2" />
//               Continuar Comprando
//             </button>
//           </div>

//           <hr className="my-3" />

//           <h2 className="text-xl font-semibold mb-2">Carrito de compras</h2>
//           <p className="text-gray-500 text-sm">
//             Tienes {items.length} items en el carrito
//           </p>

//           <div className="mt-4 space-y-3">
//             {items.map((it) => (
//               <div
//                 key={it.id}
//                 className="flex justify-between items-center bg-gray-50 rounded-lg p-3 shadow-sm"
//               >
//                 <div className="flex items-center space-x-3">
//                   <img
//                     src={it.img}
//                     alt={it.title}
//                     className="w-12 h-12 rounded"
//                   />
//                   <div>
//                     <p className="font-semibold">{it.title}</p>
//                     <p className="text-xs text-gray-500">{it.spec}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center">
//                     <button
//                       onClick={() => changeQty(it.id, -1)}
//                       className="px-2 py-1 bg-gray-200 rounded text-gray-700 hover:bg-gray-300"
//                     >
//                       -
//                     </button>
//                     <span className="px-3">{it.qty}</span>
//                     <button
//                       onClick={() => changeQty(it.id, +1)}
//                       className="px-2 py-1 bg-gray-200 rounded text-gray-700 hover:bg-gray-300"
//                     >
//                       +
//                     </button>
//                   </div>
//                   <span className="font-semibold">${it.price * it.qty}</span>
//                   <FaTrash
//                     onClick={() => removeItem(it.id)}
//                     className="text-gray-400 hover:text-red-500 cursor-pointer"
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* --- Panel de pago --- */}
//         <div className="bg-blue-600 text-white rounded-lg p-5 font-semibold">
//           <div className="flex justify-between items-center">
//             <span>Elije tu tarjeta</span>
//             <img
//               src="https://i.imgur.com/WU501C8.jpg"
//               alt="card"
//               className="w-8 rounded"
//             />
//           </div>

//           <p className="uppercase text-xs mt-4 mb-1">tipo de Tarjeta</p>

//           <div className="flex gap-2 mb-3">
//             {["mastercard", "visa", "mercadopago", "paypal"].map((type) => (
//               <label key={type}>
//                 <input
//                   type="radio"
//                   name="card"
//                   value={type}
//                   checked={cardType === type}
//                   onChange={() => setCardType(type)}
//                   className="hidden peer"
//                 />
//                 <span
//                   className={`inline-block border-2 rounded-md p-1 cursor-pointer peer-checked:bg-white peer-checked:text-blue-600`}
//                 >
//                   <img
//                     src={
//                       type === "mastercard"
//                         ? "https://img.icons8.com/color/48/000000/mastercard.png"
//                         : type === "visa"
//                           ? "https://img.icons8.com/officel/48/000000/visa.png"
//                           : type === "mercadopago"
//                             ? "https://img.icons8.com/?size=100&id=nTLVtpxsNPaz&format=png&color=000000"
//                             : "https://img.icons8.com/officel/48/000000/paypal.png"
//                     }
//                     alt={type}
//                     className="w-8"
//                   />
//                 </span>
//               </label>
//             ))}
//           </div>

//           <label className="block text-xs mb-1">Titular</label>
//           <input
//             type="text"
//             value={cardName}
//             onChange={(e) => setCardName(e.target.value)}
//             className="w-full rounded bg-blue-500 text-white placeholder-white text-sm p-2 mb-2 outline-none"
//             placeholder="Name"
//           />

//           <label className="block text-xs mb-1">numero de tarjeta</label>
//           <input
//             type="text"
//             value={cardNumber}
//             onChange={(e) => setCardNumber(e.target.value)}
//             className="w-full rounded bg-blue-500 text-white placeholder-white text-sm p-2 mb-2 outline-none"
//             placeholder="0000 0000 0000 0000"
//           />

//           <div className="grid grid-cols-2 gap-2">
//             <div>
//               <label className="block text-xs mb-1">Fecha</label>
//               <input
//                 type="text"
//                 value={cardDate}
//                 onChange={(e) => setCardDate(e.target.value)}
//                 className="w-full rounded bg-blue-500 text-white placeholder-white text-sm p-2 mb-2 outline-none"
//                 placeholder="12/24"
//               />
//             </div>
//             <div>
//               <label className="block text-xs mb-1">CVV</label>
//               <input
//                 type="text"
//                 value={cardCvv}
//                 onChange={(e) => setCardCvv(e.target.value)}
//                 className="w-full rounded bg-blue-500 text-white placeholder-white text-sm p-2 mb-2 outline-none"
//                 placeholder="342"
//               />
//             </div>
//           </div>

//           <hr className="border-blue-400 my-3" />

//           <div className="text-sm space-y-1 mb-3">
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>${subtotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Descuento</span>
//               <span>${shipping.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Total (Incl. imp.)</span>
//               <span>${total.toFixed(2)}</span>
//             </div>
//           </div>

//           <button
//             onClick={handleCheckout}
//             className="bg-white text-blue-600 font-bold w-full py-2 rounded flex justify-between items-center"
//           >
//             <span>${total.toFixed(2)}</span>
//             <span className="flex items-center gap-1">
//               Pagar <FaArrowRight />
//             </span>

//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// src/Cart.jsx
import React, { useState, useMemo } from "react";
import { FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [items, setItems] = useState([
    {
      id: 1,
      title: "iPhone 11 Pro",
      spec: "256GB, Navy Blue",
      img: "https://i.imgur.com/QRwjbm5.jpg",
      price: 900,
      qty: 2,
    },
    {
      id: 2,
      title: "OnePlus 7T",
      spec: "256GB, Navy Blue",
      img: "https://i.imgur.com/GQnIUfs.jpg",
      price: 900,
      qty: 2,
    },
    {
      id: 3,
      title: "Google Pixel 4 XL",
      spec: "256GB, Axe Black",
      img: "https://i.imgur.com/o2fKskJ.jpg",
      price: 800,
      qty: 1,
    },
    {
      id: 4,
      title: "Samsung Galaxy Note 10",
      spec: "256GB, Navy Blue",
      img: "https://i.imgur.com/Tja5H1c.jpg",
      price: 999,
      qty: 1,
    },
  ]);

  const [cardType, setCardType] = useState("mastercard");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardDate, setCardDate] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const navigate = useNavigate();

  const shipping = 20;
  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.price * it.qty, 0),
    [items]
  );
  const total = subtotal + shipping;

  const changeQty = (id, delta) => {
    setItems((prev) =>
      prev
        .map((it) =>
          it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it
        )
        .filter((it) => it.qty > 0)
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleCheckout = () => {
    const order = {
      items,
      subtotal,
      shipping,
      total,
      payment: { cardType, cardName, cardNumber, cardDate, cardCvv },
    };
    console.log("Checkout:", order);
    alert("Gracias por su compra. Revisa la consola para ver el pedido.\nVolviendo a su perfil...");
    navigate('/perfil');
  };

  return (
    <div className="bg-gradient-to-b from-zinc-900 via-neutral-900 to-black min-h-screen flex justify-center py-10 text-zinc-200">
      <div className="bg-zinc-900/60 rounded-lg border border-zinc-800 shadow-xl p-6 w-full max-w-5xl grid md:grid-cols-3 gap-6">
        {/* --- Lista de productos --- */}
        <div className="md:col-span-2">
          <button
            onClick={() => navigate('/descubrir-productos')}
            className="flex items-center text-sky-400 hover:text-sky-300 transition mb-2"
          >
            <FaArrowLeft className="mr-2" />
            Continuar Comprando
          </button>

          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-sky-400 to-green-400 mb-2">
            Carrito de compras
          </h2>
          <p className="text-zinc-400 text-sm">
            Tienes {items.length} items en el carrito
          </p>

          <div className="mt-4 space-y-3">
            {items.map((it) => (
              <div key={it.id} className="flex justify-between items-center bg-zinc-800/50 rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-3">
                  <img src={it.img} alt={it.title} className="w-12 h-12 rounded" />
                  <div>
                    <p className="font-semibold text-zinc-200">{it.title}</p>
                    <p className="text-xs text-zinc-400">{it.spec}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <button onClick={() => changeQty(it.id, -1)} className="px-2 py-1 bg-zinc-700 rounded text-zinc-200 hover:bg-zinc-600">-</button>
                    <span className="px-3">{it.qty}</span>
                    <button onClick={() => changeQty(it.id, +1)} className="px-2 py-1 bg-zinc-700 rounded text-zinc-200 hover:bg-zinc-600">+</button>
                  </div>
                  <span className="font-semibold text-green-400">${it.price * it.qty}</span>
                  <FaTrash onClick={() => removeItem(it.id)} className="text-zinc-500 hover:text-red-500 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Panel de pago --- */}
        <div className="bg-zinc-900 rounded-lg p-5 font-semibold border border-zinc-700">
          <div className="flex justify-between items-center">
            <span>Elije tu tarjeta</span>
            <img src="https://i.imgur.com/WU501C8.jpg" alt="card" className="w-8 rounded" />
          </div>

          <p className="uppercase text-xs mt-4 mb-1 text-zinc-400">tipo de Tarjeta</p>

          <div className="flex gap-2 mb-3">
            {["mastercard", "visa", "mercadopago", "paypal"].map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="card"
                  value={type}
                  checked={cardType === type}
                  onChange={() => setCardType(type)}
                  className="hidden peer"
                />
                <span className="inline-block border-2 border-zinc-700 rounded-md p-1 cursor-pointer peer-checked:bg-zinc-800 peer-checked:text-amber-400">
                  <img
                    src={
                      type === "mastercard"
                        ? "https://img.icons8.com/color/48/000000/mastercard.png"
                        : type === "visa"
                          ? "https://img.icons8.com/officel/48/000000/visa.png"
                          : type === "mercadopago"
                            ? "https://img.icons8.com/?size=100&id=nTLVtpxsNPaz&format=png&color=000000"
                            : "https://img.icons8.com/officel/48/000000/paypal.png"
                    }
                    alt={type}
                    className="w-8"
                  />
                </span>
              </label>
            ))}
          </div>

          <label className="block text-xs mb-1 text-zinc-400">Titular</label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="w-full rounded bg-zinc-800 text-zinc-200 placeholder-zinc-400 text-sm p-2 mb-2 outline-none"
            placeholder="Name"
          />

          <label className="block text-xs mb-1 text-zinc-400">numero de tarjeta</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full rounded bg-zinc-800 text-zinc-200 placeholder-zinc-400 text-sm p-2 mb-2 outline-none"
            placeholder="0000 0000 0000 0000"
          />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs mb-1 text-zinc-400">Fecha</label>
              <input
                type="text"
                value={cardDate}
                onChange={(e) => setCardDate(e.target.value)}
                className="w-full rounded bg-zinc-800 text-zinc-200 placeholder-zinc-400 text-sm p-2 mb-2 outline-none"
                placeholder="12/24"
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-zinc-400">CVV</label>
              <input
                type="text"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                className="w-full rounded bg-zinc-800 text-zinc-200 placeholder-zinc-400 text-sm p-2 mb-2 outline-none"
                placeholder="342"/>
            </div>
          </div>

          <hr className="border-zinc-700 my-3" />

          <div className="text-sm space-y-1 mb-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Descuento</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total (Incl. imp.)</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="bg-amber-400 text-zinc-900 font-bold w-full py-2 rounded flex justify-between items-center hover:bg-amber-300"
          >
            <span>${total.toFixed(2)}</span>
            <span className="flex items-center gap-1">
              Pagar <FaArrowRight />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}