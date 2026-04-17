import { useState } from "react";
import { ChevronLeft, Star, Clock, Plus, Minus, Search, ShoppingBag, Flame, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PohaImg from "../assets/images/Pohe.jpg";
import IdliImg from "../assets/images/Idli.png";
import DosaImg from "../assets/images/south.png";
import SabudanaImg from "../assets/images/sabudana_khichdi.jpg";
import UpmaImg from "../assets/images/Upma.png";
import VadapavImg from "../assets/images/Vadapav.png";
import MisalImg from "../assets/images/misal_pav.jpg";
import DabeliImg from "../assets/images/Dabeli.png";
import SabudanavadaImg from "../assets/images/Sabudanavada.png";
import FriesImg from "../assets/images/Fries.jpg";
import SandwichImg from "../assets/images/sandwich.jpg";
import OmleteImg from "../assets/images/Omlete.png";
import DhoklaImg from "../assets/images/Dhokla.png";
import  TeaImg from "../assets/images/Tea.jpg";
import  hotCoffeeImg from "../assets/images/coffee.jpg";
import  coldcoffeeImg from "../assets/images/Cold_coffee.jpg";
import  TaakImg from "../assets/images/Taak.png";
import  DahiImg from "../assets/images/Dahi.jpg";
import  PavbhajiImg from "../assets/images/Pavbhaji.png";
import  CholebhatureImg from "../assets/images/Cholebhature.png";
import  NoodelesImg from "../assets/images/Noodles.png";
import  MaggieImg from "../assets/images/Maggie.jpg";
import  AlooparathaImg from "../assets/images/Aloo_paratha.png";
import  FriedRiceImg from "../assets/images/FriedRice.png";
import  PastaImg from "../assets/images/passta.jpg";



const menuData = {
  "Morning Kickstart": [
    { name: "Poha", price: 20, desc: "Light Maharashtrian breakfast", image: PohaImg },
    { name: "Idli", price: 30, desc: "Soft idli with chutney & sambar", image:IdliImg },
    { name: "Upma", price: 30, desc: "Healthy semolina breakfast", image: UpmaImg },
    { name: "Dosa", price: 50, desc: "Crispy dosa with chutney", image: DosaImg },
    { name: "Vada Sambar", price: 40, desc: "Crispy vada with sambar", image: DosaImg },
    { name: "Sabudana Khichdi", price: 45, desc: "Fasting special dish", image: SabudanaImg }
  ],

  "Street Cravings": [
    { name: "Vada Pav", price: 20, desc: "Mumbai street food", image: VadapavImg },
    { name: "Samosa", price: 20, desc: "Crispy samosa", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80" },
    { name: "Misal Pav", price: 60, desc: "Spicy curry with pav", image:MisalImg},
    { name: "Dabeli", price: 30, desc: "Spicy dabeli", image:DabeliImg },
    { name: "Sabudana Vada", price: 40, desc: "Fried sabudana snack", image: SabudanavadaImg }
  ],

  "Crispy Bites & Quick Fix": [
    { name: "French Fries", price: 60, desc: "Crispy fries", image:FriesImg },
    { name: "Peri Peri Fries", price: 70, desc: "Spicy fries", image:FriesImg },
    { name: "Sandwich", price: 50, desc: "Veg sandwich", image:SandwichImg },
    { name: "Omelette", price: 40, desc: "Egg omelette", image: OmleteImg },
    { name: "Dhokla", price: 40, desc: "Soft Gujarati snack", image: DhoklaImg }
  ],

  "Sip & Chill": [
    { name: "Tea", price: 12, desc: "Regular chai", image:TeaImg},
    { name: "Coffee", price: 30, desc: "Hot coffee", image: hotCoffeeImg},
    { name: "Cold Coffee", price: 45, desc: "Chilled coffee", image:coldcoffeeImg },
    { name: "Taak", price: 20, desc: "Refreshing buttermilk", image: TaakImg },
    { name: "Dahi", price: 25, desc: "Fresh curd", image: DahiImg }
  ],

  "Desi & Global Meals": [
    { name: "Pav Bhaji", price: 70, desc: "Spicy mashed veggies", image:PavbhajiImg },
    { name: "Chole Bhature", price: 70, desc: "Punjabi special meal", image: CholebhatureImg },
    { name: "Aloo Paratha", price: 50, desc: "Stuffed paratha with butter", image: AlooparathaImg },
    { name: "Fried Rice", price: 80, desc: "Veg fried rice", image: FriedRiceImg},
    { name: "Noodles", price: 70, desc: "Hakka noodles", image: NoodelesImg},
    { name: "Pasta", price: 90, desc: "Creamy pasta", image: PastaImg },
    { name: "Maggi (Plain)", price: 40, desc: "Simple maggi", image: MaggieImg },
    { name: "Maggi (Masala)", price: 50, desc: "Spicy maggi", image: MaggieImg }
  ]
};

function MainCanteen({ cart, setCart }) {
  const [activeCategory, setActiveCategory] = useState("Morning Kickstart");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // --- CART LOGIC ---
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
  cart.reduce((total, item) => total + item.price * item.qty, 0);
  ;return (
      <div className="bg-[#f8f9fa] min-h-screen pb-32 font-sans selection:bg-orange-100">

        {/* --- PREMIUM STICKY HEADER --- */}
        <div className="bg-white/90 backdrop-blur-xl px-6 py-4 sticky top-0 z-40 border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronLeft size={24} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  Main Canteen <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter">Campus Favorite</span>
                </h1>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-green-600 text-xs font-bold"><Star size={14} fill="currentColor" /> 4.2 (1k+ Ratings)</span>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center gap-1 text-gray-500 text-xs font-bold"><Clock size={14} /> 15 MINS</span>
                </div>
              </div>
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input
                  type="text"
                  placeholder="Search for dishes..."
                  className="bg-gray-100 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl pl-12 pr-4 py-3 w-full md:w-80 outline-none transition-all text-sm font-medium"
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">

          {/* --- PROMO BANNER (Zomato Style) --- */}
          <div className="mb-10 relative h-48 md:h-64 rounded-[2.5rem] overflow-hidden group cursor-pointer" onClick={() => navigate("/main-canteen/thali")}>
            <img src="https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Special Thali" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <div className="flex items-center gap-2 text-orange-400 mb-2">
                <Flame size={20} fill="currentColor" />
                <span className="text-sm font-black uppercase tracking-widest">Trending Now</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white">The Grand Maharaja Thali</h2>
              <p className="text-gray-200 mt-2 font-medium">Get a complete meal for just <span className="text-white text-xl font-black">₹75</span></p>
            </div>
          </div>

          {/* --- CATEGORY SLIDER --- */}
          <div className="flex gap-4 mb-10 overflow-x-auto no-scrollbar py-2">
            {Object.keys(menuData).map((cat) => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-8 py-3 rounded-2xl font-bold transition-all whitespace-nowrap shadow-sm border ${
                        activeCategory === cat ? "bg-orange-500 text-white border-orange-500 shadow-orange-200 shadow-lg" : "bg-white text-gray-500 border-gray-100 hover:border-orange-200"
                    }`}
                >
                  {cat}
                </button>
            ))}
          </div>

          {/* --- MENU LIST --- */}
          <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3">
            Popular Dishes <div className="h-1 flex-1 bg-gray-100 rounded-full" />
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {menuData[activeCategory].filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => {
              const cartItem = cart.find((i) => i.name === item.name);
              return (
                  <div key={idx} className="bg-white p-5 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center gap-6 group">
                    <div className="relative h-32 w-32 min-w-[128px] overflow-hidden rounded-3xl">
                      <img src={item.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-1 rounded-lg">
                        <div className="w-3 h-3 rounded-sm border-2 border-green-600 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-green-600" /></div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-black text-gray-800">{item.name}</h3>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2 font-medium">{item.desc}</p>
                      <div className="flex items-center justify-between mt-4">
                        <p className="font-black text-gray-900 text-2xl">₹{item.price}</p>

                        <div className="relative">
                          {cartItem ? (
                              <div className="flex items-center bg-orange-500 text-white rounded-2xl shadow-lg overflow-hidden border-2 border-orange-500">
                                <button onClick={() => removeItem(item)} className="p-2 hover:bg-orange-600"><Minus size={16} strokeWidth={3} /></button>
                                <span className="px-2 font-bold text-sm">{cartItem.qty}</span>
                                <button onClick={() => addItem(item)} className="p-2 hover:bg-orange-600"><Plus size={16} strokeWidth={3} /></button>
                              </div>
                          ) : (
                              <button
                                  onClick={() => addItem(item)}
                                  className="bg-white text-orange-500 border-2 border-orange-500 px-8 py-2 rounded-2xl font-black text-sm hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                              >
                                ADD
                              </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
              );
            })}
          </div>
        </div>

        {/* --- FLOATING SMART CART --- */}
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

export default MainCanteen;