import React, { useEffect, useState, useContext } from 'react';
import Header from './Header';
import CommentItem from './CommentItem';
import Rating from '@mui/material/Rating';
import styles from '../css/productDetail.module.css';
import CartContext from './CartContext';
export default function ProductDetail() {
  const [showAddToCart, setShowAddToCart] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const { cartItems, addToCart, decrementQuantity, currentItemID } = useContext(CartContext);
  const currentQuantity = cartItems.find((item) => item.itemId == currentItemID)?.qty || 0;
  console.log(currentQuantity);
  console.log(cartItems);
  useEffect(() => {
    setQuantity(currentQuantity);
    setShowAddToCart(currentQuantity === 0); // show Add to Cart when qty = 0
  }, [currentItemID, cartItems]);
  console.log(currentItemID);
  const [productDetail, setProductDetail] = useState(null);

  const handleAddToCart = () => {
    setShowAddToCart(false);
    setQuantity(1);
    addToCart(productDetail);
  };

  const increment = () => {
    if (quantity < productDetail.stock) {
      setQuantity(prev => prev + 1)
      addToCart(productDetail);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
      decrementQuantity(currentItemID);
    } else {
      setShowAddToCart(true);
      decrementQuantity(currentItemID);
    }
  };
  // Review part

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // read reviews from Mock API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('https://674c812654e1fca9290cc39b.mockapi.io/RateReview');
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);
  // about the product detail
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
          console.log('Failed to fetch product details');
        }

        const detail = await response.json();
        setProductDetail(detail.data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [currentItemID]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  if (!productDetail) {
    return <div>Failed to load product details. Please try again later.</div>;
  }
  // dynamic spec table
  const renderSpecTable = () => {
    if (!productDetail.spec) return null;

    return (
      <table>
        <tbody>
          {Object.entries(productDetail.spec).map(([key, value], index) => (
            <tr key={index}>
              <td className={styles.strong}>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  return (
    <>
      <Header />
      <main className={styles.DetailMain}>
        {/* show the selected Product */}
        <div className={styles.left}>
          {/* here is one pic */}
          <img alt="com" src={`data:image/jpeg;base64,${productDetail.img}`} className={styles.pic} />

        </div>
        <div className={styles.right}>

          <h2>{productDetail.name}</h2>
          <h2>Price: <span className={styles.price} data-value="449.99">${productDetail.price}</span></h2>
          <div className={styles.rate}>
            {/* UI API of star */}
            <Rating name="half-rating-read" className="custom-rating" defaultValue={Number(productDetail.rate)} precision={0.5} readOnly sx=
              {{
                '& .MuiRating-decimal': {
                  display: 'inline-flex',
                  position: 'relative',
                  transform: 'none'
                }
              }} />
            <span>
              <span id='point'> {productDetail.rate} </span>
              out of 5
            </span>
          </div>
          <h2>Stock: {productDetail.stock}</h2>

          {showAddToCart ? (
            <button
              className={styles.addcart}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          ) : (
            <div className={styles.op}>
              <span className={styles.less} onClick={decrement}>-</span>
              <span className={styles.num}>{quantity}</span>
              <span className={styles.more} onClick={increment}>+</span>
            </div>
          )}

        </div>
        <div className={styles.ContainTable}>
          {renderSpecTable()}
        </div>


        <div className={styles.allComments}>
          {/* should have a component of one single comment */}
          {comments.map((comment, index) => (
            <CommentItem
              key={index}
              username={comment.name}
              date={comment.createdAt}
              rate={comment.rate}
              review={comment.review}
            />
          ))}

        </div>

      </main>

    </>

  );


}
