import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>404 - Page Not Found</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '32px' }}>
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary">Go Back Home</Button>
      </Link>
    </div>
  );
}