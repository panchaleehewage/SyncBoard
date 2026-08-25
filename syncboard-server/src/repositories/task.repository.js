// Fix 3c: Sync task seed data with the complete frontend mockData.js (12 tasks, 3 boards)
let tasks = [
  { id: 1, boardId: 1, title: "Design User Profile Page", assignee: "Alice", dueDate: "2026-10-20", tags: ["Frontend"], status: "To Do" },
  { id: 2, boardId: 1, title: "Setup MongoDB Schema", assignee: "Bob", dueDate: "2026-07-01", tags: ["Backend", "Database"], status: "To Do" },
  { id: 3, boardId: 1, title: "Post Management Endpoints", assignee: "StudentDev", dueDate: "2026-12-05", tags: ["API"], status: "In Progress" },
  { id: 4, boardId: 2, title: "Book Conference Venue", assignee: "Alice", dueDate: "2026-09-01", tags: ["Logistics"], status: "To Do" },
  { id: 5, boardId: 2, title: "Order Catering", assignee: "Bob", dueDate: "2026-09-10", tags: ["Logistics"], status: "To Do" },
  { id: 6, boardId: 2, title: "Invite Guest Speaker", assignee: "Alice", dueDate: "2026-09-01", tags: ["Logistics"], status: "Done" },
  { id: 7, boardId: 1, title: "Design Home Page", assignee: "Bob", dueDate: "2026-10-20", tags: ["Frontend"], status: "To Do" },
  { id: 8, boardId: 2, title: "Design Event Poster", assignee: "StudentDev", dueDate: "2026-09-10", tags: ["Marketing", "Content"], status: "In Progress" },
  { id: 9, boardId: 1, title: "AI Chatbot Integration", assignee: "StudentDev", dueDate: "2026-11-01", tags: ["AI"], status: "To Do" },
  { id: 10, boardId: 2, title: "Film Promotion Video", assignee: "Alice", dueDate: "2026-09-01", tags: ["Marketing", "Content"], status: "To Do" },
  { id: 11, boardId: 1, title: "Testing & QA", assignee: "Bob", dueDate: "2026-12-01", tags: ["Testing"], status: "Done" },
  { id: 12, boardId: 2, title: "Make Decorations", assignee: "StudentDev", dueDate: "2026-09-01", tags: ["Deco"], status: "To Do" },
];
let nextId = 13;

export const taskRepository = {
  async findAll() {
    return tasks;
  },

  async findById(id) {
    return tasks.find(t => t.id === parseInt(id));
  },

  // Fix 3b: Strip any client-provided id so server auto-increment is always used
  async create(taskData) {
    const { id: _clientId, ...rest } = taskData;
    const newTask = { id: nextId++, ...rest };
    tasks.push(newTask);
    return newTask;
  },

  async update(id, updates) {
    const index = tasks.findIndex(t => t.id === parseInt(id));
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], ...updates };
    return tasks[index];
  },

  async delete(id) {
    const index = tasks.findIndex(t => t.id === parseInt(id));
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  }
};