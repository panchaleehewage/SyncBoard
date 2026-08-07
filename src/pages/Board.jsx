import { useParams, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { mockBoards, mockTasks } from '../mockData';
import TaskCard from '../components/TaskCard';

export default function Board({ currentUser }) {
  const { boardId } = useParams();
  const board = mockBoards.find(b => b.id === parseInt(boardId));
  
  const [tasks, setTasks] = useState(mockTasks.filter(t => t.boardId === board?.id));
  const [showTaskModal, setShowTaskModal] = useState(false); // Controls the popup
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(currentUser || '');
  const [newTaskTags, setNewTaskTags] = useState([]);

  if (!currentUser) return <Navigate to="/" replace />;
  if (!board) return <div className="alert">Board not found.</div>;

  const moveTask = (id, newStatus) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status: newStatus } : task));
  };

  const handleTagToggle = (tag) => {
    setNewTaskTags(prevTags => 
      prevTags.includes(tag) 
        ? prevTags.filter(t => t !== tag) 
        : [...prevTags, tag]
    );
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskDate || !newTaskAssignee) return;

    const newTask = {
      id: Date.now(),
      boardId: board.id,
      title: newTaskTitle,
      assignee: newTaskAssignee,
      dueDate: newTaskDate,
      tags: newTaskTags.length > 0 ? newTaskTags : ["General"],
      status: "To Do"
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDate('');
    setNewTaskTags([]);
    setShowTaskModal(false); // Close the modal after adding
  };

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="board-page">
      <div className="board-header">
        <div>
          <h2>{board.title}</h2>
          <span className="leader-badge" style={{marginTop: '8px', display: 'inline-block'}}>
            Leader: {board.leader}
          </span>
        </div>
        {/* Trigger Button */}
        <button className="btn-primary" onClick={() => setShowTaskModal(true)}>+ Add Task</button>
      </div>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Add New Task</h2>
            <form onSubmit={handleAddTask} className="modal-form">
              <div className="form-group">
                <label>Task Title</label>
                <input 
                  type="text" 
                  placeholder="What needs to be done?" 
                  value={newTaskTitle} 
                  onChange={(e) => setNewTaskTitle(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Due Date</label>
                <input 
                  type="date" 
                  value={newTaskDate} 
                  onChange={(e) => setNewTaskDate(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Assignee</label>
                <select value={newTaskAssignee} onChange={(e) => setNewTaskAssignee(e.target.value)} required>
                  <option value="" disabled>Assign to...</option>
                  {board.members.map(member => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Tags</label>
                <div className="checkbox-group" style={{marginTop: '4px'}}>
                  {board.tags.map(tag => (
                    <label key={tag} className="tag-checkbox">
                      <input 
                        type="checkbox" 
                        checked={newTaskTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                      />
                      {tag}
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="board">
        {columns.map(col => (
          <div key={col} className="column">
            <h3>{col} <span className="task-count">{tasks.filter(t => t.status === col).length}</span></h3>
            <div className="task-list">
              {tasks.filter(t => t.status === col).map(task => (
                <TaskCard key={task.id} task={task} moveTask={moveTask} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}