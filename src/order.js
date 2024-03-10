import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import Header from './header.js';
import styles from './order.module.css';
import earringImage from './images/earrings.png'
import cashPayment from './images/cashPayLogo.png'
import phoneNumber from './images/phoneIcon.png'
import Chat from './chat.js'


const formatDate = (dateString) => {
    const date = new Date(dateString);
    const timeHours = date.getHours().toString().padStart(2, '0');
    const timeMinutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // January is 0!
    const year = date.getFullYear();
    return `${timeHours}:${timeMinutes} ${day}-${month}-${year}`;
};

const calculateArrivalDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 2); // Add 2 days to the current date
    return formatDate(date.toISOString()); // Reuse formatDate to get the desired output
};


function OrderHead({order}) {
    const formattedOrderDate = order.dateOfOrder ? formatDate(order.dateOfOrder) : 'Изчакване...';
    // Use the calculateArrivalDate function to get the expected arrival date
    const expectedArrivalDate = order.dateOfOrder ? calculateArrivalDate(order.dateOfOrder) : 'Изчакване...';
    function GetStatus() {
        const status = order.status;
        if (status == 0)
        {
            return (
                <a style={{color: "darkorange"}}>ПОЛУЧЕНА</a>
            )
        }

        if (status == 1)
        {
            return (
                <a style={{color: "green"}}>ИЗПРАТЕНА</a>
            )
        }

        if (status == 2)
        {
            return (
                <a style={{color: "darkgreen"}}>ДОСТАВЕНА</a>
            )
        }

        else 
        {
            return (
                <a style={{color: "red"}}>ОТКАЗАНА</a>
            )
        }
    }
    return (
        <div className={styles.orderHead}>
            <div className={styles.left}>
                <div className={styles.orderNumber}><a>Номер на поръчка: {order.id}</a></div>
                <div><a>Дата на поръчка: {formattedOrderDate}</a></div>
            </div>
            <div className={styles.right}>
                <div className={styles.orderStaus}>{GetStatus()}</div>
                <div><a>Очаквана дата на пристигане: {expectedArrivalDate}</a></div>
            </div>
        </div>
    )
}

function OrderProducts({ productsList }) {
    // Ensure productsList is an array to prevent runtime errors
    if (!Array.isArray(productsList)) return null;
    const productElements = productsList.map((product, index) => (
      <div key={index} className={styles.product}> {/* Make sure to include a unique key for each child */}
        <div className={styles.productImage}>
         <img src={'data:image/jpeg;base64,' + product.productDetails.mainImageData} alt={product.productDetails.name} />
        </div>
        <div className={styles.productInfo}>
          <div className={styles.name}><a>{product.productDetails.name}</a></div>
          <div className={styles.weight}><a>{product.productDetails.weight} гр.</a></div>
          {/* Uncomment if engraving is to be included */}
          {/* <div className={styles.grafit}><a>Гравиране + (18.00 лв.)</a></div> */}
        </div>
        <div className={styles.productPrice}>
          <div className={styles.price}> <a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(product.productDetails.price)} лв.</a></div>
          <div><a style={{fontSize: "0.9vw"}}>с включено ДДС</a></div>
          <div className={styles.quantity}><a>Количество: {product.productDetails.quantity}</a></div>
        </div>
      </div>
    ));
  
    return    (     
        <div className={styles.products}>{productElements}</div>
    )
  }

function PaymentInformation({order}) {
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
                        <a>{order.phoneNumber}</a>
                    </div>

                </div>
                <div className={styles.right}>
                    <div className={styles.address}>
                        <div><a style={{fontSize: "1.4vw", fontWeight:"600"}}>ДОСТАВКА</a></div>
                        <div><a style={{color: "rgba(0, 0, 0, 0.75)"}}>Адрес:</a><a> гр. {order.address.split(" ")[0]}, ул. {order.address.split(" ")[1]} {order.address.split(" ")[2]}</a></div>
                        <div style={{alignSelf: "flex-end", position:"absolute", bottom:"-2vw"}}><a>Метод на доставка:</a> <a style={{fontWeight:"600"}}> {order.deliveryMethod}</a></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function OrderSummary({order}) {

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
                }).format(order.mejdinnaSuma)} лв.</a></div>
                <div className={styles.discountText}><a>Отстъпка:</a></div>
                <div className={styles.discountPrice}><a>-{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(order.discount)} лв.</a></div>
                <div className={styles.grafitText}><a>Гравиране</a></div>
                <div className={styles.grafitPrice}><a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(order.engravingPrice)} лв.</a></div>
                <div className={styles.deliveryText}><a>Доставка:</a></div>
                <div className={styles.deliveryPrice}><a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(order.deliveryPrice)} лв.</a></div>
                <div className={styles.line}><hr /></div>
                <div className={styles.totalText}><a>Общо: </a></div>
                <div className={styles.totalPrice}><a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(order.totalPrice)} лв.</a></div>
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
                // Assign product details back to the respective OrderProduct
                const orderWithDetails = {
                    ...orderData,
                    listOfProducts: orderData.listOfProducts.map((orderProduct, index) => ({
                        ...orderProduct,
                        productDetails: productsDetails[index]
                    }))
                };
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

        return (
            <>
            <div className={styles.fullPage}>
                <Header />
                <OrderHead order={order}/>
                <OrderProducts productsList={order.listOfProducts}/>
                <PaymentInformation order={order} />
                <OrderSummary order={order} />
            </div>
            <Chat userid={userID} />
            </>
        );
    }

    else {
        return;
    }
    
}

export default App;