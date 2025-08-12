import React, { useState, useContext } from 'react';
import styles from '../css/Homepage.module.css';
import ProductList from './ProductList';
import Header from './Header';
import Navigation from './Navigation';
export default function Homepage() {
  // initially save the navigation lable---category/brand/price
  const [category, setCategory] = useState('');
  const [brands, setBrands] = useState('');
  const [priceLow, setPriceLow] = useState(0);
  const [priceHigh, setPriceHigh] = useState(3000);
  // function to update their value
  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleBrandsChange = (value) => {
    setBrands(value);
  };

  const handlePriceLowChange = (low) => {
    setPriceLow(low);
  };

  const handlePriceHighChange = (high) => {
    setPriceHigh(high);
  };
  return (
    <div className={styles.Homepage}>
      
        <Header />
      
      <main className={styles.homemain}>
        {/* navigation part */}
      <Navigation
        onCategoryChange={handleCategoryChange}
        onBrandsChange={handleBrandsChange}
        onPriceLowChange={handlePriceLowChange}  
        onPriceHighChange={handlePriceHighChange}
      />
      {/* show product list */}
      <ProductList
        category={category}
        brands={brands}
        priceLow={priceLow}
        priceHigh={priceHigh}
      />

      </main>
    </div>
  );
}


