import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockBoards, mockTasks } from '../mockData';
import TaskCard from '../components/TaskCard';

export default function Board({ currentUser }) {
  const { boardId } = useParams();
  const board = mockBoards.find(b => b.id === parseInt(boardId));
  
  const [tasks, setTasks] = useState(mockTasks.filter(t => t.boardId === board?.id));
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(currentUser || '');
  const [newTaskTags, setNewTaskTags] = useState([]); // Now an array

  if (!currentUser) return <div className="alert">Please log in to view this board.</div>;
  if (!board) return <div className="alert">Board not found.</div>;

  const moveTask = (id, newStatus) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status: newStatus } : task));
  };

  // Adds or removes tags from the array when a checkbox is clicked
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
      tags: newTaskTags.length > 0 ? newTaskTags : ["General"], // Fallback if no tags selected
      status: "To Do"
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDate('');
    setNewTaskTags([]); // Reset tags
  };

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="board-page">
      <div className="board-header">
        <h2>{board.title}</h2>
        <span className="leader-badge">Leader: {board.leader}</span>
      </div>

      <form className="add-task-form wide-form" onSubmit={handleAddTask}>
        <div className="form-row">
          <input type="text" placeholder="What needs to be done?" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
          <input type="date" value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} />
          <select className="wide-select" value={newTaskAssignee} onChange={(e) => setNewTaskAssignee(e.target.value)}>
            <option value="" disabled>Assign to...</option>
            {board.members.map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
        </div>
        
        {/* Checkbox Group for Multiple Tags */}
        <div className="tags-selection">
          <span className="tags-label">Select Tags:</span>
          <div className="checkbox-group">
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

        <button type="submit" className="btn-primary w-100">Add Task</button>
      </form>

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