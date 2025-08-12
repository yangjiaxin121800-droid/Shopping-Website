import React, { useState, useContext, useEffect } from 'react';
import styles from '../css/Homepage.module.css';
import { Link } from 'react-router-dom';
import CartContext from './CartContext';
import { useNavigate } from 'react-router-dom';

// gain things from given data is enough
export default function ProductCard({ product }) {
  const [showAddToCart, setShowAddToCart] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const { cartItems, addToCart, decrementQuantity, setItemID } = useContext(CartContext);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const cartData = cartItems.reduce((acc, item) => {
    acc.push({
      id: item.itemId,
      qty: item.qty
    });
    return acc;
  }, []);
  useEffect(() => {
    const existingItem = cartItems.find(item => item.itemId == product.itemId);
    if (existingItem) {
      setShowAddToCart(false); // hide Add to Cart
      setQuantity(existingItem.qty);
    } else {
      setShowAddToCart(true);
    }
  }, [cartItems, product.id]); // trigger when cart or item ID changed

  const handleAddToCart = () => {
    if (product.stock > 0) {
      setShowAddToCart(false); // hide Add to Cart
      setQuantity(1);
      addToCart(product);
    }
  };

  const increment = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1)
      addToCart(product);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
      decrementQuantity(product.itemId);
    } else {
      setShowAddToCart(true);
      decrementQuantity(product.itemId);
    }
  };
  const handleDetailClick = async (itemID) => {
    const data = [
      { username: username },
      ...cartData
    ];
    try {
      const response = await fetch('http://10.147.19.129:3036/api/cart/list', {
        method: 'PUT',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(`Update failed`);
        if (response.status === 403) {
          localStorage.removeItem('username');
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
          return;
        }
      } else {
        console.log(`success: `);
        setItemID(itemID);
        console.log(itemID);
        navigate('/detail', { replace: true });
      }


    } catch (error) {
      console.error(error);
    }


  };
  return (
    <div className={styles.productCard}>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'around'}}>
      <div>
      <img src={`data:image/jpeg;base64,${product.img}`} alt={product.productName} />
      <p>{product.name}</p>
      <p>${product.price}</p>
      <p>Rate: {product.rate}</p>
      <p>Stock: {product.stock}</p>
      </div>
      <div>
      {showAddToCart ? (
      <div>
        <button
          className={styles.productOption}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
        </div>
      ) : (
        <div className={styles.op}>
          <span className={styles.less} onClick={decrement}>-</span>
          <span className={styles.num}>{quantity}</span>
          <span className={styles.more} onClick={increment}>+</span>
        </div>
      )}

      <div className={styles.container}>
        <button className={styles.productOption} onClick={() => handleDetailClick(product.itemId)} >

          See more detail

        </button>
      </div>
      </div>
      </div>
    </div>
  );
}


