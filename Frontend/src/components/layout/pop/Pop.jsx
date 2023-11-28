import React, { useContext, useEffect, useState } from "react";
import './Pop.css';
import { ImCross } from "react-icons/im";
import { getItems, saveItems } from "../../../utils/storageFunctions";
import LocalStorageContext from "../../../hooks/LocalStorageContext";


const Pop = ({ children }) => {
  const { popStatus, setPopStatus } = useContext(LocalStorageContext);

  function setCartPopStatus() {
    saveItems("popperStatus", false);
    setPopStatus(false);
  }
  
  useEffect(() => {
    setPopStatus(JSON.parse(getItems("popperStatus")));
  }, []);
  return (
    <>
    {
      popStatus ?
      <section className="pop">
              <div className="backdrop" />
              <div className="pop_content_data">
                  <div className="data">
                      <div className="header">
                        <div />
                        <button 
                          onClick={setCartPopStatus} 
                          className="cross-btn"
                        >
                          <ImCross />
                        </button>
                      </div>
                      {children}
                  </div>
          </div>
      </section>
      :
      <div></div>
    }
    </>
  )
};

export default Pop;
