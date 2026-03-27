import { useNavigate } from "react-router-dom";
import { Utensils, Coffee, Zap, Star, ArrowRight, ShoppingBag, Users2, Plus, X, UserPlus, Check } from "lucide-react";
import { useState } from "react";

function Dashboard({ cart, groups, setGroups }) {
  const navigate = useNavigate();
  const cartTotal = cart.reduce((t, i) => t + (i.price * i.qty), 0);

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState([]);

  const addMember = () => {
    if (memberInput.trim() !== "") {
      setMembers([...members, memberInput.trim()]);
      setMemberInput("");
    }
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

    // 3. This now updates the state in App.jsx 👈
    setGroups([...groups, newGroup]);
    setShowGroupModal(false);
    navigate("/groups");
  };


  const canteens = [
    { id: "main", name: "Main Canteen", desc: "Home-style Thalis, Dosa & Meals", path: "/main-canteen", color: "from-orange-500 to-red-500", icon: <Utensils size={32} />, rating: "4.2", time: "10-15 min" },
    { id: "hangout", name: "Hangout Cafe", desc: "Burgers, Pizza & Chinese Snacks", path: "/hangout-cafe", color: "from-amber-400 to-orange-500", icon: <Coffee size={32} />, rating: "4.5", time: "5-10 min" }
  ];

  return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6 font-sans">
        <div className="max-w-6xl mx-auto">

          {/* --- WELCOME & CART STATUS --- */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">What's for Lunch? <span className="text-orange-500">😋</span></h1>
              <p className="text-slate-500 font-medium mt-1">Select a canteen or start a group order</p>
            </div>
            {cart.length > 0 && (
                <div className="bg-white border-2 border-orange-100 p-4 rounded-3xl flex items-center gap-4 shadow-sm animate-in fade-in slide-in-from-right-4">
                  <div className="bg-orange-500 text-white p-2 rounded-xl"><ShoppingBag size={20} /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Current Order</p>
                    <p className="text-lg font-black text-slate-800">₹{cartTotal}</p>
                  </div>
                </div>
            )}
          </div>

          {/* --- GROUP HUB BANNER --- */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-md">
                  <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    <Zap size={14} fill="currentColor" /> Shared Cart
                  </div>
                  <h2 className="text-3xl font-black mb-2 text-white">Order with Friends! 🍕</h2>
                  <p className="text-indigo-100 font-medium">Create a group, add items together, and split the bill instantly.</p>
                </div>

                {/* --- BUTTON GROUP --- */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                      onClick={() => navigate("/groups")} // 👈 DIRECT LINK TO LIST
                      className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Users2 size={20} /> View My Squads
                  </button>

                  <button
                      onClick={() => setShowGroupModal(true)}
                      className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Plus size={20} strokeWidth={3} /> Create New Group
                  </button>
                </div>
              </div>
              <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </div>
          </div>

          {/* --- GROUP CREATION MODAL --- */}
          {showGroupModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowGroupModal(false)} />
                <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                  <button onClick={() => setShowGroupModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>

                  <div className="text-center mb-8">
                    <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"><Users2 size={32} /></div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Setup Your Squad</h3>
                    <p className="text-slate-400 text-sm font-medium">Split bills and share meals in real-time</p>
                  </div>

                  <div className="space-y-5">
                    {/* Input: Group Name */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Group Name</label>
                      <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="e.g. Hostellers 🏠" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 mt-1 font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                    </div>

                    {/* Input: Add Members */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Add Friends</label>
                      <div className="flex gap-2 mt-1">
                        <input type="text" value={memberInput} onChange={(e) => setMemberInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addMember()} placeholder="Enter friend's name..." className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none" />
                        <button onClick={addMember} className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-90"><UserPlus size={20} /></button>
                      </div>
                    </div>

                    {/* Display: Member List */}
                    {members.length > 0 && (
                        <div className="max-h-40 overflow-y-auto pr-2 space-y-2 py-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2">Members to invite ({members.length})</p>
                          {members.map((m, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-indigo-50 px-4 py-3 rounded-xl border border-indigo-100 animate-in slide-in-from-left-2">
                                <div className="flex items-center gap-3">
                                  <div className="bg-white p-1 rounded-full text-indigo-600"><Check size={14} strokeWidth={3} /></div>
                                  <span className="font-bold text-indigo-900 text-sm">{m}</span>
                                </div>
                                <button onClick={() => removeMember(idx)} className="text-indigo-300 hover:text-red-500 transition-colors"><X size={16} /></button>
                              </div>
                          ))}
                        </div>
                    )}

                    <button onClick={handleCreateGroup} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all mt-4 active:scale-95">
                      Confirm Group & Start Order
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* --- CANTEEN SELECTOR --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {canteens.map((canteen) => (
                <div key={canteen.id} onClick={() => navigate(canteen.path)} className="group relative bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 cursor-pointer overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl active:scale-95 border border-white">
                  <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${canteen.color} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700`} />
                  <div className="relative z-10">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${canteen.color} text-white mb-6 shadow-lg shadow-orange-200`}>{canteen.icon}</div>
                    <h2 className="text-3xl font-black text-slate-800 mb-2">{canteen.name}</h2>
                    <p className="text-slate-500 font-medium mb-6 max-w-[250px] leading-relaxed">{canteen.desc}</p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1.5 text-slate-700 font-bold bg-slate-100 px-3 py-1.5 rounded-xl text-sm"><Star size={16} className="text-orange-500" fill="currentColor" /> {canteen.rating}</div>
                      <div className="text-slate-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2"><Zap size={16} className="text-amber-500" /> {canteen.time}</div>
                    </div>
                    <div className="mt-8 flex items-center gap-2 font-black text-orange-500 group-hover:gap-4 transition-all uppercase tracking-widest text-xs">Browse Menu <ArrowRight size={18} /></div>
                  </div>
                </div>
            ))}
          </div>

          {/* --- PROMO SECTION --- */}
          <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-300">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-3xl font-black mb-2">Thali of the Day 🥘</h3>
                <p className="text-slate-400 text-lg font-medium">Every Friday: Special Paneer Thali @ ₹75</p>
                <button onClick={() => navigate("/main-canteen/thali")} className="mt-6 bg-orange-500 hover:bg-white hover:text-orange-500 text-white font-black px-8 py-3 rounded-2xl transition-all shadow-lg active:scale-95">View Weekly Menu</button>
              </div>
              <div className="hidden lg:block text-9xl opacity-10 rotate-12">🍛</div>
            </div>
          </div>

        </div>
      </div>
  );
}

export default Dashboard;