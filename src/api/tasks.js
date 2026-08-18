import { mockTasks } from '../data/mockData';

export const getTasks = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTasks);
    }, 800);
  });
};