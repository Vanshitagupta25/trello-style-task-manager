import React from "react";
import { useState, useEffect } from "react";
import "./TaskModel.css";

const emptyTask = {
  title: "",
  description: "",
  priority: "Low",
  status: "To-Do",
  dueDate: "",
};
export default function TaskModel({ isOpen, isClose, onSave, taskToEdit }) {
  const [task, setTask] = useState(emptyTask);

  useEffect(() => {
    if (taskToEdit) {
      setTask(taskToEdit);
    } else {
      setTask(emptyTask);
    }
  }, [taskToEdit]);

  if (!isOpen) return null;
  function handleChange(e) {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  }
  function handleSubmit(e) {
    e.preventDefault();

    if (!task.title.trim()) {
      alert("Title is required");
      return;
    }
    onSave(task);
    isClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{taskToEdit ? "Edit Task" : "Add Task"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Task title"
            value={task.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Task description"
            value={task.description}
            onChange={handleChange}
          ></textarea>

          <select name="priority" value={task.priority} onChange={handleChange}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select name="status" value={task.status} onChange={handleChange}>
            <option>To-Do</option>
            <option>In-Progress</option>
            <option>Completed</option>
          </select>

          <input
            type="date"
            name="dueDate"
            value={task.dueDate?.slice(0, 10)}
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button className="btn-cancel" type="button" onClick={isClose}>
              Cancel
            </button>
            <button type="submit" className="btn save">
              {" "}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
