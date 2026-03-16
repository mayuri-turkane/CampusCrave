import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import canteenImg from "../assets/images/canteen.jpg";
import bgFood from "../assets/images/bg_food.jpg";
import Card from "../components/Card";

function Dashboard({ cart }) {
    const canteenRef = useRef(null);
    const navigate = useNavigate();


const scrollToCanteens = () => {
    canteenRef.current?.scrollIntoView({ behavior: "smooth" });
};

const totalPrice = cart.reduce((total, item) => total + item.price, 0);

return (
    <div className="flex flex-col">

        {/* HERO SECTION */}
        <div
            className="relative w-full h-[90vh] bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${bgFood})` }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>

            <div className="relative z-10 text-center text-white px-6 max-w-3xl">
                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                    Campus Hunger? <br />
                    <span className="text-amber-400">We’ve Got You Covered 🍔</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-200 mb-8">
                    Discover your favorite campus canteens, order instantly,
                    and skip the queue.
                </p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={scrollToCanteens}
                        className="bg-amber-500 hover:bg-amber-600 px-8 py-3 rounded-full text-lg font-semibold shadow-xl transition duration-300"
                    >
                        Explore Now
                    </button>
                </div>
            </div>
        </div>

        {/* CANTEEN SECTION */}
        <div
            ref={canteenRef}
            className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-40 px-6 text-center"
        >
            <h2 className="text-4xl font-bold text-gray-800 mb-14">
                Explore Our Canteens 🍽️
            </h2>

            <div className="flex flex-col md:flex-row justify-center items-center gap-12">

                <Card
                    title="Main Campus Canteen"
                    image={canteenImg}
                    onClick={() => navigate("/main-canteen")}
                />

                <Card
                    title="The Hangout Cafe"
                    image={canteenImg}
                    onClick={() => navigate("/hangout-cafe")}
                />

            </div>
        </div>

        {/* CART SECTION */}
        <div className="bg-gray-100 py-16 px-6">
            <h2 className="text-3xl font-bold text-center mb-8">
                Your Cart 🛒
            </h2>

            {cart.length === 0 ? (
                <p className="text-center text-gray-500">
                    No items added yet
                </p>
            ) : (
                <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
                    {cart.map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between border-b py-2"
                        >
                            <span>{item.name}</span>
                            <span>₹{item.price}</span>
                        </div>
                    ))}

                    <div className="flex justify-between font-bold text-lg mt-4">
                        <span>Total</span>
                        <span>₹{totalPrice}</span>
                    </div>
                </div>
            )}
        </div>

    </div>
);


}

export default Dashboard;
