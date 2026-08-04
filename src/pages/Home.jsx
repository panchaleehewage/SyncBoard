import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockBoards } from '../mockData';

export default function Home({ currentUser }) {
  const [boards, setBoards] = useState(mockBoards);

  if (!currentUser) {
    return (
      <div className="landing-page">
        <h1>Welcome to Syncboard</h1>
        <p>A collaborative Kanban task board. Please login to view your workspaces, manage tasks, and collaborate with your team.</p>
      </div>
    );
  }

  // Only show boards where the current user is a member
  const userBoards = boards.filter(b => b.members.includes(currentUser));

  return (
    <div className="dashboard">
      <h2>Your Workspaces</h2>
      <div className="board-grid">
        {userBoards.map(board => (
          <Link key={board.id} to={`/board/${board.id}`} className="board-tile">
            <h3>{board.title}</h3>
            <p>Leader: {board.leader}</p>
            <div className="board-members">Members: {board.members.join(', ')}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
