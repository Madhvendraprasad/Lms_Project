import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API}/courses`).then((res) => {
      setCourses(res.data);
    });
  }, []);

  return (
    <div>
      <h2>Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            <Link to={`/course/${course._id}`}>{course.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
