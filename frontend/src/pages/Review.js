// it's for writing a review for the selected item
import React, { useState }  from 'react';
import Header from './Header';
import styles from '../css/Review.module.css';
import ComImage from '../img/computer.jpg';
import Rating from '@mui/material/Rating';
export default function Review(){
    const [value, setValue] = useState(2.5);
    return(
        <>
            <Header />
            <main className={styles.Review}>
                {/* here need to be a pic in the top */}
                <div className={styles.reviewBlock}>
                        <img alt="com" src={ComImage} className={styles.pic} />
                        <h1>it's name</h1>
                        <div className='review'>
                            <p>Select a Rating:</p>
                            <div className={styles.rating}>
                                <Rating
                                        name="half-rating"
                                        value={value}
                                        precision={0.5}
                                        onChange={(event, newValue) => {
                                        setValue(newValue);
                                        }}
                                    />
                                    <span className={styles.dis}>{value} Out of 5</span>
                            </div>
  
                            {/* should rate here--API */}
                            {/* should review here--API */}
                            <button>
                            Submit
                        </button>
                        </div>
                        
                </div>
                
            </main>
        </>
    );

}