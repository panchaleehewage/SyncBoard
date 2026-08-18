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
    
    // --- NEW ACTIONS ---
    case 'EDIT_TASK':
      return state.map(task => 
        task.id === action.payload.id ? action.payload : task
      );
    case 'RENAME_COLUMN':
      // If a column name changes, all tasks in that column must update their status to match
      return state.map(task => 
        task.status === action.payload.oldName ? { ...task, status: action.payload.newName } : task
      );
    default:
      return state;
  }
}

export function useTaskReducer(initialTasks) {
  return useReducer(taskReducer, initialTasks);
}