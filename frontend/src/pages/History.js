// it's for history payment
import React, { useState, useContext, useEffect } from 'react';
import Header from './Header';
import HistoryItem from './HistoryItem';
import styles from '../css/History.module.css';
export default function History() {
  const item = localStorage.getItem('itemId');
  const new1 = item.slice(1);
  const user = localStorage.getItem('user');
  const time = localStorage.getItem('time');
  const card = localStorage.getItem('card');

  const [history, setHistory] = useState([]);
  console.log(new1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://10.147.19.129:3036/api/order/details?orderId=${new1}`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch purchase history');
        }
        const data = await response.json();
        console.log(data);
        setHistory(data.data);
        console.log(history);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [new1]);
  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;
  const totalPrice = history.reduce((acc, item) => {
    return acc + item.price * item.qty; // calc and accumulate
  }, 0);
  const tax = totalPrice * 0.13;
  const sum = tax + totalPrice;
  return (
    <>
      <Header />
      <main className={styles.History}>
        <div className={styles.Left}>
          <div className={styles.title}>
            <span>
              {time}
            </span>
            <span>
              <strong>Order : </strong>
              <span id='ordercode'>
                {item}
              </span>
            </span>
          </div>
          <div className={styles.content}>
            <p className={styles.titleItem}>Total <span>{history.length}</span> Items </p>
            {/* should have a component of items */}
            {history.length > 0 ? (
              history.map((item, index) => (
                <HistoryItem styles={styles} key={index} data={item} />
              ))
            ) : (
              !loading && <p>No purchase history available.</p>
            )}

          </div>
        </div>

        <div className={styles.Right}>
          <div className={styles.address}>
            <h3>
              User Name
            </h3>
            <p>
              {user}
            </p>

          </div>
          <div className={styles.pay}>
            <h3>
              Payment method
            </h3>
            <p className={styles.payment}>
              {card}
            </p>
          </div>
          <div>

            <div className={styles.price}>
              <strong>
                Subtotal
              </strong>
              <span>
                $ {totalPrice.toFixed(2)}
              </span>
            </div>

            <div className={styles.price}>
              <strong>
                Taxs
              </strong>
              <span>
                $ {tax.toFixed(2)}
              </span>
            </div>

            <div className={styles.price}>
              <h3>
                Total
              </h3>
              <h3 className={styles.totalprice}>

                $ {sum.toFixed(2)}


              </h3>
            </div>
          </div>
        </div>
      </main>
    </>
  );

}