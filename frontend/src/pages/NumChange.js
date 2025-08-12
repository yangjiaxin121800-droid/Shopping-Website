import React from 'react';
import styles from '../css/Homepage.module.css';
export default function ProductCard() {
  return (
    <div className={styles.op}>
      <span className={styles.less}>-</span>
      <span className={styles.num}>1</span>
      <span className={styles.more}>+</span>
    </div>
  );
}