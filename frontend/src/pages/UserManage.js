import React, { useState, useEffect } from 'react';
import styles from '../css/Dashboard.module.css';
import DeleteImage from '../img/delete.png';

export default function UserManage() {
  // control show info or edit
  const [isEditing, setIsEditing] = useState(false);
  const showUserDetail = () => {
    setIsEditing(false);
  };
  const showEdit = () => {
    setIsEditing(true);
  };
  // gain data from json
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://10.147.19.129:3036/user/list', {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      setLoading(false);
      console.log('Fetched users:', data.data);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Error fetching users:', err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  return (

    <div className={styles.userContent}>
      {/* should use grid */}
      {/* user list part */}
      <div className={styles.UserList}>
        <h2>User List</h2>
        <ul>

          <li>
            <img src={DeleteImage} className={styles.delete} />
            <span>Jacquette Marion</span>
            <p><i>id : 1</i></p>

          </li>
        </ul>
      </div>

      <div className={styles.userDetail}>
        {/* like what in profile */}
        <h2>User Details</h2>
        {!isEditing ? (<div className={styles.showDetail} id="UserDetail">
          <div className={styles.UserInfo}>
            <span className={styles.infoname}>ID :</span>
            <span className={styles.infocontent} id="userId">1</span>
          </div>
          <div className={styles.UserInfo}>
            <span className={styles.infoname}>First name :</span>
            <span className={styles.infocontent} id="firstName">Jacquette</span>
          </div>
          <div className={styles.UserInfo}>
            <span className={styles.infoname}>Last name :</span>
            <span className={styles.infocontent} id="lastName">Marion</span>
          </div>
          <div className={styles.UserInfo}>
            <span className={styles.infoname}>State :</span>
            <span className={styles.infocontent} id="state">Texas</span>
          </div>
          <div className={styles.UserInfo}>
            <span className={styles.infoname}>City :</span>
            <span className={styles.infocontent} id="city">Lubbock</span>
          </div>
          <div className={styles.UserInfo}>
            <span className={styles.infoname}>Address :</span>
            <span className={styles.infocontent} id="address">207 Ryan Avenue</span>
          </div>
          <div className={styles.UserInfo}>
            <span className={styles.infoname}>Email :</span>
            <span className={styles.infocontent} id="email">jmarion0@nyu.edu</span>
          </div>
          <div className={styles.UserInfo}>
            <span className={styles.infoname}>Zip :</span>
            <span className={styles.infocontent} id="zip">79491</span>
          </div>
          <div className={styles.UserInfo}>
            <span className={styles.infoname}>Payment Card :</span>
            <span className={styles.infocontent} id="card">7747 7845 5981</span>
          </div>
          <div className={styles.but}>
            <button className={styles.btnEdit} onClick={showEdit} >Edit</button>
          </div>
        </div>
        ) : (
          <form className={styles.EditInfo}>
            ID :<span>1</span>
            <label for="firstname">First Name:</label>
            <input type="text" id="firstname" title="firstname" />
            <label for="lastname">Last Name:</label>
            <input type="text" id="lastname" title="lastname" />
            <label for="state">State:</label>
            <input type="text" id="State" title="state" />
            <label for="city">City:</label>
            <input type="text" id="City" title="city" />
            <label for="address">Address:</label>
            <input type="text" id="Address" title="address" />
            <label for="email">Email:</label>
            <input type="email" id="Email" title="email" />
            <label for="zip">Zip:</label>
            <input type="text" id="Zip" title="zip" />
            <label for="zip">Payment Card :</label>
            <input type="text" id="card" title="card" />
            <button id="btnBack" onClick={showUserDetail}>Back</button>
            <button id="btnSave" onClick={showUserDetail}>Save</button>
          </form>
        )}
      </div>
      <div className={styles.port}>
        <div className={styles.portProduct}>
          <h2>Portfolio</h2>
          {/* should have a component--1 */}
        </div>
        <div className={styles.productOrder}>
          <h2>Orders</h2>
          {/* same in lab3 */}
        </div>
      </div>
    </div>
  );
}