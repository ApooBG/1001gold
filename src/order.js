import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import Header from './header.js';
import styles from './order.module.css';
import earringImage from './images/earrings.png'
import cashPayment from './images/cashPayLogo.png'
import phoneNumber from './images/phoneIcon.png'


function OrderHead() {
    return (
        <div className={styles.orderHead}>
            <div className={styles.left}>
                <div className={styles.orderNumber}><a>Номер на поръчка: 234567</a></div>
                <div><a>Дата на поръчка: 12:25 30/01/2024</a></div>
            </div>
            <div className={styles.right}>
                <div className={styles.orderStaus}><a>ДОСТАВЕНА</a></div>
                <div><a>Очаквана дата на пристигане: 02/02/2024</a></div>
            </div>
        </div>
    )
}

function OrderProducts() {
    var products = [];
    for (let i = 0; i <= 4; i++)
    {
        products.push(
            <div className={styles.product}>
                <div className={styles.productImage}>
                    <img src={earringImage} />
                </div>
                <div className={styles.productInfo}>
                    <div className={styles.name}><a>Дамски златни обеци</a></div>
                    <div className={styles.weight}><a>12.34 гр.</a></div>
                    <div className={styles.grafit}><a>Гравиране + (18.00 лв.)</a></div>
                </div>
                <div className={styles.productPrice}>
                    <div className={styles.price}><a>10,250.00 лв.</a></div>
                    <div><a style={{fontSize: 0.9 + "vw"}}>с включено ДДС</a></div>
                    <div className={styles.quantity}><a>Количество: 1</a></div>

                </div>
            </div>
        )
    }
    return (
        <div className={styles.products}>
            {products}
        </div>
    )
}

function PaymentInformation() {
    return (
        <div className={styles.paymentInformation}>
            <div className={styles.firstChild}> 
                <div className={styles.left}>
                    <div className={styles.paymentMethod}>
                        <div style={{textAlign: 'center', paddingTop: "0.5vw", fontSize: "1.3vw"}}>НАЧИН НА ПЛАЩАНЕ</div>
                        <div className={styles.cashPayment}>
                            <img src={cashPayment} />
                            <a>На място при доставка</a>
                        </div>
                    </div>
                    <div className={styles.phoneNumber}>
                        <img src={phoneNumber} /> 
                        <a>+359 89 486 4780</a>
                    </div>

                </div>
                <div className={styles.right}>
                    <div className={styles.address}>
                        <div><a style={{fontSize: "1.4vw", fontWeight:"600"}}>ДОСТАВКА</a></div>
                        <div><a style={{color: "rgba(0, 0, 0, 0.75)"}}>Адрес:</a><a> гр. Варна, ул. Черни връх №17, ет. 2, ап.3</a></div>
                        <div style={{alignSelf: "flex-end", position:"absolute", bottom:"-2vw"}}><a>Метод на доставка:</a> <a style={{fontWeight:"600"}}> Еконт</a></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function OrderSummary() {

        return (
            <div className={styles.orderSummaryBack}>
                <div className={styles.orderHelp}><a>Отказване на поръчката</a><a>Нужда от помощ?</a><a>Условия за връщане</a></div>
            <div className={styles.orderSummary}>
                <div className={styles.summaryText}><a>Обобщ. на поръчката</a></div>
                <div className={styles.mejdSumaText}><a>Межд. сума:</a></div>
                <div className={styles.mejdSumaPrice}><a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(12500)} лв.</a></div>
                <div className={styles.discountText}><a>Отстъпка:</a></div>
                <div className={styles.discountPrice}><a>-{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(12500)} лв.</a></div>
                <div className={styles.grafitText}><a>Гравиране</a></div>
                <div className={styles.grafitPrice}><a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(12500)} лв.</a></div>
                <div className={styles.deliveryText}><a>Доставка:</a></div>
                <div className={styles.deliveryPrice}><a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(20)} лв.</a></div>
                <div className={styles.line}><hr /></div>
                <div className={styles.totalText}><a>Общо: </a></div>
                <div className={styles.totalPrice}><a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(12500)} лв.</a></div>
            </div>
        </div>
        );
    }


function App({userID}) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true) // This is just a placeholder.
    let orderID = window.location.pathname.split('/')[window.location.pathname.split('/').length-1];

    useEffect(() => {
        const getOrder = async () => {
            try {
                const orderResponse = await fetch(`http://localhost:5104/Order/GetOrder/${orderID}`);
                
                if (!orderResponse.ok) {
                    throw new Error(`HTTP error! status: ${orderResponse.status}`);
                }
                const orderData = await orderResponse.json();

                // Fetch product details for each OrderProduct
                const productsPromises = orderData.listOfProducts.map(async (orderProduct) => {
                    const productResponse = await fetch(`http://localhost:5104/Product/FindProduct/${orderProduct.productID}`);
                    if (!productResponse.ok) {
                        throw new Error(`HTTP error! status: ${productResponse.status}`);
                    }
                    return productResponse.json();
                });

                // Resolve all promises to get product details
                const productsDetails = await Promise.all(productsPromises);
                console.log(productsDetails)
                // Assign product details back to the respective OrderProduct
                const orderWithDetails = {
                    ...orderData,
                    listOfProducts: orderData.listOfProducts.map((orderProduct, index) => ({
                        ...orderProduct,
                        productDetails: productsDetails[index]
                    }))
                };
                console.log(orderWithDetails);
                setOrder(orderWithDetails);
            } catch (error) {
                console.error("Fetching order or products failed", error);
            } finally {
                setLoading(false);
            }
        };

        getOrder();
    }, []);


    if (!loading)
    {
        console.log(order);

        return (
            <>
            <Header />
            <div className={styles.fullPage}>
                <OrderHead />
                <OrderProducts />
                <PaymentInformation />
                <OrderSummary />
            </div>
            </>
        );
    }

    else {
        return;
    }
    
}

export default App;