import styles from './adminDashboard.module.css';
import React, {useState, useRef, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import sendIcon from './images/sendIcon.png';


function LeftMenu({ setCategory }) {
    return (
        <div className={styles.leftMenu}>
            <Categories setCategory={setCategory} />
        </div>
    );
}

function RightMenu(category) {
    console.log(category.category)
        if (category.category == "Продукти")
        {
            return (
                <ProductMenu />
            )
        }

        if (category.category == "Поръчки")
        {
            return (
                <DisplayOrders />
            )
        }
        
        if (category.category == "Потребители")
        {
            return (
                <DisplayUsers />
            )
        }

        if (category.category == "Чат")
        {
            return (
                <DisplayChat />
            )
        }

        else {
 

                let newDate = new Date()
                let date = newDate.getDate();
                let month = newDate.getMonth() + 1;
                let year = newDate.getFullYear();
                
                console.log(`${year}${month<10?`0${month}`:`${month}`}${date}`);
            return (
                <>
                    <div style={{textAlign:"center", position: "absolute", top: "20%", left:"43%"}}><a style={{fontSize:"5vw"}}>Админ Панел <br /> {date}-{month}-{year} </a></div>
                </>
            )
        }

}

function ProductMenu(){
    const [products, setProducts] = useState([]);
    return (
        <div className={styles.rightMenu}>
            <div className={styles.products}>
                <div className={styles.addProduct}>
                    <a className={styles.title}>Създаване на продукт</a>
                    <AddProduct products={products} setProducts={setProducts}/>
                </div>

                <div className={styles.addProduct}>
                    <a className={styles.title}>Редактиране на продукт</a>
                    <EditProduct products={products} setProducts={setProducts}/>
                </div>
            </div>

            <div className={styles.displayProducts}>
                <DisplayProducts products={products} setProducts={setProducts}/>
            </div>
        </div>
    )
    
}

function Categories({ setCategory }) {
    const navigate = useNavigate();
    const handleRedirect = () => {
        navigate('/'); // This will navigate to the home route
    };

    return (
        <div className={styles.categories}>
            <div onClick={handleRedirect} className={styles.flexItem}><a>Начало</a></div>
            <div onClick={() => setCategory("Продукти")} className={styles.flexItem}><a>Продукти</a></div>
            <div onClick={() => setCategory("Потребители")} className={styles.flexItem}><a>Потребители</a></div>
            <div onClick={() => setCategory("Поръчки")} className={styles.flexItem}><a>Поръчки</a></div>
            <div onClick={() => setCategory("Чат")} className={styles.flexItem}><a>Чат</a></div>
        </div>
    );
}

function AddProduct({products, setProducts}) {
    // State hooks for each input field and images
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [weight, setWeight] = useState('');
    const [category, setCategory] = useState('');
    const [discount, setDiscount] = useState('');
    const [mainImage, setMainImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [description, setDescription] = useState('');

    // Handler for main image change
    const handleMainImageChange = (event) => {
        setMainImage(event.target.files[0]);
    };

    // Handler for additional images change
    const handleAdditionalImagesChange = (event) => {
        setAdditionalImages([...event.target.files]);
    };

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a FormData object to send the files along with other fields
        const formData = new FormData();
        formData.append('name', name);
        formData.append('quantity', quantity);
        formData.append('price', price);
        formData.append('weight', weight);
        formData.append('category', category);
        formData.append('discount', discount);
        formData.append('mainImage', mainImage);
        formData.append('description', description);

        // Append additional images
        for (const file of additionalImages) {
            formData.append('additionalImages', file);
        }

        // Make an API request to create the product
        try {
            const response = await fetch('http://localhost:5104/Product/AddProduct', {
                method: 'POST',
                body: formData // Send formData as the request body
                // No 'Content-Type' header required, browser sets 'multipart/form-data'
            });

            if (!response.ok) {
                throw new Error('Продуктът не може да бъде създаден');
            }

            // Handle success
            alert('Продуктът беше създаден успешно');

        } catch (error) {
            // Handle errors
            console.error('Грешка:', error);
            alert('Продуктът не може да бъде създаден');
        }
        fetchProducts(setProducts);
    };

    // Form JSX
    return (
        <form className={styles.addProductForm} onSubmit={handleSubmit}>
            <div className={styles.flexItem}>
                <a>Име на продукта: </a>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Име..." />
            </div>
            <div className={styles.flexItem}>
                <a>Количество: </a>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Наличност..." />
            </div>
            <div className={styles.flexItem}>
                <a>Цена: </a>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Цена..." step="0.01" />
            </div>
            <div className={styles.flexItem}>
                <a>Тегло: </a>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Тегло..." step="0.01" />
            </div>
            <div className={styles.flexItem}>
                <a>Категория: </a>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Категория..." />
            </div>
            <div className={styles.flexItem}>
                <a>Информация: </a>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Допълнителна информация..." />
            </div>
            <div className={styles.flexItem}>
            <a>Снимка: </a>
                <input type="file" onChange={handleMainImageChange} />
            </div>
            <div className={styles.flexItem}>
                <a>Още снимки (3): </a>
                <input type="file" multiple onChange={handleAdditionalImagesChange}/>
            </div>
            <div className={styles.flexItem}>
                <button type="submit">Добавяне</button>
            </div>
        </form>
    );
}
function EditProduct({products, setProducts}) {

    const [selectedProductId, setSelectedProductId] = useState('');
    const [productDetails, setProductDetails] = useState({
        name: '',
        quantity: '',
        price: '',
        weight: '',
        category: '',
        discount: '',
        mainImage: null,
        additionalImages: []
    });

    useEffect(() => {
        // Fetch all products for the dropdown
        fetch('http://localhost:5104/Product/GetProducts')
            .then((response) => response.json())
            .then(setProducts);
    }, []);

    useEffect(() => {
        if (selectedProductId) {
            fetch(`http://localhost:5104/Product/FindProduct/${selectedProductId}`)
                .then((response) => response.json())
                .then((data) => {
                    setProductDetails({
                        ...productDetails,
                        name: data.name,
                        quantity: data.quantity.toString(),
                        price: data.price.toString(),
                        weight: data.weight.toString(),
                        category: data.category,
                        discount: data.discount ? data.discount.toString() : '',
                        description: data.description.toString()
                    });
                });
        }
    }, [selectedProductId]);

    const handleInputChange = (event, field) => {
        setProductDetails({
            ...productDetails,
            [field]: event.target.value,
        });
    };
    // Function to increase the product quantity
    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        Object.keys(productDetails).forEach(key => {
            if (key === 'additionalImages') {
                if (productDetails[key].length) {
                    productDetails[key].forEach(file => {
                        formData.append(key, file);
                    });
                } else {
                    // Optionally append existing additional images information if no new images are selected
                    // This might be done by appending the URLs or identifiers, depending on your backend expectation
                }
            } else if (key === 'mainImage') {
                if (productDetails[key]) {
                    formData.append(key, productDetails[key]);
                } else {
                    // Optionally append existing main image information if no new image is selected
                    // This might be done by appending the URL or identifier, depending on your backend expectation
                }
            } else {
                formData.append(key, productDetails[key]);
            }
            
        });
    
        try {
            const response = await fetch(`http://localhost:5104/Product/EditProduct/${selectedProductId}`, {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Промените не могат да се запазят');
            }
            alert('Промените бяха запазени успешно');
            // Optionally, you might want to refresh the product list or clear the form here
        } catch (error) {
            console.error('Грешка:', error);
            alert('Промените не могат да се запазят');
        }
        fetchProducts(setProducts);
    };


    return (
        <form className={styles.editProduct} onSubmit={handleSubmit}>
            <div className={styles.flexItem}>
                <label>Продукт:</label>
                <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
                    <option value="">Избери продукт</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>{product.id} - {product.name}</option>
                    ))}
                </select>
            </div>
            
            {/* Product Name */}
            <div className={styles.flexItem}>
                <label>Име:</label>
                <input
                    type="text"
                    value={productDetails.name}
                    onChange={(e) => handleInputChange(e, 'name')}
                    placeholder="Име на продукта"
                    disabled={!selectedProductId}
                />
            </div>
    
            {/* Quantity */}
            <div className={styles.flexItem}>
                <label>Количество:</label>
                <input
                    type="number"
                    value={productDetails.quantity}
                    onChange={(e) => handleInputChange(e, 'quantity')}
                    placeholder="Количество"
                    disabled={!selectedProductId}
                />
            </div>
    
            {/* Price */}
            <div className={styles.flexItem}>
                <label>Цена:</label>
                <input
                    type="number"
                    value={productDetails.price}
                    onChange={(e) => handleInputChange(e, 'price')}
                    placeholder="Цена"
                    step="0.01"
                    disabled={!selectedProductId}
                />
            </div>
    
            {/* Weight */}
            <div className={styles.flexItem}>
                <label>Тегло:</label>
                <input
                    type="number"
                    value={productDetails.weight}
                    onChange={(e) => handleInputChange(e, 'weight')}
                    placeholder="Тегло"
                    step="0.01"
                    disabled={!selectedProductId}
                />
            </div>
    
            {/* Category */}
            <div className={styles.flexItem}>
                <label>Категория:</label>
                <input
                    type="text"
                    value={productDetails.category}
                    onChange={(e) => handleInputChange(e, 'category')}
                    placeholder="Категория"
                    disabled={!selectedProductId}
                />
            </div>

            {/* Description */}
            <div className={styles.flexItem}>
                <label>Информация:</label>
                <input
                    type="text"
                    value={productDetails.description}
                    onChange={(e) => handleInputChange(e, 'description')}
                    placeholder="Допълнителна информация"
                    disabled={!selectedProductId}
                />
            </div>
    
            {/* Discount */}
            <div className={styles.flexItem}>
                <label>Отстъпка (%):</label>
                <input
                    type="number"
                    value={productDetails.discount}
                    onChange={(e) => handleInputChange(e, 'discount')}
                    placeholder="Отстъпка"
                    disabled={!selectedProductId}
                />
            </div>
    
            {/* Submit Button */}
            <div className={styles.flexItem}>
                <button type="submit" disabled={!selectedProductId}>Редактирай</button>
            </div>
        </form>
    );
}
const fetchProducts = async (setProducts) => {
    const response = await fetch('http://localhost:5104/Product/GetProducts');
    const data = await response.json();
    setProducts(data);
};
function DisplayProducts({products, setProducts}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteProductId, setDeleteProductId] = useState('');
    const [discountDetails, setDiscountDetails] = useState({ id: '', discount: '' });

    useEffect(() => {
        fetchProducts(setProducts);
    }, []);

    const increaseQuantity = async (productId) => {
        try {
            const response = await fetch(`http://localhost:5104/Product/ChangeQuantityByOne?add=true`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productId),
            });

            if (!response.ok) {
                throw new Error('Failed to update product quantity.');
            }

            // Handle successful update here, e.g., refresh the product list or show a message
            fetchProducts(setProducts);
        } catch (error) {
            console.error('Error:', error);
            // Handle errors here, such as displaying an error message to the user
        }
    };

    // Function to decrease the product quantity
    const decreaseQuantity = async (productId) => {
        try {
            const response = await fetch(`http://localhost:5104/Product/ChangeQuantityByOne?add=false`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productId),
            });

            if (!response.ok) {
                throw new Error('Failed to update product quantity.');
            }

            // Handle successful update here
            fetchProducts(setProducts);
        } catch (error) {
            console.error('Error:', error);
            // Handle errors here
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toString().includes(searchTerm)
    );

    const handleDelete = async () => {
        if (deleteProductId) {
            const response = await fetch(`http://localhost:5104/Product/DeleteProduct?productid=${deleteProductId}`, { method: 'GET' });
            if(response.ok){
                fetchProducts(); // Refresh the list
                alert('Продуктът беше премахнат успешно.');
            }

            else {
                alert('Няма съществуващ продукт.');
            }
        }
    };

    const applyDiscount = async () => {
        if (discountDetails.id && discountDetails.discount) {
            // Assuming you have an endpoint to update a product's discount
            const response = await fetch(`http://localhost:5104/Product/AddDiscount?productid=${discountDetails.id}&discount=${discountDetails.discount}`, { method: 'POST' });
            if (response.ok) {
                fetchProducts(); // Refresh the list
                alert("Успешно променихте отстъпката на продукта.")
            }

            else {
                alert("Грешка.")
            }
        }
    };
    console.log(products);
    return (
        <div className={styles.allProducts}>
        <div className={styles.productFilters}>
            <div className={styles.deleteProduct}>
                <input
                    type="text"
                    placeholder="Въведи код за изтриване на продукт..."
                    onChange={(e) => setDeleteProductId(e.target.value)}
                />
                <button onClick={handleDelete}>Изтрий Продукт</button>
            </div>
            <div className={styles.discountProduct}>
                <input
                    className={styles.discountID}
                    type="text"
                    placeholder="Код на продукт"
                    onChange={(e) => setDiscountDetails(prev => ({ ...prev, id: e.target.value }))}
                />
                <input
                    className={styles.discountNum}
                    type="text"
                    placeholder="% Отстъпка"
                    onChange={(e) => setDiscountDetails(prev => ({ ...prev, discount: e.target.value }))}
                />
                <button onClick={applyDiscount}>Промени Отстъпка</button>
            </div>
            <div className={styles.searchProduct}>
                <input
                    type="text"
                    placeholder="Въведи код или име за търсене на продукт..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            </div>
            <div className={styles.productTable}>
                <table>
                    <thead>
                        <tr>
                            <th>Код</th>
                            <th>Снимка</th>
                            <th>Име</th>
                            <th>Цена</th>
                            <th>Тегло</th>
                            <th>Количество</th>
                            <th>Категория</th>
                            <th>Отстъпка</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td><img src={'data:image/jpeg;base64,' + product.mainImageData} /></td>
                            <td>{product.name}</td>
                            <td>{product.price} лв.</td>
                            <td>{product.weight} г.</td>
                            <td>{product.quantity}</td>
                            <td>{product.category}</td>
                            <td>{product.discount ? `${product.discount}% Отстъпка` : 'Без Отстъпка'}</td>
                            <td><a onClick={() => increaseQuantity(product.id)} style={{cursor:"pointer", backgroundColor:"green", display:"block", padding: "0.1vw", marginBottom: "0.5vw", color:"white", fontWeight:"900", fontSize:"1.2vw"}}>+</a> <a onClick={() => decreaseQuantity(product.id)} style={{cursor:"pointer", backgroundColor:"red", display:"block", padding: "0.1vw", color:"white", fontWeight:"900", fontSize:"1.2vw"}}>-</a></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
    );
}

