import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "10px", display: "flex", gap: "15px", background: "#f0f0f0" }}>
      <Link to="/">Courses</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
    </nav>
  );
};

export default Navbar;
