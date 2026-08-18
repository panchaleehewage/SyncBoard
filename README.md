# Syncboard

## Description
Syncboard is a collaborative Kanban-style task board built with React and Vite. It allows teams to create workspaces, add and assign tasks, and track progress across "To Do", "In Progress", and "Done" columns. This front-end prototype features simulated API latency, URL-based filtering, global dark mode, and custom state management using React Context and `useReducer`.

## How to Run Locally

To get the development server running on your local machine, follow these steps:

1. **Clone the repository** (if you haven't already):
   git clone <your-repo-url>
   cd syncboard

2. Install the dependencies:
    npm install

3. Start the development server:
    npm run dev

4. Open your browser: Click the local link provided in the terminal (usually http://localhost:5173).

## Folder Structure

The project is strictly organized to separate concerns and maintain modularity:

api/: Contains simulated API calls. All data fetching is abstracted here (no fetch calls inside components).

components/: Presentational, reusable UI components (e.g., TaskCard, Button, Column). These do not fetch data.

context/: Global state providers. Contains ThemeContext to manage dark mode app-wide without prop drilling.

data/: Holds mockData.js to seed the application before the live API and database are connected.

hooks/: Shared stateful logic, including useTaskReducer to manage the complex task state actions (add, move, delete).

pages/: Route-level components (Home, Board, TaskDetail, NotFound) that compose the UI for specific URLs.

utils/: Reserved for pure, unit-testable helper functions (e.g., date formatting).

## Known Limitations (Week 1 Prototype)

Data Persistence: Because there is no real backend or database connected yet, data is only stored in memory. Refreshing the browser will reset all tasks, boards, and user states back to the original mock data.

Authentication: The login system is a front-end simulation. It validates against hard-coded user objects and does not yet use secure JWTs or session tokens.

Simulated Latency: The loading states are triggered by an artificial 800ms setTimeout delay in the api module to simulate network requests.