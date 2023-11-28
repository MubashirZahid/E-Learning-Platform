import React  from "react";
import { useNavigate, useNavigation } from "react-router-dom";

export default function LoggedOutItems() {
  const router = useNavigate();
    return (
      <li className="nav-right-log-out">
        <p>Teach On Udemy</p>
        <button className="secondary-btn" onClick={ () => router("/signup")}>Sign Up</button>
        <button className="primary-btn" onClick={ () => router("/login")}>Log In</button>
      </li>

    );
}