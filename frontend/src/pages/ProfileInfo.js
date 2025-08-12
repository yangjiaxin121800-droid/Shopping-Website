import React, { useState, useContext, useEffect } from 'react';
import styles from '../css/UserProfile.module.css';
import Alert from './Alert';
export default function ProfileInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  // all the thing need in the form
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [postcode, setPostcode] = useState('');
  const userName = localStorage.getItem('username');
  const username = userName;
  const showUserDetail = () => {
    setIsEditing(false);
  };
  const showEdit = () => {
    setIsEditing(true);
  };
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userName) return;

      try {
        setLoading(true);
        const response = await fetch(`http://10.147.19.129:3036/api/user/info?username=${userName}`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }

        const detail = await response.json();
        setUser(detail.data);
        console.log(detail);
        setProvince(detail.data.province);
        setEmail(detail.data.email);
        setCity(detail.data.city);
        setAddress(detail.data.address);
        setPostcode(detail.data.postcode);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userName]);

  if (loading) return <div>Loading...</div>;


  if (error) return <div>Error: {error}</div>;

  const handleSave = async (event) => {
    event.preventDefault();

    const updatedInfo = {
      username,
      province,
      city,
      address,
      email,
      postcode,
    };
    console.log(updatedInfo);
    try {
      const response = await fetch('http://10.147.19.129:3036/api/user/info', {
        method: 'POST',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedInfo),
      });
      if (!response.ok) {
        throw new Error('Failed to save user info');
      }
      const edit = await response.json();
      console.log(edit);

      if (edit.code !== 200) {
        console.log('Setting alert message:', edit.message);
        setAlertMessage(edit.message || 'An error occurred');
      } else {
        setAlertMessage(null);
        user.province = province;
        user.email = email;
        user.address = address;
        user.city = city;
        user.postcode = postcode;
        setIsEditing(false);
      }

    } catch (error) {
      console.error('Error saving user info:', error);
      alert('Failed to save user information.');
    }
  };
  return (
    <div className={styles.information}>
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
      <h1>Information</h1>
      {!isEditing ? (<div className={styles.showDetail} id="UserDetail">
        <div className={styles.UserInfo}>
          <span className={styles.infoname}>User name: </span>
          <span className={styles.infocontent} id="firstName">{user.username}</span>
        </div>
        <div className={styles.UserInfo}>
          <span className={styles.infoname}>Province: </span>
          <span className={styles.infocontent} id="city">{user.province}</span>
        </div>

        <div className={styles.UserInfo}>
          <span className={styles.infoname}>City: </span>
          <span className={styles.infocontent} id="city">{user.city}</span>
        </div>
        <div className={styles.UserInfo}>
          <span className={styles.infoname}>Address: </span>
          <span className={styles.infocontent} id="address">{user.address}</span>
        </div>
        <div className={styles.UserInfo}>
          <span className={styles.infoname}>Email: </span>
          <span className={styles.infocontent} id="email">{user.email}</span>
        </div>
        <div className={styles.UserInfo}>
          <span className={styles.infoname}>Postcode: </span>
          <span className={styles.infocontent} id="zip">{user.postcode}</span>
        </div>

        <div className={styles.but}>
          <button className={styles.btnEdit} onClick={showEdit} >Edit</button>
        </div>
      </div>
      ) : (
        <form className={styles.EditInfo}>
          <div>
            <span className={styles.infoname}>User name: </span>
            <span className={styles.infocontent} id="firstName">{user.username}</span>
          </div><div>
            <label htmlFor="state">Province: </label>
            <input
              type="text"
              id="State"
              title="state"
              value={province}
              placeholder={user.province}
              onChange={(e) => setProvince(e.target.value)}
            />
          </div><div>
            <label htmlFor="city">City: </label>
            <input
              type="text"
              id="City"
              title="city"
              value={city}
              placeholder={user.city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div><div>
            <label htmlFor="address">Address: </label>
            <input
              type="text"
              id="Address"
              title="address"
              value={address}
              placeholder={user.address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div><div>
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id="Email"
              title="email"
              value={email}
              placeholder={user.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div><div>
            <label htmlFor="zip">Postcode: </label>
            <input
              type="text"
              id="Zip"
              title="zip"
              value={postcode}
              placeholder={user.postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />
          </div>
          <button id="btnBack" type="button" onClick={showUserDetail}>Back</button>
          <button id="btnSave" type="submit" onClick={handleSave}>Save</button>
        </form>
      )}

    </div>
  );
}