import { useState } from 'react';
import { mockTasks } from './mockTasks';
import TaskCard from './components/TaskCard';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(mockTasks);

  // Updates a task's status and triggers a re-render
  const moveTask = (id, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="app-container">
      <h1>Syncboard</h1>
      <div className="board">
        {columns.map(col => (
          <div key={col} className="column">
            <h2>{col}</h2>
            <div className="task-list">
              {/* Filter tasks so they only show in the correct column */}
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