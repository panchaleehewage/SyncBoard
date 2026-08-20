// We include a "Secret Project" board that StudentDev is NOT a member of
const boards = [
  { id: 1, title: "LearnThread Development", members: ["StudentDev", "Alice", "Bob"] },
  { id: 2, title: "Workshop Planning", members: ["Alice", "StudentDev"] },
  { id: 3, title: "Secret Project", members: ["Eve"] } 
];

export const boardRepository = {
  async findById(id) {
    return boards.find(b => b.id === parseInt(id));
  },
  async findAllByMember(username) {
    return boards.filter(b => b.members.includes(username));
  }
};