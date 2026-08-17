import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockBoards, mockUsers } from '../data/mockData';
import Button from '../components/Button';

export default function Home({ currentUser }) {
  const [boards, setBoards] = useState(mockBoards);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // States for the new teammate search feature
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  if (!currentUser) {
    return (
      <div className="landing-page">
        <h1>Welcome to Syncboard</h1>
        <p>Please login or sign up to view your workspaces.</p>
      </div>
    );
  }

  // Filter available users for the search dropdown
  const availableUsers = mockUsers
    .map(u => u.username)
    .filter(u => 
      u !== currentUser && 
      u.toLowerCase().includes(searchTerm.toLowerCase()) && 
      !selectedMembers.includes(u)
    );

  const addMember = (user) => {
    setSelectedMembers([...selectedMembers, user]);
    setSearchTerm(''); // clear search after selecting
  };

  const removeMember = (user) => {
    setSelectedMembers(selectedMembers.filter(m => m !== user));
  };

  const handleCreateBoard = (e) => {
    e.preventDefault();
    const title = e.target.boardTitle.value;
    const tagsInput = e.target.boardTags.value;
    
    const members = [currentUser, ...selectedMembers];
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
    setSelectedMembers([]); // Reset members for next time
  };

  const userBoards = boards.filter(b => b.members.includes(currentUser));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Your Workspaces</h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>+ Create Workspace</Button>
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

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Create New Workspace</h2>
            <form onSubmit={handleCreateBoard} className="modal-form">
              <div className="form-group">
                <label>Workspace Name</label>
                <input name="boardTitle" type="text" required placeholder="e.g., App Development" />
              </div>
              
              {/* New Searchable Teammates Section */}
              <div className="form-group">
                <label>Add Teammates</label>
                <div className="selected-members">
                  {selectedMembers.map(m => (
                    <span key={m} className="member-tag">
                      {m} <Button type="button" onClick={() => removeMember(m)} style={{ background: 'none', border: 'none', color: 'white', padding: 0 }}>×</Button>
                    </span>
                  ))}
                </div>
                <input 
                  type="text" 
                  placeholder="Search by username..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && availableUsers.length > 0 && (
                  <ul className="autocomplete-list">
                    {availableUsers.map(user => (
                      <li key={user} onClick={() => addMember(user)}>{user}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="form-group">
                <label>Tags (Comma separated)</label>
                <input name="boardTags" type="text" placeholder="e.g., Frontend, UI" />
              </div>
              <div className="modal-actions">
                <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}