function DisplayOrders() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userId, setUserId] = useState('');
    const [dateBefore, setDateBefore] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate(); // create instance of navigate

    useEffect(() => {
        fetchOrders();
    }, []);

    const redirectToOrder = (orderID) => {
        navigate(`/order/${orderID}`);
    };
    
    const clearFilters = async () => {
        setUserId('')
        setSearchTerm('')
        setDateBefore('')
        setStatus('')
        const response = await fetch('http://localhost:5104/Order/GetAllOrders');
        const data = await response.json();
        setOrders(data);
    }

    const fetchOrders = async () => {
        let url = 'http://localhost:5104/Order/GetAllOrders';
        if (userId) {
            url = `http://localhost:5104/Order/GetAllUserOrders/${userId}`;
        } else if (status && dateBefore) {
            url = `http://localhost:5104/Order/GetOrdersByStatusAndBefore?status=${status}&date=${dateBefore}`
        }
        else if (status) {
            url = `http://localhost:5104/Order/GetOrdersByStatus?status=${status}`;
        } else if (dateBefore) {
            url = `http://localhost:5104/Order/GetOrdersBefore?date=${dateBefore}`;
        } 
        const response = await fetch(url);
        const data = await response.json();
        setOrders(data);
    };
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5104/Order/UpdateStatus/${orderId}?status=${newStatus}`, {
                method: 'POST',
                headers: {
                    // Your headers here, if any are needed
                },
                // No body needed since status is in the query string
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            alert('Успешно промениха статус на поръчката!!');
            fetchOrders(); // Refresh orders after status update
        } catch (error) {
            console.error("Error updating order status", error);
            alert(`Грешка: ${error}`);
        }
    };
    
    

    const formatDateTime = (datetimeString) => {
        const date = new Date(datetimeString);
        const timeHours = date.getHours();
        const timeMinutes = String(date.getMinutes()).padStart(2, '0'); // Ensure two digits
        const day = date.getDate();
        const month = date.getMonth() + 1; // JavaScript months are 0-indexed
        const year = date.getFullYear();
        return `${timeHours}:${timeMinutes} ${day}-${month}-${year}`;
    };

    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(searchTerm)
    );

    return (
        <div className={styles.allProducts}>
            <div className={styles.orderFilters}>
                <div>
                    <input
                        type="text"
                        placeholder="Търсене с код на поръчка"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Търсене с код на потребител"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="date"
                        placeholder=""
                        value={dateBefore}
                        onChange={(e) => setDateBefore(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Търсене със статус"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    />
                    <button onClick={fetchOrders}>Намери</button>
                    <button onClick={clearFilters}>Изчистване на филтрите</button>
                    <a style={{fontSize:"1vw", paddingLeft:"2vw"}}>0 - Получена <br /> 1 - Изпратена <br /> 2 - Доставена <br /> 3 - Отменена</a>
                </div>
            </div>
            <div className={styles.productTable}>
                <table>
                    <thead>
                        <tr>
                            <th>Код</th>
                            <th>Код на потребител</th>
                            <th>Дата на поръчка</th>
                            <th>Крайна цена</th>
                            <th>Адрес</th>
                            <th>Телефон</th>
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                           <tr key={order.id} onClick={() => redirectToOrder(order.id)} style={{ cursor: 'pointer' }}>
                                <td>{order.id}</td>
                                <td>{order.userID}</td>
                                <td>{formatDateTime(order.dateOfOrder)}</td>
                                <td>                <a>{new Intl.NumberFormat('en-US', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(order.totalPrice)} лв.</a></td>
                                <td>{order.deliveryMethod}: <br />{order.address}</td>
                                <td>{order.phoneNumber}</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    >
                                        <option value="0">Получена</option>
                                        <option value="1">Изпратена</option>
                                        <option value="2">Доставена</option>
                                        <option value="3">Върната/отменена</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> 
        </div>
    );
}

function DisplayUsers() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchName, setSearchName] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const response = await fetch('http://localhost:5104/User/GetAllUsers');
        const data = await response.json();
        setUsers(data);
    };

    const deleteUser = async (userId) => {
        // Display a confirmation dialog
        const isConfirmed = window.confirm("Сигурен ли си, че искаш да изтриеш този потребител?");
        
        // If the user clicks "OK", the value of isConfirmed will be true
        if (isConfirmed) {
            const response = await fetch(`http://localhost:5104/User/DeleteUser/${userId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                // Update the state to remove the user from the list
                setUsers(users.filter(user => user.id !== userId));
                alert("Успешно изтрихте потребителя.");
            } else {
                // If the request fails, log the error or display a message
                alert("Неуспешен опит да се изтрие потребителя.");
            }
        } 
    };
    const handleChangeUserRole = async (userid, newRole) => {
        try {
            // Convert the role to the numeric value if needed
            const roleValue = newRole; // Assume newRole is already the correct numeric value
    
            const response = await fetch(`http://localhost:5104/User/EditUserRole/${userid}?newUserRole=${roleValue}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`, // Assuming you store the token in localStorage
                },
            });
    
            if (!response.ok) {
                // If the server responded with an error message, handle it here
                const errorResponse = await response.text();
                throw new Error(errorResponse || 'Unknown error occurred');
            }
    
            // If the request was successful, update the UI or state as needed
            alert('Ролята на потребителя е променена успешно.');
            fetchUsers();
    
        } catch (error) {
            console.error('Failed to change user role:', error);
            alert(`Неуспешна промяна на ролята на потребителя: ${error.message || error}`);
        }
    };
    

    const filteredUsers = users.filter(user =>
        user.id.toString().includes(searchTerm) && user.name.toLowerCase().includes(searchName.toLowerCase())
    );

    return (
        <div className={styles.allUsers}>
             <div className={styles.searchFields}>
                <input
                    type="text"
                    placeholder="Търсене с Код"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Търсене с Име"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
            </div>
            <div className={styles.productTable}>
                <table>
                    <thead>
                        <tr>
                            <th>Код</th>
                            <th>Име</th>
                            <th>Имейл</th>
                            <th>Телефонен Номер</th>
                            <th>Местоположение</th>
                            <th>Направени Поръчки</th>
                            <th>Роля</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber}</td>
                                <td>гр. {user.city}, ул. {user.street}</td>
                                <td>{user.listOfOrders?.length || 0}</td>
                                <td>
                                <select 
                                        value={user.userRole}
                                        onChange={(e) => handleChangeUserRole(user.id, e.target.value)}
                                    >
                                        <option value="0">Потребител</option>
                                        <option value="1">Администратор</option>
                                        <option value="2">Изгонен</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> 
        </div>
    );
}


