import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import styles from '../css/Homepage.module.css';
import downImage from '../img/down.png';
function valuetext(value) {
  return `$ ${value}`;
}
// function should transit to parent
export default function Navigation({
  onCategoryChange, onBrandsChange, onPriceLowChange, onPriceHighChange
}) {
  // value should be passed
  const [value, setValue] = React.useState([0, 3000]);
  const [priceLow, setPriceLow] = useState(0);
  const [priceHigh, setPriceHigh] = useState(3000);
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedBrands, setSelectedBrands] = React.useState('');
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onCategoryChange(category);

  };

  const handleBrandSelect = (brand) => {
    setSelectedBrands(brand);
    onBrandsChange(brand);

  };

  const handlePriceChange = (event, newValue) => {
    setValue(newValue);
  };

  // execute when click search
  const handlePriceClick = () => {
    const [low, high] = value;
    onPriceLowChange?.(low);
    onPriceHighChange?.(high);

  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={styles.Navigation}>
      <div className={styles.menu}>
        <button className={styles.menuTitle}>Category
          <img src={downImage} alt="down" />
        </button>
        <ul className={styles.extendMenu}>
          <li
            className={`${styles.item} ${selectedCategory === '' ? styles.selectedNav : ''}`}
            onClick={() => handleCategorySelect('')}
          >
            ALL Category
          </li>
          <li
            className={`${styles.item} ${selectedCategory === 'Laptop' ? styles.selectedNav : ''}`}
            onClick={() => handleCategorySelect('Laptop')}
          >
            Laptop
          </li>
          <li
            className={`${styles.item} ${selectedCategory === 'Desktop' ? styles.selectedNav : ''}`}
            onClick={() => handleCategorySelect('Desktop')}
          >
            Desktop
          </li>
          <li
            className={`${styles.item} ${selectedCategory === 'Tablet' ? styles.selectedNav : ''}`}
            onClick={() => handleCategorySelect('Tablet')}
          >
            Tablet
          </li>
          <li
            className={`${styles.item} ${selectedCategory === 'Hard Drive' ? styles.selectedNav : ''}`}
            onClick={() => handleCategorySelect('Hard Drive')}
          >
            Hard Drives
          </li>
          <li
            className={`${styles.item} ${selectedCategory === 'Accessory' ? styles.selectedNav : ''}`}
            onClick={() => handleCategorySelect('Accessory')}
          >
            Accessory
          </li>
        </ul>
      </div>

      <div className={styles.menu}>
        <button className={styles.menuTitle}>Brands
          <img src={downImage} alt="down" />
        </button>
        <ul className={styles.extendMenu}>
          <li
            className={`${styles.item} ${selectedBrands === '' ? styles.selectedNav : ''}`}
            onClick={() => handleBrandSelect('')}
          >
            ALL Brands
          </li>
          <li
            className={`${styles.item} ${selectedBrands === 'HP' ? styles.selectedNav : ''}`}
            onClick={() => handleBrandSelect('HP')}
          >
            HP
          </li>
          <li
            className={`${styles.item} ${selectedBrands === 'DELL' ? styles.selectedNav : ''}`}
            onClick={() => handleBrandSelect('DELL')}
          >
            DELL
          </li>
          <li
            className={`${styles.item} ${selectedBrands === 'APPLE' ? styles.selectedNav : ''}`}
            onClick={() => handleBrandSelect('APPLE')}
          >
            APPLE
          </li>
          <li
            className={`${styles.item} ${selectedBrands === 'LENOVO' ? styles.selectedNav : ''}`}
            onClick={() => handleBrandSelect('LENOVO')}
          >
            LENOVO
          </li>
        </ul>
      </div>

      <div className={styles.menu} >
        <button className={styles.menuTitle}>Price
          <img src={downImage} alt="down" />
        </button>
        <div className={styles.scale}>
          <Slider
            getAriaLabel={() => 'Minimum distance'}
            value={value}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            min={0}
            max={3000}
            disableSwap
          />
          <div className={styles.Checkprice} onClick={handlePriceClick} >
            Search
          </div>
        </div>
      </div>




    </div>
  );
}

