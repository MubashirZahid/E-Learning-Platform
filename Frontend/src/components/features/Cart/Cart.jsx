import React from "react"
import CourseCard from "../../common/CourseCard/CourseCard";
import './Cart.css'
const Cart = () => {
    const course = {
        imageUrl: "fsddfs",
        title: "Hello",
        teacherID: {
            name: "mr. spongebob"
        }
    };
  return (
    <div>
      <div className="cart-header">
        <div className="title">Items Added !</div>
        <button className="primary-btn" style={{ paddingRight: "1em" }}>Subscribe</button>
      </div>
      <div className="cart-list">
          <CourseCard course={course} />
          <CourseCard course={course} />
          <CourseCard course={course} />
      </div>
    </div>
  )
};

export default Cart;
