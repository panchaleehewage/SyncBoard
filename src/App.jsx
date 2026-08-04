import { useState } from 'react';
import { mockTasks } from './mockTasks';
import TaskCard from './components/TaskCard';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(mockTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  
  // Simulating a logged-in user to fulfill the user-distinction requirement
  const currentUser = "StudentDev"; 

  const moveTask = (id, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskDate) return;

    const newTask = {
      id: Date.now(), // Generates a unique ID for the front-end phase
      title: newTaskTitle,
      assignee: currentUser,
      dueDate: newTaskDate,
      tags: ["New"],
      status: "To Do"
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDate('');
  };

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="app-container">
      <header className="header-bar">
        <h1>LearnThread Development</h1>
        <div className="user-info">
          Logged in as: <strong>{currentUser}</strong>
        </div>
      </header>

      <form className="add-task-form" onSubmit={handleAddTask}>
        <input 
          type="text" 
          placeholder="What needs to be done?" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <input 
          type="date" 
          value={newTaskDate}
          onChange={(e) => setNewTaskDate(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="board">
        {columns.map(col => (
          <div key={col} className="column">
            <h2>{col} <span className="task-count">{tasks.filter(t => t.status === col).length}</span></h2>
            <div className="task-list">
              {tasks.filter(t => t.status === col).map(task => (
                <TaskCard key={task.id} task={task} moveTask={moveTask} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;