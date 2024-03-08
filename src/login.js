import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './login.module.css';
import logo from './images/logo.jpg';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevents the default form submit action
    
        try {
            const response = await fetch('http://localhost:5104/User/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            if (!response.ok) {
                // It's a good idea to provide a more specific message based on the response status
                const message = response.status === 401 ? 'Грешен имейл или парола.' : 'Няма връзка към сървъра.';
                throw new Error(message);
            }
    
            const { token } = await response.json();
            localStorage.setItem('userToken', token); // Save the token in localStorage
    
            // Redirect or update UI upon successful login
            navigate("/");
            console.log('Login successful:', token);
            // Here's how you might redirect to a dashboard page using React Router
            // this.props.history.push('/dashboard');
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    return (
        <div className={styles.login}>
            <div className={styles.image}>
                <img src={logo} />
            </div>
            <div className={styles.loginRegister}>
                <a>Вход -- Регистрация</a>

                <div className={styles.loginPanel}>
                <form onSubmit={handleLogin}>
                    <div className={styles.email}>
                        <label>Имейл: </label>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={styles.password}>
                        <label>Парола: </label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit">Вход</button>
                    {error && <p>{error}</p>}
                </form>
            </div>
            </div>
            
        </div>
    );
}

export default Login;