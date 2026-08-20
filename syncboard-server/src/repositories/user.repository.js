let users = [];
let nextId = 1;

export const userRepository = {
  async findByEmail(email) {
    return users.find(u => u.email === email);
  },

  async findById(id) {
    return users.find(u => u.id === id);
  },

  async create(userData) {
    const newUser = { id: nextId++, ...userData };
    users.push(newUser);
    return newUser;
  }
};