function DisplayChat() {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessageContent, setNewMessageContent] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };

    useEffect(() => {
        fetchAllConversations();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]); // Dependency on messages means this runs whenever messages change

    const fetchAllConversations = async () => {
        try {
            const response = await fetch('http://localhost:5104/Chat/GetAllConversations');
            const data = await response.json();
            for (const conversation of data) {
                const userResponse = await fetch(`http://localhost:5104/User/FindUser/${conversation.userID}`);
                const userData = await userResponse.json();
                conversation.userName = userData.name; // Assuming the user object has a 'name' property
            }
            setConversations(data);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        }
    };

    const fetchMessagesForUser = async (userID) => {
        try {
            const response = await fetch(`http://localhost:5104/Chat/GetConversationByUser?userID=${userID}`);
            const data = await response.json();
            setMessages(data.messages || []);
            setSelectedConversation(data); // Keep track of the selected conversation
        } catch (error) {
            console.error('Failed to fetch messages for user:', error);
        }
    };

    const handleSendClick = async () => {
        if (!newMessageContent.trim()) return; // Don't send empty messages

        try {
            console.log(selectedConversation);
            const response = await fetch('http://localhost:5104/Chat/AddMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: 0, // Assuming the backend generates the id
                    conversationID: selectedConversation.id, // This should be retrieved from the selected conversation
                    messageText: newMessageContent,
                    isStaff: true, // Change accordingly if you are sending messages as a user
                    dateTime: new Date().toISOString()
                }),
            });

            if (response.ok) {
                setNewMessageContent('');
                fetchMessagesForUser(selectedConversation.userID); // Refresh messages
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleNewMessageChange = (event) => {
        setNewMessageContent(event.target.value);
    };

    return (
        <div className={styles.fullChat}>
            <div className={styles.chat}>
                <div className={styles.conversations}>
                    {conversations.map((conv) => (
                        <div key={conv.id} className={styles.conversation} onClick={() => fetchMessagesForUser(conv.userID)}>
                            <a>{conv.userID}</a>
                            <a>{conv.userName}</a>
                        </div>
                    ))}
                </div>

                <div className={styles.messages}>
                    {messages.map((message) => (
                        <div key={message.id} className={message.isStaff ? styles.adminMessage : styles.userMessage}>
                            {message.messageText}
                        </div>
                    ))}
                <div ref={messagesEndRef} />

                </div>
            </div>
            
            <div className={styles.sendMessage}>
                <textarea value={newMessageContent} onChange={handleNewMessageChange} />
                <img src={sendIcon} onClick={handleSendClick} />
            </div>
        </div>
    );
}


function App() {
    const [category, setCategory] = useState("");
    return (
        <div className={styles.page}>
            <LeftMenu setCategory={setCategory} />
            <RightMenu category={category} />
        </div>
    );
}

export default App;