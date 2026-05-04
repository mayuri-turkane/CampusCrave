import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Clock, Search, Flame, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mapping table to turn database keys into pretty display names
const categoryNames = {
  breakfast: "Breakfast",
  beverages: "Beverages",
  snacks: "Snack Corner",
  chinese: "Chinese Corner",
  breads: "Between the Breads",
  morning: "Morning Kickstart",
  street: "Street Cravings",
  quick_fix: "Crispy Bites",
  sip_chill: "Sip & Chill",
  meals: "Desi & Global Meals"
};

function HangoutCafe({ cart, setCart }) {
    const [menuData, setMenuData] = useState({});
    const [activeCategory, setActiveCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState({});

    useEffect(() => {
        // We use the ID 'hangout' as defined in our backend seeder
        fetch("http://localhost:5000/menu/hangout")
            .then(res => res.json())
            .then(data => {
                const grouped = data.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item);
                    return acc;
                }, {});
                setMenuData(grouped);
                console.log("response", grouped);
                // Set the first available category as active
                const firstCat = Object.keys(grouped)[0];
                if (firstCat) setActiveCategory(firstCat);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/analytics/predict")
            .then(res => res.json())
            .then(data => setAnalytics(data))
            .catch(err => console.log(err));
    }, []);

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

    if (loading) return <div className="h-screen flex items-center justify-center font-bold">Loading Menu...</div>;

    const hotLabels = analytics.hot_labels || {};

    return (
        <div className="bg-white min-h-screen pb-40 font-sans selection:bg-amber-100">
            {/* --- HERO HEADER --- */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover scale-105 brightness-50" alt="Cafe Interior" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 bg-gradient-to-t from-black/80 to-transparent">
                    <button onClick={() => navigate("/")} className="absolute top-8 left-6 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-black transition-all">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="max-w-6xl mx-auto w-full">
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Hangout Cafe <span className="text-amber-400">☕</span></h1>
                        <div className="flex items-center gap-4 mt-3 text-white">
                            <span className="flex items-center gap-1 bg-green-500 px-2 py-0.5 rounded-lg text-xs font-bold"><Star size={14} fill="currentColor" /> 4.4</span>
                            <span className="font-medium text-sm flex items-center gap-1"><Clock size={14} /> 10-15 MINS</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SEARCH & CATEGORIES (Sticky) --- */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
                            {Object.keys(menuData).map((catKey) => (
                                <button
                                    key={catKey}
                                    onClick={() => setActiveCategory(catKey)}
                                    className={`px-5 py-2 rounded-2xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                                        activeCategory === catKey ? "bg-amber-500 text-white shadow-lg" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}
                                >
                                    {categoryNames[catKey] || catKey}
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
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        Top Picks in {categoryNames[activeCategory] || activeCategory}
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {(menuData[activeCategory] || [])
                      .filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((item) => {
                        const cartItem = cart.find((i) => i.name === item.name);
                        const isNonVeg = item.name.toLowerCase().includes('chicken') || item.name.toLowerCase().includes('egg');

                        return (
                            <div key={item.id} className="flex justify-between items-start bg-white p-4 md:p-6 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition-all group">
                                <div className="flex-1 pr-6">
                                    <div className={`w-4 h-4 rounded-sm border-2 ${isNonVeg ? 'border-red-500' : 'border-green-600'} flex items-center justify-center mb-3`}>
                                        <div className={`w-2 h-2 rounded-full ${isNonVeg ? 'bg-red-500' : 'bg-green-600'}`} />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-800 group-hover:text-amber-600 transition-colors">
                                        {item.name}

                                        {hotLabels[item.name]?.trending && (
                                            <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                                                🔥
                                            </span>
                                        )}

                                        {hotLabels[item.name]?.selling_fast && (
                                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
            ⚡
                                            </span>
                                        )}
                                    </h3>

                                    <p className="mt-2 font-black text-gray-900 text-2xl tracking-tighter">₹{item.price}</p>
                                    <p className="text-gray-400 text-sm mt-2 leading-relaxed font-medium line-clamp-2">{item.desc}</p>
                                </div>

                                <div className="relative">
                                    <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-inner bg-gray-100">
                                        <img
                                            src={item.image_url ? `http://localhost:5000/static/images/${item.image_url}` : "https://via.placeholder.com/150"}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-28">
                                        {cartItem ? (
                                            <div className="flex items-center justify-between bg-white text-amber-600 rounded-xl shadow-xl border border-amber-100 overflow-hidden px-1 py-1">
                                                <button onClick={() => removeItem(item)} className="p-2 hover:bg-amber-50 rounded-lg"><Minus size={16} strokeWidth={3} /></button>
                                                <span className="font-black text-sm">{cartItem.qty}</span>
                                                <button onClick={() => addItem(item)} className="p-2 hover:bg-amber-50 rounded-lg"><Plus size={16} strokeWidth={3} /></button>
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
                <button onClick={() => navigate("/cart")} className="fixed bottom-8 right-8 bg-orange-500 text-white p-5 rounded-full shadow-2xl z-50 flex items-center gap-3">
                    <div className="relative">
                        <ShoppingBag size={28} strokeWidth={2.5} />
                        <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                            {cart.reduce((total, item) => total + item.qty, 0)}
                        </span>
                    </div>
                </button>
            )}
        </div>
    );
}

export default HangoutCafe;