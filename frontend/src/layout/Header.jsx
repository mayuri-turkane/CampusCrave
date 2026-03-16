import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Header() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <div className="w-full bg-white/70 backdrop-blur-lg shadow-md fixed top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    <img src={logo} alt="CampusCrave" className="h-12" />
                    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                        CampusCrave
                    </h1>
                </div>

                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:scale-105 transition duration-300"
                    >
                        Logout
                    </button>
                ) : (
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:scale-105 transition duration-300"
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    );
}

export default Header;
