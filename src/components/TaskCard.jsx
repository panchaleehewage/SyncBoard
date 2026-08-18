import Button from './Button';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function TaskCard({ task, moveTask, deleteTask, editTask }) {
  const { isDarkMode } = useTheme();
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';

  let cardClass = 'task-card ';
  if (isOverdue) cardClass += 'overdue';
  else if (task.status === 'To Do') cardClass += 'to-do';
  else if (task.status === 'In Progress') cardClass += 'in-progress';
  else cardClass += 'done';

  return (
    <div className={cardClass} style={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }}>
      <h3>
        <Link to={`/tasks/${task.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {task.title}
        </Link>
      </h3>
      <p className="task-meta">
        <strong>{task.assignee}</strong> 
        {isOverdue && <span className="late-warning"> • Late</span>}
      </p>
      <p className="task-meta">Due: {task.dueDate}</p>
      
      <div className="tags">
        {task.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <div className="card-actions">
        <Button variant="secondary" onClick={() => editTask(task)}>Edit</Button>
        
        <Button variant="danger" onClick={() => {
          if (window.confirm("Are you sure you want to delete this task?")) {
            deleteTask(task.id);
          }
        }}>Delete</Button>
  
        {task.status !== 'To Do' && (
          <Button variant="secondary" onClick={() => moveTask(task.id, task.status === 'Done' ? 'In Progress' : 'To Do')}>
            Move Left
          </Button>
        )}
        {task.status !== 'Done' && (
          <Button variant="primary" onClick={() => moveTask(task.id, task.status === 'To Do' ? 'In Progress' : 'Done')}>
            Move Right
          </Button>
        )}
      </div>
    </div>
  );
}