// Fix 2a: Use "label" key (not "name") to match the frontend data shape
// Fix 2b: Use Tailwind colour key strings (not hex values)
// Fix 2c: Add "tags" arrays to all boards
// Fix 2d: Sync all 3 boards and their members/leaders with the frontend mockData.js

let nextId = 100;
const boards = [
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

export const boardRepository = {
  // Fix 2e: Add findAll so GET /boards works
  async findAll() {
    return boards;
  },

  async findById(id) {
    return boards.find(b => b.id === parseInt(id));
  },

  async findAllByMember(username) {
    return boards.filter(b => b.members.includes(username));
  },

  async create(boardData) {
    const newBoard = { id: nextId++, ...boardData };
    boards.push(newBoard);
    return newBoard;
  },

  // Fix 2f: update() is called via the controller which now validates the body first
  async update(id, updates) {
    const boardIndex = boards.findIndex(b => b.id === parseInt(id));
    if (boardIndex === -1) return null;
    boards[boardIndex] = { ...boards[boardIndex], ...updates };
    return boards[boardIndex];
  }
};