import React, { useState, useEffect } from 'react';
import ManageProductCard from './ManageProductCard';
import styles from '../css/Dashboard.module.css';
import FilterImage from '../img/filter.png';
import Confirm from './Confirm';
export default function ProductManage() {
  const [priceLow, setPriceLow] = useState(0);
  const [priceHigh, setPriceHigh] = useState(3000);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrands, setSelectedBrands] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentItemID, setCurrentItemID] = useState(null);
  const [productDetail, setProductDetail] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  // change stock
  const [stock, setStock] = useState(productDetail ? productDetail.stock : '');
  const [isEditing, setIsEditing] = useState(false);
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleStockChange = (event) => {
    setStock(event.target.value);
  };

  const handleSaveClick = async () => {
    productDetail.stock = stock;
    try {
      const response = await fetch(`http://10.147.19.129:3036/api/item/stock?itemId=${productDetail.itemId}&qty=${stock}`,
        {
          method: 'PUT',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setIsEditing(false);
        console.log('Stock updated successfully:', result);
      } else {
        console.error(
          'Failed to update stock:',
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error while updating stock:', error);
    }
    console.log("Updated stock:", productDetail.stock);
  };


  const handleBrandChange = (event) => {
    setSelectedBrands(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSortChange = (event) => {
    const sortOption = event.target.value;
    let sortedProducts = [...filteredProducts];

    if (sortOption == 'Price') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption == 'revPrice') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption == 'rate') {
      sortedProducts.sort((a, b) => b.rate - a.rate);
    }

    setFilteredProducts(sortedProducts);
  };

  // get items info
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          Category: selectedCategory,
          Brands: selectedBrands,
          Price_Low: priceLow,
          Price_High: priceHigh,
        });

        const url = `http://10.147.19.129:3036/api/item/list?${queryParams}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setFilteredProducts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedBrands, priceLow, priceHigh]);

  // gain the product detail
  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!currentItemID) return;

      try {
        setLoading(true);
        const response = await fetch(`http://10.147.19.129:3036/api/item/details?itemId=${currentItemID}`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }

        const detail = await response.json();
        setProductDetail(detail.data);
        console.log(detail.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [currentItemID]);

  const handleProductClick = (product) => {
    setCurrentItemID(product.itemId);
  };

  // delete one product
  const handleDelete = () => {
    console.log(productDetail.itemId);
    setAlertMessage("111");
  }
  const updateStockToZero = () => {
    setProductDetail((prev) => ({ ...prev, stock: 0 }));
  };

  return (
    <div className={styles.proContent}>
      {alertMessage && (
        <Confirm itemId={productDetail.itemId} onClose={() => setAlertMessage(null)} onDeleteSuccess={updateStockToZero} />
      )}
      <aside>
        <select id="ManuList" value={selectedBrands} onChange={handleBrandChange}>
          <option value="">Choose a Manufacturer</option>
          <option value="APPLE">Apple</option>
          <option value="DELL">Dell</option>
          <option value="HP">HP</option>
          <option value="LENOVO">LENOVO</option>
        </select>
        <fieldset>
          <select id="categoryList" className={styles.categoryList} value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            <option value="Laptop">Laptop</option>
            <option value="Desktop">Desktop</option>
            <option value="Tablet">Tablet</option>
            <option value="Hard Drive">Hard Drive</option>
            <option value="Accessory">Accessory</option>

          </select>
          <fieldset className={styles.interface}>

            <div className={styles.search}>
              <select id="filterWay" onChange={handleSortChange}>
                <option value="">Choose a Filter</option>
                <option value="Price">Price high to low</option>
                <option value="revPrice">Price low to high</option>
                <option value="rate">Popular Rate</option>

              </select>
              <img alt="search_icon" src={FilterImage} className={styles.filterIcon} />
            </div>
            <ul id="ComputerList" className={styles.ComputerList}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <li key={product.itemId} onClick={() => handleProductClick(product)}  >
                    <ManageProductCard product={product} />
                  </li>
                ))
              ) : (
                <div>No products found</div>
              )}
            </ul>
          </fieldset>

        </fieldset>
      </aside>

      <section className={styles.detail}>
        {/* <h2>Computer Model Details</h2> */}
        {productDetail && productDetail.img ? (
          <img alt="Select one model from list" src={`data:image/jpeg;base64,${productDetail.img}`} className={styles.showPic} id="Pic" />
        ) : (
          <div className={styles.showPic} id="deletePic">Select one model...</div>
        )}

        {/* <div className={styles.showPic} id="deletePic"style={{ display: 'block' }}>Select one model...</div> */}
        <h3>Model Name: <span>{productDetail ? productDetail.name : 'would show here..'}</span></h3>

        <div className={styles.computerDetails}>
          <p>Product ID: </p><p id="releaseDate">{productDetail ? productDetail.itemId : '...'}</p>
          <p>Category: </p><p id="category">{productDetail ? productDetail.ctg : '...'}</p>
          <p>Price: </p><p id="specifications">{productDetail ? productDetail.price : '...'}</p>
          <p>Manufacture: </p><p id="manufacture">{productDetail ? productDetail.brand : '...'}</p>
          <p>Stock: </p>
          {isEditing ? (
            <input
              type="number"
              value={stock}
              onChange={handleStockChange}
              className={styles.stockInput}
            />
          ) : (
            <p id="popularity">{productDetail ? productDetail.stock : '...'}</p>
          )}
          <p>Rate: </p><p id="popularity">{productDetail ? productDetail.rate : '...'}</p>
        </div>
        <button
          id="btnEdit"
          className={styles.btnDelete}
          onClick={isEditing ? handleSaveClick : handleEditClick}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
        <button id="btnDelete" className={styles.btnDelete} onClick={handleDelete}>Delete</button>
      </section>
    </div>
  );
}