let users = [];
let nextId = 1;

export const userRepository = {
  async findByEmail(email) {
    return users.find(u => u.email === email);
  },

  // Fix 1d: Login uses username on the frontend — add username lookup
  async findByUsername(username) {
    return users.find(u => u.username === username);
  },

  async findById(id) {
    return users.find(u => u.id === id);
  },

  // Fix 1c: Ensure all profile fields are initialised at registration
  async create(userData) {
    const newUser = {
      bio: '',
      avatar: null,
      pendingInvites: [],
      ...userData,
      id: nextId++,
    };
    users.push(newUser);
    return newUser;
  },

  async update(id, updates) {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;
    users[userIndex] = { ...users[userIndex], ...updates };
    return users[userIndex];
  },

  async searchByUsername(query, excludeId) {
    const q = (query || '').toLowerCase();
    return users
      .filter(u => u.id !== excludeId && u.username.toLowerCase().includes(q))
      .map(({ password: _, ...u }) => u);
  }
};