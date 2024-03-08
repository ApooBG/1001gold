import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './header.js';
import styles from './product.module.css';
import { useState, useEffect } from "react";

import earringsImage from './images/earrings.png';
import armbandImage from './images/armband.png';
import ringImage from './images/ring.png';
import necklaceImage from './images/necklace.png';
import starImage from './images/star.png';
import yellowStarImage from './images/yellowStar.png';



function ProductImages(product) {
    const additionalImages = product.product.additionalImages;
    let renderAdditionalImage = [];
    for (let i = 0; i < additionalImages.length; i++)
    {

        renderAdditionalImage.push(
            <div className={`${styles['productPicture']} ${styles['productPicture' + (i+2)]}`}><img src={'data:image/jpeg;base64,' + additionalImages[i]} /></div>
        )
    }
    return (
        <div className={`${styles['flex-item']} ${styles['flex-item1']}`}>
            <div className={styles.allImages}>
                <div className={`${styles['productPicture']} ${styles['productPicture1']}`}><img src={'data:image/jpeg;base64,' + product.product.mainImageData} /></div>
                {renderAdditionalImage}
            </div>
        </div>
    )
}

function GetCartID(userID, setCartID) {
    const url = `http://localhost:5104/Cart/GetCart/${userID}`;
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


function ProductDetails(product) {
    const [cartID, setCartID] = useState(null);

    if (cartID <= 0)
    {
        GetCartID(4, setCartID);
    }

    const addToCart = (cartID, productID) => {
        // Prepare the URL with query parameters
        const url = new URL('http://localhost:5104/Cart/AddProductInCart');
        url.searchParams.append('cartID', cartID);
        url.searchParams.append('productID', productID);
    
        // Perform the POST request
        fetch(url, { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong on API server!');
                }
            })
            .then(response => {
                console.log(response); // Handle the response data
            })
            .catch(error => {
                console.error(error); // Handle the error
            });
    };
    return (
        <div className={`${styles['flex-item']} ${styles['flex-item2']}`}>
        <div className={styles.productDetails}>
            <div className={styles.header}><a>{product.product.name}</a></div>
            <hr />
            <div className={styles.price}>
                <a>{new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(product.product.price)} лв.</a>
            </div>
            <div className={styles.productInfo}>
                <div className={`${styles.addInfo} ${styles['flex-item']}`}><a>{product.product.description}.</a></div>
                <div className={`${styles.weight} ${styles['flex-item']}`}><a>Тегло: {product.product.weight} гр.</a></div>
                <div className={`${styles.productCode} ${styles['flex-item']}`}><a>Код на продукта: {product.product.id}</a></div>
                <div className={`${styles.inStock} ${styles['flex-item']}`}>{ product.product.quantity > 0 ? <a style={{color: "Green"}}>в наличност</a> : <a style={{color: "Red"}}>няма в наличност</a> }</div>
            </div>

            {/* <div className={styles.productEngraving}>
                <div className={`${styles.header} ${styles['flex-item']}`}><a>Лазерно Гравиране</a></div>
                <div className={`${styles.engravingChoice} ${styles['flex-item']}`}>
                    <div className={styles.engravingBack}>
                        <div className={styles.engravingTrue}></div>
                    </div>
                    <div className={styles.wantEngravingText}><a>Искам лазерно гравиране (+18,00 лв.)</a></div>
                    <input type='text' defaultValue="Вашият текст за графиране..."/>
                </div>
                <div className={`${styles.fonts} ${styles['flex-item']}`}>
                    <div className={`${styles.font} ${styles.font1}`}><a>AbcaБц12</a></div>
                    <div className={`${styles.font} ${styles.font2}`}><a>AbcаБц12</a></div>
                    <div className={`${styles.font} ${styles.font3}`}><a>AbcаБц12</a></div>
                    <div className={styles.fontText}><a>Гравирани бижута не подлежат на връщане или замяна.</a></div>
                </div>
            </div> */}

            <div onClick={() => addToCart(cartID, product.product.id)} className={styles.buyButton}>
                <a>КУПИ</a>
            </div>
            </div>
        </div>
    )
}

