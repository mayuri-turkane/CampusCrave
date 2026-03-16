import { useState } from "react";

const cafeMenu = {
    Breakfast: [
        { name: "Poha", price: 25, desc: "Light Maharashtrian breakfast" },
        { name: "Misal Pav", price: 55, desc: "Spicy curry served with pav" },
        { name: "Vada Pav", price: 15, desc: "Mumbai street food classic" },
        { name: "Samosa", price: 18, desc: "Crispy fried potato samosa" },
        { name: "Sabudana Khichdi", price: 45, desc: "Popular fasting dish" }
    ],


Beverages: [
    { name: "Tea", price: 12, desc: "Hot cutting chai" },
    { name: "Special Tea (Big Cup)", price: 30, desc: "Strong special tea" },
    { name: "Hot Coffee", price: 30, desc: "Fresh brewed coffee" },
    { name: "Cold Coffee", price: 45, desc: "Chilled creamy coffee" }
],

Snacks: [
    { name: "French Fries", price: 60, desc: "Crispy potato fries" },
    { name: "Peri Peri Fries", price: 70, desc: "Fries with spicy peri peri seasoning" },
    { name: "Cheese Fries", price: 80, desc: "Fries topped with melted cheese" },
    { name: "Egg Bhurji", price: 65, desc: "Spicy scrambled eggs" },
    { name: "Egg Omelette", price: 65, desc: "Classic egg omelette" },
    { name: "Samosa Chaat", price: 40, desc: "Samosa topped with chutneys" }
],

Chinese: [
    { name: "Veg Fried Rice", price: 70, desc: "Vegetable fried rice" },
    { name: "Veg Schezwan Rice", price: 80, desc: "Spicy schezwan rice" },
    { name: "Chicken Fried Rice", price: 100, desc: "Chicken fried rice" },
    { name: "Chicken Schezwan Rice", price: 110, desc: "Spicy chicken schezwan rice" },
    { name: "Hakka Noodles", price: 70, desc: "Classic hakka noodles" },
    { name: "Schezwan Hakka Noodles", price: 80, desc: "Spicy noodles" },
    { name: "Chicken Hakka Noodles", price: 100, desc: "Chicken noodles" },
    { name: "Veg Steamed Momos", price: 70, desc: "Steamed veg dumplings" },
    { name: "Veg Fried Momos", price: 80, desc: "Fried veg momos" },
    { name: "Chicken Steamed Momos", price: 80, desc: "Steamed chicken dumplings" },
    { name: "Chicken Fried Momos", price: 100, desc: "Fried chicken momos" }
],

FastFood: [
    { name: "Veg Grilled Sandwich", price: 60, desc: "Grilled vegetable sandwich" },
    { name: "Veg Cheese Grilled Sandwich", price: 85, desc: "Cheese grilled sandwich" },
    { name: "Bombay Grilled Sandwich", price: 60, desc: "Mumbai style sandwich" },
    { name: "Bombay Cheese Grilled Sandwich", price: 85, desc: "Bombay sandwich with cheese" },
    { name: "Corn Capsicum Sandwich", price: 60, desc: "Corn capsicum sandwich" },
    { name: "Corn Capsicum Cheese Sandwich", price: 85, desc: "Corn capsicum sandwich with cheese" },
    { name: "Chicken Sandwich", price: 80, desc: "Chicken sandwich" },
    { name: "Chicken Cheese Sandwich", price: 100, desc: "Chicken sandwich with cheese" },
    { name: "Veg Burger", price: 70, desc: "Veg burger" },
    { name: "Veg Cheese Burger", price: 95, desc: "Veg burger with cheese" },
    { name: "Chicken Burger", price: 90, desc: "Chicken burger" },
    { name: "Chicken Cheese Burger", price: 115, desc: "Chicken burger with cheese" },
    { name: "Cheese Garlic Toast", price: 75, desc: "Garlic toast with cheese" },
    { name: "Chilli Cheese Toast", price: 75, desc: "Spicy cheese toast" },
    { name: "Veg Pizza (11 inch)", price: 150, desc: "Veg pizza" },
    { name: "Chicken Pizza (11 inch)", price: 200, desc: "Chicken pizza" }
]


};

function HangoutCafe({ addToCart }) {


const [activeCategory, setActiveCategory] = useState("Breakfast");

return (
    <div className="p-8 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-6">
            Hangout Cafe ☕ ⭐ 4.4 | 8 mins
        </h1>

        <div className="flex gap-4 mb-8 overflow-x-auto">
            {Object.keys(cafeMenu).map((category) => (
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

        <div className="grid md:grid-cols-2 gap-6">
            {cafeMenu[activeCategory].map((item, index) => (
                <div
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
                >

                    <h2 className="text-xl font-semibold">{item.name}</h2>

                    <p className="text-gray-500 text-sm mb-3">{item.desc}</p>

                    <div className="flex justify-between items-center">

                        <span className="font-bold text-lg">₹{item.price}</span>

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

export default HangoutCafe;
