import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from '../css/LogRegister.module.css';
import Alert from './Alert';
import CartContext from './CartContext';
export default function Register() {
  const [alertMessage, setAlertMessage] = useState(null);
  const [repeatPassword, setRepeatPassword] = useState('');
  const { setLogname } = useContext(CartContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    address: '',
    city: '',
    province: '',
    postcode: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async () => {
    // if (formData.password !== formData.repeatPassword) {
    //   alert("Passwords do not match!");
    //   return;
    // }
    if (formData.password !== repeatPassword) {
      setAlertMessage("Password do not match!");
      return;
    }
    try {
      const response = await fetch('http://10.147.19.129:3036/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      if (data.code !== 200) {
        console.log('Setting alert message:', data.message);
        setAlertMessage(data.message || 'An error occurred');
      } else {
        setAlertMessage(null);
        setLogname(formData.username);
        localStorage.removeItem('username');
        localStorage.setItem('username', formData.username);
        navigate('/');
      }

    } catch (error) {
      console.error(error);
      alert('Error occurred while registering.');
    }
  };
  return (
    <>
      {/* A header like what in Homepage but with a little difference */}
      <header className={styles.AppHeader}>
        <h1>
          <Link to="/">
            Computer Store
          </Link>
        </h1>

      </header>

      <main>

        <div>

          {alertMessage && (
            <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
          )}
          <form className={styles.register}>
            <h1>Register</h1>
            <div className={styles.formgroup}>
              <label>User Name :</label>
              <input type="text"
                className={styles.formcontrol}
                id="username"
                value={formData.username}
                onChange={handleChange} />
            </div>

            <div className={styles.formgroup}>
              <label>Password :</label>
              <input type="password" className={styles.formcontrol} id="password" value={formData.password}
                onChange={handleChange} />
            </div>

            <div className={styles.formgroup}>
              <label>Repeat :</label>
              <input type="password" className={styles.formcontrol} id="repeatPassword" placeholder='repeat onece your password...' value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)} />
            </div>

            <div className={styles.formgroup}>
              <label>Email :</label>
              <input type="text" className={styles.formcontrol} id="email" value={formData.email}
                onChange={handleChange} />
            </div>

            <div className={styles.formgroup}>
              <label>Address :</label>
              <input type="text" className={styles.formcontrol} id="address" value={formData.address}
                onChange={handleChange} />
            </div>
            <div className={styles.formgroup}>
              <label>City :</label>
              <input type="text" className={styles.formcontrol} id="city" value={formData.city}
                onChange={handleChange} />
            </div>
            <div className={styles.formgroup}>
              <label>Provience :</label>
              <input type="text" className={styles.formcontrol} id="province" value={formData.province}
                onChange={handleChange} />
            </div>
            <div className={styles.formgroup}>
              <label>Postcode :</label>
              <input type="text" className={styles.formcontrol} id="postcode" value={formData.postcode}
                onChange={handleChange} />
            </div>


            <div className={styles.formcheck}>
              <Link to="/login" > Have an account? Click to Log In.</Link>
            </div>
            <div className={styles.btn} id="submit1" onClick={handleSubmit}>Register</div>
          </form>


        </div>

      </main>

    </>
  );
}
