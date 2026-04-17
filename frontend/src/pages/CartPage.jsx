import {Plus, Minus, ChevronLeft, CreditCard, Users2, User, Check, Tag, Users, Clock, Calendar} from "lucide-react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function CartPage({cart, setCart, groups = []}) {
    const navigate = useNavigate();
    const [selectedGroupId, setSelectedGroupId] = useState(null);

    // --- NEW STATE FOR SCHEDULING ---
    const [orderType, setOrderType] = useState("asap"); // "asap" or "scheduled"
    const placeOrderAPI = () => {
        console.log("API CALLED 🚀");

        const formattedItems = cart.map(item => ({
            name: item.name,
            quantity: item.qty,
            price: item.price
        }));

        fetch("http://127.0.0.1:5000/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: 1,
                items: formattedItems,
                total_price: total
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                alert("Order placed successfully 🎉");
                setCart([]);
            })
            .catch(err => console.error(err));
    };
    const [selectedTime, setSelectedTime] = useState(null);

    const timeSlots = ["12:15 PM", "12:30 PM", "12:45 PM", "01:00 PM", "01:15 PM", "01:30 PM", "04:30 PM"];

    const selectedGroup = groups.find(g => g.id === selectedGroupId);
    const currentMembers = selectedGroup ? selectedGroup.members : ["You"];

    const updateQty = (name, delta) => {
        setCart(prev => prev.map(item =>
            item.name === name ? {...item, qty: Math.max(0, item.qty + delta)} : item
        ).filter(item => item.qty > 0));
    };

    const toggleOwner = (itemName, memberName) => {
        setCart(prev => prev.map(item => {
            if (item.name === itemName) {
                const currentOwners = item.owners || ["You"];
                const newOwners = currentOwners.includes(memberName)
                    ? currentOwners.filter(name => name !== memberName)
                    : [...currentOwners, memberName];
                return {...item, owners: newOwners.length > 0 ? newOwners : ["You"]};
            }
            return item;
        }));
    };

    const toggleEveryone = (itemName) => {
        setCart(prev => prev.map(item => {
            if (item.name === itemName) {
                const isEveryone = item.owners?.length === currentMembers.length;
                return {...item, owners: isEveryone ? ["You"] : [...currentMembers]};
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

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-52 px-4 font-sans text-slate-900">
            <div className="max-w-xl mx-auto">

                {/* --- HEADER --- */}
                <div className="flex items-center justify-between mb-8 px-2">
                    <button onClick={() => navigate(-1)}
                            className="p-3 bg-white rounded-2xl shadow-sm hover:scale-110 transition-all border border-slate-100">
                        <ChevronLeft size={24} strokeWidth={3}/>
                    </button>
                    <div className="text-center">
                        <h1 className="text-2xl font-black tracking-tight text-slate-800">Review Order</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Finalize &
                            Split</p>
                    </div>
                    <div
                        className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-orange-200">
                        {cart.length}
                    </div>
                </div>

                {/* --- SQUAD SELECTOR --- */}
                <div className="mb-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-2">Whose meal
                        is this?</p>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 px-2">
                        <button
                            onClick={() => setSelectedGroupId(null)}
                            className={`flex flex-col items-center min-w-[100px] p-4 rounded-[2.5rem] transition-all border-2 shadow-sm ${!selectedGroupId ? "bg-white border-orange-500 ring-4 ring-orange-50" : "bg-white border-transparent text-slate-400"}`}
                        >
                            <div
                                className={`p-3 rounded-2xl mb-2 ${!selectedGroupId ? "bg-orange-500 text-white" : "bg-slate-100"}`}>
                                <User size={20}/></div>
                            <span className="text-[10px] font-black uppercase tracking-tighter">Personal</span>
                        </button>

                        {groups.map(g => (
                            <button
                                key={g.id}
                                onClick={() => setSelectedGroupId(g.id)}
                                className={`flex flex-col items-center min-w-[100px] p-4 rounded-[2.5rem] transition-all border-2 shadow-sm ${selectedGroupId === g.id ? "bg-white border-indigo-600 ring-4 ring-indigo-50" : "bg-white border-transparent text-slate-400"}`}
                            >
                                <div
                                    className={`p-3 rounded-2xl mb-2 ${selectedGroupId === g.id ? "bg-indigo-600 text-white" : "bg-slate-100"}`}>
                                    <Users2 size={20}/></div>
                                <span
                                    className="text-[10px] font-black uppercase truncate w-16 text-center tracking-tighter">{g.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- PRE-ORDER SCHEDULING MODULE --- */}
                <div className="mb-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-2">Pickup
                        Schedule</p>
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
                        <div className="flex p-1 bg-slate-50 rounded-2xl mb-6 border border-slate-100">
                            <button
                                onClick={() => setOrderType("asap")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${orderType === "asap" ? "bg-white text-slate-900 shadow-md" : "text-slate-400"}`}
                            >
                                <Clock size={14} strokeWidth={3}/> ASAP
                            </button>
                            <button
                                onClick={() => setOrderType("scheduled")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${orderType === "scheduled" ? "bg-white text-slate-900 shadow-md" : "text-slate-400"}`}
                            >
                                <Calendar size={14} strokeWidth={3}/> Scheduled
                            </button>
                        </div>

                        {orderType === "scheduled" && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <p className="text-[9px] font-black text-indigo-500 uppercase text-center tracking-[0.2em]">Select
                                    Pickup Time</p>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                    {timeSlots.map(time => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`px-5 py-3 rounded-2xl font-black text-[10px] whitespace-nowrap border-2 transition-all ${selectedTime === time ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"}`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                                <div
                                    className="bg-indigo-50 p-4 rounded-2xl flex items-center gap-3 border border-indigo-100">
                                    <div className="bg-indigo-600 text-white p-2 rounded-lg"><Clock size={14}/></div>
                                    <p className="text-[10px] font-bold text-indigo-700 leading-tight">Canteen will
                                        start preparation exactly 15 mins before {selectedTime || "your slot"}.</p>
                                </div>
                            </div>
                        )}

                        {orderType === "asap" && (
                            <div className="text-center py-2 flex items-center justify-center gap-2">
                                <span className="relative flex h-2 w-2">
                                  <span
                                      className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                </span>
                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Est.
                                    Ready Time: <span className="text-orange-600 font-black">15 mins</span></p>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- ITEMS LIST --- */}
                <div className="space-y-6 mb-12">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Items &
                        Splits</p>
                    {cart.map((item, idx) => {
                        const owners = item.owners || ["You"];
                        const isSharedByAll = owners.length === currentMembers.length && currentMembers.length > 1;

                        const placeOrderAPI = () => {
                            console.log("API CALLED 🚀");

                            const formattedItems = cart.map(item => ({
                                name: item.name,
                                quantity: item.qty,
                                price: item.price
                            }));

                            fetch("http://127.0.0.1:5000/order", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    user_id: 1,
                                    items: formattedItems,
                                    total_price: total
                                })
                            })
                                .then(res => res.json())
                                .then(data => {
                                    console.log(data);
                                    alert("Order placed successfully 🎉");
                                    setCart([]);
                                })
                                .catch(err => console.error(err));
                        };
                        return (
                            <div key={idx}
                                 className="bg-white rounded-[2.8rem] p-7 shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:shadow-slate-200/50">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="max-w-[60%]">
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">{item.name}</h3>
                                        <p className="text-sm font-bold text-indigo-500 mt-2">₹{item.price * item.qty}</p>
                                    </div>
                                    <div
                                        className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
                                        <button onClick={() => updateQty(item.name, -1)}
                                                className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                            <Minus size={14} strokeWidth={3}/></button>
                                        <span className="px-3 font-black text-slate-800">{item.qty}</span>
                                        <button onClick={() => updateQty(item.name, 1)}
                                                className="p-2 text-orange-500 hover:scale-125 transition-transform">
                                            <Plus size={14} strokeWidth={3}/></button>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <div className="flex items-center justify-between">
                                        <span
                                            className="text-[10px] font-black uppercase tracking-widest text-slate-400">Share with</span>
                                        {selectedGroupId && (
                                            <button
                                                onClick={() => toggleEveryone(item.name)}
                                                className={`text-[9px] font-black uppercase px-3 py-1 rounded-full transition-all border ${isSharedByAll ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" : "bg-white text-indigo-600 border-indigo-100"}`}
                                            >
                                                {isSharedByAll ? "Everyone Sharing ✨" : "Quick Split All"}
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {currentMembers.map(m => (
                                            <button
                                                key={m}
                                                onClick={() => toggleOwner(item.name, m)}
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-black transition-all border-2 ${owners.includes(m) ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:scale-105"}`}
                                            >
                                                {owners.includes(m) && <Check size={12} strokeWidth={4}/>} {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* --- LIVE SPLIT SUMMARY --- */}
                {selectedGroup && (
                    <div
                        className="bg-slate-900 rounded-[3rem] p-8 mb-10 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-6 relative z-10">
                            <Users size={18} className="text-indigo-400"/>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Settlement
                                Breakdown</h2>
                        </div>
                        <div className="space-y-3 relative z-10">
                            {selectedGroup.members.map(member => (
                                <div key={member}
                                     className="flex justify-between items-center bg-white/5 p-4 rounded-[1.5rem] border border-white/5 backdrop-blur-md">
                                    <span className="font-bold text-sm text-slate-300">{member}'s Share</span>
                                    <span className="font-black text-xl text-white">₹{getIndividualTotal(member)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="absolute -right-6 -bottom-6 text-7xl opacity-5 font-black italic">SQUAD</div>
                    </div>
                )}

                {/* --- FINAL TOTAL CARD --- */}
                <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-50 mb-10 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Grand Total</p>
                    <p className="text-5xl font-black text-slate-900 mb-2 tracking-tight">₹{total}</p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest underline decoration-orange-500/30">CampusCrave
                        Secure Checkout</p>
                </div>

                {/* --- UNIFIED FINAL ACTION BUTTON (FIXED LOGIC) --- */}
                <div className="fixed bottom-8 left-4 right-4 max-w-xl mx-auto z-[100]">
                    <button
                        onClick={() => {
                            if (orderType === "scheduled" && !selectedTime) {
                                return alert("Please select a pickup time first! 🕒");
                            }
                            placeOrderAPI();
                        }}
                        className={`w-full py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex flex-col items-center justify-center gap-0 group 
            ${(orderType === "scheduled" && !selectedTime)
                            ? "bg-slate-300 cursor-not-allowed text-slate-500"
                            : "bg-slate-900 hover:bg-orange-500 text-white shadow-orange-200"}`}
                    >
                        <div className="flex items-center gap-3">
                            <CreditCard size={20} className="group-hover:rotate-12 transition-transform"/>
                            <span>Confirm & Pay Order</span>
                        </div>

                        {/* Status Label on Button */}
                        {orderType === "scheduled" && selectedTime ? (
                            <span
                                className="text-[9px] text-orange-200 mt-1 italic font-bold">Scheduled for {selectedTime}</span>
                        ) : orderType === "asap" ? (
                            <span className="text-[9px] text-slate-400 mt-1 font-bold">Preparing Immediately</span>
                        ) : (
                            <span className="text-[9px] text-slate-500 mt-1">Pick a Slot Above</span>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default CartPage;