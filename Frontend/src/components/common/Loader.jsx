import React from "react";
import './Loader.css';

const Loader = (props) => {
  return (
    <div style={{
        display: "flex",
        justifyContent: "center",
        width: "100%"
    }}>
        <div className="loader" />
    </div>
  )
};

export default Loader;
