import { useState } from "react";
import { ChevronLeft, Star, Clock, Info, Plus, Minus, Search, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const cafeMenu = {
    Breakfast: [
        { name: "Poha", price: 25, desc: "Light Maharashtrian breakfast" },
        { name: "Misal Pav", price: 55, desc: "Spicy curry served with pav" },
        { name: "Vada Pav", price: 15, desc: "Mumbai street food classic" },
        { name: "Samosa", price: 18, desc: "Crispy fried potato samosa" },
        { name: "Sabudana Khichdi", price: 45, desc: "Popular fasting dish" }
    ],

    Beverages: [
        { name: "Tea", price: 12, desc: "Hot cutting chai" },
        { name: "Special Tea (Big Cup)", price: 30, desc: "Strong special tea" },
        { name: "Hot Coffee", price: 30, desc: "Fresh brewed coffee" },
        { name: "Cold Coffee", price: 45, desc: "Chilled creamy coffee" }
    ],

    Snacks: [
        { name: "French Fries", price: 60, desc: "Crispy potato fries" },
        { name: "Peri Peri Fries", price: 70, desc: "Fries with spicy peri peri seasoning" },
        { name: "Cheese Fries", price: 80, desc: "Fries topped with melted cheese" },
        { name: "Egg Bhurji", price: 65, desc: "Spicy scrambled eggs" },
        { name: "Egg Omelette", price: 65, desc: "Classic egg omelette" },
        { name: "Samosa Chaat", price: 40, desc: "Samosa topped with chutneys" }
    ],

    Chinese: [
        { name: "Veg Fried Rice", price: 70, desc: "Vegetable fried rice" },
        { name: "Veg Schezwan Rice", price: 80, desc: "Spicy schezwan rice" },
        { name: "Chicken Fried Rice", price: 100, desc: "Chicken fried rice" },
        { name: "Chicken Schezwan Rice", price: 110, desc: "Spicy chicken schezwan rice" },
        { name: "Hakka Noodles", price: 70, desc: "Classic hakka noodles" },
        { name: "Schezwan Hakka Noodles", price: 80, desc: "Spicy noodles" },
        { name: "Chicken Hakka Noodles", price: 100, desc: "Chicken noodles" },
        { name: "Veg Steamed Momos", price: 70, desc: "Steamed veg dumplings" },
        { name: "Veg Fried Momos", price: 80, desc: "Fried veg momos" },
        { name: "Chicken Steamed Momos", price: 80, desc: "Steamed chicken dumplings" },
        { name: "Chicken Fried Momos", price: 100, desc: "Fried chicken momos" }
    ],

    FastFood: [
        { name: "Veg Grilled Sandwich", price: 60, desc: "Grilled vegetable sandwich" },
        { name: "Veg Cheese Grilled Sandwich", price: 85, desc: "Cheese grilled sandwich" },
        { name: "Bombay Grilled Sandwich", price: 60, desc: "Mumbai style sandwich" },
        { name: "Bombay Cheese Grilled Sandwich", price: 85, desc: "Bombay sandwich with cheese" },
        { name: "Corn Capsicum Sandwich", price: 60, desc: "Corn capsicum sandwich" },
        { name: "Corn Capsicum Cheese Sandwich", price: 85, desc: "Corn capsicum sandwich with cheese" },
        { name: "Chicken Sandwich", price: 80, desc: "Chicken sandwich" },
        { name: "Chicken Cheese Sandwich", price: 100, desc: "Chicken sandwich with cheese" },
        { name: "Veg Burger", price: 70, desc: "Veg burger" },
        { name: "Veg Cheese Burger", price: 95, desc: "Veg burger with cheese" },
        { name: "Chicken Burger", price: 90, desc: "Chicken burger" },
        { name: "Chicken Cheese Burger", price: 115, desc: "Chicken burger with cheese" },
        { name: "Cheese Garlic Toast", price: 75, desc: "Garlic toast with cheese" },
        { name: "Chilli Cheese Toast", price: 75, desc: "Spicy cheese toast" },
        { name: "Veg Pizza (11 inch)", price: 150, desc: "Veg pizza" },
        { name: "Chicken Pizza (11 inch)", price: 200, desc: "Chicken pizza" }
    ]
};
function HangoutCafe({ cart, setCart }) {
  const [activeCategory, setActiveCategory] = useState("Breakfast");
  const navigate = useNavigate();

  // --- UNIVERSAL ACTIONS ---
  const addItem = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) => i.name === item.name ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeItem = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((i) => i.name !== item.name);
      return prev.map((i) => i.name === item.name ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const cartTotal = cart.reduce((t, i) => t + (i.price * i.qty), 0);

  return (
    <div className="bg-slate-50 min-h-screen pb-32 font-sans">
      {/* --- UNIFIED HEADER --- */}
      <div className="bg-white/80 backdrop-blur-md px-6 pt-12 pb-6 sticky top-0 z-30 border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-slate-400 mb-4 hover:text-amber-500 transition-colors group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-wider">Back to Dashboard</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">Hangout Cafe <span className="text-amber-500">☕</span></h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-black"><Star size={14} fill="currentColor" /> 4.4</span>
                <span className="flex items-center gap-1 text-slate-500 text-xs font-bold border-l border-slate-200 pl-4"><Clock size={14} /> 8-12 MINS</span>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search menu..." className="bg-slate-100 border-none rounded-2xl pl-10 pr-4 py-3 w-full md:w-64 focus:ring-2 focus:ring-amber-400 outline-none transition-all" />
            </div>
          </div>

          <div className="flex gap-3 mt-8 overflow-x-auto no-scrollbar pb-2">
            {Object.keys(cafeMenu).map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${activeCategory === cat ? "bg-slate-900 text-white shadow-xl" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- UNIFIED GRID --- */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cafeMenu[activeCategory].map((item, idx) => {
            const cartItem = cart.find((i) => i.name === item.name);
            return (
              <div key={idx} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex justify-between items-center group">
                <div className="flex-1 pr-4">
                  <div className={`w-3 h-3 rounded-full mb-2 border-2 ${item.name.includes('Chicken') ? 'border-red-500 bg-red-500' : 'border-green-600 bg-green-600'}`} />
                  <h3 className="text-lg font-black text-slate-800">{item.name}</h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed line-clamp-2">{item.desc}</p>
                  <p className="mt-3 font-black text-slate-900 text-xl">₹{item.price}</p>
                </div>

                <div className="w-24 flex flex-col items-center">
                  {cartItem ? (
                    <div className="flex items-center bg-amber-500 text-white rounded-2xl shadow-lg overflow-hidden scale-110">
                      <button onClick={() => removeItem(item)} className="p-2 hover:bg-amber-600"><Minus size={16} strokeWidth={3} /></button>
                      <span className="px-1 font-bold">{cartItem.qty}</span>
                      <button onClick={() => addItem(item)} className="p-2 hover:bg-amber-600"><Plus size={16} strokeWidth={3} /></button>
                    </div>
                  ) : (
                    <button onClick={() => addItem(item)} className="bg-white text-amber-600 border-2 border-amber-500 px-6 py-2 rounded-2xl font-black text-xs hover:bg-amber-500 hover:text-white transition-all shadow-md">ADD</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- UNIFIED GLOBAL FLOATING CART --- */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl z-50 flex justify-between items-center animate-in slide-in-from-bottom-5">
           <div className="flex items-center gap-4">
             <div className="bg-amber-500 p-3 rounded-2xl"><ShoppingBag size={24} /></div>
             <div>
               <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">{cart.length} Items Selected</p>
               <p className="text-2xl font-black text-white">₹{cartTotal}</p>
             </div>
           </div>
           <button onClick={() => navigate("/")} className="bg-amber-500 text-slate-900 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all transform active:scale-95">Checkout</button>
        </div>
      )}
    </div>
  );
}

export default HangoutCafe;