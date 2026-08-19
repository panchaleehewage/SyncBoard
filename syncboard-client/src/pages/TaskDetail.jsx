import { useParams, Link } from 'react-router-dom';
import { mockTasks } from '../data/mockData';
import Button from '../components/Button';

export default function TaskDetail() {
  const { id } = useParams();
  
  const task = mockTasks.find(t => t.id === parseInt(id));

  if (!task) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Task Not Found</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '32px' }}>
          We couldn't find a task with the ID: {id}
        </p>
        <Link to="/">
          <Button variant="primary">Go Back Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '32px', backgroundColor: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
      <h2 style={{ marginTop: 0, fontSize: '1.8rem' }}>{task.title}</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '24px 0' }}>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Assignee:</strong> {task.assignee}</p>
        <p><strong>Due Date:</strong> {task.dueDate}</p>
        <div>
          <strong>Tags:</strong> 
          <div className="tags" style={{ marginTop: '8px' }}>
            {task.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
        <Link to={`/board/${task.boardId}`}>
          <Button variant="secondary">Back to Board</Button>
        </Link>
      </div>
    </div>
  );
}