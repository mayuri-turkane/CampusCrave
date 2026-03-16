import { useState } from "react";

function ThaliMenu() {

    const thaliPrice = 75;   // 👈 Added price

    const weeklyMenu = {
        Monday: [
            "Bhindi Do Pyaja",
            "Rajma Masala",
            "Jeera Rice",
            "Mix Daal",
            "Chapati",
            "Salad",
            "Pickle"
        ],
        Tuesday: [
            "Aaloo Methi Dry",
            "Mix Kathor",
            "Plain Rice",
            "Daal Fry",
            "Chapati",
            "Curd"
        ],
        Wednesday: [
            "Sev Bhaji",
            "Rajma Masala",
            "Plain Rice",
            "Punjabi Kadhi",
            "Chapati"
        ],
        Thursday: [
            "Corn Capsicum",
            "Matki Masala",
            "Plain Rice",
            "Lehsuniya Daal",
            "Chapati"
        ],
        Friday: [
            "Soyabean Keema",
            "Malka Masala",
            "Jeera Rice",
            "Curd",
            "Roti"
        ],
        Saturday: [
            "Flour Matar Dry",
            "Matki Masala",
            "Plain Rice",
            "Daal Fry"
        ],
        Sunday: [
            "Veg Kofta",
            "Aloo Shimla",
            "Waran",
            "Plain Rice",
            "Roti"
        ]
    };

    const days = Object.keys(weeklyMenu);
    const [selectedDay, setSelectedDay] = useState(days[0]);

    return (
        <div className="min-h-screen pt-28 px-10 bg-amber-50">

            <h2 className="text-3xl font-bold text-center mb-2">
                Weekly Thali Menu 🍛
            </h2>

            {/* 💰 Price Section */}
            <p className="text-center text-xl font-semibold text-amber-600 mb-8">
                Price: ₹{thaliPrice} per plate
            </p>

            {/* Day Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
                {days.map((day) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-5 py-2 rounded-full font-semibold transition
              ${
                            selectedDay === day
                                ? "bg-amber-500 text-white"
                                : "bg-gray-200"
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Menu Items */}
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl mx-auto">
                <ul className="space-y-3">
                    {weeklyMenu[selectedDay].map((item, index) => (
                        <li key={index} className="border-b pb-2">
                            {item}
                        </li>
                    ))}
                </ul>

                {/* Order Button */}
                <button className="mt-8 w-full bg-amber-500 text-white py-3 rounded-xl hover:bg-amber-600 transition duration-300">
                    Order Full Thali 🍽️
                </button>
            </div>

        </div>
    );
}

export default ThaliMenu;
