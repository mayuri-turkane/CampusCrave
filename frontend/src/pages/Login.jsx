import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import loginImage from "../assets/images/login_img.jpg";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        const storedUser = JSON.parse(localStorage.getItem("user"));

        // If no user registered
        if (!storedUser) {
            alert("No user found. Please register first.");
            return;
        }

        // Check credentials
        if (
            storedUser.email === email &&
            storedUser.password === password
        ) {
            alert("Login Successful ✅");

            // Save login status (optional but useful later)
            localStorage.setItem("isLoggedIn", true);

            // Redirect to Home
            navigate("/");
        } else {
            alert("Invalid Credentials ❌");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">

            {/* Main Card */}
            <div className="flex w-[900px] bg-white rounded-3xl shadow-2xl overflow-hidden">

                {/* Left Side - Form */}
                <div className="w-1/2 p-12 flex flex-col justify-center">

                    <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>

                    <p className="text-gray-500 mb-8">
                        Login to continue ordering delicious food 🍔
                    </p>

                    <form onSubmit={handleLogin} className="space-y-5">

                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full p-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-xl hover:bg-yellow-500 transition duration-300"
                        >
                            Sign In
                        </button>

                    </form>

                    <p className="text-sm text-gray-500 mt-6">
                        Don’t have an account?{" "}
                        <Link
                            to="/register"
                            className="text-yellow-500 font-semibold"
                        >
                            Create one
                        </Link>
                    </p>

                </div>

                {/* Right Side - Image */}
                <div className="w-1/2 hidden md:block relative">

                    <img
                        src={loginImage}
                        alt="Login Visual"
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/20"></div>

                </div>

            </div>
        </div>
    );
}

export default Login;