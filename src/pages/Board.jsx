import { useParams, Navigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { mockBoards } from '../data/mockData';
import { getTasks } from '../api/tasks';
import { useTaskReducer } from '../hooks/useTaskReducer';
import TaskCard from '../components/TaskCard';
import Column from '../components/Column';
import Button from '../components/Button';

let nextTaskId = 10000;

export default function Board({ currentUser }) {
  const { boardId } = useParams();
  const board = mockBoards.find(b => b.id === parseInt(boardId));
  
  const [tasks, dispatch] = useTaskReducer([]);
  
  const [isLoading, setIsLoading] = useState(true); 
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(currentUser || '');
  const [newTaskTags, setNewTaskTags] = useState([]);

  useEffect(() => {
    if (!board) return;
    
    setIsLoading(true);
    getTasks().then((allTasks) => {
      const boardTasks = allTasks.filter(t => t.boardId === board.id);
      
      dispatch({ type: 'SET_TASKS', payload: boardTasks });
      setIsLoading(false);
    });
  }, [board?.id, dispatch]);

  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') || '';
  const assigneeFilter = searchParams.get('assignee') || '';

  const updateSearch = (e) => {
    const value = e.target.value;
    if (value) searchParams.set('search', value);
    else searchParams.delete('search');
    setSearchParams(searchParams);
  };

  const updateAssignee = (e) => {
    const value = e.target.value;
    if (value) searchParams.set('assignee', value);
    else searchParams.delete('assignee');
    setSearchParams(searchParams);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAssignee = assigneeFilter ? task.assignee === assigneeFilter : true;
    return matchesSearch && matchesAssignee;
  });
  
  if (!currentUser) return <Navigate to="/" replace />;
  if (!board) return <div className="alert">Board not found.</div>;

  const moveTask = (id, newStatus) => {
    dispatch({ type: 'MOVE_TASK', payload: { id, newStatus } });
  };

  const deleteTask = (id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
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

    dispatch({ type: 'ADD_TASK', payload: newTask });
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

      <div className="filter-bar" style={{ display: 'flex', gap: '16px', marginBottom: '24px', backgroundColor: 'var(--card-bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Search Tasks</label>
          <input 
            type="text" 
            placeholder="Search by title..." 
            value={searchQuery}
            onChange={updateSearch}
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Filter by Assignee</label>
          <select value={assigneeFilter} onChange={updateAssignee}>
            <option value="">All Members</option>
            {board.members.map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '100px 20px', backgroundColor: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <h2 style={{ color: 'var(--text-light)' }}>Loading tasks...</h2>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--card-bg)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>No tasks found</h3>
          <p style={{ color: 'var(--text-light)', margin: 0 }}>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="board">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col);
            
            return (
              <Column key={col} title={col} count={colTasks.length}>
                {colTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    moveTask={moveTask} 
                    deleteTask={deleteTask} 
                  />
                ))}
              </Column>
            );
          })}
        </div>
      )}
    </div>
  );
}