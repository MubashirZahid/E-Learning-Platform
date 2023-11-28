import React from "react"
import { FaStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";


const Rating = (props) => {
  return (
    <div>
        <FaStar color="orange" />
        <FaStarHalfAlt color="orange" />
        <FaRegStar />
    </div>
  )
};

export default Rating;
