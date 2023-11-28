import React, { useContext }  from "react";
import { FaRegHeart } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";
import { saveItems } from "../../../utils/storageFunctions";
import LocalStorageContext from "../../../hooks/LocalStorageContext";


export default function LoggedItems() {
  const { popStatus, setPopStatus } = useContext(LocalStorageContext);
  function setCartPopStatus() {
    saveItems("popperStatus", true);
    setPopStatus(true);
  }
    return (
        <li className="nav-right-log-in">
          <p>My Learning</p>
          <FaRegHeart style={{ cursor: "pointer" }} />
          <FaCartShopping style={{ cursor: "pointer" }}  onClick={setCartPopStatus} />
          <FaCircleUser style={{ cursor: "pointer" }}  />
        </li>
    );
}