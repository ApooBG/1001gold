import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import Header from './header.js';
import styles from './cart.module.css';
import earringsImage from './images/earrings.png';
import Chat from './chat.js';

function Address({userid}) {
    const [user, setUser] = useState([]);

    useEffect(() => {
        // Only fetch user info if userid is valid
        if (userid) {
            GetUser(userid)
            .then(userInfo => {
                // Do something with the user info
                setUser(userInfo);
            })
            .catch(error => {
                // Handle the error
                console.error('Failed to get user info:', error);
            });
        }
    }, [userid]); //
    return(
        <div className={`${styles['flex-item']} ${styles['flex-item1']}`}>
            <div className={`${styles['adress']} ${styles['flex-details']}`}>
                <div className={styles.number}><a>1</a></div>
                <div className={styles.title}><a>Адрес на доставка</a></div>
                <div className={styles.details}><a> {user.name} <br /> {user.deliveryType} <br /> {user.deliveryAddress} <br /> {user.phoneNumber}</a></div>
                <div className={styles.edit}><a> промени</a></div>
            </div>
        </div>
    )
}

function Payment({userid}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Only fetch user info if userid is valid
        if (userid) {
            GetUser(userid)
            .then(userInfo => {
                // Do something with the user info
                setUser(userInfo);
            })
            .catch(error => {
                // Handle the error
                console.error('Failed to get user info:', error);
            });
        }
    }, [userid]); //
    return(
        <div className={`${styles['flex-item']} ${styles['flex-item2']}`}>
            <div className={`${styles['payment']} ${styles['flex-details']}`}>
                <div className={styles.number}><a>2</a></div>
                <div className={styles.title}><a>Начин на плащане</a></div>
                <div className={styles.details}><a>На място при доставка</a></div>
                <div className={styles.edit}><a> промени</a></div>
            </div>
        </div>
    )
}

