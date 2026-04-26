import logo from "../../../backend/static/images/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const savedData = localStorage.getItem("user");
            // Check if data exists and is not the literal string "undefined"
            if (savedData && savedData !== "undefined") {
                const parsedUser = JSON.parse(savedData);
                setUser(parsedUser);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
            setUser(null);
        }
    }, [location]); // Triggered every time the route changes

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        setUser(null);
        navigate("/login");
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-[100]">
            {/* Top Gradient Accent Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-red-500 to-indigo-600"></div>

            {/* Main Header Bar */}
            <div className="w-full bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto h-20 flex justify-between items-center px-6 lg:px-10">

                    {/* Logo Section */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate("/")}
                    >
                        <div className="bg-slate-900 p-2 rounded-xl group-hover:bg-orange-500 transition-all duration-300">
                            <img src={logo} alt="Logo" className="h-6 w-6 object-contain brightness-0 invert" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-slate-900">
                            Campus<span className="text-orange-500">Crave</span>
                        </h1>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex flex-col items-end border-r border-slate-200 pr-4">
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter leading-none mb-1">Hello,</span>
                                    <span className="text-sm font-black text-slate-800">{user.name}</span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="group flex items-center justify-center h-11 w-11 bg-slate-100 hover:bg-red-500 text-slate-600 hover:text-white rounded-xl transition-all active:scale-95 shadow-sm"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg active:scale-95"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;