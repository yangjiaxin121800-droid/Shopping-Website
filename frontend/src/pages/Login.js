import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from '../css/LogRegister.module.css';
import Alert from './Alert';
import CartContext from './CartContext';
export default function Login() {
  const [alertMessage, setAlertMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setLogname, userName } = useContext(CartContext);
  const navigate = useNavigate();
  const handleLogin = async () => {
    if (!username || !password) {
      setAlertMessage("Please enter username and password");
      return;
    }

    try {
      console.log(username, password)
      const response = await fetch('http://10.147.19.129:3036/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log(data);
      if (data.code != 200) {
        // console.log("budi");
        console.log('Setting alert message:', data.message);
        setAlertMessage(data.message || 'An error occurred');
      } else {
        setAlertMessage(null);
        console.log(username);
        setLogname(username);
        localStorage.removeItem('username');
        localStorage.setItem('username', username);
        localStorage.setItem('token', data.data.token);
        console.log(userName);
        if (data.data.role == 0) {
          console.log('user login')
          navigate('/', { replace: true });
        }
        else if (data.data.role == 1) {
          console.log('admin login')
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      console.error('Error during login:', err.message);
      alert('Login failed.');
    }
  };

  return (
    <>
      {/* A header like what in Homepage but with a little difference */}
      <header className={styles.AppHeader}>
        <h1> 
          Computer Store
        </h1>
      </header>

      <main>
        {alertMessage && (
          <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
        )}
        <div className={styles.Log}>

          <form className={styles.IdLog}>
            <h1>Log In</h1>
            <div className={styles.formgroup}>
              <label>Name:</label>
              <input
                type="text"
                className={styles.formcontrol}
                id="username"
                placeholder="Your Id.."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={styles.formgroup}>
              <label>Password:</label>
              <input
                type="password"
                className={styles.formcontrol}
                id="password"
                placeholder="Your Password.."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.formcheck}>
              <Link to="/register" >No account? Click to register.</Link>
            </div>
            <div className={styles.btn} id="submit1" onClick={handleLogin}>Log in</div>
          </form>


        </div>

      </main>

    </>
  );
}
