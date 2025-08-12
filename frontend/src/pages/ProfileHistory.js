import React, { useState, useContext, useEffect } from 'react';
import styles from '../css/UserProfile.module.css';
import PurchaseItem from './PurchaseItem';
export default function () {
  const userName = localStorage.getItem('username');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  // see history
  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://10.147.19.129:3036/api/order/list?username=${localStorage.getItem('username')}`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch purchase history');
        }
        const data = await response.json();
        setPurchaseHistory(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, []);
  return (
    <div className={styles.All} style={{overflow:'auto'}}>
      <h1>History</h1>
      {purchaseHistory.length > 0 ? (
        purchaseHistory.map((item, index) => (
          <PurchaseItem
            key={index}
            data={item}
          />
        ))
      ) : (
        !loading && <p> No purchase history available.</p>
      )}
    </div>
  );
}