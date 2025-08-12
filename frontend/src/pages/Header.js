import React, { useState, useContext, useEffect } from 'react';
import styles from '../css/header.module.css';
import SearchImage from '../img/Search.png';
import UserImage from '../img/user.png';
import CartImage from '../img/shoppingcart.png';
import OpenCart from './OpenCart';
import { Link } from 'react-router-dom';
import CartContext, { CartProvider } from './CartContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { totalPrice, totalNum, cartItems } = useContext(CartContext);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const cartData = cartItems.reduce((acc, item) => {
    acc.push({
      id: item.itemId,
      qty: item.qty
    });
    return acc;
  }, []);
  // State to control the visibility of the cart
  const [isCartOpen, setIsCartOpen] = useState(false);
  // whether there is a user

  const [isLog, setLog] = useState(false);

  useEffect(() => { // check username as well as login status
    const userName = localStorage.getItem('username');
    if (userName != null) {
      setLog(true);
    } else {
      setLog(false);
    }
  }, []);

  // Function to toggle the cart visibility
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleDetailClick = async () => {
    const data = [
      { username: username },
      ...cartData
    ];
    try {

      const response = await fetch('http://10.147.19.129:3036/api/cart/list', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(`Update failed`);
      } else {
        console.log(`success`);

        navigate('/userprofile', { replace: true });
      }


    } catch (error) {
      console.error(error);
    }
  }
  const homePage = async () => {
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
      } else {
        console.log(`success`);

        navigate('/', { replace: true });
      }


    } catch (error) {
      console.error(error);
    }


  };

  return (
    <>
      <header className={styles.AppHeader}>
        <h1>
          <Link to="/" onClick={homePage} >
            Computer Store
          </Link>
        </h1>

        <div className={styles.Right}>

          <div className={styles.user}>
            <img alt="search_icon" src={UserImage} className={styles.userIcon} id="user" />

            <button onClick={isLog ? handleDetailClick : undefined} >
              <Link to={isLog ? "/userprofile" : "/login"}>
                {isLog ? "Profile" : "Log in"}
              </Link>
            </button>


          </div>

          <div className={styles.cart} onClick={toggleCart}>
            <span className={styles.number}>
              {totalNum}
            </span>
            <img src={CartImage} alt="Description of the image" className={styles.cartIcon} id='cart' />
            <span className={styles.sumprice}>
              Total: $<span id="sumPrice">{totalPrice.toFixed(2)}</span>
            </span>
          </div>

        </div>
      </header>

      {isCartOpen && (

        <OpenCart setIsCartOpen={setIsCartOpen} />

      )}


    </>

  );
}
