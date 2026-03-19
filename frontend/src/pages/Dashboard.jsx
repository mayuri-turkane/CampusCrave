import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ChevronRight, Plus, Minus, Utensils } from "lucide-react"; // Highly recommended for UI
import canteenImg from "../assets/images/canteen.jpg";
import bgFood from "../assets/images/bg_food.jpg";
import Card from "../components/Card";

function Dashboard({ cart, setCart }) {
  const canteenRef = useRef(null);
  const navigate = useNavigate();

  const scrollToCanteens = () => {
    canteenRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const totalPrice = cart.reduce((total, item) => total + item.price * item.qty, 0);

  const increaseQty = (index) => {
    const updated = [...cart];
    updated[index].qty += 1;
    setCart(updated);
  };

  const decreaseQty = (index) => {
    const updated = [...cart];
    if (updated[index].qty === 1) {
      updated.splice(index, 1);
    } else {
      updated[index].qty -= 1;
    }
    setCart(updated);
  };

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen font-sans">

      {/* --- HERO SECTION --- */}
      <div
        className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden"
        style={{
            background: `url(${bgFood}) center/cover no-repeat`,
            backgroundAttachment: 'fixed'
        }}
      >
        {/* Soft Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>

        <div className="relative z-10 text-center text-white px-6">
          <span className="uppercase tracking-[0.3em] text-amber-400 font-semibold text-sm mb-4 block">
            Satisfy Your Cravings
          </span>
          <h1 className="text-6xl md:text-8xl font-black mb-6 drop-shadow-2xl">
            Campus <span className="text-amber-400">Bites.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            The quickest way to fuel your study sessions. Fresh meals from your
            favorite canteens, delivered to your spot.
          </p>

          <button
            onClick={scrollToCanteens}
            className="group flex items-center gap-3 bg-amber-500 hover:bg-white hover:text-amber-600 px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl mx-auto"
          >
            Order Now
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* --- CANTEEN SECTION --- */}
      <div ref={canteenRef} className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-800">Popular Hubs</h2>
            <div className="h-1.5 w-20 bg-amber-400 mt-2 rounded-full"></div>
          </div>
          <p className="text-slate-500 hidden md:block italic">"Best food on campus, voted by students"</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="transform transition-all hover:-translate-y-2">
            <Card
              title="Main Campus Canteen"
              image={canteenImg}
              onClick={() => navigate("/main-canteen")}
              className="rounded-3xl shadow-2xl border-none"
            />
          </div>
          <div className="transform transition-all hover:-translate-y-2">
            <Card
              title="The Hangout Cafe"
              image={canteenImg}
              onClick={() => navigate("/hangout-cafe")}
              className="rounded-3xl shadow-2xl border-none"
            />
          </div>
        </div>
      </div>

      {/* --- FLOATING CART SECTION --- */}
      <div className="bg-white border-t border-slate-200 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-10 justify-center">
            <ShoppingBag className="text-amber-500 w-8 h-8" />
            <h2 className="text-3xl font-bold text-slate-800">Review Your Order</h2>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <Utensils className="mx-auto w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">Your tray is empty. Let's find some food!</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
              <div className="p-8">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-slate-50 py-6 last:border-0">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{item.name}</h4>
                      <p className="text-slate-400 text-sm">Unit Price: ₹{item.price}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center bg-slate-100 rounded-2xl p-1">
                        <button
                          onClick={() => decreaseQty(index)}
                          className="p-2 hover:bg-white rounded-xl transition-colors text-slate-600 shadow-sm"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-bold text-slate-700">{item.qty}</span>
                        <button
                          onClick={() => increaseQty(index)}
                          className="p-2 hover:bg-white rounded-xl transition-colors text-slate-600 shadow-sm"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="font-black text-slate-800 w-20 text-right">₹{item.price * item.qty}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                <div>
                  <p className="text-slate-400 text-sm uppercase tracking-widest">Total Amount</p>
                  <p className="text-3xl font-black text-amber-400">₹{totalPrice}</p>
                </div>
                <button className="bg-amber-500 hover:bg-amber-400 text-white px-10 py-4 rounded-2xl font-bold transition-all transform active:scale-95 shadow-xl">
                  Checkout Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;