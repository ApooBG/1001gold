import React from 'react';
import ReactDOM from 'react-dom/client';
import styles from './main.module.css';
import shopImage from './images/logo.jpg';
import searchIcon from './images/SearchIcon.png';
import cartImage from './images/cart.png';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Header from './header';
import Chat from './chat.js';


const products = [];

function Image() {
    return (
            <img className={styles.shopImage} src={shopImage} />
    )
}

function FilterMenu({ products, setFilteredProducts }) {
    const [activeCategory, setActiveCategory] = useState('');

    // Function to filter products by category
    const filterProductList = (category) => {
        const newFilteredProducts = products.filter(product => product.category.includes(category));
        setFilteredProducts(newFilteredProducts);
        setActiveCategory(category);
    };

    const findProductsByName = (name) => {
        const newFilteredProducts = products.filter(product => product.name.includes(name));
        setFilteredProducts(newFilteredProducts);
    };


    return (
        <div className={styles.filterMenu}>
            <ul>
                <li><a className={styles.category}>...</a></li>
                <li><a className={activeCategory === '' ? styles.activeCategory : styles.category} onClick={() => filterProductList('')}>ВСИЧКИ</a></li>
                <li><a className={activeCategory === 'Гривни' ? styles.activeCategory : styles.category} onClick={() => filterProductList('Гривни')}>ГРИВНИ</a></li>
                <li><a className={activeCategory === 'Огърлици' ? styles.activeCategory : styles.category} onClick={() => filterProductList('Огърлици')}>ОГЪРЛИЦИ</a></li>
                <li><a className={activeCategory === 'Пръстени' ? styles.activeCategory : styles.category} onClick={() => filterProductList('Пръстени')}>ПРЪСТЕНИ</a></li>
                <li><a className={activeCategory === 'Обеци' ? styles.activeCategory : styles.category} onClick={() => filterProductList('Обеци')}>ОБЕЦИ</a></li>
                <div className={styles.filterSearchbar} id="filterSearchbar" >
                    <input onChange={(e) => findProductsByName(e.target.value)} type="text" className={styles.filterText} id="filterText"/>
                    <img className={styles.SearchIcon} src={searchIcon} />
                </div>
            </ul>
        </div>
    );
}

function GetCartID(userID, setCartID) {
    const url = `http://localhost:5104/Cart/GetCartByUser/${userID}`;
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Cart not found or an error occurred.');
            }
        })
        .then(cart => {
            setCartID(cart.cartID); // Assuming the cart object has an id property
            console.log(cart.cartID);
            console.log(cart);
        })
        .catch(error => {
            console.error(error); // Handle any errors here
        });
}

function Products({ products, addToCart, userid }) {
    const [cartID, setCartID] = useState(null);
    let currentPage = read_cookie("CurrentPage");
    let maxItemsOnPage = 28;

    let firstItemPage = (currentPage * maxItemsOnPage) - maxItemsOnPage;
    let lastItemPage = currentPage * maxItemsOnPage;

    let totalPages = Math.ceil(products.length / maxItemsOnPage);
    let lastPageProductNumber = Math.ceil(products.length - ((totalPages-1) * maxItemsOnPage));

    if (totalPages == currentPage)
    {
        lastItemPage = currentPage * maxItemsOnPage - (28-lastPageProductNumber);
    }

    if (cartID <= 0)
    {
        GetCartID(userid, setCartID);
    }

    const items = products.slice(firstItemPage, lastItemPage).map((product, index) => (
        
        <div className={styles['grid-item']} key={product.id}>
        <Link to={`/product/${product.id}`} style={{ color: 'black' }}>
          <div className={styles.picture}>
            {product.quantity < 1 && (
              <div className={styles.outOfStockOverlay}>
                Няма в наличност
              </div>
            )}
            <img className={styles.productPicture} src={'data:image/jpeg;base64,' + product.mainImageData} />
          </div>
        </Link>
            <div className={styles.title}><a>{product.name} {product.weight}гр</a></div>
            <div className={styles.price}>
                <a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(product.price)} лв.</a>
            </div>
            <div className={styles.cartImage}>
                {product.quantity >= 1 && (<img onClick={() => addToCart(product.name, cartID, product.id)} className={styles.cart} src={cartImage} />)}
            </div>
        </div>
    ));

    return (
        <div className={styles['grid-container']}>
            {items}
        </div>
    );
}

