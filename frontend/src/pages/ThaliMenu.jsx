import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, ShoppingBag, CheckCircle2, Info } from "lucide-react";

function ThaliMenu({ cart, setCart }) {
    const navigate = useNavigate();
    const thaliPrice = 75;

    const weeklyMenu = {
        Monday: ["Bhindi Do Pyaja", "Rajma Masala", "Jeera Rice", "Mix Daal", "Chapati", "Salad", "Pickle"],
        Tuesday: ["Aaloo Methi Dry", "Mix Kathor", "Plain Rice", "Daal Fry", "Chapati", "Curd"],
        Wednesday: ["Sev Bhaji", "Rajma Masala", "Plain Rice", "Punjabi Kadhi", "Chapati"],
        Thursday: ["Corn Capsicum", "Matki Masala", "Plain Rice", "Lehsuniya Daal", "Chapati"],
        Friday: ["Soyabean Keema", "Malka Masala", "Jeera Rice", "Curd", "Roti"],
        Saturday: ["Flour Matar Dry", "Matki Masala", "Plain Rice", "Daal Fry"],
        Sunday: ["Veg Kofta", "Aloo Shimla", "Waran", "Plain Rice", "Roti"]
    };

    const days = Object.keys(weeklyMenu);
    // Auto-select current day or default to Monday
    const [selectedDay, setSelectedDay] = useState(days[new Date().getDay() - 1] || "Monday");

    const handleAddToCart = () => {
        const thaliItem = {
            name: `${selectedDay} Special Thali`,
            price: thaliPrice,
            desc: weeklyMenu[selectedDay].join(", "),
            qty: 1
        };

        setCart((prev) => {
            const existing = prev.find((i) => i.name === thaliItem.name);
            if (existing) {
                return prev.map((i) => i.name === thaliItem.name ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, thaliItem];
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* --- NAVIGATION --- */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 mb-6 hover:text-orange-500 transition-colors group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-wider">Back to Canteen</span>
                </button>

                {/* --- HERO HEADER --- */}
                <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-12 text-white mb-10 relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-orange-400 mb-4">
                            <Calendar size={20} />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Weekly Specials</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                            Premium Veg Thali <span className="text-orange-500">🍛</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed">
                            A complete, balanced home-style meal prepared fresh every single day.
                        </p>

                        <div className="mt-8 flex items-baseline gap-2">
                            <span className="text-4xl font-black text-white">₹{thaliPrice}</span>
                            <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Fixed Price</span>
                        </div>
                    </div>
                    {/* Decorative Background Element */}
                    <div className="absolute -right-10 -bottom-10 text-[15rem] opacity-10 rotate-12 pointer-events-none">🥘</div>
                </div>

                {/* --- DAY SELECTOR --- */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 mb-8">
                    {days.map((day) => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap border-2
                                ${selectedDay === day
                                ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200"
                                : "bg-white border-slate-100 text-slate-400 hover:border-orange-200"}`}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* --- MENU DISPLAY --- */}
                <div className="grid md:grid-cols-5 gap-8 items-start">

                    {/* Menu Items Card */}
                    <div className="md:col-span-3 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">What's Inside?</h2>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">100% Vegetarian</span>
                        </div>

                        <ul className="grid grid-cols-1 gap-4">
                            {weeklyMenu[selectedDay].map((item, index) => (
                                <li key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 group hover:bg-orange-50 transition-colors">
                                    <div className="bg-white p-2 rounded-xl text-green-500 shadow-sm group-hover:text-orange-500 transition-colors">
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <span className="font-bold text-slate-700 tracking-tight">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Order Sidebar */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-orange-50 rounded-[2rem] p-6 border-2 border-orange-100">
                            <div className="flex items-center gap-3 text-orange-700 mb-4">
                                <Info size={20} />
                                <h4 className="font-black text-sm uppercase tracking-widest">Canteen Note</h4>
                            </div>
                            <p className="text-orange-800/70 text-sm font-medium leading-relaxed">
                                Thalis are available from 12:30 PM to 3:00 PM. Includes unlimited Rice and Daal refills for dine-in.
                            </p>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-slate-300 flex items-center justify-center gap-4 hover:bg-orange-500 transition-all active:scale-95 group"
                        >
                            <ShoppingBag className="group-hover:animate-bounce" />
                            Add to Cart
                        </button>
                    </div>

                </div>

            </div>

            {/* --- MINI FLOATING CART (Matching Dashboard) --- */}
            {cart.length > 0 && (
                <button
                    onClick={() => navigate("/cart")}
                    className="fixed bottom-8 right-8 bg-slate-900 text-white p-5 rounded-full shadow-2xl z-50 hover:scale-110 transition-all active:scale-95 flex items-center gap-3"
                >
                    <div className="relative">
                        <ShoppingBag size={24} />
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-slate-900">
                            {cart.length}
                        </span>
                    </div>
                </button>
            )}
        </div>
    );
}

export default ThaliMenu;