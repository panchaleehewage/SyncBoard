import { useReducer } from 'react';

function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_TASKS':
      return action.payload;
    case 'ADD_TASK':
      return [...state, action.payload];
    case 'MOVE_TASK':
      return state.map(task => 
        task.id === action.payload.id ? { ...task, status: action.payload.newStatus } : task
      );
    case 'DELETE_TASK':
      return state.filter(task => task.id !== action.payload);
    default:
      return state;
  }
}

export function useTaskReducer(initialTasks) {
  return useReducer(taskReducer, initialTasks);
}