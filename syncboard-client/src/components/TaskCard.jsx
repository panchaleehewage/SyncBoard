import Button from './Button';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function TaskCard({ task, deleteTask, editTask, columnIndex, totalColumns, onMoveLeft, onMoveRight }) {
  const { isDarkMode } = useTheme();
  
  const isOverdue = new Date(task.dueDate) < new Date() && columnIndex !== totalColumns - 1;

  let cardClass = 'task-card ';
  if (isOverdue) cardClass += 'overdue';
  else if (columnIndex === 0) cardClass += 'to-do';
  else if (columnIndex === totalColumns - 1) cardClass += 'done';
  else if (columnIndex === 1) cardClass += 'in-progress';
  else cardClass += 'default-col';

  return (
    <div className={cardClass} style={{ backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }}>
      <h3 style={{ textTransform: 'none' }}>
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
          if (window.confirm("Are you sure you want to delete this task?")) deleteTask(task.id);
        }}>Delete</Button>
        
        {/* Render move buttons dynamically if the functions were provided by the Board */}
        {onMoveLeft && (
          <Button variant="secondary" onClick={onMoveLeft}>Move Left</Button>
        )}
        {onMoveRight && (
          <Button variant="primary" onClick={onMoveRight}>Move Right</Button>
        )}
      </div>
    </div>
  );
}