function Comments(product) {

    function GetStars(stars) 
    {
        let starImagesList = [];

        for (let i = 1; i <= 5; i++) 
        {
            if (i <= stars.stars)
            {
                starImagesList.push(<img src={yellowStarImage} key={i}/>)
            }

            else {
                starImagesList.push(<img src={starImage} key={i}/>)
            }
        }

        return (
            <>{starImagesList}</>
        )
    }
    
    let commentsList = [];
    for (let i = 0; i < product.product.comments.length; i++)
    {
        commentsList.push(<div className={styles.comment}>
            <div className={styles.reviewUsername}><a>{product.product.comments[i].username}:</a></div>
            <div className={styles.reviewText}>
                <div className={styles.text}><a>{product.product.comments[i].text}</a></div>
                <div className={styles.reviewStars}>
                    <GetStars stars={product.product.comments[i].gradeReview}/>
                </div>
            </div>
        </div>)
    }

    return (
        <div className={`${styles['flex-item']} ${styles['flex-item3']}`}>
        <div className={styles.commentSection}>
        <>{commentsList}</>
        </div>
        </div>
    )
}

function AddReview({product, setLoading}) {
    const [text, setText] = useState(''); // State to hold textarea content
    const [starClicked, setStarClicked] = useState(0); // State to hold the selected star rating

    // Function to handle star click, updating the starClicked state
    const handleStarClick = (value) => {
        setStarClicked(value);
    };

    // Create star images with click handlers
    let starImagesList = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= starClicked)
        {
            starImagesList.push(<img src={yellowStarImage} key={i} onClick={() => handleStarClick(i)} style={{ cursor: 'pointer' }} alt="star"/>);
        }
        else
        {
            starImagesList.push(<img src={starImage} key={i} onClick={() => handleStarClick(i)} style={{ cursor: 'pointer' }} alt="star"/>);
        }
    }

    // Function to send the review data using a POST request
    const createReview = () => {
        setLoading(true); // Indicate loading start
        // Define the URL for the POST request
        const url = "http://localhost:5104/Product/AddComment?productid=" + product.id;

        // Create the data object to send
        const postData = {
            productid: product.id,
            Username: "Ruslan",
            Text: text,
            GradeReview: starClicked
        };
        console.log(postData);


        // Fetch options for a POST request
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        };

        // Perform the fetch operation
        fetch(url, fetchOptions)
            .then(response => response.json())
            .catch(error => {
                console.error("Error adding review:", error);
            })
            .finally(() => {
                setLoading(false); // Indicate loading end
            });
    };

    // Render the component
    return (
        <div className={`${styles['flex-item']} ${styles['flex-item4']}`}>
            <div className={styles.addReviewBackground}>
                <div className={styles.reviewText}>
                    <textarea value={text} onChange={(e) => setText(e.target.value)}></textarea>
                </div>
                <div className={styles.reviewStars}>{starImagesList}</div>
                <div className={styles.sendButton} onClick={createReview} style={{ cursor: 'pointer' }}>
                    <a>Изпращане</a>
                </div>
            </div>
        </div>
    );
}

function App() {
    let productID = window.location.pathname.split('/')[window.location.pathname.split('/').length-1];
    var [CurrentProduct, setProduct] = useState([]);
    var [loading, setLoading] = useState(true);
    useEffect(() => {
        const url = "http://localhost:5104/Product/FindProduct/" + productID;
        fetch(url)
            .then((response) => response.json())
            .then((data) => setProduct(data));
            console.log("GETTING DATA FROM SERVER");
            setLoading(false);
    }, [loading]);

    console.log(CurrentProduct);
    if (loading)
    {
        return <p>Loading...</p>;
    }

    if (!loading && CurrentProduct.id > 0)
    {
        return (
            <div className={styles.productPage}>
                    <Header />
            <div className={styles.fullPage}>
                    <ProductImages product={CurrentProduct} />
                    <ProductDetails product={CurrentProduct} />
                    <Comments product={CurrentProduct} />
                    <AddReview product={CurrentProduct} setLoading={setLoading} />
            </div>
            </div>
        );
    }
}
export default App;
