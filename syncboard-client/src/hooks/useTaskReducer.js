import { useReducer } from 'react';

// ─── Board Reducer ─────────────────────────────────────────────────────────────
// State shape: { tasks: [], columns: [], tags: [] }
function boardReducer(state, action) {
  switch (action.type) {
    // ── Task actions ───────────────────────────────────────────────────────────
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'MOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? { ...t, status: action.payload.newStatus } : t
        ),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case 'EDIT_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => (t.id === action.payload.id ? action.payload : t)),
      };
    case 'RENAME_COLUMN':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.status === action.payload.oldName ? { ...t, status: action.payload.newName } : t
        ),
      };

    // ── Column actions ─────────────────────────────────────────────────────────
    case 'SET_COLUMNS':
      return { ...state, columns: action.payload };
    case 'ADD_COLUMN':
      return { ...state, columns: [...state.columns, action.payload] };
    case 'REMOVE_COLUMN':
      return { ...state, columns: state.columns.filter((_, i) => i !== action.payload) };
    case 'UPDATE_COLUMN':
      return {
        ...state,
        columns: state.columns.map((c, i) => (i === action.payload.index ? action.payload.column : c)),
      };

    // ── Tag actions ────────────────────────────────────────────────────────────
    case 'SET_TAGS':
      return { ...state, tags: action.payload };
    case 'ADD_TAG':
      return { ...state, tags: [...state.tags, action.payload] };
    case 'REMOVE_TAG':
      return { ...state, tags: state.tags.filter((_, i) => i !== action.payload) };
    case 'UPDATE_TAG':
      return {
        ...state,
        tags: state.tags.map((t, i) => (i === action.payload.index ? action.payload.tag : t)),
      };

    default:
      return state;
  }
}

/**
 * useBoardReducer — manages full board state: tasks, columns, and tags.
 * Replaces scattered useState calls for board-level data.
 * @param {Object} initialState — { tasks?, columns?, tags? }
 */
export function useBoardReducer(initialState) {
  return useReducer(boardReducer, {
    tasks: [],
    columns: [],
    tags: [],
    ...initialState,
  });
}

// ─── Backward-compat alias (tasks-only flat array) ─────────────────────────────
function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_TASKS': return action.payload;
    case 'ADD_TASK': return [...state, action.payload];
    case 'MOVE_TASK': return state.map(t => t.id === action.payload.id ? { ...t, status: action.payload.newStatus } : t);
    case 'DELETE_TASK': return state.filter(t => t.id !== action.payload);
    case 'EDIT_TASK': return state.map(t => t.id === action.payload.id ? action.payload : t);
    case 'RENAME_COLUMN': return state.map(t => t.status === action.payload.oldName ? { ...t, status: action.payload.newName } : t);
    default: return state;
  }
}

export function useTaskReducer(initialTasks) {
  return useReducer(taskReducer, initialTasks);
}