import React from "react"
import { Url } from "../../../constants/url";
import placeholderImage from '../../../assets/images/placeholder_image.png';
import Rating from "../../features/Landing/Rating";

const CourseCard = ({ course }) => {
  return (
    <div className="card">
            <img
              src={Url.BUCKET+course.imageUrl}
              alt=""
              onError={({ currentTarget }) => {
                currentTarget.src = placeholderImage
              }}
            />
            <div className="card-details">
              <div className="card-header">{course.title}</div>
              <div className="subtitle">{course.teacherID.name}</div>
              <div className="rating">
                <span>4.9</span>
                <span>
                  <Rating />
                </span>
                <span></span>
              </div>
              <div className="tag">Best Seller!</div>
            <button className="primary-btn">add</button>
            </div>
    </div>
  )
};

export default CourseCard;
