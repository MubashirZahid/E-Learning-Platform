import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getAllCourses } from "../../../service/courses";
import "./Courses.css";
import placeholderImage from '../../../assets/images/placeholder_image.png';
import Rating from "./Rating";
import { Url } from "../../../constants/url";
import Loader from "../../common/Loader";
import CourseCard from "../../common/CourseCard/CourseCard";
// https://react-icons.github.io/react-icons

const Courses = (props) => {
  const [courseList, setCourseList] = useState([]);

  const [loader, setLoader] = useState(false);

  const course = {
    imageUrl: "fsddfs",
    title: "Hello",
    teacherID: {
        name: "mr. spongebob"
    }
  };
  useEffect(() => {
    setLoader(true);
    getAllCourses().then(
      (resp) => {
        setCourseList(resp.data.courses);
        console.log(resp.data.courses);
        setLoader(false);
      }
    ).catch((err) => {
      console.log(err);
      setCourseList[course, course, course];
      setLoader(false);
    });
  }, []);
  return (
    <section className="courses">
      {
      loader ? <Loader /> :
       courseList.map(course => (
        <CourseCard course={course} />
       )) 
      }
    </section>
  )
};

export default Courses;