function PageNumbering({products, changeCurrentPage} ){
    const totalPages = Math.ceil(products.length / 30);
    const lastPageProductNumber = Math.ceil(products.length - ((totalPages-1) * 30));
    let currentPage = read_cookie("CurrentPage");
    const pages = [];


    const filterProductList = (pageNum) => {
        changeCurrentPage(pageNum);
    };

    for (let i = 1; i <= totalPages; i++)
    {
        if (i < currentPage + 3 || i > currentPage -3)
        {
            if (read_cookie("CurrentPage") == i)
            {
                pages.push(<div key={"pageNum"+i} onClick={() => filterProductList(i)} className={`${styles.pageNum} ${styles[`pageNum2`]}`}><a>{i}</a></div>)
            }
           
            else 
            {
                pages.push(<div key={"pageNum"+i} onClick={() => filterProductList(i)} className={`${styles.pageNum} ${styles[`pageNum1`]}`}><a>{i}</a></div>)
            }
        }
    }
    
    return (
        
        <div className = {styles.pageNumbers}>
            {pages}
        </div>
    )
}

function PriceRange() {
    const [firstValue, setFirstValue] = useState(2);
    const [secondValue, setSecondValue] = useState(10);
    function handleRanges(value) {
       setFirstValue(value[0]);
       setSecondValue(value[1]);
    }
    return (
       <div>

       </div>
    );
 }


function Footer() {
    return (
        <div className={styles.footer}></div>
    )
}


function App({userid, isAdmin}) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, changeCurrentPage] = useState(1);
    const [showAddToCartMessage, setShowAddToCartMessage] = useState(false);
    const [productName, setProductName] = useState([]);
    const [cartMessages, setCartMessages] = useState([]);

    useEffect(() => {
        const url = "http://localhost:5104/Product/GetProducts";
        fetch(url)
            .then((response) => response.json())
            .then((data) => setProducts(data) )
            .then(console.log("GETTING DATA FROM SERVER"));
            setLoading(false);
    }, []);

    // Function to handle adding to cart
    const addToCart = (name, cartID, productID) => {
        // Create a message object with a unique id
        
        const url = new URL('http://localhost:5104/Cart/AddProductInCart');
        url.searchParams.append('cartID', cartID);
        url.searchParams.append('productID', productID);
    
        // Perform the POST request as you have it...
        fetch(url, { method: 'POST' })
        .then(response => {
            if (response.ok) {
                const message = {
                    id: Date.now(), // Unique identifier
                    name: name
                };
            
                // Add the new message object to the array
                setCartMessages(prevMessages => [...prevMessages, message]);
            
                // Set a timeout to remove this message after 5 seconds
                setTimeout(() => {
                    setCartMessages(prevMessages => prevMessages.filter(msg => msg.id !== message.id));
                }, 5000);
                return response.json();
            } else {
                alert("Няма достатъчно количество!");
                throw new Error('Something went wrong on API server!');
            }
        })
        .then(response => {
            console.log(response); // Handle the response data
            alert("Няма връзка със сървъра!");
        })
        .catch(error => {
            console.error(error); // Handle the error
        });
    };
    
    // Render the messages on the top right of the screen
    const cartMessageElements = cartMessages.map((message) => (
        <div key={message.id} className={styles.addToCart}>
            <a>Успешно добавихте <span className={styles.productText}>{message.name}</span> в количката.</a>
        </div>
    ));
    const deleteElementFromArr = (dsa) => {
        setProductName(productName.slice(0, 1))
    };
    
    let arrayOfAddedProducts = productName.map((product, index) => (
        <div className={styles.addToCart} key={index+1}><a>Успешно добавихте <span className={styles.productText}>{product}</span> в количката.</a></div>
    ));

    console.log(productName);


    if (!loading)
    {
        bake_cookie("CurrentPage", currentPage);

        return (
            <div className={styles.fullPage}>
                <Header isAdmin={isAdmin}/>
                <Image />
                <FilterMenu products={products} setFilteredProducts={setFilteredProducts} />
                <PriceRange />
                <div className={styles.NewProductsToCart}>
                    {cartMessageElements}
                </div>
                <PageNumbering products={filteredProducts.length ? filteredProducts : products} changeCurrentPage={changeCurrentPage} />
                <div className={styles.NewProductsToCart}> {arrayOfAddedProducts} </div>
                <Products products={filteredProducts.length ? filteredProducts : products} addToCart={addToCart} userid={userid} />
                <PageNumbering products={filteredProducts.length ? filteredProducts : products} changeCurrentPage={changeCurrentPage}/>
                <Footer />
                <Chat userid={userid} />
            </div>
        );
    }
    
}
export default App;


//  const productsDisplay = ReactDOM.createRoot(document.getElementById('products'));
//  productsDisplay.render(<App />);


