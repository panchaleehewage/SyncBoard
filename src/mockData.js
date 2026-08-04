export const mockUsers = ["StudentDev", "Alice", "Bob"];

export const mockBoards = [
  { 
    id: 1, 
    title: "LearnThread Development", 
    leader: "StudentDev", 
    members: ["StudentDev", "Alice", "Bob"], 
    tags: ["Frontend", "Backend", "API", "Database"] 
  },
  { 
    id: 2, 
    title: "Workshop Planning", 
    leader: "Alice", 
    members: ["Alice", "StudentDev"], 
    tags: ["Logistics", "Marketing", "Content"] 
  }
];

export const mockTasks = [
  { id: 1, boardId: 1, title: "Design User Profile Page", assignee: "Alice", dueDate: "2026-10-15", tags: ["Frontend"], status: "To Do" },
  { id: 2, boardId: 1, title: "Setup MongoDB Schema", assignee: "Bob", dueDate: "2026-07-01", tags: ["Backend", "Database"], status: "To Do" },
  { id: 3, boardId: 1, title: "Post Management Endpoints", assignee: "StudentDev", dueDate: "2026-12-05", tags: ["API"], status: "In Progress" },
  { id: 4, boardId: 2, title: "Book Venue", assignee: "Alice", dueDate: "2026-09-01", tags: ["Logistics"], status: "To Do" }
];