import React, { useState, useEffect } from 'react';
import './navbar.css';
import logo from '../../../assets/images/logo.svg'; 
import LoggedItems from './loggedItems';
import LoggedOutItems from './loggedOutItems';
import { getItems } from '../../../utils/storageFunctions';

export default function Navbar() {

  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  useEffect(() => {
    setUserIsLoggedIn(getItems('token'));
  }, []);
  return (
    <>
      <nav>
        <ul>
          <li>
            <img src={logo} alt="" />
          </li>
          <li>
            <input type="text" />
          </li>
          {
            userIsLoggedIn ? 
            <LoggedItems />
            :
            <LoggedOutItems />
          }
          
        </ul>
      </nav>
    </>
  );
}
