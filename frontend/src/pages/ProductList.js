import React, { useEffect, useState } from 'react';
import SearchImage from '../img/Search.png';
import styles from '../css/Homepage.module.css';
import ProductCard from './ProductCard';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function ProductList({ category, brands, priceLow, priceHigh }) {
  // React.useEffect(() => {
  //   console.log('Category:', category);
  //   console.log('Brands:', brands);
  //   console.log('Price Low:', priceLow);
  //   console.log('Price High:', priceHigh);
  // }, [category, brands, priceLow, priceHigh]);
  // console.log(Price_Low);
  // State for Switch (simplified)
  const [checkedA, setCheckedA] = React.useState(false);

  // State for Select
  const [select, setSelect] = React.useState('');

  // Handle Switch Change
  const handleSwitchChange = (event) => {
    const isChecked = event.target.checked;
    setCheckedA(isChecked);
    if (isChecked) {
      setFilteredProducts(productCards.filter((p) => p.stock > 0));
    } else {
      setFilteredProducts(productCards);
    }
  };


  // show the product card
  const [productCards, setproductCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const queryParams = new URLSearchParams({
          Category: category,
          Brands: brands,
          Price_Low: priceLow,
          Price_High: priceHigh,
        });
        const url = `http://10.147.19.129:3036/api/item/list?${queryParams}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        console.log(data);
        setproductCards(data.data);
        setFilteredProducts(data.data); // initially show all
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, brands, priceLow, priceHigh]);
  // search function
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelect(selectedValue);

    let sortedProducts = [...filteredProducts];

    if (selectedValue === "Price") {
      // price high to low
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (selectedValue === "revPrice") {
      // price low to high
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (selectedValue === "rate") {
      // sort by rate
      sortedProducts.sort((a, b) => b.rate - a.rate);
    }

    setFilteredProducts(sortedProducts);
  };
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleSearchClick = () => {
    if (searchQuery) {
      const filtered = productCards.filter((productCard) =>
        productCard.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(productCards);
    }
  };
  // about sorting

  return (
    <div className={styles.productList}>
      <div className={styles.wrap}>
      <div className={styles.productTitle}>
        <span className={styles.TotalResult}>
          <i>{filteredProducts.length}</i> results
        </span>
        <div className={styles.search}>
          <input
            className={styles.searchInput}
            placeholder="Search ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img alt="search_icon" src={SearchImage} className={styles.searchIcon} id="search" onClick={handleSearchClick} />
        </div>


        <div className={styles.stockTitle} style={{ marginRight: '5%' }}>
          <span className={styles.sortTitle}>Sort</span>
          <FormControl className={styles.SortingWay}>
            <InputLabel id="demo-simple-select-label" className={styles.notice}>Select a sorting way...</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={select}
              onChange={handleSelectChange}

            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Price">Price high to low</MenuItem>
              <MenuItem value="revPrice">Price low to high</MenuItem>
              <MenuItem value="rate">Popular Rate</MenuItem>

            </Select>
          </FormControl>
        </div>
        <div className={styles.stockTitle}>
          <Switch
            checked={checkedA}
            onChange={handleSwitchChange}
            color="primary"
            name="checkedA"
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
          <span>In Stock</span>
        </div>

      </div>
      <div className={styles.productAll}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((productCard) => (
            <ProductCard key={productCard.itemId
            } product={productCard} />
          ))
        ) : (
          <div>No product found</div>
        )}
      </div>
      </div>
    </div>
  );
}


