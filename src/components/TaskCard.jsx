export default function TaskCard({ task, moveTask }) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';

  let cardClass = 'task-card ';
  if (isOverdue) cardClass += 'overdue';
  else if (task.status === 'To Do') cardClass += 'to-do';
  else if (task.status === 'In Progress') cardClass += 'in-progress';
  else cardClass += 'done';

  return (
    <div className={cardClass}>
      <h3>{task.title}</h3>
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
        {task.status === 'To Do' && (
          <button onClick={() => moveTask(task.id, 'In Progress')}>Start</button>
        )}
        {task.status === 'In Progress' && (
          <button onClick={() => moveTask(task.id, 'Done')}>Finish</button>
        )}
      </div>
    </div>
  );
}