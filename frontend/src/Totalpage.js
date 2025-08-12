import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Homepage from './pages/Homepage';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';
import ProductDetail from './pages/ProductDetail';
import Payment from './pages/Payment';
import SuccessPay from './pages/SuccessPay';
import Dashboard from './pages/Dashboard';
import { CartProvider } from './pages/CartContext';
//for admin


export default function App() {
  return (
    <BrowserRouter>
    <CartProvider>
      <Routes>
          <Route path="/login" element={ <Login /> } /> 
          <Route path="/register" element={ <Register />} /> 
          {/* wapped by CartContext*/}
          <Route
                    path="/*"
                    element={
                        <CartProvider>
                            <Routes>
                            <Route path="/" element={<Homepage />} />
        
                            <Route path="/history" element={ <History /> } /> 
                            <Route path="/userprofile" element={ <UserProfile />} /> 
                            
                            <Route path="/dashboard" element={<Dashboard />} /> 
                            <Route path="/detail" element={ <ProductDetail />} /> 
                            
                            <Route path="/payment"  element={<Payment />} />
                            <Route path="/SuccessPay" element={<SuccessPay />} /> 
                            </Routes>
                        </CartProvider>
                    }
                />
            
        
       
      </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}


