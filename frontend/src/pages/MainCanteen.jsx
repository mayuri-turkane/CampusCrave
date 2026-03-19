import { useState } from "react";
import { ChevronLeft, Star, Clock, Plus, Minus, Search, ShoppingBag, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";

const menuData = {
  Breakfast: [
    { name: "Poha", price: 20, desc: "Fresh and light breakfast with peanuts and curry leaves" },
    { name: "Idli", price: 30, desc: "3 pieces of soft idli with coconut chutney & sambar" },
    { name: "Upma", price: 25, desc: "South Indian semolina breakfast with veggies" },
    { name: "Dosa", price: 50, desc: "Crispy golden dosa with potato masala" },
    { name: "Uttapam", price: 55, desc: "Thick rice pancake topped with onions & tomatoes" },
    { name: "Misal Pav", price: 60, desc: "Spicy Maharashtrian sprouts curry with buttery pav" },
    { name: "Pav Bhaji", price: 70, desc: "Special butter-mashed vegetables with toasted pav" },
  ],
};

function MainCanteen({ cart, setCart }) {
  const [activeCategory, setActiveCategory] = useState("Breakfast");
  const navigate = useNavigate();

  // --- UNIVERSAL SHARED CART ACTIONS ---
  const addItem = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeItem = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (!existing) return prev;
      if (existing.qty === 1) {
        return prev.filter((i) => i.name !== item.name);
      }
      return prev.map((i) =>
        i.name === item.name ? { ...i, qty: i.qty - 1 } : i
      );
    });
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

  return (
    <div className="bg-slate-50 min-h-screen pb-32 font-sans">

      {/* --- UNIVERSAL STICKY HEADER --- */}
      <div className="bg-white/80 backdrop-blur-md px-6 pt-12 pb-6 sticky top-0 z-30 border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-400 mb-4 hover:text-amber-500 transition-colors group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-wider">Back to Dashboard</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                Main Canteen <span className="text-amber-500 font-normal text-2xl">🏛️</span>
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-black">
                  <Star size={14} fill="currentColor" /> 4.2
                </span>
                <span className="flex items-center gap-1 text-slate-500 text-xs font-bold border-l border-slate-200 pl-4">
                  <Clock size={14} /> 10-15 MINS
                </span>
              </div>
            </div>

            {/* Universal Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search Canteen menu..."
                className="bg-slate-100 border-none rounded-2xl pl-10 pr-4 py-3 w-full md:w-64 focus:ring-2 focus:ring-amber-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Universal Category Slider */}
          <div className="flex gap-3 mt-8 overflow-x-auto no-scrollbar pb-2">
            {Object.keys(menuData).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                  ? "bg-slate-900 text-white shadow-xl"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- UNIFIED MENU GRID --- */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-black text-slate-800 mb-8">Best Sellers</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuData[activeCategory].map((item, idx) => {
            const cartItem = cart.find((i) => i.name === item.name);

            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex justify-between items-center group"
              >
                <div className="flex-1 pr-4">
                  {/* Veg Indicator */}
                  <div className="w-3 h-3 rounded-full mb-2 border-2 border-green-600 bg-green-600" />

                  <h3 className="text-lg font-black text-slate-800 group-hover:text-amber-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                  <p className="mt-3 font-black text-slate-900 text-xl tracking-tight">
                    ₹{item.price}
                  </p>
                </div>

                {/* Unified Quantity / Add Button */}
                <div className="w-24 flex flex-col items-center">
                  {cartItem ? (
                    <div className="flex items-center bg-amber-500 text-white rounded-2xl shadow-lg overflow-hidden scale-110 animate-in zoom-in duration-200">
                      <button
                        onClick={() => removeItem(item)}
                        className="p-2 hover:bg-amber-600 active:bg-amber-700 transition-colors"
                      >
                        <Minus size={16} strokeWidth={3} />
                      </button>
                      <span className="px-1 font-bold text-sm min-w-[20px] text-center">{cartItem.qty}</span>
                      <button
                        onClick={() => addItem(item)}
                        className="p-2 hover:bg-amber-600 active:bg-amber-700 transition-colors"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addItem(item)}
                      className="bg-white text-amber-600 border-2 border-amber-500 px-6 py-2 rounded-2xl font-black text-xs hover:bg-amber-500 hover:text-white transition-all shadow-md transform active:scale-95"
                    >
                      ADD
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- UNIVERSAL GLOBAL FLOATING CART BAR --- */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-slate-900 text-white p-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 flex justify-between items-center animate-in slide-in-from-bottom-10 duration-500">
           <div className="flex items-center gap-4">
             <div className="bg-amber-500 p-3 rounded-2xl text-slate-900">
               <ShoppingBag size={24} strokeWidth={2.5} />
             </div>
             <div>
               <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">
                 {cart.length} {cart.length === 1 ? 'Item' : 'Items'} Selected
               </p>
               <p className="text-2xl font-black text-white tracking-tight">
                 ₹{cartTotal}
               </p>
             </div>
           </div>

           <button
             onClick={() => navigate("/")} // Navigate back to Dashboard/Checkout
             className="bg-amber-500 text-slate-900 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all transform active:scale-95 shadow-lg"
           >
             View Cart
           </button>
        </div>
      )}
    </div>
  );
}

export default MainCanteen;