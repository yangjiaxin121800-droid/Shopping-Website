import React, { useState, useContext, useEffect } from 'react';
import DeleteImage from '../img/delete.png';
import styles from '../css/header.module.css';
import CartContext from './CartContext';

export default function CartItem({ id, initialQuantity, name, price, img, product }) {
    const [quantity, setQuantity] = useState(initialQuantity);
    const { removeFromCart, decrementQuantity, addToCart } = useContext(CartContext);

    // Function to decrease quantity, can not check stock because data is not stored there
    const decrement = () => {
        setQuantity((prev) => prev - 1);
    };

    // Function to increase quantity
    const increment = () => {
        setQuantity((prev) => prev + 1);
    };

    const handleRemoveItem = () => {
        removeFromCart(id);
    };

    // useEffect to handle changes in quantity
    useEffect(() => {
        if (quantity === 0) {
            removeFromCart(id); 
        } else if (quantity > initialQuantity) {
            addToCart(product); 
        } else if (quantity < initialQuantity) {
            decrementQuantity(product.itemId); 
        }
    }, [quantity, removeFromCart, addToCart, decrementQuantity, id, initialQuantity, product]);

    return (
        <div className={styles.product}>
            <img alt="com" src={img} className={styles.pic} />
            <div className={styles.info}>
                <p>{name}</p>
                <p>Price : <span> ${price}</span> </p>
                <div className={styles.op}>
                    <span className={styles.less} onClick={decrement}>-</span>
                    <span className={styles.num}>{quantity}</span>
                    <span className={styles.more} onClick={increment}>+</span>
                </div>
            </div>
            <img 
                src={DeleteImage} 
                className={styles.delete} 
                onClick={handleRemoveItem} 
                alt="Delete" 
            />
        </div>
    );
}
