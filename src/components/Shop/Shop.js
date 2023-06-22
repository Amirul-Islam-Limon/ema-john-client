import React, { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { addToDb, deleteShoppingCart, getStoredCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';

const Shop = () => {
    // const {products, count} = useLoaderData();
    const [products, setProducts] = useState([])
    const [count,setCount] = useState(0)
    const [cart, setCart] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [productDataSize, setProductDataSize] = useState(10)

    const pages = Math.ceil(count / productDataSize);

    useEffect(() => {
        const url = `http://localhost:5000/products/?page=${currentPage}&size=${productDataSize}`
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setCount(data.count);
                setProducts(data.products);
        })
    },[currentPage, productDataSize])

    const clearCart = () =>{
        setCart([]);
        deleteShoppingCart();
    }

    useEffect( () =>{
        const storedCart = getStoredCart();
        const savedCart = [];
        const ids = Object.keys(storedCart);
        console.log(ids);
        fetch("http://localhost:5000/productsByIds", {
            method: "POST",
            headers: {
                "Content-Type":"Application/json"
            },
            body: JSON.stringify(ids)
        })
            .then(res => res.json())
            .then(data => {
                console.log("data by ids", data);
                
                for(const _id in storedCart){
                    const addedProduct = data.find(product => product._id === _id);
                    if(addedProduct){
                        const quantity = storedCart[_id];
                        addedProduct.quantity = quantity;
                        savedCart.push(addedProduct);
                    }
                }
                setCart(savedCart);
        })

        

    }, [products])

    const handleAddToCart = (selectedProduct) =>{
        console.log(selectedProduct);
        let newCart = [];
        const exists = cart.find(product => product._id === selectedProduct._id);
        if(!exists){
            selectedProduct.quantity = 1;
            newCart = [...cart, selectedProduct];
        }
        else{
            const rest = cart.filter(product => product._id !== selectedProduct._id);
            exists.quantity = exists.quantity + 1;
            newCart = [...rest, exists];
        }
        
        setCart(newCart);
        addToDb(selectedProduct._id);
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product=><Product 
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                        ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart clearCart={clearCart} cart={cart}>
                    <Link to="/orders">
                        <button >Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className='pagination'>
                <div>
                    <p>Currently Selected Page: {currentPage} and Data Length: { productDataSize}</p>
                    {
                        [...Array(pages).keys()].map(number => <button
                            key={number}
                            onClick={()=> setCurrentPage(number)}
                            className={currentPage === number && "selected"}
                        > { number + 1}</button>)
                    }
                    <select onChange={(event)=> setProductDataSize(event.target.value)}>
                        <option value="5">5</option>
                        <option value="10" selected>10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="25">25</option>
                    </select>
                </div>
                </div>
        </div>
    );
};

export default Shop;