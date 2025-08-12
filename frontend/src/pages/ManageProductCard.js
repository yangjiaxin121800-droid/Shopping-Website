import React, { useState, useEffect } from 'react';
import styles from '../css/Dashboard.module.css';
import DeleteImage from '../img/delete.png';
import Confirm from './Confirm';

export default function ManageProductCard({ product }) {
  const [alertMessage, setAlertMessage] = useState(null);

  const handleDelete = () => {
    console.log(product.itemId);
    setAlertMessage("111");
  }
  const updateStockToZero = () => {
    product.stock = 0;
  };
  return (
    <>
      {alertMessage && (
        <Confirm itemId={product.itemId} onClose={() => setAlertMessage(null)} onDeleteSuccess={updateStockToZero} />
      )}
      <img alt="ConfirmDelete" className={styles.DeleteCom} src={DeleteImage} onClick={handleDelete} />
      <span>{product.name}</span>
      <p>Price: <i className="Popular">{product.price}</i></p>
      <p>Stock: <i className="stockcode">{product.stock}</i></p>
      <p>Rate: <i className="relDeate">{product.rate}</i></p>

    </>
  );

}