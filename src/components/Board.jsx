import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"
import Navbar from "./Navbar";
import TaskCard from "./TaskCard";
import TaskModel from "./TaskModel";
import initialTasks from "../data/tasks.json";

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [isModelOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  //Filter State
  const [filters, setFilters] = useState({
    priority: "All",
    due: "All"
  })

  //Load Tasks
  useEffect(() => {
    const raw = localStorage.getItem("tasks_v1");
    if(raw) {
      try {
        setTasks(JSON.parse(raw));
      } catch (e){
        console.warn("Invalid tasks in localStorage", e);
        setTasks(initialTasks);
      } 
     } else {
        setTasks(initialTasks);
      }
  }, []);
  // Save Tasks
  useEffect(() => {
    if(tasks.length > 0){
      localStorage.setItem("tasks_v1", JSON.stringify(tasks));
    }
  }, [tasks]);

  //FIlter Logic
  function applyFilters(tasks) {
    const today = new Date().toDateString();

    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate).toDateString();

      if(filters.priority !== "All" && task.priority !== filters.priority) return false;

      if(filters.due === "Today" && taskDate !== today) return false;

      if(filters.due === "Upcoming" && new Date(task.dueDate) < new Date()) return false;
        
      if(filters.due === "Overdue" && new Date(task.dueDate) >= new Date()) return false;

      return true;
    });
    
  }

    
  const filteredTasks = applyFilters(tasks);


  const todo = filteredTasks.filter(t => t.status === "To-Do");
  
  const inProgress = filteredTasks.filter(t => t.status === "In-Progress");
 
  const completed = filteredTasks.filter(t => t.status === "Completed");

  //Add Task 
  function openAddModal() {
    setTaskToEdit(null);
    setIsModalOpen(true);
  }
  //Edit task
  function openEditModal(task) {
    setTaskToEdit(task);
    setIsModalOpen(true);
  }
  //Delete task
  function deleteTask(taskId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if(!confirmed) return;

    setTasks(prevTasks => 
      prevTasks.filter(task => task.id !== taskId)
    );
  }
  //Save task
  function saveTask(task) {
    if(task.id) {
      setTasks(prev => 
        prev.map(t => t.id === task.id ? task : t)
      )
    } else {
      setTasks(prev => [
        {
          ...task,
          id: Date.now(),
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    }
    setIsModalOpen(false);
  }

  function onDragEnd(result){
    const {destination, draggableId} = result;

    if(!destination) return;

    setTasks(prev =>
      prev.map(task =>
        task.id.toString() === draggableId ? 
        { ...task, status: destination.droppableId }
          : task
      )
    );
  }
 
 return (
  <>
   <Navbar onAddTask={openAddModal} />
   {/* filters */}
   <div className="filters">
    <select value={filters.priority}
    onChange={e =>
      setFilters({...filters, priority: e.target.value})
    }>
      <option value="All">All Priorities</option>
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>
    <select 
    value={filters.status}
    onChange={e => 
      setFilters({...filters, status: e.target.value})
    }>
      <option value="All">All Priorities</option>
      <option value="To-Do">To-Do</option>
      <option value="In-Progress">In-Progress</option>
      <option value="Completed">Completed</option>
    </select>
      <select 
    value={filters.due}
    onChange={e => 
      setFilters({...filters, status: e.target.value})
    }>
      <option value="All">All Priorities</option>
      <option value="Today">Due Today</option>
      <option value="Upcoming">Upcoming</option>
      <option value="Overdue">Overdue</option>
    </select>
   </div>
   <DragDropContext onDragEnd={onDragEnd}>
    
    <div className="board">
      <Droppable droppableId="To-Do">
        {(provided) => (
          <div className="column"
            ref={provided.innerRef}
            {...provided.droppableProps}>
              <h2>To-Do</h2>
              {todo.map((t, index) => (
                <Draggable key={t.id}
                draggableId={t.id.toString()}
                index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}>
                      <TaskCard task={t}
                      onOpen={openEditModal}
                      onDelete={deleteTask}>
                      </TaskCard>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
          </div>
        )}
      </Droppable>
      {/* In Progress */}
      <Droppable droppableId="In-Progress">
        {(provided) => (
          <div className="column"
          ref={provided.innerRef}
          {...provided.droppableProps}>

            <h2>In-Progress</h2>
            {inProgress.map((t, index) => (
              <Draggable 
              key={t.id}
              draggableId={t.id.toString()}
              index={index}>
                {(provided) => (
                  <div ref={provided.innerRef}
                   {...provided.draggableProps}
                   {...provided.dragHandleProps}>
                    <TaskCard 
                    task={t}
                    onOpen={openEditModal}
                    onDelete={deleteTask}>
                    </TaskCard>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {/* Completed */}
      <Droppable droppableId="Completed">
         {(provided) => (
          <div
           className="column"
           ref={provided.innerRef}
           {...provided.droppableProps}>
            <h2>Completed</h2>
            {completed.map((t, index) => (
              <Draggable 
              key={t.id}
              draggableId={t.id.toString()}
              index={index}>
                {(provided) => (
                  <div 
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}>

                    <TaskCard 
                    task={t}
                    onOpen={openEditModal}
                    onDelete={deleteTask}>
                    </TaskCard>
                  </div>
                )} 
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
         )}
       </Droppable>
     </div>
   </DragDropContext>
   <TaskModel 
   isOpen={isModelOpen}
   isClose={() =>  setIsModalOpen(false)}
   onSave={saveTask}
   taskToEdit={taskToEdit}>
   </TaskModel>
  </> 
 );
} 
