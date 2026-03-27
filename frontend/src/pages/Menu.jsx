import { useState } from "react";
import { canteens } from "../data/canteenData";

function Menu() {
    const [activeCanteen, setActiveCanteen] = useState(canteens[0]);

    return (
        <div className="min-h-screen pt-28 px-10 bg-gradient-to-br from-orange-50 to-amber-100">

            {/* Menu Bar */}
            <div className="flex justify-center mb-12">
                <div className="flex bg-white shadow-xl rounded-full p-2">

                    {canteens.map((canteen) => (
                        <button
                            key={canteen.id}
                            onClick={() => setActiveCanteen(canteen)}
                            className={`px-6 py-2 rounded-full font-semibold transition duration-300
              ${
                                activeCanteen.id === canteen.id
                                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            {canteen.name}
                        </button>
                    ))}

                </div>
            </div>

            {/* Menu Items */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                {activeCanteen.menu.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-3xl shadow-lg p-6 hover:scale-105 transition duration-300"
                    >
                        <h3 className="text-xl font-bold text-gray-800">
                            {item.item}
                        </h3>

                        <p className="mt-2 text-amber-600 font-semibold">
                            ₹ {item.price}
                        </p>

                        <button className="mt-4 w-full bg-amber-500 text-white py-2 rounded-xl hover:bg-amber-600 transition">
                            Order Now
                        </button>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default Menu;
