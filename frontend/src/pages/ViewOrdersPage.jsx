import React from 'react';
import { Clock, MapPin, ChevronRight, Package, CheckCircle2 } from "lucide-react";

function ViewOrdersPage({ orders = [] }) {
    // Demo Data if no orders exist
    const demoOrders = orders.length > 0 ? orders : [
        {
            id: "ORD-9921",
            items: [{ name: "Paneer Tikka Pizza", quantity: 2 }, { name: "Coke", quantity: 1 }],
            total: 840,
            status: 0, // 1 = Preparing
            timestamp: "12:45 PM"
        }
    ];

    const steps = ["Placed", "Kitchen", "Pickup", "Done"];

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 font-sans">
            <div className="max-w-2xl mx-auto px-4">
                <header className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Orders</h1>
                    <p className="text-slate-500 font-medium text-sm">Track your meal in real-time</p>
                </header>

                <div className="space-y-6">
                    {demoOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            {/* Status Header */}
                            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
                                        <Package size={20} className="text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Order ID</p>
                                        <p className="text-sm font-bold">#{order.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Est. Arrival</p>
                                    <p className="text-sm font-bold">25 mins</p>
                                </div>
                            </div>

                            {/* Progress Stepper */}
                            <div className="p-8">
                                <div className="relative flex justify-between mb-8">
                                    {/* Background Line */}
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2" />
                                    {/* Active Line */}
                                    <div
                                        className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 transition-all duration-1000"
                                        style={{ width: `${(order.status / 3) * 100}%` }}
                                    />

                                    {steps.map((step, idx) => (
                                        <div key={idx} className="relative z-10 flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 ${
                                                idx <= order.status
                                                    ? "bg-indigo-600 border-white shadow-md text-white"
                                                    : "bg-white border-slate-100 text-slate-300"
                                            }`}>
                                                {idx <= order.status ? <CheckCircle2 size={14} /> : <div className="w-2 h-2 bg-current rounded-full" />}
                                            </div>
                                            <span className={`text-[10px] font-black uppercase mt-3 tracking-tighter ${
                                                idx <= order.status ? "text-indigo-600" : "text-slate-400"
                                            }`}>
                        {step}
                      </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Details */}
                                <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <p className="text-sm font-bold text-slate-700">
                                                <span className="text-indigo-600 mr-2">{item.quantity}x</span>
                                                {item.name}
                                            </p>
                                            <p className="text-xs font-black text-slate-400">ITEM</p>
                                        </div>
                                    ))}
                                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                                        <span className="text-sm font-black text-slate-900">Total Paid</span>
                                        <span className="text-lg font-black text-indigo-600">₹{order.total}</span>
                                    </div>
                                </div>

                                <button className="w-full mt-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                    <Clock size={14} /> View Receipt <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ViewOrdersPage;