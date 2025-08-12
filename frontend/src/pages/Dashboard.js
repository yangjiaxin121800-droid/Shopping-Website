import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ProductManage from './ProductManage.js';
import OrderManage from './OrderManage';
import styles from '../css/Dashboard.module.css';
import Alert from './Alert';
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const admin = localStorage.getItem('username');
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState(null);
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://10.147.19.129:3036/api/user/list', {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          if (response.status === 403) {
            localStorage.removeItem('username');
            localStorage.removeItem('token');
            navigate('/login', { replace: true });
            return;
          }
        }

      } catch (error) {
        console.log(error)
      }
    };

    checkAuth()
  }, []);

  const menuItems = [

    'Products',
    'Orders',
  ];
  const tabContents = [
    (
      <ProductManage />
    ), (
      <OrderManage />
    )
  ];
  return (
    <main className={styles.dashboard}>
      {/* left navigation bar */}
      <div className={styles.LeftNav}>
        <h1>
          <Link to="/">
            Computer Store
          </Link>
        </h1>
        <p className={styles.manage}>Management</p>
        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={activeTab === index ? styles.active : ''}
              onClick={() => setActiveTab(index)} // toggle options
            >
              {item}
            </li>
          ))}
          <li onClick={handleLogout}>
            Log out
          </li>

        </ul>
      </div>
      <div className={styles.Right}>
        <h2>Dashboard</h2>
        <p className={styles.adminName}>Admin : <span>{admin}</span></p>
        <div className={styles.content}>
          {/* if it's user bodard */}
          {tabContents[activeTab]}
          {/* if it's product also its the func to add */}

        </div>


      </div>
    </main>
  );
}