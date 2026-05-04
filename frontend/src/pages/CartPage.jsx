import { Plus, Minus, CreditCard, Users2, User, Check, ShoppingBag, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CartPage({ cart, setCart, groups = [] }) {
    const navigate = useNavigate();
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [orderType, setOrderType] = useState("asap");
    const [selectedTime, setSelectedTime] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paidMembers, setPaidMembers] = useState([]); // Track names of people who finished payment

    const timeSlots = ["12:15 PM", "12:30 PM", "12:45 PM", "01:00 PM", "01:15 PM", "01:30 PM", "04:30 PM"];
    const user = JSON.parse(localStorage.getItem("user"));

    const selectedGroup = groups.find(g => g.id === selectedGroupId);

    // Logic: If in a group, members = You + other members. If solo, just You.
    const currentMembers = selectedGroup
        ? [user.name, ...(selectedGroup.members || [])]
        : [user.name];

    const updateQty = (name, delta) => {
        setCart(prev => prev.map(item =>
            item.name === name ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        ).filter(item => item.qty > 0));
    };

    const toggleOwner = (itemName, memberName) => {
        setCart(prev => prev.map(item => {
            if (item.name === itemName) {
                // Initialize owners with current user if empty
                const currentOwners = item.owners || [user.name];
                const isRemoving = currentOwners.includes(memberName);

                // Prevent removing the last owner
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
                return { ...item, owners: isEveryone ? [user.name] : [...currentMembers] };
            }
            return item;
        }));
    };

    // Calculations
    const subtotal = cart.reduce((t, i) => t + (i.price * i.qty), 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    const getIndividualTotal = (memberName) => {
        let memberShare = 0;
        cart.forEach(item => {
            const owners = item.owners || [user.name];
            if (owners.includes(memberName)) {
                memberShare += ((item.price * item.qty) / owners.length);
            }
        });
        // Add 5% tax to individual share
        return Math.round(memberShare * 1.05);
    };

    const payIndividualShare = async (memberName, shareAmount) => {
        if (shareAmount <= 0) return;
        setIsProcessing(true);

        try {
            // 1. Initialize/Get the Group Order ID from Backend
            const initRes = await fetch("http://127.0.0.1:5000/init-group-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: user.email,
                    items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
                    total_price: total,
                    group_id: selectedGroupId,
                    members: currentMembers
                })
            });
            const { order_id } = await initRes.json();

            // 2. Create Razorpay Order for this SPECIFIC share
            const razorRes = await fetch("http://127.0.0.1:5000/create-razorpay-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: shareAmount })
            });
            const razorOrder = await razorRes.json();

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SjhjEUcaquoL49",
                amount: razorOrder.amount,
                currency: "INR",
                name: "CampusCrave Split",
                description: `Payment for ${memberName}`,
                order_id: razorOrder.id,
                handler: async function (response) {

                    const verifyRes = await fetch("http://127.0.0.1:5000/verify-partial-payment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...response,
                            order_id: order_id,
                            member_name: memberName
                        })
                    });

                    if (verifyRes.ok) {
                        const data = await verifyRes.json();
                        alert(`${memberName}'s share paid!`);

                        // ✅ VALIDATION: Add member to paid list
                        setPaidMembers(prev => [...prev, memberName]);

                        if (data.status === "order_completed") {
                            alert("Full Order Confirmed! 🚀");
                            setCart([]);
                            navigate("/");
                        }
                    }
                    setIsProcessing(false);
                },
                prefill: { name: memberName },
                theme: { color: "#4F46E5" },
                modal: { ondismiss: () => setIsProcessing(false) }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            setIsProcessing(false);
        }
    };

    const placeOrderAPI = async () => {
        if (cart.length === 0) return alert("Your cart is empty!");
        setIsProcessing(true);

        if (selectedGroupId) {
            const unpaidMembers = currentMembers.filter(m => !paidMembers.includes(m));

            if (unpaidMembers.length > 0) {
                const confirmPartial = window.confirm(
                    `Wait! The following members haven't paid yet: \n${unpaidMembers.join(", ")}\n\n` +
                    `Do you want to proceed and ONLY order items paid for by the rest of the squad?`
                );

                if (confirmPartial) {
                    // Filter cart to only items where AT LEAST one owner has paid
                    // This prevents the "Half Plate" issue by checking if the owner-group has any 'paid' representation
                    const filteredCart = cart.filter(item =>
                        item.owners?.some(owner => paidMembers.includes(owner))
                    );

                    if (filteredCart.length === 0) {
                        return alert("No items have been paid for yet!");
                    }

                    // Proceed with the filtered cart
                    // Note: You would normally send this 'filteredCart' to a new API endpoint
                    alert("Proceeding with partial order. (Items without any payment were removed)");
                    // Continue with checkout logic using filteredCart...
                }
                return; // Stop if they click cancel
            }
        }

        try {
            // STEP 1: Create Order ID on Backend
            const orderRes = await fetch("http://127.0.0.1:5000/create-razorpay-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: total })
            });
            const razorOrder = await orderRes.json();

            // STEP 2: Configure Razorpay Options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SjhjEUcaquoL49",
                amount: razorOrder.amount,
                currency: "INR",
                name: "CampusCrave",
                description: "Settling the squad's hunger",
                order_id: razorOrder.id,
                handler: async function (response) {
                    // STEP 3: Verify Payment and Save to DB
                    const verifyRes = await fetch("http://127.0.0.1:5000/verify-payment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            email: user.email,
                            items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
                            total_price: total,
                            group_id: selectedGroupId
                        })
                    });

                    if (verifyRes.ok) {
                        alert("Order placed successfully! 🎉");
                        setCart([]);
                        navigate("/");
                    } else {
                        alert("Payment verification failed.");
                    }
                    setIsProcessing(false);
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: { color: "#4F46E5" }, // Indigo
                modal: {
                    ondismiss: function() {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Could not initiate payment. Check console.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F6F8] pt-24 pb-12 font-sans text-slate-800">
            <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT SIDE: SELECTION & ITEMS */}
                <div className="lg:col-span-7 space-y-5">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">Review Order</h1>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
                            Checkout securely with your squad
                        </p>
                    </div>

                    {/* SQUAD SELECTOR */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-4">
                            <Users2 className="text-indigo-600" size={18}/>
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-600">Dining Context</h2>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            <button onClick={() => setSelectedGroupId(null)}
                                    className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all border-2 text-xs font-bold whitespace-nowrap ${!selectedGroupId ? "bg-slate-900 border-slate-900 text-white shadow-md" : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"}`}>
                                <User size={16}/> Solo Order
                            </button>
                            {groups.map(g => (
                                <button key={g.id} onClick={() => setSelectedGroupId(g.id)}
                                        className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all border-2 text-xs font-bold whitespace-nowrap ${selectedGroupId === g.id ? "bg-indigo-600 border-indigo-600 text-white shadow-md" : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"}`}>
                                    <Users2 size={16}/> {g.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CART ITEMS */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="text-xs font-black flex items-center gap-2 uppercase tracking-widest text-slate-500">
                                <ShoppingBag size={14}/> Items in Basket ({cart.length})
                            </h2>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {cart.map((item, idx) => {
                                const owners = item.owners || [user.name];
                                const isSharedByAll = owners.length === currentMembers.length;

                                return (
                                    <div key={idx} className="p-6 transition-all">
                                        <div className="flex justify-between items-center mb-5">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-slate-200">
                                                    {item.name.toLowerCase().includes('pizza') ? '🍕' : item.name.toLowerCase().includes('burger') ? '🍔' : '🍱'}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-slate-900">{item.name}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <p className="text-sm font-black text-indigo-600">₹{item.price * item.qty}</p>
                                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">₹{item.price} ea</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center bg-slate-100 rounded-xl p-1.5 border border-slate-200">
                                                <button onClick={() => updateQty(item.name, -1)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Minus size={14} strokeWidth={3}/></button>
                                                <span className="px-4 text-sm font-black text-slate-800">{item.qty}</span>
                                                <button onClick={() => updateQty(item.name, 1)} className="p-1.5 text-emerald-600 hover:scale-110 transition-transform"><Plus size={14} strokeWidth={3}/></button>
                                            </div>
                                        </div>

                                        {/* SPLIT SHARE UI */}
                                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Paid By:</span>
                                                {selectedGroupId && (
                                                    <button onClick={() => toggleEveryone(item.name)}
                                                            className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg transition-all ${isSharedByAll ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 border border-indigo-100 shadow-sm"}`}>
                                                        {isSharedByAll ? "Split equally ✨" : "Split with all"}
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {currentMembers.map(m => (
                                                    <button key={m} onClick={() => toggleOwner(item.name, m)}
                                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${owners.includes(m) ? "bg-slate-900 border-slate-900 text-white shadow-md" : "bg-white border-slate-200 text-slate-400 hover:bg-slate-100"}`}>
                                                        {owners.includes(m) && <Check size={12} strokeWidth={4} className="text-emerald-400"/>} {m === user.name ? "You" : m}
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

                {/* RIGHT SIDE: SUMMARY & CHECKOUT */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="sticky top-24 space-y-6">
                        {/* SETTLEMENT BREAKDOWN */}
                        {selectedGroupId && (
                            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-5">Squad Settlement</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {currentMembers.map(m => (
                                            <div key={m} className="bg-white/10 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                                                <span className="text-xs font-bold text-slate-300">{m === user.name ? "Your Share" : `${m}'s share`}</span>
                                                <span className="font-black text-lg text-white">₹{getIndividualTotal(m)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 -right-4 text-6xl opacity-5 font-black italic select-none">SQUAD</div>
                            </div>
                        )}

                        {/* PICKUP */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Pickup Time</h3>
                            <div className="flex p-1 bg-slate-100 rounded-2xl mb-4 border border-slate-200">
                                <button onClick={() => setOrderType("asap")} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${orderType === "asap" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}>Instant (15m)</button>
                                <button onClick={() => setOrderType("scheduled")} className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${orderType === "scheduled" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}>Schedule</button>
                            </div>
                            {orderType === "scheduled" && (
                                <div className="grid grid-cols-4 gap-2 mb-4 animate-in fade-in slide-in-from-top-1">
                                    {timeSlots.map(t => (
                                        <button key={t} onClick={() => setSelectedTime(t)} className={`py-2.5 rounded-xl text-[10px] font-bold border transition-all ${selectedTime === t ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"}`}>{t}</button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* FINAL BILL */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-200 relative">
                            <div className="space-y-4 mb-8 border-b border-slate-100 pb-6">
                                <div className="flex justify-between text-slate-400 font-bold text-xs uppercase">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900 font-black">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-slate-400 font-bold text-xs uppercase">
                                    <span>GST (5%)</span>
                                    <span className="text-slate-900 font-black">₹{tax}</span>
                                </div>
                            </div>

                            <div className="mb-8 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Total Amount</p>
                                    <p className="text-5xl font-black text-slate-900 tracking-tighter">₹{total}</p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                                    <CreditCard className="text-orange-500" size={32} />
                                </div>
                            </div>

                            {/* SQUAD PAYMENT AREA */}
                            {selectedGroupId && (
                                <div className="mb-6 p-4 bg-slate-50 rounded-3xl border border-slate-200">
                                    <h3 className="text-[10px] font-black mb-3 uppercase tracking-widest text-slate-400">Squad Payment Hub</h3>
                                    <div className="space-y-2">
                                        {currentMembers.map(member => (
                                            <div key={member}
                                                 className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                                                <div>
                                                    <p className="text-xs font-black text-slate-800">{member}</p>
                                                    <p className="text-[10px] font-bold text-indigo-600">₹{getIndividualTotal(member)}</p>
                                                </div>
                                                <button
                                                    onClick={() => payIndividualShare(member, getIndividualTotal(member))}
                                                    disabled={paidMembers.includes(member) || isProcessing}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                                                        paidMembers.includes(member)
                                                            ? "bg-emerald-100 text-emerald-600 cursor-default"
                                                            : "bg-indigo-600 hover:bg-slate-900 text-white"
                                                    }`}
                                                >
                                                    {paidMembers.includes(member) ? "Paid ✓" : "Pay Share"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={placeOrderAPI}
                                disabled={isProcessing}
                                className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] text-white shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 group ${isProcessing ? 'bg-slate-500 cursor-not-allowed' : 'bg-slate-900 hover:bg-indigo-600 hover:-translate-y-1'}`}
                            >
                                {isProcessing ? "Processing..." : "Pay & Place Order"}
                                {!isProcessing &&
                                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform"/>}
                            </button>

                            <div className="mt-8 flex flex-col items-center gap-2 opacity-50">
                                <div className="flex items-center gap-2 text-emerald-600">
                                    <ShieldCheck size={16}/>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Campus Secure Pay</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CartPage;

