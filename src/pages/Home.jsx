import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockBoards, mockUsers } from '../mockData';

export default function Home({ currentUser }) {
  const [boards, setBoards] = useState(mockBoards);
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (!currentUser) {
    return (
      <div className="landing-page">
        <h1>Welcome to Syncboard</h1>
        <p>A collaborative Kanban task board. Please login or sign up to view your workspaces.</p>
      </div>
    );
  }

  const handleCreateBoard = (e) => {
    e.preventDefault();
    const title = e.target.boardTitle.value;
    const tagsInput = e.target.boardTags.value;
    
    // Get multiple selected options from the native select element
    const selectedMembers = Array.from(e.target.boardMembers.selectedOptions, option => option.value);

    // Automatically make the creator a member, and remove any accidental duplicates
    const members = Array.from(new Set([currentUser, ...selectedMembers]));
    
    // Convert comma-separated tags into a clean array
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);

    const newBoard = {
      id: Date.now(),
      title,
      leader: currentUser,
      members,
      tags: tags.length ? tags : ["General"]
    };

    setBoards([...boards, newBoard]);
    setShowCreateModal(false);
  };

  const userBoards = boards.filter(b => b.members.includes(currentUser));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Your Workspaces</h2>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>+ Create Workspace</button>
      </div>

      <div className="board-grid">
        {userBoards.map(board => (
          <Link key={board.id} to={`/board/${board.id}`} className="board-tile">
            <h3>{board.title}</h3>
            <div className="board-meta">
              <p><strong>Leader:</strong> {board.leader}</p>
              <p><strong>Team:</strong> {board.members.join(', ')}</p>
            </div>
            <div className="tags">
              {board.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
          </Link>
        ))}
      </div>

      {/* Create Workspace Modal Popup */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Create New Workspace</h2>
            <form onSubmit={handleCreateBoard} className="modal-form">
              <div className="form-group">
                <label>Workspace Name</label>
                <input name="boardTitle" type="text" required placeholder="e.g., App Development" />
              </div>
              <div className="form-group">
                <label>Select Teammates (Hold Ctrl/Cmd to select multiple)</label>
                <select name="boardMembers" multiple className="wide-select" style={{height: '100px'}}>
                  {/* Filter out current user so they don't have to select themselves */}
                  {mockUsers.filter(u => u !== currentUser).map(user => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Tags (Comma separated)</label>
                <input name="boardTags" type="text" placeholder="e.g., Frontend, UI, Urgent" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}