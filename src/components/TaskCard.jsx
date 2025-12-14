import React from "react";
import "./TaskCard.css";

export default function TaskCard({ task, onOpen, onDelete }) {
  if (!task) return null;

  return (
    <div className="task-card" data-priority={task.priority}>
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <span className="priority-pill">{task.priority}</span>
      </div>
      <p className="task-desc">{task.description}</p>
      <div className="task-details">
        <span>Status: {task.status}</span>
        <span>Due: {new Date(task.dueDate).toLocaleDateString()} </span>
      </div>
      <div className="task-actions">
        <button className="btn" onClick={() => onOpen(task)}>
          View Details
        </button>

        <button className="btn danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
