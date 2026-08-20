let tasks = [
  { id: 1, boardId: 1, title: "Design User Profile Page", assignee: "Alice", dueDate: "2026-10-20", tags: ["Frontend"], status: "To Do" },
  { id: 2, boardId: 1, title: "Setup MongoDB Schema", assignee: "Bob", dueDate: "2026-07-01", tags: ["Backend", "Database"], status: "To Do" },
  { id: 3, boardId: 1, title: "Post Management Endpoints", assignee: "StudentDev", dueDate: "2026-12-05", tags: ["API"], status: "In Progress" },
];
let nextId = 4;

export const taskRepository = {
  async findAll() {
    return tasks;
  },

  async findById(id) {
    return tasks.find(t => t.id === parseInt(id));
  },

  async create(taskData) {
    const newTask = { id: nextId++, ...taskData };
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