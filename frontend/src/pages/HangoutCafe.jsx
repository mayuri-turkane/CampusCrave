import { useState } from "react";
import { ChevronLeft, Star, Clock, Plus, Minus, Search, ShoppingBag, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Added image placeholders to make it look "Swiggy-style"
const cafeMenu = {
    Breakfast: [
        { name: "Poha", price: 25, desc: "Light Maharashtrian breakfast with peanuts", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80" },
        { name: "Misal Pav", price: 55, desc: "Spicy sprouts curry served with buttery pav", image: "https://images.unsplash.com/photo-1606491956689-2ea8c5119c85?auto=format&fit=crop&w=300&q=80" },
        { name: "Vada Pav", price: 15, desc: "The iconic Mumbai burger", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80" },
    ],
    Chinese: [
        { name: "Veg Fried Rice", price: 70, desc: "Classic wok-tossed vegetable rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=300&q=80" },
        { name: "Chicken Schezwan Rice", price: 110, desc: "Spicy chicken rice with fiery Schezwan sauce", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=300&q=80" },
    ],
    // ... add more categories as needed
};

function HangoutCafe({ cart, setCart }) {
    const [activeCategory, setActiveCategory] = useState("Breakfast");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const addItem = (item) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.name === item.name);
            if (existing) return prev.map((i) => i.name === item.name ? { ...i, qty: i.qty + 1 } : i);
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
    cart.reduce((t, i) => t + (i.price * i.qty), 0);
    return (
        <div className="bg-white min-h-screen pb-40 font-sans selection:bg-amber-100">

            {/* --- HERO HEADER --- */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80"
                    className="w-full h-full object-cover scale-105 brightness-50"
                    alt="Cafe Interior"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 bg-gradient-to-t from-black/80 to-transparent">
                    <button
                        onClick={() => navigate("/")}
                        className="absolute top-8 left-6 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-black transition-all"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="max-w-6xl mx-auto w-full">
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                            Hangout Cafe <span className="text-amber-400">☕</span>
                        </h1>
                        <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1 bg-green-500 text-white px-2 py-0.5 rounded-lg text-xs font-bold">
                <Star size={14} fill="currentColor" /> 4.4
              </span>
                            <span className="text-gray-300 font-medium text-sm flex items-center gap-1">
                <Clock size={14} /> 10-15 MINS
              </span>
                            <span className="text-gray-300 font-medium text-sm border-l border-gray-500 pl-4">
                200+ Students served today
              </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SEARCH & CATEGORIES (Sticky) --- */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
                            {Object.keys(cafeMenu).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-5 py-2 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                                        activeCategory === cat ? "bg-amber-500 text-white shadow-lg shadow-amber-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search favorite dish..."
                                className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-amber-400 transition-all outline-none"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MENU LIST --- */}
            <div className="max-w-6xl mx-auto px-6 mt-10">
                <div className="flex items-center gap-3 mb-8">
                    <Flame className="text-orange-500" fill="currentColor" />
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Top Picks in {activeCategory}</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {(cafeMenu[activeCategory] || []).filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => {
                        const cartItem = cart.find((i) => i.name === item.name);
                        const isNonVeg = item.name.toLowerCase().includes('chicken') || item.name.toLowerCase().includes('egg');

                        return (
                            <div key={idx} className="flex justify-between items-start bg-white p-4 md:p-6 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl hover:shadow-gray-200 transition-all group">
                                <div className="flex-1 pr-6">
                                    <div className={`w-4 h-4 rounded-sm border-2 ${isNonVeg ? 'border-red-500' : 'border-green-600'} flex items-center justify-center mb-3`}>
                                        <div className={`w-2 h-2 rounded-full ${isNonVeg ? 'bg-red-500' : 'bg-green-600'}`} />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-800 group-hover:text-amber-600 transition-colors">{item.name}</h3>
                                    <p className="mt-2 font-black text-gray-900 text-2xl tracking-tighter">₹{item.price}</p>
                                    <p className="text-gray-400 text-sm mt-2 leading-relaxed font-medium line-clamp-2">{item.desc}</p>
                                </div>

                                <div className="relative">
                                    <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-inner bg-gray-100">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>

                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-28">
                                        {cartItem ? (
                                            <div className="flex items-center justify-between bg-white text-amber-600 rounded-xl shadow-xl border border-amber-100 overflow-hidden px-1 py-1">
                                                <button onClick={() => removeItem(item)} className="p-2 hover:bg-amber-50 rounded-lg transition-colors"><Minus size={16} strokeWidth={3} /></button>
                                                <span className="font-black text-sm">{cartItem.qty}</span>
                                                <button onClick={() => addItem(item)} className="p-2 hover:bg-amber-50 rounded-lg transition-colors"><Plus size={16} strokeWidth={3} /></button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => addItem(item)}
                                                className="w-full bg-white text-amber-600 border border-amber-200 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-amber-500 hover:text-white transition-all transform active:scale-90"
                                            >
                                                Add
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- FLOATING CART --- */}
            {cart.length > 0 && (
                <button
                    onClick={() => navigate("/cart")}
                    className="fixed bottom-8 right-8 bg-orange-500 text-white p-5 rounded-full shadow-2xl z-50 hover:scale-110 transition-all active:scale-95 group flex items-center gap-3"
                >
                    <div className="relative">
                        <ShoppingBag size={28} strokeWidth={2.5} />
                        <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-orange-500">
        {cart.reduce((total, item) => total + item.qty, 0)}
      </span>
                    </div>
                    <span className="font-black text-sm pr-2 hidden group-hover:block transition-all">View Cart</span>
                </button>
            )}
        </div>
    );
}

export default HangoutCafe;