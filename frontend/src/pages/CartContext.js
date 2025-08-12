import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// create cart context
const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [currentItemID, setCurrentItemID] = useState(null); //see product detail
  const [userName, setUsername] = useState(null); //get the user loged
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  // console.log(username);
  useEffect(() => {
    const fetchCartData = async () => {
      if (username == null) {
        return;
      }
      try {
        const username = localStorage.getItem('username');
        const response = await fetch(`http://10.147.19.129:3036/api/cart/list?username=${username}`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        // console.log(response)
        if (response.ok) {
          const data = await response.json();
          setCartItems(data.data || []);
          console.log(data);
        } else if (response.status == 403) {
          navigate('/login', { replace: true });
        } else {
          console.error('Failed to fetch cart data');
        }

      } catch (error) {
        console.log(error)
      }
    };

    fetchCartData();
  }, []);

  // Add product to cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      console.log(prevItems);
      const existingItem = prevItems.find((cartItem) => cartItem.itemId === item.itemId);

      if (existingItem) {
        // only add to quantity
        return prevItems.map((cartItem) =>
          cartItem.itemId === item.itemId
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      } else {
        // add new item and set qty to 1
        return [...prevItems, { ...item, qty: 1 }];
      }
    });
  };

  const decrementQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.itemId === itemId) {
            const newQty = item.qty - 1;
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter((item) => item.qty != 0)
    );
  };


  const removeFromCart = async (itemId) => {
    const itemToRemove = cartItems.find(item => item.itemId === itemId);

    if (!itemToRemove) {
      console.error('Item not exist');
      return;
    }

    setCartItems((prevItems) => prevItems.filter(item => item.itemId !== itemId));
    console.log(cartItems);

  };

  const updateQuantity = (itemId, newProductNum) => {

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.itemId === itemId ? { ...item, productNum: newProductNum } : item
      )
    );
  };
  const calculateTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const calculateSum = () => {
    return cartItems.reduce((totalNum, item) => totalNum + item.qty, 0);
  };
  const totalPrice = calculateTotalPrice();
  const totalNum = calculateSum();
  // save the new itemid
  const setItemID = (id) => {
    setCurrentItemID(id);
  };
  const setLogname = (name) => {
    setUsername(name);
    console.log('CartProvider state userName:', userName);
  }
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, totalPrice, totalNum, currentItemID, setItemID, setLogname, userName, decrementQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;