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
  const isLeader = currentUser === board?.leader;
  
  const [tasks, dispatch] = useTaskReducer([]);
  const [columns, setColumns] = useState(board?.columns || ['To Do', 'In Progress', 'Done']);
  
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // Tracks if we are editing vs adding
  const [showColumnModal, setShowColumnModal] = useState(false); // Controls leader settings
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(currentUser || '');
  const [newTaskTags, setNewTaskTags] = useState([]);

  useEffect(() => {
    if (!board) return;
    setIsLoading(true);
    setError(null);

    getTasks().then((allTasks) => {
      const boardTasks = allTasks.filter(t => t.boardId === board.id);
      dispatch({ type: 'SET_TASKS', payload: boardTasks });
      setIsLoading(false);
    }).catch((err) => {
      setError("Failed to load tasks. Please try again later.");
      setIsLoading(false);
    });
  }, [board?.id, dispatch]);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const assigneeFilter = searchParams.get('assignee') || '';
  const statusFilter = searchParams.get('status') || '';
  const overdueFilter = searchParams.get('overdue') === 'true';

  const updateParam = (key, value) => {
    if (value) searchParams.set(key, value);
    else searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAssignee = assigneeFilter ? task.assignee === assigneeFilter : true;
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const isLate = new Date(task.dueDate) < new Date() && task.status !== columns[columns.length - 1]; // Assume last column is "Done"
    const matchesOverdue = overdueFilter ? isLate : true;
    return matchesSearch && matchesAssignee && matchesStatus && matchesOverdue;
  });
  
  if (!currentUser) return <Navigate to="/" replace />;
  if (!board) return <div className="alert">Board not found.</div>;

  const moveTask = (id, newStatus) => dispatch({ type: 'MOVE_TASK', payload: { id, newStatus } });
  const deleteTask = (id) => dispatch({ type: 'DELETE_TASK', payload: id });

  // Opens the modal pre-filled with the task's data
  const openEditTask = (task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDate(task.dueDate);
    setNewTaskAssignee(task.assignee);
    setNewTaskTags(task.tags);
    setShowTaskModal(true);
  };

  const resetForm = () => {
    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskDate('');
    setNewTaskTags([]);
    setShowTaskModal(false);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskTitle.length < 3) return alert("Title must be at least 3 characters long.");
    
    const selectedDate = new Date(newTaskDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today && !editingTask) return alert("Due date cannot be in the past.");

    if (editingTask) {
      dispatch({ type: 'EDIT_TASK', payload: { ...editingTask, title: newTaskTitle, dueDate: newTaskDate, assignee: newTaskAssignee, tags: newTaskTags } });
    } else {
      dispatch({ type: 'ADD_TASK', payload: { id: nextTaskId++, boardId: board.id, title: newTaskTitle, assignee: newTaskAssignee, dueDate: newTaskDate, tags: newTaskTags.length > 0 ? newTaskTags : ["General"], status: columns[0] } });
    }
    resetForm();
  };

  // --- LEADER COLUMN MANAGEMENT ---
  const handleRenameColumn = (index, newName) => {
    if (!newName) return;
    const oldName = columns[index];
    if (oldName === newName) return;

    const newCols = [...columns];
    newCols[index] = newName;
    setColumns(newCols);
    dispatch({ type: 'RENAME_COLUMN', payload: { oldName, newName } }); // Update tasks instantly
  };

  const handleAddColumn = () => setColumns([...columns, `New Column ${columns.length + 1}`]);
  const handleRemoveColumn = (index) => setColumns(columns.filter((_, i) => i !== index));

  const doneCount = tasks.filter(t => t.status === columns[columns.length - 1]).length;
  const totalCount = tasks.length;

  return (
    <div className="board-page">
      <div className="board-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0 }}>{board.title}</h2>
          <span className="leader-badge">Leader: {board.leader}</span>
          <span className="progress-badge">{doneCount} of {totalCount} done</span>
          {isLeader && (
            <Button variant="secondary" onClick={() => setShowColumnModal(true)}>⚙️ Manage Columns</Button>
          )}
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setShowTaskModal(true); }}>+ Add Task</Button>
      </div>

      {/* Task Creation / Editing Modal */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
            <form onSubmit={handleAddTask} className="modal-form">
              <div className="form-group">
                <label>Task Title</label>
                <input type="text" placeholder="What needs to be done?" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Assignee</label>
                <select value={newTaskAssignee} onChange={(e) => setNewTaskAssignee(e.target.value)} required>
                  <option value="" disabled>Assign to...</option>
                  {board.members.map(member => <option key={member} value={member}>{member}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Tags</label>
                <div className="checkbox-group" style={{marginTop: '4px'}}>
                  {board.tags.map(tag => (
                    <label key={tag} className="tag-checkbox">
                      <input type="checkbox" checked={newTaskTags.includes(tag)} onChange={() => setNewTaskTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])} />
                      {tag}
                    </label>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
                <Button type="submit" variant="primary">{editingTask ? 'Save Changes' : 'Add Task'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leader Column Management Modal */}
      {showColumnModal && (
        <div className="modal-overlay" onClick={() => setShowColumnModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Manage Columns</h2>
            <p style={{fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '20px'}}>Rename your columns below. Tasks will automatically migrate to the new names.</p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px'}}>
              {columns.map((col, idx) => (
                <div key={idx} style={{display: 'flex', gap: '8px'}}>
                  <input type="text" value={col} onChange={(e) => handleRenameColumn(idx, e.target.value)} />
                  <Button variant="danger" onClick={() => handleRemoveColumn(idx)}>X</Button>
                </div>
              ))}
            </div>
            <Button variant="secondary" onClick={handleAddColumn} style={{width: '100%', marginBottom: '20px'}}>+ Add Column</Button>
            <div className="modal-actions">
              <Button type="button" variant="primary" onClick={() => setShowColumnModal(false)}>Done</Button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="filter-bar" style={{ display: 'flex', gap: '16px', marginBottom: '24px', backgroundColor: 'var(--card-bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
          <label>Search Tasks</label>
          <input type="text" placeholder="Search by title..." value={searchQuery} onChange={(e) => updateParam('search', e.target.value)} />
        </div>
        <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
          <label>Assignee</label>
          <select value={assigneeFilter} onChange={(e) => updateParam('assignee', e.target.value)}>
            <option value="">All Members</option>
            {board.members.map(member => <option key={member} value={member}>{member}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
          <label>Status</label>
          <select value={statusFilter} onChange={(e) => updateParam('status', e.target.value)}>
            <option value="">All Statuses</option>
            {columns.map(col => <option key={col} value={col}>{col}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '22px' }}>
          <input type="checkbox" id="overdue-check" checked={overdueFilter} onChange={(e) => updateParam('overdue', e.target.checked ? 'true' : null)} style={{ width: 'auto' }} />
          <label htmlFor="overdue-check" style={{ margin: 0, cursor: 'pointer' }}>Overdue Only</label>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '100px 20px', backgroundColor: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border)' }}><h2 style={{ color: 'var(--text-light)' }}>Loading tasks...</h2></div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', color: 'var(--danger)' }}><h3 style={{ margin: '0 0 8px 0' }}>Error</h3><p style={{ margin: 0 }}>{error}</p></div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--card-bg)', borderRadius: '8px', border: '1px dashed var(--border)' }}><h3 style={{ margin: '0 0 8px 0' }}>No tasks found</h3><p style={{ color: 'var(--text-light)', margin: 0 }}>Try adjusting your search or filters.</p></div>
      ) : (
        <div className="board">
          {columns.map((col, colIndex) => {
            const colTasks = filteredTasks.filter(t => t.status === col);
            
            return (
              <Column key={col} title={col} count={colTasks.length}>
                {colTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    deleteTask={deleteTask} 
                    editTask={openEditTask}
                    
                    columnIndex={colIndex}
                    totalColumns={columns.length}
                    
                    onMoveLeft={colIndex > 0 ? () => moveTask(task.id, columns[colIndex - 1]) : null}
                    onMoveRight={colIndex < columns.length - 1 ? () => moveTask(task.id, columns[colIndex + 1]) : null}
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