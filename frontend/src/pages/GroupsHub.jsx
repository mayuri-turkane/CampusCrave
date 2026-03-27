import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Users2, ArrowRight, CreditCard, Clock } from "lucide-react";

function GroupsHub({groups}) {
    const navigate = useNavigate();
    const location = useLocation();



    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6 font-sans text-slate-900">
            <div className="max-w-5xl mx-auto">

                <button onClick={() => navigate("/")} className="flex items-center gap-2 text-slate-400 mb-6 hover:text-indigo-600 font-bold transition-all">
                    <ChevronLeft size={20} /> Back to Dashboard
                </button>

                <h1 className="text-4xl font-black mb-10 tracking-tight">Your Squads</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {groups.map((group) => (
                        <div key={group.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-white">
                            <div className="flex justify-between items-start mb-6">
                                <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-100">
                                    <Users2 size={24} />
                                </div>
                                <span className="bg-amber-100 text-amber-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {group.status}
                </span>
                            </div>

                            <h2 className="text-2xl font-black mb-2">{group.name}</h2>
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-6">
                                <Clock size={14} /> Last activity: Just now
                            </div>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {group.members.map((m, i) => (
                                    <span key={i} className="bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600">
                    {m}
                  </span>
                                ))}
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-5 flex items-center justify-between border border-slate-100">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Spent</p>
                                    <p className="text-xl font-black">₹{group.totalSpent}</p>
                                </div>
                                <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-indigo-600 transition-all">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GroupsHub;