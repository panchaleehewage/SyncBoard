export default function TaskCard({ task, moveTask }) {
  // Check if the due date is in the past AND the task isn't finished
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';

  // Apply specific CSS classes based on status and time
  let cardClass = 'task-card ';
  if (isOverdue) {
    cardClass += 'overdue';
  } else if (task.status === 'To Do') {
    cardClass += 'to-do';
  } else if (task.status === 'In Progress') {
    cardClass += 'in-progress';
  } else {
    cardClass += 'done';
  }

  return (
    <div className={cardClass}>
      <h3>{task.title}</h3>
      <p>
        <strong>Assignee:</strong> {task.assignee} 
        {isOverdue && <span className="late-warning"> (Late!)</span>}
      </p>
      <p><strong>Due:</strong> {task.dueDate}</p>
      
      <div className="tags">
        {task.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      {/* Conditionally render buttons based on current column */}
      {task.status === 'To Do' && (
        <button onClick={() => moveTask(task.id, 'In Progress')}>Start</button>
      )}
      {task.status === 'In Progress' && (
        <button onClick={() => moveTask(task.id, 'Done')}>Finish</button>
      )}
    </div>
  );
}