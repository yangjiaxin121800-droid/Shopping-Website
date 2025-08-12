import React from 'react';
import { Link } from 'react-router-dom';
import ComImage from '../img/computer.jpg';
export default function HistoryItem({ styles, data }) {
  console.log(data);
  return (
    <div className={styles.historyItem}>
      {/* should be a pic in the left */}
      <div className={styles.Picbox}>
        <img alt="com" src={`data:image/jpeg;base64,${data.img}`} className={styles.pic} />
      </div>

      <div className={styles.introduce}>
        <p>{data.name}</p>
        <p>Price : <span> ${data.price}</span> </p>
        <p>Quantity : <span>{data.qty}</span></p>
      </div>

    </div>
  );
}