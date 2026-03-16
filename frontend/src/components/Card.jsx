function Card({ title, image, onClick }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-64
                    transform hover:scale-105 transition duration-300">

            <img
                src={image}
                alt={title}
                className="w-full h-40 object-cover"
            />

            <div className="p-4 text-center">
                <h2 className="text-xl font-semibold text-gray-800">
                    {title}
                </h2>

                <button
                    onClick={onClick}
                    className="mt-4 bg-amber-500 text-white px-4 py-2
                     rounded-lg hover:bg-amber-600 transition duration-300"
                >
                    Order Now 🍽️
                </button>
            </div>
        </div>
    );
}

export default Card;
