import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockBoards, mockTasks } from '../mockData';
import TaskCard from '../components/TaskCard';

export default function Board({ currentUser }) {
  const { boardId } = useParams();
  const board = mockBoards.find(b => b.id === parseInt(boardId));
  
  // Filter tasks to only show ones belonging to this board
  const [tasks, setTasks] = useState(mockTasks.filter(t => t.boardId === board.id));
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(currentUser || '');
  const [newTaskTag, setNewTaskTag] = useState('');

  if (!currentUser) return <div className="alert">Please log in to view this board.</div>;
  if (!board) return <div className="alert">Board not found.</div>;

  const moveTask = (id, newStatus) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status: newStatus } : task));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskDate || !newTaskAssignee || !newTaskTag) return;

    const newTask = {
      id: Date.now(),
      boardId: board.id,
      title: newTaskTitle,
      assignee: newTaskAssignee,
      dueDate: newTaskDate,
      tags: [newTaskTag],
      status: "To Do"
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDate('');
  };

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="board-page">
      <div className="board-header">
        <h2>{board.title}</h2>
        <span className="leader-badge">Leader: {board.leader}</span>
      </div>

      <form className="add-task-form" onSubmit={handleAddTask}>
        <input type="text" placeholder="Task title..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
        <input type="date" value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} />
        
        {/* Dropdown for Assignee based on board members */}
        <select value={newTaskAssignee} onChange={(e) => setNewTaskAssignee(e.target.value)}>
          <option value="" disabled>Assign to...</option>
          {board.members.map(member => (
            <option key={member} value={member}>{member}</option>
          ))}
        </select>

        {/* Dropdown for Tags based on board tags */}
        <select value={newTaskTag} onChange={(e) => setNewTaskTag(e.target.value)}>
          <option value="" disabled>Select Tag...</option>
          {board.tags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        <button type="submit">Add Task</button>
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