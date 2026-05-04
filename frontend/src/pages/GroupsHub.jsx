import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {
    ChevronLeft, Users2, ArrowRight, Clock, Plus, Zap,
    X, UserPlus, Pencil, Trash2
} from "lucide-react";

function GroupsHub({ groups, setGroups }) {
    const navigate = useNavigate();

    // --- MODAL & FORM STATE ---
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [editingGroupId, setEditingGroupId] = useState(null); // Tracks if we are editing
    const [groupName, setGroupName] = useState("");
    const [memberInput, setMemberInput] = useState("");
    const [members, setMembers] = useState([]);
    const [memberError, setMemberError] = useState("");
     const user = JSON.parse(localStorage.getItem("user"));

    // --- 1. FETCH GROUPS ON LOAD ---
    useEffect(() => {
        console.log("ffsdvsfgvrg")
        const fetchGroups = async () => {

            if (!user) return;

            try {
                const res = await fetch(`http://localhost:5000/groups/${user.id}`);
                const data = await res.json();
                console.log("API DATA:", data);
                // ✅ Re-insert "You" so the Cart logic stays happy
                const formatted = data.map(g => ({
                    ...g,
                    members: ["You", ...g.members],
                    status: "Active",
                    totalSpent: 0
                }));

                setGroups(formatted);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        fetchGroups();
    }, []);

    // --- LOGIC FUNCTIONS ---
    const addMember = () => {
        if (memberInput.trim() === "") {
            setMemberError("Please enter a name first! ✍️");
            return;
        }
        setMembers([...members, memberInput.trim()]);
        setMemberInput("");
        setMemberError("");
    };

    const removeMember = (index) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const openCreateModal = () => {
        setEditingGroupId(null);
        setGroupName("");
        setMembers([]);
        setShowGroupModal(true);
    };

    const openEditModal = (group) => {
        setEditingGroupId(group.id);
        setGroupName(group.name);
        // We filter "You" out because it's automatically added back in handleCreateGroup
        setMembers(group.members.filter(m => m !== "You"));
        setShowGroupModal(true);
    };

    const handleDeleteGroup = (id) => {
        if (window.confirm("Are you sure you want to disband this squad? 🥺")) {
            setGroups(prev => prev.filter(g => g.id !== id));
        }
    };

    const handleCreateGroup = async () => {
    if (!groupName.trim()) {
        alert("Please name your squad! ✍️");
        return;
    }

    // ✅ FIX: Only send the friends to the backend.
    // We don't send "You" because the backend already knows
    // who created the group via user_id.
    const friendList = members.map(m => m.trim());

    try {
        const response = await fetch("http://127.0.0.1:5000/create-group", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: groupName.trim(),
                user_id: user.id, // This links YOU to the group
                members: friendList // Just the friends
            })
        });

        if (response.ok) {
            const result = await response.json();

            // Update local state for the UI
            const newGroup = {
                id: result.group_id,
                name: groupName.trim(),
                members: friendList, // Store friends here
                totalSpent: 0,
                status: "Active"
            };

            setGroups(prevGroups => [newGroup, ...prevGroups]);

            // Reset
            setGroupName("");
            setMembers([]);
            setShowGroupModal(false);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-indigo-100">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-[100px] opacity-60" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-orange-50 rounded-full blur-[100px] opacity-60" />
            </div>

            <div className="max-w-6xl mx-auto px-6 pt-32 relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <button onClick={() => navigate("/")} className="group flex items-center gap-2 text-slate-400 mb-8 hover:text-indigo-600 font-black text-xs uppercase tracking-[0.2em] transition-all">
                        <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-indigo-50 transition-colors">
                            <ChevronLeft size={16} />
                        </div>
                        Back to Hub
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="animate-in slide-in-from-left duration-700">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="h-1.5 w-10 bg-indigo-600 rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Social Dining</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                                Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Squads.</span>
                            </h1>
                        </div>

                        <button
                            onClick={openCreateModal}
                            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center gap-3 animate-in zoom-in duration-500"
                        >
                            <Plus size={18} strokeWidth={4} /> New Group
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Groups</p>
                        <p className="text-3xl font-black text-slate-900">{groups.length}</p>
                    </div>
                    <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Members</p>
                        <p className="text-3xl font-black text-slate-900">
                            {groups.reduce((acc, g) => acc + g.members.length, 0)}
                        </p>
                    </div>
                    <div className="bg-indigo-600 p-6 rounded-[2rem] shadow-lg shadow-indigo-100 text-white">
                        <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1 text-center sm:text-left">Squad Savings</p>
                        <p className="text-3xl font-black text-center sm:text-left">₹{groups.reduce((acc, g) => acc + g.totalSpent, 0) * 0.1}</p>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {groups.map((group) => (
                        <div key={group.id} className="group relative bg-white rounded-[3rem] p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

                             {/* Actions overlay */}
                             <div className="absolute top-6 right-6 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button onClick={() => openEditModal(group)} className="p-2 bg-white/80 backdrop-blur shadow-sm rounded-xl text-slate-600 hover:text-indigo-600 transition-colors">
                                    <Pencil size={16} />
                                </button>
                                <button onClick={() => handleDeleteGroup(group.id)} className="p-2 bg-white/80 backdrop-blur shadow-sm rounded-xl text-slate-600 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                             </div>

                             <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-100">
                                        <Users2 size={24} />
                                    </div>
                                    <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600">
                                        ● {group.status}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 mb-2">{group.name}</h2>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {group.members.map((m, i) => (
                                        <span key={i} className="bg-slate-50 px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-600">{m}</span>
                                    ))}
                                </div>
                                <div className="mt-auto bg-slate-50 rounded-3xl p-6 flex items-center justify-between border border-slate-100">
                                    <p className="text-2xl font-black text-slate-900">₹{group.totalSpent}</p>
                                    <button className="bg-white text-slate-900 h-12 w-12 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                             </div>
                        </div>
                    ))}

                    <div
                        onClick={openCreateModal}
                        className="group border-4 border-dashed border-slate-200 rounded-[3rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all cursor-pointer"
                    >
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all">
                            <Plus size={32} strokeWidth={3} />
                        </div>
                        <p className="font-black text-slate-400 uppercase tracking-widest text-xs group-hover:text-indigo-600">Create New Squad</p>
                    </div>
                </div>

                {/* BOTTOM PROMO */}
                <div className="mt-20 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                            <Zap className="text-orange-500 fill-orange-500" /> Group Discounts
                        </h3>
                        <p className="text-slate-400 font-medium">Add more members to unlock better deals.</p>
                    </div>
                    <button onClick={openCreateModal} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all">
                        Start Your Squad
                    </button>
                </div>
            </div>

            {/* --- MODAL --- */}
            {showGroupModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowGroupModal(false)} />
                    <div className="relative bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-3xl animate-in zoom-in-95 overflow-hidden">
                        <button onClick={() => setShowGroupModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X size={28} /></button>

                        <div className="mb-10">
                            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner">
                                <Users2 size={32} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                                {editingGroupId ? "Update Squad" : "Start a Squad Order"}
                            </h3>
                            <p className="text-slate-400 font-medium">
                                {editingGroupId ? "Modify your squad details below." : "Add friends to start sharing your basket."}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 ml-1 mb-2 block">Group Title</label>
                                <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="e.g. Lunch Legends 🍟" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:border-indigo-500 transition-all outline-none" />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 ml-1 mb-2 block">Add Teammates</label>
                                <div className="flex gap-3">
                                    <input
                                        type="text" value={memberInput}
                                        onChange={(e) => { setMemberInput(e.target.value); if(memberError) setMemberError(""); }}
                                        onKeyPress={(e) => e.key === 'Enter' && addMember()}
                                        placeholder="Friend's name..."
                                        className={`flex-1 bg-slate-50 border-2 rounded-2xl px-6 py-4 font-bold transition-all outline-none ${memberError ? 'border-red-400' : 'border-slate-100 focus:border-indigo-500'}`}
                                    />
                                    <button onClick={addMember} className="bg-indigo-600 text-white px-5 rounded-2xl hover:bg-indigo-700 transition-all active:scale-90">
                                        <UserPlus size={22}/>
                                    </button>
                                </div>
                                {memberError && <p className="text-red-500 text-[11px] font-bold mt-2 ml-2 animate-bounce">{memberError}</p>}
                            </div>

                            {members.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                                        {members.map((m, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-white border-2 border-indigo-100 text-indigo-600 pl-4 pr-2 py-2 rounded-2xl shadow-sm">
                                                <span className="text-xs font-black tracking-tight">{m}</span>
                                                <button onClick={() => removeMember(idx)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:text-red-500"><X size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleCreateGroup}
                                disabled={!groupName.trim()}
                                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl
                                  ${groupName.trim()
                                    ? "bg-slate-900 text-white hover:bg-indigo-600 shadow-indigo-200"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                            >
                                {editingGroupId ? "Save Changes" : "Confirm & Create Squad"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GroupsHub;