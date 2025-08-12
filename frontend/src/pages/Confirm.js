import React, { useState } from 'react';
import styles from '../css/Alert.module.css';
import CloseImage from '../img/close.png';
export default function Confirm({ itemId, onClose, onDeleteSuccess }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };
  if (!isVisible) {
    return null;
  }

  if (!isVisible) {
    return null;
  }
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://10.147.19.129:3036/api/item/info?itemId=${itemId}`, {
        method: 'DELETE',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ itemId }), 
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Item deleted successfully:', result);
        onClose();
        onDeleteSuccess();
        setIsVisible(false);

      } else {
        console.error('Failed to delete item:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error while deleting item:', error);
    }
  };
  return (
    <div className={styles.DeleteCom}>
      <h3>Confirm<img alt="ConfirmDelete" className={styles.confirmClose} src={CloseImage} onClick={handleClose} /></h3>
      <div className={styles.ConfirmDetail}>
        <p>Do you really want to delete?</p>
        <button id="Back" className={styles.deleteback} onClick={handleClose}  >Back</button>
        <button className={styles.deleteback} onClick={handleDelete}>Confirm</button>
      </div>
    </div>
  );
}