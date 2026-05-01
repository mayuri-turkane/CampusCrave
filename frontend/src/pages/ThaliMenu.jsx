import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ShoppingBag, Clock, Sparkles, Plus, CheckCircle2 } from "lucide-react";

function ThaliMenu({ cart, setCart }) {
    const navigate = useNavigate();

    const weeklyMenu = {
        Monday: ["Bhindi Do Pyaja", "Rajma Masala", "Jeera Rice", "Mix Daal", "Chapati", "Salad", "Pickle"],
        Tuesday: ["Aaloo Methi Dry", "Mix Kathor", "Plain Rice", "Daal Fry", "Chapati", "Curd"],
        Wednesday: ["Sev Bhaji", "Rajma Masala", "Plain Rice", "Punjabi Kadhi", "Chapati"],
        Thursday: ["Corn Capsicum", "Matki Masala", "Plain Rice", "Lehsuniya Daal", "Chapati"],
        Friday: ["Soyabean Keema", "Malka Masala", "Jeera Rice", "Curd", "Roti"],
        Saturday: ["Flour Matar Dry", "Matki Masala", "Plain Rice", "Daal Fry", "Chapati", "Pickle"],
        Sunday: ["Veg Kofta", "Aloo Shimla", "Waran", "Plain Rice", "Roti", "Gulab Jamun"]
    };

    const days = Object.keys(weeklyMenu);
    const [selectedDay, setSelectedDay] = useState("");

    useEffect(() => {
        const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
        setSelectedDay(today);
    }, []);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/analytics/predict")
            .then(res => res.json())
            .then(data => setAnalytics(data))
            .catch(err => console.log(err));
    }, []);


    // ➕ Optimized Add to Cart
    const addToCart = (name, price, desc) => {
        const item = { name, price, desc, qty: 1 };
        setCart((prev) => {
            const existing = prev.find((i) => i.name === item.name);
            if (existing) {
                return prev.map((i) => i.name === item.name ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, item];
        });
    };

    if (!selectedDay) return null;

    // Define the menu items based on selected day
    const menuItems = [
        {
            id: 'thali',
            name: `${selectedDay} Maharaja Thali`,
            price: 75,
            tag: "Best Seller",
            desc: weeklyMenu[selectedDay].join(" • "),
            isThali: true
        },
        {
            id: 'dal-rice',
            name: "Dal Rice Combo",
            price: 60,
            tag: "Budget Friendly",
            desc: "Hot Steaming Daal Fry served with Jeera/Plain Rice & Pickle.",
            isThali: false
        },
        {
            id: 'budget-meal',
            name: "Daily Budget Meal",
            price: 60,
            tag: "Value Pack",
            desc: `5 Fresh Butter Rotis served with today's special ${weeklyMenu[selectedDay][0]}.`,
            isThali: false
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">
            <div className="max-w-6xl mx-auto px-6 pt-32 relative z-10">

                {/* --- HEADER --- */}
                <div className="mb-10">
                    <button onClick={() => navigate("/")} className="flex items-center gap-2 text-slate-400 mb-6 hover:text-orange-600 font-black text-[10px] uppercase tracking-[0.3em] transition-all group">
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Back to Hub
                    </button>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">
                                Daily <span className="text-orange-500 text-6xl">Menu.</span>
                            </h1>
                            <p className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest">
                                <Clock size={14} className="text-orange-500" /> {selectedDay}'s Fresh Selection
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- DAY TABS --- */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 mb-10 border-b border-slate-100">
                    {days.map((day) => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all whitespace-nowrap
                                ${selectedDay === day
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-200 scale-105"
                                : "bg-white text-slate-400 hover:text-slate-600"}`}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* --- MENU GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            className="group relative bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/50 border border-white hover:border-orange-200 hover:-translate-y-2 transition-all duration-500 flex flex-col"
                        >
                            {/* Tag */}
                            <div className="flex justify-between items-start mb-6">
                                <span className="bg-slate-900 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">
                                    {item.tag}
                                </span>
                                {item.isThali && <Sparkles className="text-orange-500 animate-pulse" size={20} />}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-orange-500 transition-colors leading-tight">
                                    {item.name}
                                </h3>

                                <div className="bg-slate-50 rounded-[2rem] p-5 mb-8 border border-slate-100 group-hover:bg-orange-50/50 transition-colors">
                                    <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>

                            {/* Price & Action */}
                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price per plate</p>
                                    <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{item.price}</p>
                                </div>
                                <button
                                    onClick={() => addToCart(item.name, item.price, item.desc)}
                                    className="bg-slate-900 text-white h-14 w-14 rounded-2xl flex items-center justify-center hover:bg-orange-500 transition-all active:scale-90 shadow-lg group-hover:shadow-orange-200"
                                >
                                    <Plus size={24} strokeWidth={3} />
                                </button>
                            </div>

                            {/* Decorative Background Icon */}
                            <div className="absolute bottom-10 right-10 text-6xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                                {item.isThali ? "🍱" : "🍲"}
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- FOOTER INFO --- */}
                <div className="mt-16 bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-white/10 rounded-3xl flex items-center justify-center text-orange-500">
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <h4 className="text-xl font-black tracking-tight">Hygiene Guaranteed</h4>
                            <p className="text-slate-400 text-sm font-medium italic">Our kitchen follows 100% safety protocols.</p>
                        </div>
                    </div>
                    <div className="text-center md:text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1">Serving Hours</p>
                        <p className="text-lg font-bold">12:30 PM — 03:00 PM</p>
                    </div>
                </div>

            </div>

            {/* --- FLOATING CART --- */}
            {cart.length > 0 && (
                <button
                    onClick={() => navigate("/cart")}
                    className="fixed bottom-10 right-10 bg-slate-900 text-white px-10 py-5 rounded-[2rem] shadow-3xl z-50 hover:scale-105 hover:-translate-y-2 transition-all flex items-center gap-5 border-4 border-white"
                >
                    <div className="relative">
                        <ShoppingBag size={24} />
                        <span className="absolute -top-3 -right-3 bg-orange-500 h-6 w-6 rounded-xl flex items-center justify-center text-[10px] font-black">
                            {cart.reduce((t, i) => t + i.qty, 0)}
                        </span>
                    </div>
                    <div className="text-left border-l border-white/20 pl-4">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">View Basket</p>
                        <p className="text-xl font-black">₹{cart.reduce((t, i) => t + (i.price * i.qty), 0)}</p>
                    </div>
                </button>
            )}
        </div>
    );
}

export default ThaliMenu;