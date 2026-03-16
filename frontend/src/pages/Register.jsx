import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        localStorage.setItem("user", JSON.stringify(formData));
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-amber-100 to-orange-200 px-4">

            <div className="flex w-[950px] bg-white rounded-3xl shadow-2xl overflow-hidden">

                {/* Left Side Branding */}
                <div className="w-1/2 bg-gradient-to-br from-orange-400 to-amber-500 text-white p-12 flex flex-col justify-center">

                    <h1 className="text-4xl font-extrabold mb-6">
                        Join CampusCrave 🍽️
                    </h1>

                    <p className="text-lg leading-relaxed">
                        Order your favorite canteen food easily,
                        skip the queue, and enjoy faster service.
                    </p>

                    <div className="mt-10 space-y-3 text-sm opacity-90">
                        <p>✔ Fast Ordering</p>
                        <p>✔ Multiple Canteens</p>
                        <p>✔ Easy Payments</p>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="w-1/2 p-12 flex flex-col justify-center">

                    <h2 className="text-2xl font-bold mb-6">
                        Create Account
                    </h2>

                    {error && (
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">

                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            className="w-full p-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            className="w-full p-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full p-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="w-full p-3 rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
                        >
                            Register
                        </button>
                    </form>

                    <p className="text-sm text-gray-500 mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-orange-500 font-semibold">
                            Login
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Register;
