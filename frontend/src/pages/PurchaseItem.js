import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/UserProfile.module.css';
export default function PurchaseItem({ data }) {
  const item = localStorage.getItem('itemId');
  console.log(data);
  const navigate = useNavigate();
  const handleClick = async () => {
    if (!item) {
      localStorage.setItem('itemId', data.id);
      localStorage.setItem('user', data.user_id);
      localStorage.setItem('card', data.card);
      localStorage.setItem('time', data.time);
      console.log(item);
      navigate('/history', { replace: true });
    }
    else {
      localStorage.removeItem('itemId');
      localStorage.removeItem('user');
      localStorage.removeItem('card');
      localStorage.removeItem('time');
      localStorage.setItem('user', data.user_id);
      localStorage.setItem('card', data.card);
      localStorage.setItem('time', data.time);
      localStorage.setItem('itemId', data.id);
      console.log(item);
      navigate('/history', { replace: true });
    }

  };
  return (
    <div className={styles.PurchaseItem} style={{minHeight: '160px'}}>
      <div className={styles.title}>
        <span className={styles.order}>Order Code : <span className={styles.codeNumber}>{data.id}</span></span>
        <span className={styles.orderDate}>{new Date(data.time).toLocaleString('en-US')}&nbsp;</span>
      </div>
      <div>
        <div className={styles.OrderContent}>
          <p><strong>Total Price:  </strong><span>${data.totalPrice.toFixed(2)}</span> </p>
          <div>
            <button onClick={handleClick}>

              View Detail

            </button>
          </div>

        </div>

      </div>
    </div>
  );
}