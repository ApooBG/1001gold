import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './header.js';
import './index.css';
import shopImage from './images/ShopImage.png';
import searchIcon from './images/SearchIcon.png';
import cartImage from './images/cart.png';

import { useState, useEffect } from "react";


const products = [];


function Image() {
    return (
        <div class="image-area">
            <img class="shopImage" src={shopImage} />
        </div>
    )
}

function FilterMenu(props){
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Function to filter products by category
    const filterProductList = (category) => {
      const newFilteredProducts = products.filter(product => product.category.includes(category));
      setFilteredProducts(newFilteredProducts);
      console.log(newFilteredProducts);
    };
    return (
        <div class="filterMenu">
            <ul>
                <li><a>...</a></li>
                <li><a>ВСИЧКИ</a></li>
                <li><a onClick={() => filterProductList('Гривни')}>ГРИВНИ</a></li>
                <li><a>ОГЪРЛИЦИ</a></li>
                <li><a>ПРЪСТЕНИ</a></li>
                <li><a>ОБЕЦИ</a></li>
                    <div className='filterSearchbar' id="filterSearchbar" >
                        <input type="text" className='filterText' id="filterText"/>
                        <img class="SearchIcon" src={searchIcon} />
                    </div>
            </ul>
            
        </div>
    )
}

function PageNumbering(){
    return (
        <div className = "pageNumbers">
            <div className="pageNum1 pageNum"><a>1</a></div>
            <div className="pageNum2 pageNum"><a>2</a></div>
            <div className="pageNum3 pageNum"><a>3</a></div>
            <div className="dots"><a>...</a></div>
            <div className="pageNum4 pageNum"><a>24</a></div>
            <div className="pageNum5 pageNum"><a>25</a></div>
            <div className="pageNum6 pageNum"><a>26</a></div>
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



function Products(start, listOfFilteredProducts) {
    console.log(start);
    const [listOfProducts, setListOfProducts] = useState([]);
    function FetchData() {
        useEffect(() => {
        const url = "http://localhost:5104/Product";
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                for (let i = 0; i < data.length; i++) {
                    products.push(data[i]);
                }
                console.log(products);
                setListOfProducts(products);
            })
        }, [])
    }
    if (start)
    {
        console.log(start);
        FetchData();
    }
    else {
        setListOfProducts(listOfFilteredProducts);
        console.log(listOfFilteredProducts);
    }
    console.log(listOfFilteredProducts);

    const items = [];
    for (let i = 0; i < listOfProducts.length; i++)
    {
        items.push(
            <div className ="grid-item" key={i+1}>
                <div className="picture">
                    <img class="productPicture" src={'data:image/jpeg;base64,' + products[i].imageData} />
                </div>
                <div className="title"><a>{products[i].name} {products[i].weight}гр</a></div>
                <div className="price"><a>{products[i].price} лв.</a></div>
                <div className="cartImage">
                    <img class="cart" src={cartImage} />
                </div>
            </div>
        );
    }
        return (
            <div className="grid-container">
                {items}
            </div>
        )
}

function Footer() {
    return (
        <div class="footer"></div>
    )
}

const header = ReactDOM.createRoot(document.getElementById('header'));
const image = ReactDOM.createRoot(document.getElementById('image'));
const filterMenu = ReactDOM.createRoot(document.getElementById('filterMenu'));
const priceRange = ReactDOM.createRoot(document.getElementById('priceRange'));
const productsDisplay = ReactDOM.createRoot(document.getElementById('products'));
const pageNumbering = ReactDOM.createRoot(document.getElementById('pageNumbering'));
const pageNumberingBottom = ReactDOM.createRoot(document.getElementById('pageNumberingBottom'));
const footer = ReactDOM.createRoot(document.getElementById('footer'));


header.render (
    <Header />
)

image.render (
    <Image />
)

filterMenu.render(
    <FilterMenu />
)

priceRange.render(
    <PriceRange />
)

productsDisplay.render (
    <Products true />
)

pageNumbering.render (
    <PageNumbering />
)

pageNumberingBottom.render (
    <PageNumbering />
)

footer.render (
    <Footer />
)