import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {useState} from "react";

import Header from "./layout/Header";
import Footer from "./layout/Footer";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import MainCanteen from "./pages/MainCanteen";
import ThaliMenu from "./pages/ThaliMenu";
import HangoutCafe from "./pages/HangoutCafe.jsx";
import CartPage from "./pages/CartPage.jsx";
import GroupsHub from "./pages/GroupsHub.jsx";

const ProtectedRoute = ({children}) => {
    // Check for user object instead of just a boolean
    const user = localStorage.getItem("user");
    if (!user) {
        return <Navigate to="/login" replace/>;
    }
    return children;
};

function App() {

    const [groups, setGroups] = useState([
        {id: 1, name: "Sample Squad 🍕", members: ["You", "Rahul"], totalSpent: 0, status: "Active", lastOrder: "None"}
    ]);

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
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>

                {/* Thali Menu */}
                <Route
                    path="/main-canteen/thali"
                    element={
                        <ProtectedRoute>
                            <Header/>
                            <ThaliMenu cart={cart} setCart={setCart}/>
                            <Footer/>
                        </ProtectedRoute>
                    }
                />

                {/* Main Canteen */}
                <Route
                    path="/main-canteen"
                    element={
                        <ProtectedRoute>
                            <Header/>
                            <MainCanteen cart={cart} setCart={setCart}/>
                            <Footer/>
                        </ProtectedRoute>
                    }
                />

                {/* Hangout Cafe */}
                <Route
                    path="/hangout-cafe"
                    element={
                        <ProtectedRoute>
                            <Header/>
                            <HangoutCafe cart={cart} setCart={setCart}/>
                            <Footer/>
                        </ProtectedRoute>
                    }
                />

                {/* Menu */}
                <Route
                    path="/menu"
                    element={
                        <ProtectedRoute>
                            <Header/>
                            <Menu/>
                            <Footer/>
                        </ProtectedRoute>
                    }
                />

                {/* Dashboard */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Header/>
                            {<Dashboard cart={cart} groups={groups} setGroups={setGroups}/>}
                            <Footer/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Header/>
                            <CartPage cart={cart} setCart={setCart} groups={groups}/>
                            <Footer/>
                        </ProtectedRoute>
                    }
                />

                {/* App.jsx - Find the /groups route and update it to this: */}
                <Route
                    path="/groups"
                    element={
                        <ProtectedRoute>
                            <Header/>
                            <GroupsHub groups={groups} setGroups={setGroups}/>
                            <Footer/>
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );


}

export default App;