function CartItems({cart, fetchCart}) {
    const removeProductFromCart = async (cartID, productID) => {
        try {
            const response = await fetch(`http://localhost:5104/Cart/RemoveCartProduct?cartID=${cartID}&productID=${productID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Include other headers such as Authorization if needed
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // If the product was removed successfully, you may want to update the state or trigger a re-fetch of the cart
        } catch (error) {
        }
        fetchCart();
    };
    
    let listOfItems = [];
    if (cart != null)
    {
        for (let i = 0; i < cart.listOfProducts.length; i++) {
                listOfItems.push(
                    <div key={i} className={styles.product}> {/* Make sure to include a unique key for each child */}
                    <div className={styles.productImage}>
                     <img src={'data:image/jpeg;base64,' + cart.listOfProducts[i].mainImageData} alt={cart.listOfProducts[i].name} />
                    </div>
                    <div className={styles.productInfo}>
                      <div className={styles.name}><a>{cart.listOfProducts[i].name}</a></div>
                      <div className={styles.weight}><a>{cart.listOfProducts[i].weight} гр.</a></div>
                      {/* Uncomment if engraving is to be included */}
                      {/* <div className={styles.grafit}><a>Гравиране + (18.00 лв.)</a></div> */}
                    </div>
                    <div className={styles.productPrice}>
                    <div className={styles.removeProduct} onClick={() => removeProductFromCart(cart.cartID, cart.listOfProducts[i].productID)}>
                        <a>Премахване</a>
                        <div className={styles.closeButton}><a>X</a></div>
                    </div>
                      <div className={styles.price}> <a>{new Intl.NumberFormat('en-US', {
                                style: 'decimal',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(cart.listOfProducts[i].price)} лв.</a></div>
                      <div><a style={{fontSize: "0.9vw"}}>с включено ДДС</a></div>
                      <div className={styles.quantity}><a>Количество: {cart.listOfProducts[i].quantity}</a></div>
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
            <div className={styles.products}>{listOfItems}</div>
            </div>
        </div>
    )
}

function OrderSummary({ cart, userid }) {
    console.log("USERID" + userid);
    const [placeOrder, setPlaceOrder] = useState(false);

    const [user, setUser] = useState([]);

    useEffect(() => {
        // Only fetch user info if userid is valid
        if (userid) {
            GetUser(userid)
            .then(userInfo => {
                // Do something with the user info
                setUser(userInfo);
            })
            .catch(error => {
                // Handle the error
                console.error('Failed to get user info:', error);
            });
        }
    }, [userid]); //

    // Function to handle the order submission
    const submitOrder = async () => {
        if (!cart) {
            console.error('Cart is empty');
            return;
        }
    
        // Prepare the order data
        setPlaceOrder(true);
        const orderData = {
            UserID: userid, // You need to provide the correct user ID
            DeliveryMethod: user.deliveryType, // Define the delivery method
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

                alert('Успешно заявикте поръчка!');
                // Redirect to the order page using the returned order ID
                window.location.href = `http://localhost:8080/order/${data.orderId}`;

            } else {
                // Handle server errors or invalid responses here
                alert('Грешка. Моля, опитайте пак по-късно.');
                setPlaceOrder(false);
            }
        } catch (error) {
            // Handle network errors or exceptions here
            alert('Грешка. Моля, опитайте пак по-късно.');
        }
    };

    if (placeOrder)
    {
        return (
            <h1>Изчакване...</h1>
        )
    }

    if (cart != null) {
        return (
            <div className={`${styles['flex-item']} ${styles['flex-item4']}`}>
            <div className={styles.orderSummary}>
                <div className={styles.summaryText}><a>Обобщ. на поръчката</a></div>
                <div className={styles.mejdSumaText}><a>Межд. сума:</a></div>
                <div className={styles.mejdSumaPrice}><a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(cart.mejdinnaSuma)} лв.</a></div>
                <div className={styles.discountText}><a>Отстъпка:</a></div>
                <div className={styles.discountPrice}><a>-{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(cart
                .discount)} лв.</a></div>
                <div className={styles.grafitText}><a>Гравиране</a></div>
                <div className={styles.grafitPrice}><a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(cart.engravingPrice)} лв.</a></div>
                <div className={styles.deliveryText}><a>Доставка:</a></div>
                <div className={styles.deliveryPrice}><a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(cart.deliveryPrice)} лв.</a></div>
                <div className={styles.line}><hr /></div>
                <div className={styles.totalText}><a>Общо: </a></div>
                <div className={styles.totalPrice}><a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(cart.totalPrice)} лв.</a></div>
            </div>
            <div className={styles.buyButton} onClick={submitOrder}><a>НАПРАВИ ПОРЪЧКА</a></div>
        </div>
        );
    }
}

async function GetUser(userID) {
    // Define the URL using the userID
    const url = `http://localhost:5104/User/FindUser/${userID}`;
  
    try {
      // Make the GET request to the API
      const response = await fetch(url);
  
      // If the response is OK, parse the JSON and return the user info
      if (response.ok) {
        const userInfo = await response.json();
        console.log(userInfo);
        return userInfo;
      } else {
        // If the response is not OK, throw an error
        throw new Error('User not found');
      }
    } catch (error) {
      // Log any errors and rethrow them
      console.error('GetUser failed:', error);
      throw error;
    }
  }

function App({userID}) {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true) // This is just a placeholder.

    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5104/Cart/GetCartByUser/${userID}`);
            if (!response.ok) {
                throw new Error('Fetching cart failed');
            }
            const cartData = await response.json();
            if (!cartData || cartData.isEmpty) {
                const addCartResponse = await fetch(`http://localhost:5104/Cart/AddCart?UserID=${userID}&MejdinnaSuma=0&Discount=0&EngravingPrice=0&DeliveryPrice=0&TotalPrice=0`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!addCartResponse.ok) {
                    throw new Error('Adding cart failed');
                }
                const newCartData = await addCartResponse.json();
                setCart(newCartData);
            } else {
                setCart(cartData);
            }
        } catch (error) {
            console.error('There has been a problem with your cart operations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [userID]);

    if (!loading)
    {
        return (
            <div className={styles.fullPage}>
                <Header />
                <Address userid={userID} />
                <Payment userid={userID}/>
                <CartItems cart={cart} fetchCart={fetchCart} />
                <OrderSummary cart={cart} userid={userID} />
                <Chat  userid={userID}/>
            </div>
        );
    }

    else {
        return;
    }
    
}

export default App;
