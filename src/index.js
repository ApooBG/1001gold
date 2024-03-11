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
    const auth = isAuthenticated();
    return auth ? children : <Navigate to="/login" replace />;
}

// This component ensures non-authenticated users can only access the login page
function PublicRoute({ children }) {
    const auth = isAuthenticated();
    return auth ? <Navigate to="/" replace /> : children;
}

function App() {
    const [user, setUser] = useState(null);
    const [userid, setUserid] = useState(0);
    const [userRole, setUserRole] = useState(0);
    
    useEffect(() => {
        const userData = getUserDataFromToken();

        const fetchUserRoleById = async (id) => {
            try {
                const response = await fetch(`http://localhost:5104/User/GetUserRoleById?id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('userToken')}`, // Assuming you store the token in localStorage
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user role');
                }

                const role = await response.json();
                setUserRole(role); // Update the state with the fetched role
            } catch (error) {
                console.error('Failed to fetch user role:', error);
            }
        };

        const fetchUserIdByEmail = async (userData) => {
            try {
                const response = await fetch(`http://localhost:5104/User/GetUserIdByEmail?email=${encodeURIComponent(userData.email)}`, {
                    method: 'GET', // Assuming it's a GET request, update if it's otherwise
                    headers: {
                        'Content-Type': 'application/json',
                        // Include Authorization header if this endpoint requires authentication
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const id = await response.json();
                setUserid(id); // You already have this line
                fetchUserRoleById(id); // Fetch the user role after fetching the user ID
            }catch (error) {
                console.error('Failed to fetch userID:', error);
            } 
        };

        if (userData) {
            setUser(userData);
            fetchUserIdByEmail(userData);
        }

    }, []);


    if (userRole == 1)
    {
        return (
            <BrowserRouter>
            <div>
                <Routes>
                    <Route index element={<PrivateRoute><MainPage userid={userid} isAdmin={true} /></PrivateRoute>} />
                    <Route path="/product/:productId" element={<PrivateRoute><Product userid={userid}/></PrivateRoute>} />
                    <Route path="/cart" element={<PrivateRoute><Cart userID={userid} /></PrivateRoute>} />
                    <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
                    {/* Use PublicRoute for the login page */}
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/order/:orderID" element={<PrivateRoute><Order userID={userid} /></PrivateRoute>} />
                    <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
                    {/* Redirect users trying to access "/login" if they are already authenticated */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </BrowserRouter>
        );
    }

    else {

        return (
            <BrowserRouter>
            <div>
                <Routes>
                    <Route index element={<PrivateRoute><MainPage userid={userid} isAdmin={false} /></PrivateRoute>} />
                    <Route path="/product/:productId" element={<PrivateRoute><Product userid={userid} /></PrivateRoute>} />
                    <Route path="/cart" element={<PrivateRoute><Cart userID={userid} /></PrivateRoute>} />
                    {/* Use PublicRoute for the login page */}
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/order/:orderID" element={<PrivateRoute><Order userID={userid} /></PrivateRoute>} />
                    <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
                    {/* Redirect users trying to access "/login" if they are already authenticated */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </BrowserRouter>
        );
    }
    
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
