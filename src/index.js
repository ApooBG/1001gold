import React, {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Header from './header.js';
import Product from './product.js';
import MainPage from './main.js';
import Cart from './cart.js';
import Login from './login.js';
import Admin from './adminDashboard.js';
import Order from './order.js';
import Chat from './chat.js';
import { getUserDataFromToken } from './authService';

// This function checks if the user is authenticated
function isAuthenticated() {
    const token = localStorage.getItem('userToken');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Check if token has expired
        return payload.exp > Date.now() / 1000;
    }
    return false;
}

// This component wraps around the protected route's element
function PrivateRoute({ children }) {
    return isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = getUserDataFromToken();
        if (userData) {
            setUser(userData.email);
        }
    }, []);
    //console.log(user);
    var userid=7
    return (
        <BrowserRouter>
            <div>
                <Routes>
                    <Route index element={<PrivateRoute><MainPage userid={userid}/></PrivateRoute>} />
                    <Route path="/product/:productId" element={<PrivateRoute><Product /></PrivateRoute>} />
                    <Route path="/cart" element={<PrivateRoute><Cart userID={userid} /></PrivateRoute>} />
                    <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/order/:orderID" element={<Order userID={userid} />} />
                    <Route path="/chat" element={<Chat />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
