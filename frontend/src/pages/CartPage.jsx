import { Plus, Minus, CreditCard, Users2, User, Check, ShoppingBag, Clock, ArrowRight, ShieldCheck, Info } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CartPage({ cart, setCart, groups = [] }) {
    const navigate = useNavigate();
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [orderType, setOrderType] = useState("asap");
    const [selectedTime, setSelectedTime] = useState(null);

    const timeSlots = ["12:15 PM", "12:30 PM", "12:45 PM", "01:00 PM", "01:15 PM", "01:30 PM", "04:30 PM"];
    const selectedGroup = groups.find(g => g.id === selectedGroupId);
    const currentMembers = selectedGroup ? selectedGroup.members : ["You"];

    const updateQty = (name, delta) => {
        setCart(prev => prev.map(item =>
            item.name === name ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        ).filter(item => item.qty > 0));
    };

    const toggleOwner = (itemName, memberName) => {
        setCart(prev => prev.map(item => {
            if (item.name === itemName) {
                const currentOwners = item.owners || ["You"];
                const isRemoving = currentOwners.includes(memberName);
                if (isRemoving && currentOwners.length === 1) return item;
                const newOwners = isRemoving
                    ? currentOwners.filter(name => name !== memberName)
                    : [...currentOwners, memberName];
                return { ...item, owners: newOwners };
            }
            return item;
        }));
    };

    const toggleEveryone = (itemName) => {
        setCart(prev => prev.map(item => {
            if (item.name === itemName) {
                const isEveryone = item.owners?.length === currentMembers.length;
                return { ...item, owners: isEveryone ? ["You"] : [...currentMembers] };
            }
            return item;
        }));
    };

    const subtotal = cart.reduce((t, i) => t + (i.price * i.qty), 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    const getIndividualTotal = (memberName) => {
        let memberShare = 0;
        cart.forEach(item => {
            const owners = item.owners || ["You"];
            if (owners.includes(memberName)) {
                memberShare += ((item.price * item.qty) / owners.length);
            }
        });
        return Math.round(memberShare + (memberShare * 0.05));
    };

    const placeOrderAPI = () => {
        const formattedItems = cart.map(item => ({
            name: item.name,
            quantity: item.qty,
            price: item.price
        }));
        const user = JSON.parse(localStorage.getItem("user"));

        fetch("http://127.0.0.1:5000/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: user.email,
                items: formattedItems,
                total_price: total
            })
        })
        .then(res => res.json())
        .then(() => {
            alert("Order placed successfully 🎉");
            setCart([]);
            navigate("/");
        })
        .catch(err => console.error(err));
    };

    return (
       <div className="min-h-screen bg-[#F4F6F8] pt-24 pb-12 font-sans text-slate-800">
            <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT SIDE */}
                <div className="lg:col-span-7 space-y-5">
                    <div className="px-1 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900">Review Order</h1>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
                                Checkout securely with your squad
                            </p>
                        </div>
                    </div>

                    {/* SQUAD SELECTOR */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-4">
                            <Users2 className="text-indigo-600" size={18}/>
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-600">Dining Context</h2>
                        </div>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar">
                            <button onClick={() => setSelectedGroupId(null)}
                                className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all border-2 text-xs font-bold whitespace-nowrap ${!selectedGroupId ? "bg-slate-900 border-slate-900 text-white shadow-md" : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"}`}>
                                <User size={16}/> Just Me
                            </button>
                            {groups.map(g => (
                                <button key={g.id} onClick={() => setSelectedGroupId(g.id)}
                                    className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all border-2 text-xs font-bold whitespace-nowrap ${selectedGroupId === g.id ? "bg-indigo-600 border-indigo-600 text-white shadow-md" : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"}`}>
                                    <Users2 size={16}/> {g.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ITEM LIST */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                            <h2 className="text-xs font-black flex items-center gap-2 uppercase tracking-widest text-slate-500">
                                <ShoppingBag size={14}/> Items ({cart.length})
                            </h2>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {cart.map((item, idx) => {
                                const owners = item.owners || ["You"];
                                const isSharedByAll = owners.length === currentMembers.length;

                                return (
                                    <div key={idx} className="p-5 hover:bg-slate-50/20 transition-all">
                                        <div className="flex justify-between items-center mb-5">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                                                    {item.name.toLowerCase().includes('pizza') ? '🍕' : item.name.toLowerCase().includes('burger') ? '🍔' : '🍱'}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-slate-800 leading-tight">{item.name}</h3>
                                                    {/* ADDED UNIT PRICE UI HERE */}
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <p className="text-sm font-black text-indigo-600">₹{item.price * item.qty}</p>
                                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                            ₹{item.price} each
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                                                <button onClick={() => updateQty(item.name, -1)} className="p-1.5 text-slate-400 hover:text-red-500 transition-all"><Minus size={14} strokeWidth={3}/></button>
                                                <span className="px-3 text-sm font-black text-slate-800">{item.qty}</span>
                                                <button onClick={() => updateQty(item.name, 1)} className="p-1.5 text-emerald-600 hover:scale-110 transition-all"><Plus size={14} strokeWidth={3}/></button>
                                            </div>
                                        </div>

                                        {/* SPLIT BOX */}
                                        <div className="bg-indigo-50/30 border border-indigo-100 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-3 px-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                                                    <Check size={10}/> Paid By
                                                </span>
                                                {selectedGroupId && (
                                                    <button onClick={() => toggleEveryone(item.name)}
                                                            className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-md transition-all shadow-sm ${isSharedByAll ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 border border-indigo-100"}`}>
                                                        {isSharedByAll ? "Everyone ✨" : "Quick Split All"}
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {currentMembers.map(m => (
                                                    <button key={m} onClick={() => toggleOwner(item.name, m)}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold transition-all border ${owners.includes(m) ? "bg-slate-800 border-slate-800 text-white shadow-sm" : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"}`}>
                                                        {owners.includes(m) && <Check size={10} strokeWidth={4} className="text-orange-400"/>} {m}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE SUMMARY */}
                <div className="lg:col-span-5 space-y-5">
                    <div className="sticky top-24 space-y-5">

                        {/* PICKUP PREFERENCE */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Pickup Preference</h3>
                            <div className="flex p-1 bg-slate-100 rounded-xl mb-4 border border-slate-200 shadow-inner">
                                <button onClick={() => setOrderType("asap")} className={`flex-1 py-2 rounded-lg font-bold text-[11px] transition-all ${orderType === "asap" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}>ASAP</button>
                                <button onClick={() => setOrderType("scheduled")} className={`flex-1 py-2 rounded-lg font-bold text-[11px] transition-all ${orderType === "scheduled" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}>SCHEDULE</button>
                            </div>
                            {orderType === "scheduled" && (
                                <div className="grid grid-cols-4 gap-1.5 mb-4 animate-in fade-in duration-200">
                                    {timeSlots.map(t => (
                                        <button key={t} onClick={() => setSelectedTime(t)} className={`py-2 rounded-lg text-[9px] font-bold border transition-all ${selectedTime === t ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-inner" : "bg-white border-slate-100 text-slate-400"}`}>{t}</button>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100 font-bold text-[10px]">
                                <Clock size={14}/> Freshly prepared in 15m
                            </div>
                        </div>

                        {/* SETTLEMENT CARDS */}
                        {selectedGroupId && (
                            <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg overflow-hidden relative">
                                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4">Personal Settlement</h3>
                                <div className="grid grid-cols-2 gap-2 relative z-10">
                                    {selectedGroup.members.map(m => (
                                        <div key={m} className="bg-white/10 p-3 rounded-xl border border-white/5 flex flex-col justify-center">
                                            <span className="text-[9px] font-bold text-slate-400 truncate tracking-tight">{m}'s total</span>
                                            <span className="font-black text-sm text-white leading-none mt-1">₹{getIndividualTotal(m)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute -bottom-2 -right-2 text-4xl opacity-5 font-black italic select-none">BILL</div>
                            </div>
                        )}

                        {/* FINAL BILLING */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
                            <div className="space-y-3 mb-6 border-b border-slate-50 pb-5">
                                <div className="flex justify-between text-slate-400 font-bold text-[10px] uppercase">
                                    <span>Item Subtotal</span>
                                    <span className="text-slate-700 font-black">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-slate-400 font-bold text-[10px] uppercase">
                                    <span>Tax & Service</span>
                                    <span className="text-slate-700 font-black">₹{tax}</span>
                                </div>
                            </div>
                            <div className="mb-6 flex justify-between items-end">
                                <div>
                                    <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-0.5">Grand Total</p>
                                    <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">₹{total}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <ShoppingBag className="text-slate-300" size={24} />
                                </div>
                            </div>

                            <button
                                onClick={placeOrderAPI}
                                className="w-full bg-slate-900 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.15em] text-white shadow-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
                            >
                                <CreditCard size={16} className="group-hover:rotate-12 transition-transform"/>
                                Confirm & Pay <ArrowRight size={16} className="group-hover:translate-x-1 transition-all"/>
                            </button>

                            <div className="mt-6 flex flex-col items-center gap-1 opacity-40">
                                <ShieldCheck size={14} className="text-slate-400"/>
                                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">100% Encrypted</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CartPage;