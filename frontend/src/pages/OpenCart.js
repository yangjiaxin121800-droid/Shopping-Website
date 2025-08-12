import React, { useState, useContext, useEffect } from 'react';
import styles from '../css/header.module.css';
import CloseImage from '../img/close.png';
import CartItem from './CartItem';
import { useNavigate } from 'react-router-dom';
import Alert from './Alert';
import CartContext, { CartProvider } from './CartContext';
export default function OpenCart({ setIsCartOpen }) {
  const { cartItems, updateQuantity, totalPrice } = useContext(CartContext);
  console.log(cartItems);
  console.log(totalPrice);
  const [alertMessage, setAlertMessage] = useState(null);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
  }, []);

  const cartData = cartItems.reduce((acc, item) => {
    acc.push({
      id: item.itemId,
      qty: item.qty
    });
    return acc;
  }, []);
  // close this cart
  const closeCart = async () => {
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
      }


    } catch (error) {
      console.error(error);
    } finally {
      setIsCartOpen(false);
    }
  };

  // handle the quantity change
  const handleQuantityChange = (id, newQuantity) => {
    updateQuantity(id, newQuantity);
  };

  var tax = totalPrice * 0.13;
  var sum = totalPrice * 1.13;
  const handleClick = async () => {
    const data = [
      { username: username },
      ...cartData
    ];
    try {
      const response = await fetch('http://10.147.19.129:3036/api/cart/validation', {
        method: 'POST',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(`Connect failed`);
      } else {
        const res = await response.json();
        console.log(res);
        if (res.code !== 200) {
          console.log("budi");
          console.log('Setting alert message:', res.message);
          const names = res.data.map(item => item.name).join(', ');
          setAlertMessage(`${names} - ${res.message || 'An error occurred'}`);
        } else {
          setAlertMessage(null);
          navigate('/payment', { replace: true });


        }
      }
    } catch (error) {
      console.error(error);
    }
  };


  // function about 
  return (
    <div className={styles.opencart}>
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
      <h1>Your Cart</h1>
      <img src={CloseImage} className={styles.close} onClick={closeCart} alt="Description of the image" />
      {/* it's a CartItem, need to be replace in the future */}
      <div className={styles.cartcontent}>
        {cartItems == null ? (
          <p>Your cart is empty</p>
        ) : (
          cartItems.map(item => (
            <CartItem
              key={item.itemId}
              id={item.itemId}
              initialQuantity={item.qty}
              name={item.name}
              price={item.price}
              onQuantityChange={handleQuantityChange}
              img={`data:image/jpeg;base64,${item.img}`}
              product={item}
            />
          ))
        )}
      </div>

      <div className={styles.cartsum}>
        <p>Order Summary</p>
        <table>
          <tbody>

            <tr>
              <td>Product Subtotal</td>
              <td className={styles.textright} id="subtotal">${totalPrice.toFixed(2)}</td>
            </tr>

            <tr>
              <td>Estimated Shipping</td>
              <td className={styles.textright}>$0.00</td>
            </tr>

            <tr>
              <td>Estimated Taxes</td>
              <td className={styles.textright} id="tax">${tax.toFixed(2)}</td>
            </tr>

            <tr>
              <td>Estimated Total</td>
              <td className={styles.textright} style={{ color: 'red' }} id="estimateTotal">${sum.toFixed(2)}</td>
            </tr>

          </tbody>

        </table>

        {isUserLoggedIn && (
          <button className={styles.buybtn} onClick={handleClick}>
            Buy them!
          </button>
        )}

      </div>
    </div>
  );
}