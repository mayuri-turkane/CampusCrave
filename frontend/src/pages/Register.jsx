import {useState} from "react";
import {useNavigate, Link} from "react-router-dom";

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
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });
            const data = await res.json();
            if (res.ok) {
                navigate("/login");
            } else {
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            console.error("Error during registration:", err);
            setError("Server is not responding.");
        }
    };

    return (
       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 px-4">
            <div className="flex w-full max-w-[950px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white">
                <div className="w-1/2 bg-orange-500 text-white p-16 hidden lg:flex flex-col justify-center relative overflow-hidden">
                    <h1 className="text-5xl font-black mb-6 leading-tight">Join the <br/> Community.</h1>
                    <p className="text-orange-100 text-lg">Order your favorite canteen food easily and skip the queue.</p>
                </div>
                <div className="w-full lg:w-1/2 p-12 lg:p-16">
                    <h2 className="text-3xl font-black text-gray-800 mb-8">Create Account</h2>
                    {error && <p className="text-red-500 bg-red-50 p-3 rounded-xl text-sm mb-4 font-bold">{error}</p>}
                    <form onSubmit={handleRegister} className="space-y-4">
                        <input name="name" type="text" placeholder="Full Name" className="w-full p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-orange-400" onChange={handleChange} required />
                        <input name="email" type="email" placeholder="Email Address" className="w-full p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-orange-400" onChange={handleChange} required />
                        <input name="password" type="password" placeholder="Password" className="w-full p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-orange-400" onChange={handleChange} required />
                        <input name="confirmPassword" type="password" placeholder="Confirm Password" className="w-full p-4 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-orange-400" onChange={handleChange} required />
                        <button type="submit" className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100">Register</button>
                    </form>
                    <p className="mt-8 text-gray-500 font-medium">Already a member? <Link to="/login" className="text-orange-500 font-black">Login</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;
