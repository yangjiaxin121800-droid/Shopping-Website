import React, { useState }  from 'react';
import styles from '../css/Alert.module.css';
import CloseImage from '../img/close.png';
export default function Alert({ message, onClose }){
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false); // click to hide
        onClose();
    };
    if (!isVisible) {
        return null;
    }

    return(
        <div className={styles.DeleteCom}>
            <h3>Error!<img alt="ConfirmDelete" className={styles.confirmClose} src={CloseImage} onClick={handleClose}  /></h3>
            <div className={styles.ConfirmDetail}>
                <p>{message}</p>
                <button id="Back" className={styles.Back} onClick={handleClose}  >Back</button>
                
            </div>
        </div>
    );
}