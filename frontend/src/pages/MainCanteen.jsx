import { useState } from "react";

const menuData = {
    Breakfast: [
        { name: "Poha", price: 20, desc: "Fresh and light breakfast" },
        { name: "Idli", price: 30, desc: "Soft idli with chutney" },
        { name: "Upma", price: 25, desc: "South Indian breakfast dish" },
        { name: "Dosa", price: 50, desc: "Crispy dosa with chutney & sambar" },
        { name: "Uttapam", price: 55, desc: "Thick dosa with vegetables" },
        { name: "Misal Pav", price: 60, desc: "Spicy Maharashtrian curry with pav" },
        { name: "Pav Bhaji", price: 70, desc: "Mashed vegetables with butter pav" },
        { name: "Aloo Paratha", price: 50, desc: "Stuffed paratha with butter" },
        { name: "Bhurji Pav", price: 60, desc: "Egg bhurji with pav" },
        { name: "Bread Omelet", price: 50, desc: "Bread with fluffy omelet" },
        { name: "Sabudana Khichdi", price: 45, desc: "Popular fasting dish" }
    ],


Snacks: [
    { name: "Vada Pav", price: 20, desc: "Mumbai style street food" },
    { name: "Samosa", price: 15, desc: "Crispy potato samosa" },
    { name: "French Fries", price: 60, desc: "Classic salted fries" },
    { name: "Maggie", price: 50, desc: "Hot instant noodles" },
    { name: "Peri Peri Fries", price: 70, desc: "Fries with spicy peri peri seasoning" },
    { name: "Cheese Fries", price: 80, desc: "Fries topped with melted cheese" }
],

Thali: [
    { name: "Mini Thali", price: 80, desc: "Rice, dal, roti, sabji" },
    { name: "Full Thali", price: 120, desc: "Complete meal with sweets" },
    { name: "Dal Rice", price: 70, desc: "Simple comfort food" },
    { name: "Chole Bhature", price: 90, desc: "Punjabi style chole with bhature" },
    { name: "Shev Bhaji", price: 80, desc: "Spicy curry topped with sev" }
],

Drinks: [
    { name: "Tea", price: 10, desc: "Hot cutting chai" },
    { name: "Special Tea", price: 15, desc: "Strong flavored special tea" },
    { name: "Hot Coffee", price: 20, desc: "Fresh brewed coffee" },
    { name: "Cold Coffee", price: 40, desc: "Chilled creamy coffee" }
]


};

function MainCanteen({ addToCart }) {


const [activeCategory, setActiveCategory] = useState("Breakfast");

return (
    <div className="p-8 bg-gray-100 min-h-screen">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6">
            Main Canteen ⭐ 4.2 | 10 mins
        </h1>

        {/* Category Buttons */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
            {Object.keys(menuData).map((category) => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2 rounded-full font-medium ${
        activeCategory === category
            ? "bg-yellow-400 text-black"
            : "bg-white shadow"
    }`}
                >
                    {category}
                </button>
            ))}
        </div>

        {/* Food Items */}
        <div className="grid md:grid-cols-2 gap-6">

            {menuData[activeCategory].map((item, index) => (
                <div
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
                >

                    <h2 className="text-xl font-semibold">
                        {item.name}
                    </h2>

                    <p className="text-gray-500 text-sm mb-3">
                        {item.desc}
                    </p>

                    <div className="flex justify-between items-center">

                        <span className="font-bold text-lg">
                            ₹{item.price}
                        </span>

                        <button
                            onClick={() => addToCart(item)}
                            className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600"
                        >
                            + Add
                        </button>

                    </div>

                </div>
            ))}

        </div>
    </div>
);


}

export default MainCanteen;
