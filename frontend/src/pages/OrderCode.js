import React from 'react';
import styles from '../css/Dashboard.module.css';

export default function OrderCode({ order, onDetailClick, onDeleteClick }) {
  return (
    <div className={styles.Order}>
      <span className={styles.orderLeft}>
        {order.id}
      </span>
      <span className={styles.orderRight}>
        <button onClick={() => onDetailClick(order)}>Detail</button>
        <button onClick={() => onDeleteClick(order.id)}>Delete</button>
      </span>
    </div>
  );
}