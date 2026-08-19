import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockBoards, mockUsers } from '../data/mockData';
import Button from '../components/Button';

export default function Home({ currentUser }) {
  const [boards, setBoards] = useState(mockBoards);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  if (!currentUser) {
    return (
      <div className="landing-page" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: 'var(--primary)' }}>Master Your Workflow</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', marginBottom: '40px', lineHeight: '1.6' }}>
          Whether you're building a new web application, planning a marketing campaign, or organizing a community event, Syncboard keeps your team aligned and your tasks on track.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', textAlign: 'left' }}>
          <div style={{ padding: '24px', background: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, color: 'var(--todo)' }}>Custom Columns</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: 0 }}>Design your board your way. Add, rename, and organize columns to fit your specific workflow.</p>
          </div>
          <div style={{ padding: '24px', background: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, color: 'var(--inprogress)' }}>Team Collaboration</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: 0 }}>Assign tasks, track due dates, and watch updates happen live across your entire team.</p>
          </div>
        </div>
      </div>
    );
  }

  const availableUsers = mockUsers
    .map(u => u.username)
    .filter(u => 
      u !== currentUser && 
      u.toLowerCase().includes(searchTerm.toLowerCase()) && 
      !selectedMembers.includes(u)
    );

  const addMember = (user) => {
    setSelectedMembers([...selectedMembers, user]);
    setSearchTerm('');
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

    const columnsInput = e.target.boardColumns.value;
    const defaultCols = ["To Do", "In Progress", "Done"];
    const parsedColumns = columnsInput ? columnsInput.split(',').map(c => c.trim()).filter(c => c) : defaultCols;

    const newBoard = {
      id: Date.now(),
      title,
      leader: currentUser,
      members,
      tags: tags.length ? tags : ["General"],
      columns: parsedColumns
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

              <div className="form-group">
                <label>Columns (Comma separated)</label>
                <input name="boardColumns" type="text" placeholder="e.g., To Do, Testing, Done" />
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