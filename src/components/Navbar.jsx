import React, { memo } from "react";
import "./Navbar.css";

const Navbar = ({ onAddTask, children }) => {
  return (
    <>
      <nav className="navbar">
        <h1 className="app-title">Task Manager</h1>
        <button className="add-btn" onClick={onAddTask}>
          + Add Task
        </button>
      </nav>
      <main className="app-content">{children}</main>
    </>
  );
};
export default memo(Navbar);
