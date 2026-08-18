export const mockUsers = [
  { username: "StudentDev", password: "password123" },
  { username: "Alice", password: "password123" },
  { username: "Bob", password: "password123" }
];

export const mockBoards = [
  { 
    id: 1, 
    title: "LearnThread Development", 
    leader: "StudentDev", 
    members: ["StudentDev", "Alice", "Bob"], 
    tags: ["Frontend", "Backend", "API", "Database", "AI", "Testing"],
    columns: ["To Do", "In Progress", "Done"]
  },
  { 
    id: 2, 
    title: "Workshop Planning", 
    leader: "Alice", 
    members: ["Alice", "StudentDev"], 
    tags: ["Deco","Logistics", "Marketing", "Content"],
    columns: ["To Do", "In Progress", "Done"]
  }
];

export const mockTasks = [
  { id: 1, boardId: 1, title: "Design User Profile Page", assignee: "Alice", dueDate: "2026-10-20", tags: ["Frontend"], status: "To Do" },
  { id: 2, boardId: 1, title: "Setup MongoDB Schema", assignee: "Bob", dueDate: "2026-07-01", tags: ["Backend", "Database"], status: "To Do" },
  { id: 3, boardId: 1, title: "Post Management Endpoints", assignee: "StudentDev", dueDate: "2026-12-05", tags: ["API"], status: "In Progress" },
  { id: 4, boardId: 2, title: "Book Venue", assignee: "Alice", dueDate: "2026-09-01", tags: ["Logistics"], status: "To Do" },
  { id: 5, boardId: 2, title: "Make Decorations", assignee: "Bob", dueDate: "2026-09-10", tags: ["Deco"], status: "To Do" },
  { id: 6, boardId: 2, title: "Invite Guest Speaker", assignee: "Alice", dueDate: "2026-09-01", tags: ["Logistics"], status: "To Do" },
  { id: 7, boardId: 1, title: "Design Home Page", assignee: "Bob", dueDate: "2026-10-20", tags: ["Frontend"], status: "To Do" },
  { id: 8, boardId: 2, title: "Design Promotion Poster", assignee: "StudentDev", dueDate: "2026-09-10", tags: ["Marketing", "Content"], status: "To Do" },
  { id: 9, boardId: 1, title: "AI Chatbot Integration", assignee: "StudentDev", dueDate: "2026-11-01", tags: ["AI"], status: "To Do" },
  { id: 10, boardId: 2, title: "Film Promotion Video", assignee: "Alice", dueDate: "2026-09-01", tags: ["Marketing", "Content"], status: "To Do" },
  { id: 11, boardId: 1, title: "Testing", assignee: "Bob", dueDate: "2026-12-01", tags: ["Testing"], status: "To Do" },
  { id: 12, boardId: 2, title: "Buy Necessary Materials for Deco", assignee: "StudentDev", dueDate: "2026-09-01", tags: ["Deco"], status: "To Do" }
];