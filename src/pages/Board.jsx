import { useParams, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { mockBoards, mockTasks } from '../data/mockData';
import TaskCard from '../components/TaskCard';
import Button from '../components/Button';
import Column from '../components/Column';
let nextTaskId = 10000;

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

  const deleteTask = (id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
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
    if (newTaskTitle.length < 3) {
      return alert("Title must be at least 3 characters long.");
    }
    
    const selectedDate = new Date(newTaskDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return alert("Due date cannot be in the past.");
    }

    if (!newTaskTitle || !newTaskDate || !newTaskAssignee) return;

    const newTask = {
      id: nextTaskId++,
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
    setShowTaskModal(false);
  };

  const columns = ['To Do', 'In Progress', 'Done'];

  const doneCount = tasks.filter(t => t.status === 'Done').length;
  const totalCount = tasks.length;

  return (
    <div className="board-page">
      <div className="board-header">
        <div>
          <h2>{board.title}</h2>
          <span className="leader-badge" style={{marginTop: '8px', display: 'inline-block'}}>
            Leader: {board.leader}
          </span>
          <p>{doneCount} of {totalCount} done</p>
        </div>
        {/* Trigger Button */}
        <Button variant="primary" onClick={() => setShowTaskModal(true)}>+ Add Task</Button>
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
                <Button type="button" variant="secondary" onClick={() => setShowTaskModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Add Task</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="board">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col);
          
          return (
            <Column key={col} title={col} count={colTasks.length}>
              {colTasks.map(task => (
                <TaskCard key={task.id} task={task} moveTask={moveTask} deleteTask={deleteTask}/>
              ))}
            </Column>
          );
        })}
      </div>
    </div>
  );
}