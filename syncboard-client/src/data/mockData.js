export const mockUsers = [
  {
    username: "StudentDev",
    email: "studentdev@example.com",
    password: "password123",
    bio: "Full-stack developer. Building cool stuff with React & Node.js.",
    avatar: null,
    pendingInvites: [
      { boardId: 99, boardTitle: "Design System 2027", invitedBy: "Alice" }
    ]
  },
  {
    username: "Alice",
    email: "alice@example.com",
    password: "password123",
    bio: "UI/UX designer who codes. Passionate about clean interfaces.",
    avatar: null,
    pendingInvites: []
  },
  {
    username: "Bob",
    email: "bob@example.com",
    password: "password123",
    bio: "Backend wizard. Loves databases and distributed systems.",
    avatar: null,
    pendingInvites: []
  }
];

// Columns and tags are now { label: string, color: string } objects.
// Task.tags remains string[] (label only). Task.status remains a string (column label).
export const mockBoards = [
  {
    id: 1,
    title: "LearnThread Development",
    leader: "StudentDev",
    members: ["StudentDev", "Alice", "Bob"],
    tags: [
      { label: "Frontend", color: "blue" },
      { label: "Backend", color: "violet" },
      { label: "API", color: "cyan" },
      { label: "Database", color: "teal" },
      { label: "AI", color: "amber" },
      { label: "Testing", color: "emerald" },
    ],
    columns: [
      { label: "To Do", color: "violet" },
      { label: "In Progress", color: "amber" },
      { label: "Done", color: "emerald" },
    ],
  },
  {
    id: 2,
    title: "Workshop Planning",
    leader: "Alice",
    members: ["Alice", "StudentDev"],
    tags: [
      { label: "Deco", color: "rose" },
      { label: "Logistics", color: "blue" },
      { label: "Marketing", color: "orange" },
      { label: "Content", color: "teal" },
    ],
    columns: [
      { label: "To Do", color: "violet" },
      { label: "In Progress", color: "amber" },
      { label: "Done", color: "emerald" },
    ],
  },
  {
    // Board from pending invite — Alice started it, StudentDev hasn't joined yet
    id: 99,
    title: "Design System 2027",
    leader: "Alice",
    members: ["Alice"],
    tags: [
      { label: "Components", color: "violet" },
      { label: "Tokens", color: "cyan" },
    ],
    columns: [
      { label: "Backlog", color: "blue" },
      { label: "In Progress", color: "amber" },
      { label: "Done", color: "emerald" },
    ],
  },
];

export const mockTasks = [
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