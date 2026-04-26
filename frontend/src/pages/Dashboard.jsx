import { useNavigate } from "react-router-dom";
import { Utensils, Coffee, Zap, Star, ArrowRight, ShoppingBag, Users2, Plus, X, UserPlus, Check, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";

function Dashboard({ cart, groups, setGroups }) {
  const navigate = useNavigate();
  const cartTotal = cart.reduce((t, i) => t + (i.price * i.qty), 0);

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState([]);
  const [memberError, setMemberError] = useState("");

const addMember = () => {
  if (memberInput.trim() === "") {
    setMemberError("Please enter a name first! ✍️");
    return; // Stop here
  }

  // If it's not empty, add the member and clear errors
  setMembers([...members, memberInput.trim()]);
  setMemberInput("");
  setMemberError(""); // Clear the error
};

  const removeMember = (indexToRemove) => {
    setMembers(members.filter((_, index) => index !== indexToRemove));
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) return alert("Please enter a group name!");
    const newGroup = {
      id: Date.now(),
      name: groupName,
      members: ["You", ...members],
      totalSpent: 0,
      status: "Active",
      lastOrder: "None"
    };
    setGroups([...groups, newGroup]);
    setShowGroupModal(false);
    navigate("/groups");
  };

  const canteens = [
    { id: "main", name: "Main Canteen", desc: "Home-style Thalis, Dosa & South Indian Meals", path: "/main-canteen", color: "from-orange-500 to-red-600", shadow: "shadow-orange-200", icon: <Utensils size={32} />, rating: "4.2", time: "10-15 min", image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=400&q=80" },
    { id: "hangout", name: "Hangout Cafe", desc: "Gourmet Burgers, Italian Pizza & Chinese Snacks", path: "/hangout-cafe", color: "from-amber-400 to-orange-500", shadow: "shadow-amber-200", icon: <Coffee size={32} />, rating: "4.5", time: "5-10 min", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans selection:bg-orange-100">

      {/* --- BACKGROUND DECOR --- */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-32 relative z-10">

        {/* --- HEADER --- */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-in slide-in-from-left duration-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1 w-8 bg-orange-500 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Campus Dining Hub</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Hungry, <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">Student?</span>
            </h1>
          </div>

          {cart.length > 0 && (
            <div onClick={() => navigate("/cart")} className="cursor-pointer bg-white p-5 rounded-[2rem] flex items-center gap-5 shadow-2xl shadow-orange-100 border border-orange-50 hover:scale-105 transition-transform animate-in zoom-in duration-500">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-3 rounded-2xl shadow-lg"><ShoppingBag size={24} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Basket Total</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight">₹{cartTotal}</p>
              </div>
            </div>
          )}
        </div>

        {/* --- HERO BANNER --- */}
        <div className="mb-16 group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-3xl">
            <div className="relative z-10 grid md:grid-cols-2 items-center gap-10">
              <div>
                <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-500/30">
                  <Sparkles size={14} /> New Feature: Social Ordering
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">Create a squad. <br/> Eat together.</h2>
                <p className="text-slate-400 text-lg font-medium mb-8 max-w-sm">Skip the "who owes what" talk. Create a shared cart and split the bill instantly.</p>

                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setShowGroupModal(true)} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-3">
                    <Plus size={18} strokeWidth={4} /> Create Group
                  </button>
                  <button onClick={() => navigate("/groups")} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95 flex items-center gap-3">
                    <Users2 size={18} /> My Squads
                  </button>
                </div>
              </div>

              <div className="hidden md:flex justify-center relative">
                 <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full" />
                 <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-orange-500 rounded-full border-4 border-slate-900" />
                      <div className="w-12 h-12 bg-indigo-500 rounded-full -ml-8 border-4 border-slate-900" />
                      <div className="w-12 h-12 bg-emerald-500 rounded-full -ml-8 border-4 border-slate-900" />
                      <div className="bg-slate-800 h-10 px-4 rounded-full flex items-center text-xs font-bold">+4 friends</div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 w-32 bg-white/20 rounded-full" />
                      <div className="h-3 w-48 bg-white/10 rounded-full" />
                      <div className="h-8 w-full bg-indigo-500/40 rounded-xl mt-4" />
                    </div>
                 </div>
              </div>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
          </div>
        </div>

        {/* --- CANTEEN SECTION --- */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><TrendingUp size={20} /></div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Popular Venues</h2>
          </div>
          <div className="h-[2px] flex-1 bg-slate-200 ml-6 rounded-full opacity-50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {canteens.map((canteen, idx) => (
            <div
              key={canteen.id}
              onClick={() => navigate(canteen.path)}
              className={`group relative bg-white rounded-[3rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-12 delay-${idx * 100}`}
            >
              <div className="flex flex-col h-full relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${canteen.color} text-white shadow-lg ${canteen.shadow}`}>
                    {canteen.icon}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 font-black text-slate-800 text-lg">
                      <Star size={18} className="text-orange-500" fill="currentColor" /> {canteen.rating}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{canteen.time}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{canteen.name}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed mb-8 max-w-[280px]">{canteen.desc}</p>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-orange-600 flex items-center gap-2 group-hover:gap-4 transition-all">
                    Browse Full Menu <ArrowRight size={16} />
                  </span>
                  <div className="w-20 h-20 rounded-2xl overflow-hidden opacity-10 group-hover:opacity-100 transition-opacity duration-700 rotate-6 group-hover:rotate-0 scale-150 group-hover:scale-100">
                    <img src={canteen.image} alt="Canteen preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Decorative Circle */}
              <div className={`absolute -bottom-12 -right-12 w-48 h-48 bg-gradient-to-br ${canteen.color} opacity-[0.03] group-hover:opacity-[0.08] rounded-full transition-all duration-700 scale-0 group-hover:scale-100`} />
            </div>
          ))}
        </div>

        {/* --- FOOTER PROMO --- */}
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 p-8 md:p-12 text-white shadow-2xl">
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
              <div>
                 <h4 className="text-3xl font-black tracking-tight mb-2 uppercase italic">Friday Feast! 🥘</h4>
                 <p className="text-orange-50 font-medium text-lg opacity-90">Maharaja Thali Special available today for just ₹75.</p>
              </div>
              <button onClick={() => navigate("/main-canteen/thali")} className="bg-white text-orange-600 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 transition-all active:scale-95">
                Order Thali Now
              </button>
           </div>
           <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-black -rotate-12 select-none">DELICIOUS</div>
        </div>
      </div>

      {/* --- MODAL (Enhanced Styles) --- */}
      {showGroupModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowGroupModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-3xl animate-in zoom-in-95 overflow-hidden">
            <button onClick={() => setShowGroupModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X size={28} /></button>

            <div className="mb-10">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner"><Users2 size={32} /></div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Start a Squad Order</h3>
              <p className="text-slate-400 font-medium">Add friends to start sharing your basket.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 ml-1 mb-2 block">Group Title</label>
                <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="e.g. Lunch Legends 🍟" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:border-indigo-500 focus:bg-white transition-all outline-none" />
              </div>

                <div>
                    <label
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 ml-1 mb-2 block">
                        Add Teammates
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={memberInput}
                            onChange={(e) => {
                                setMemberInput(e.target.value);
                                if (memberError) setMemberError(""); // Clear error while typing
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && addMember()}
                            placeholder="Friend's name..."
                            className={`flex-1 bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold transition-all outline-none ${
                                memberError ? 'border-red-400 bg-red-50' : 'border-slate-100 focus:border-indigo-500'
                            }`}
                        />
                        <button
                            onClick={addMember}
                            className="bg-indigo-600 text-white px-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-90"
                        >
                            <UserPlus size={22}/>
                        </button>
                    </div>

                    {/* 🔥 THE ERROR LINE */}
                    {memberError && (
                        <p className="text-red-500 text-[11px] font-bold mt-2 ml-2 animate-bounce">
                            {memberError}
                        </p>
                    )}
                </div>

              {/* Display: Member List - Now with a cleaner "Review" look */}
                {members.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 block">
                      Squad Members ({members.length})
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1 custom-scrollbar">
                      {members.map((m, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-white border-2 border-indigo-100 text-indigo-600 pl-4 pr-2 py-2 rounded-2xl animate-in zoom-in slide-in-from-top-2 duration-300 shadow-sm"
                        >
                          <span className="text-xs font-black tracking-tight">{m}</span>
                          <button
                            onClick={() => removeMember(idx)}
                            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <button onClick={handleCreateGroup} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 transition-all mt-4 active:scale-95">
                Confirm & Create Squad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;