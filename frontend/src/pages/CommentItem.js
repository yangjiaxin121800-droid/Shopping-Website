import React from 'react';
import Rating from '@mui/material/Rating';
import styles from '../css/productDetail.module.css';
export default function CommentItem({ username, date, rate, review }) {
  rate = rate / 2;
  return (
    <div className={styles.comment}>
      <div className={styles.title}>
        <span className={styles.SpanLeft}>
          {username}
        </span>
        <span className={styles.SpanRight}>
          <Rating name="half-rating-read" value={rate} precision={0.5} readOnly />
          <span className={styles.intro}>{rate} </span>
        </span>
      </div>
      <div className={styles.content}>
        <span>
          {review}
        </span>
      </div>
      <p>
        {new Date(date).toLocaleString()}
      </p>
    </div>
  );
}