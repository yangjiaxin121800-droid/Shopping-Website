// it's for mock pay
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext, { CartProvider } from './CartContext';
import Header from './Header';
import CartItem from './CartItem';
import styles from '../css/Payment.module.css';
import Alert from './Alert';

export default function Review() {
  const { cartItems, updateQuantity, totalPrice, totalNum } = useContext(CartContext);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [alertMessage, setAlertMessage] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const handleChange = (e) => {
    setCardNumber(e.target.value);
  };
  var tax = totalPrice * 0.13;
  var sum = totalPrice * 1.13;

  const cartData = cartItems.reduce((acc, item) => {
    acc.push({
      id: item.itemId,
      qty: item.qty
    });
    return acc;
  }, []);
  // about to payment
  const handleClick = async () => {
    console.log(cardNumber);
    if (!cardNumber) {
      setAlertMessage("Please enter your card!");

      return;
    }
    const data = [
      {
        username: username,
        card: cardNumber
      },
      ...cartData
    ];
    try {
      const response = await fetch('http://10.147.19.129:3036/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(`Failed`);
      } else {

        const res = await response.json();
        console.log(res);
        if (res.code !== 200) {
          console.log("budi");
          console.log('Setting alert message:', res.message);

          setAlertMessage(res.message);
        } else {
          setAlertMessage(null);
          navigate('/SuccessPay', { replace: true });

        }
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
      <main className={styles.Payment}>
        <div className={styles.cart}>
          <h1>Your Cart</h1>
          <div className={styles.content}>
            <p className={styles.titleItem}>Total <span>{totalNum}</span> Items </p>
            {/* should have a component of items */}

            {/* shoule be CartItems---same as what in other places */}
            {cartItems.length < 1 ? (
              <p>Your cart is empty</p>
            ) : (
              cartItems.map(item => (
                <CartItem
                  key={item.itemId}
                  id={item.itemId}
                  initialQuantity={item.qty}
                  name={item.name}
                  price={item.price}

                  img={`data:image/jpeg;base64,${item.img}`}
                  product={item}
                />
              ))
            )}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.pay}>
            <h3>
              Payment Card
            </h3>
            <input type='number' className={styles.payment} placeholder='Please input your card number' onChange={handleChange} />

          </div>
          <div className={styles.cartsum}>
            <h3>Order Summary</h3>
            <table>
              <tbody>

                <tr>
                  <td>Product Subtotal </td>
                  <td className={styles.textright} id="subtotal">${totalPrice.toFixed(2)}</td>
                </tr>

                <tr>
                  <td>Shipping </td>
                  <td className={styles.textright}>$0.00</td>
                </tr>

                <tr>
                  <td>Taxes </td>
                  <td className={styles.textright} id="tax">${tax.toFixed(2)}</td>
                </tr>

                <tr>
                  <td>Total </td>
                  <td className={styles.textright} style={{ color: 'red' }} id="estimateTotal">${sum.toFixed(2)}</td>
                </tr>

              </tbody>

            </table>
          </div>

          <button className={styles.btn} onClick={handleClick}  >
            Pay
          </button>

        </div>
      </main>
    </>
  );

}