// src/components/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo"> 📖 WebStories</div>
      <div className="navbar-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Home
        </NavLink>
        <NavLink 
          to="/admin" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Dashboard
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
