import React from "react";
// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../utils/userSlice";
// import { emptyCart } from "../reducers/cart";

const LogOut = () => {
  //   const history = useHistory();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    dispatch(logoutUser());
    // dispatch(emptyCart());

    // Redirect the user to the home page
    // history.push("/");
    navigate("/");
  };

  return <button onClick={handleLogOut}>Log Out</button>;
};

export default LogOut;
