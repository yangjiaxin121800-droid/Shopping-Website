import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import ProfileInfo from './ProfileInfo';
import ProfileHistory from './ProfileHistory';
import styles from '../css/UserProfile.module.css';
export default function UserProfile() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  // control to show edit
  const userName = localStorage.getItem('username');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // ul li
  const menuItems = [
    'My Information',

    'Purchase History',
    'Log out',
  ];
  // manage ul
  const handleMenuClick = (index) => {
    if (menuItems[index] === 'Log out') {
      if (localStorage.getItem("username") == null) {
        navigate('/login', { replace: true });
      } else {
        if (window.confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
      }

    }
    setActiveTab(index);
  };

  const tabContents = [
    (
      <ProfileInfo />
    ),

    (

      <ProfileHistory />
    ),

    (
      <div>
        <h2>Log Out</h2>
        <p>You didn't log out.</p>
      </div>
    ),
  ];
  return (
    <>
      <Header />
      <main className={styles.profileMain}>
        {/* choose a way to change the thing shown in the right */}

        <div className={styles.LeftBar}>
          <h2>My Profile</h2>
          <ul>
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`${styles.menuItem} ${activeTab === index ? styles.active : ''}`}
                onClick={() => handleMenuClick(index)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.RightContent}>
          {/* infomation, use grid to control */}
          {tabContents[activeTab]}
          {/* <div className='infomation'>
                <div className={styles.showDetail} id="UserDetail">
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
                        <button className={styles.btnEdit}>Edit</button>
                    </div> */}
          {/* also can be modified */}
          {/* <form className={styles.EditInfo}>
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
                        <input type="text" id="Address" title="address"/>
                        <label for="email">Email:</label>
                        <input type="email" id="Email" title="email"/>
                        <label for="zip">Zip:</label>
                        <input type="text" id="Zip" title="zip" />
                        <button id="btnBack">Back</button>
                        <button id="btnSave">Save</button>
                    </form>

                    </div>
                </div> */}

          {/* change password */}
          {/* <div className={styles.Change}>
                    <div className={styles.formgroup}>
					    <label>Password</label>
					    <input type="password" className={styles.formcontrol} id="password"/>
				    </div>
                    <div class={styles.formgroup}>
					    <label>New Password</label>
					    <input type="password" className={styles.formcontrol} id="password"/>
				    </div>

                    <div className={styles.formgroup}>
					    <label>Repeat Your New Password</label>
					    <input type="password" className={styles.formcontrol} id="password"/>
				    </div>
                    <button>
                        Confirm
                    </button>
                </div> */}
          {/* My Cart */}

          {/* <div className={styles.ShowContent}> */}
          {/* should create a compent to gengerate */}
          {/* <CartItem/>
                    <button>
                    Buy Them!
                    </button>
                </div> */}



          {/* Purchase History */}
          {/* <div className={styles.All}> */}
          {/* should also have a acomponent */}
          {/* <PurchaseItem />
                    </div> */}
        </div>


      </main>
    </>
  );
}
