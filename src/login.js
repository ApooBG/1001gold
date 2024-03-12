import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './login.module.css';
import { API_BASE_URL } from './config';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [formView, setFormView] = useState('login'); // 'login' or 'register'
    const [regStep, setRegStep] = useState(1); // 1, 2, or 3 for registration steps
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    street: '',
    phoneNumber: '',
    postalCode: '',
    deliveryType: 'Speedy', // Default selected value
    deliveryAddress: '',
    });
    const [isRight, setIsRight] = useState(false);

    const toggleSwitcher = () => {
      setIsRight(!isRight); // Toggle the state
      console.log(isRight);
    };

        const handleLogin = async (e) => {
            e.preventDefault(); // Prevents the default form submit action
        
            try {
                const response = await fetch(`${API_BASE_URL}/User/Login`, {
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
                    <img src={`${process.env.PUBLIC_URL}/images/logo.jpg`} />
                </div>
                <div className={styles.loginRegister}>
                    <div className={styles.labels}>
                        <a>Вход</a>
                        <div onClick={() => setFormView(formView === 'login' ? 'register' : 'login')}>
                            <a>
                            <div className={styles.switcherBack} onClick={toggleSwitcher}>
                                <div className={`${styles.switcher} ${isRight ? styles.switcherRight : ''}`}></div>
                            </div>
                            </a>
                        </div> 
                        <a>Регистрация</a>
                    </div>
    
                    {formView === 'login' ? (
                    <div className={styles.loginPanel}>
                    <form onSubmit={handleLogin}>
                        <div className={styles.email}>
                            <input placeholder="Имейл..." type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className={styles.password}>
                            <input placeholder="Парола..." type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit">Вход</button>
                        {error && <p>{error}</p>}
                    </form>
                </div>) : (
                    <RegistrationForm />
                )}
                </div>
                
            </div>
        );
    
}


function RegistrationForm() {
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState("");
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        city: '',
        street: '',
        phoneNumber: '',
        postalCode: '',
        deliveryType: 'Speedy', // assuming 'Speedy' is a valid option
        deliveryAddress: '',
    });
    const navigate = useNavigate();
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleNextStep = async (e) => {
        e.preventDefault();
        setMessage("");
        if (step < 3) {
            if (step == 1)
            {
                if (userData.name.length < 3)
                {
                    setMessage("Невалидно име.");
                    return;
                }

                if (userData.password.length < 6)
                {
                    setMessage("Невалидна парола.");
                    return;
                }

                if (userData.email.length < 6)
                {
                    setMessage("Невалиден имейл адрес");
                    return;
                }

                if (!emailRegex.test(userData.email)) {
                    setMessage("Невалиден имейл адрес");
                    return;
                }
        
                // Check email availability
                try {
                    const response = await fetch(`${API_BASE_URL}/User/CheckEmailAvilability`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData.email),
                    });
        
                    const isEmailAvailable = await response.json();
        
                    if (!isEmailAvailable) {
                        setMessage("Имейлът вече съществува.");
                        return;
                    }
        
                    // If the email is available, continue to the next step
                    setStep(step + 1);
        
                } catch (error) {
                    console.error('There was an error checking the email availability:', error);
                    setMessage("Възникна грешка при връзката със сървъра. Моля, опитайте по-късно!");
                }
                return;
            }            

            if (step == 2)
            {
                if (userData.phoneNumber.length < 7)
                {
                    setMessage("Моля попълнете телефонния си номер.");
                    return;
                }
            }
            setMessage("");
            setStep(step + 1);
        } else {
            // Proceed to submission
            submitRegistration();
        }
    };

    const handlePrevStep = (e) => {
        e.preventDefault();
        setMessage("");

        if (step > 1) {
            setStep(step - 1);
        }
    };

    const submitRegistration = async () => {
        // Here, you will handle the form submission to your API endpoint
        try {
            const response = await fetch(`${API_BASE_URL}/User/Register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('There was an error with the registration.');
            }
            // Handle response data
            const data = await response.json();
            console.log(data);
            navigate("/");
        } catch (error) {
            console.error(error);
            // Handle error feedback
        }
    };

    return (
        <div className={styles.RegisterPanel}>
            <form>
            {step === 1 && (
                // Step 1: Name, Email, Password
                <div className={styles.RegisterForm}>
                    <div><input
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        placeholder="Име"
                    /></div>
                    <div><input
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        placeholder="Имейл"
                        type="email"
                    /></div>
                    <div><input
                        name="password"
                        value={userData.password}
                        onChange={handleInputChange}
                        placeholder="Парола"
                        type="password"
                    /></div>
                <div><button onClick={(e) => handleNextStep(e)}>Напред</button></div>
                </div>
            )}

            {step === 2 && (
                // Step 2: City, Street, PostalCode, PhoneNumber
                <div className={styles.RegisterForm}>
                    <div><input
                        name="city"
                        value={userData.city}
                        onChange={handleInputChange}
                        placeholder="Град"
                    /></div>
                    <div><input
                        name="street"
                        value={userData.street}
                        onChange={handleInputChange}
                        placeholder="Улица"
                    /></div>
                    <div><input
                        name="phoneNumber"
                        value={userData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Телефоннен Номер"
                        type="tel"
                    /></div>
                    <div><input
                        name="postalCode"
                        value={userData.postalCode}
                        onChange={handleInputChange}
                        placeholder="Пощенски Код"
                    /></div>
                    <div><button onClick={(e) => handlePrevStep(e)}>Назад</button>
                    <button onClick={(e) => handleNextStep(e)}>Напред</button></div>
                </div>
            )}

            {step === 3 && (
                // Step 3: DeliveryType, DeliveryAddress
                <div className={styles.RegisterForm}>
                    <div><select
                        name="deliveryType"
                        value={userData.deliveryType}
                        onChange={handleInputChange}
                    >
                        <option value="Спийди">Спийди</option>
                        <option value="Еконт">Еконт</option>
                        <option value="До адрес">До адрес</option>
                    </select></div>
                    <div><input
                        name="deliveryAddress"
                        value={userData.deliveryAddress}
                        onChange={handleInputChange}
                        placeholder="Точен Адрес"
                    /></div>
                    <div><button onClick={(e) => handlePrevStep(e)}>Назад</button>
                    <button style={{marginLeft: "2vw"}} onClick={submitRegistration}>Регистрация</button></div>
                </div>
            )}
            <div style={{paddingTop:"1vw"}}>{message}</div>
            </form>
        </div>
    );
}

export default Login;