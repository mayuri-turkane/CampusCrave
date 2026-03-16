import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Header from "./layout/Header";
import Footer from "./layout/Footer";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import MainCanteen from "./pages/MainCanteen";
import ThaliMenu from "./pages/ThaliMenu";
import HangoutCafe from "./pages/HangoutCafe.jsx";

   Route
const ProtectedRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");


if (!isLoggedIn) {
    return <Navigate to="/login" />;
}

return children;


};

function App() {


// 🛒 Cart State
const [cart, setCart] = useState([]);

// ➕ Add Item to Cart
const addToCart = (item) => {
    setCart([...cart, item]);
};

return (
    <BrowserRouter>
        <Routes>

            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Thali Menu */}
            <Route
                path="/main-canteen/thali"
                element={
                    <ProtectedRoute>
                        <Header />
                        <ThaliMenu addToCart={addToCart} />
                        <Footer />
                    </ProtectedRoute>
                }
            />

            {/* Main Canteen */}
            <Route
                path="/main-canteen"
                element={
                    <ProtectedRoute>
                        <Header />
                        <MainCanteen addToCart={addToCart} />
                        <Footer />
                    </ProtectedRoute>
                }
            />

            {/* Hangout Cafe */}
            <Route
                path="/hangout-cafe"
                element={
                    <ProtectedRoute>
                        <Header />
                        <HangoutCafe addToCart={addToCart} />
                        <Footer />
                    </ProtectedRoute>
                }
            />

            {/* Menu */}
            <Route
                path="/menu"
                element={
                    <ProtectedRoute>
                        <Header />
                        <Menu />
                        <Footer />
                    </ProtectedRoute>
                }
            />

            {/* Dashboard */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Header />
                        <Dashboard cart={cart} />
                        <Footer />
                    </ProtectedRoute>
                }
            />

        </Routes>
    </BrowserRouter>
);


}

export default App;
