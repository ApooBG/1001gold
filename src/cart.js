import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import Header from './header.js';
import styles from './cart.module.css';
import earringsImage from './images/earrings.png';

function Address() {
    return(
        <div className={`${styles['flex-item']} ${styles['flex-item1']}`}>
            <div className={`${styles['adress']} ${styles['flex-details']}`}>
                <div className={styles.number}><a>1</a></div>
                <div className={styles.title}><a>Адрес на доставка</a></div>
                <div className={styles.details}><a> Руслан <br /> Ивайло №17 <br /> вх. 2 ет. 3 <br /> 0894864780</a></div>
                <div className={styles.edit}><a> промени</a></div>
            </div>
        </div>
    )
}

function Payment() {
    return(
        <div className={`${styles['flex-item']} ${styles['flex-item2']}`}>
            <div className={`${styles['payment']} ${styles['flex-details']}`}>
                <div className={styles.number}><a>2</a></div>
                <div className={styles.title}><a>Начин на плащане</a></div>
                <div className={styles.details}><a> rvas******02@gmail.com </a></div>
                <div className={styles.edit}><a> промени</a></div>
            </div>
        </div>
    )
}

function CartItems(cart) {
    console.log(cart.cart);
    let listOfItems = [];
    if (cart.cart != null)
    {
        for (let i = 0; i < cart.cart.listOfProducts.length; i++) {
                listOfItems.push(
                    <div className={styles.product}>
                        <div className={styles.image}><img src={'data:image/jpeg;base64,' + cart.cart.listOfProducts[i].mainImageData} /></div>
                        <div className={styles.left}>
                            <div className={styles.title}><a>{cart.cart.listOfProducts[i].name}</a></div>
                            <div className={styles.weight}><a>{cart.cart.listOfProducts[i].weight} гр.</a></div>
                            {/* <div className={styles.grafit}>
                                <div className={styles.uncheck}></div>
                                <div className={styles.check}></div>
                                <a>Гравиране + (18.00 лв.)</a>
                            </div> */}
                            {/* <div className={styles.tekst}><input type="text" className='grafitText' id="grafitText"/></div> */}
                        </div>
                        <div className={styles.right}>
                            <div className={styles.removeProduct}>
                                <a>Премахване</a>
                                <div className={styles.closeButton}>X</div>
                            </div>
                            <div className={styles.price}>
                                <a>{cart.cart.listOfProducts[i].price} лв. <br /></a>
                            </div>
                            <div className={styles.additionalToPrice}><a>с включено ДДС</a></div>
                            <div className={styles.quantity}>
                                <a>Количество: -  {cart.cart.listOfProducts[i].quantity}   +</a>
                            </div>
                        </div>
                    </div>
                );
        }
    }
    return(
        <div className={`${styles['flex-item']} ${styles['flex-item3']}`}>
         <div className={`${styles['cartItems']} ${styles['flex-details']}`}>
                <div className={styles.number}><a>3</a></div>
                <div className={styles.title}><a>Преглед на кошница</a></div>
            {listOfItems}
            </div>
        </div>
    )
}

function OrderSummary(cart, userid) {
    // Function to handle the order submission
    const submitOrder = async () => {
        if (!cart.cart) {
            console.error('Cart is empty');
            return;
        }
    
        // Prepare the order data
        const orderData = {
            UserID: 7, // You need to provide the correct user ID
            DeliveryMethod: 'Econt', // Define the delivery method
        };
    
        // Make the fetch API call
        try {
            const response = await fetch('http://localhost:5104/Order/AddOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data);

                alert('Order placed successfully!');
                // Redirect to the order page using the returned order ID
                window.location.href = `http://localhost:8080/order/${data.orderId}`;
            } else {
                // Handle server errors or invalid responses here
                console.log(orderData)
                alert('Failed to place the order. Please try again.');
            }
        } catch (error) {
            // Handle network errors or exceptions here
            console.error('Error submitting order:', error);
            alert('An error occurred while placing the order. Please check your internet connection and try again.');
        }
    };

    if (cart.cart != null) {
        return (
            <div className={`${styles['flex-item']} ${styles['flex-item4']}`}>
            <div className={styles.orderSummary}>
                <div className={styles.summaryText}><a>Обобщ. на поръчката</a></div>
                <div className={styles.mejdSumaText}><a>Межд. сума:</a></div>
                <div className={styles.mejdSumaPrice}><a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(cart.cart.mejdinnaSuma)} лв.</a></div>
                <div className={styles.discountText}><a>Отстъпка:</a></div>
                <div className={styles.discountPrice}><a>-{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(cart.cart.discount)} лв.</a></div>
                <div className={styles.grafitText}><a>Гравиране</a></div>
                <div className={styles.grafitPrice}><a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(cart.cart.engravingPrice)} лв.</a></div>
                <div className={styles.deliveryText}><a>Доставка:</a></div>
                <div className={styles.deliveryPrice}><a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(cart.cart.deliveryPrice)} лв.</a></div>
                <div className={styles.line}><hr /></div>
                <div className={styles.totalText}><a>Общо: </a></div>
                <div className={styles.totalPrice}><a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(cart.cart.totalPrice)} лв.</a></div>
            </div>
            <div className={styles.buyButton} onClick={submitOrder}><a>НАПРАВИ ПОРЪЧКА</a></div>
        </div>
        );
    }
}

function App({userID}) {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true) // This is just a placeholder.

    useEffect(() => {
        const url = `http://localhost:5104/Cart/GetCartByUser/${userID}`;

        // Define the function to fetch the cart data
        const fetchCart = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const cartData = await response.json();
                setCart(cartData);
                setLoading(false);
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }
        };

        // Call the fetch function
        fetchCart();
    }, []);

    if (!loading)
    {
        return (
            <div className={styles.fullPage}>
                <Header />
                <Address />
                <Payment />
                <CartItems cart={cart} />
                <OrderSummary cart={cart} userid={userID} />
            </div>
        );
    }

    else {
        return;
    }
    
}

export default App;
