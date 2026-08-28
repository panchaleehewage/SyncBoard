# Syncboard

Syncboard is a full-stack, visually intuitive Kanban application designed for seamless team collaboration. 

## Features
- **Visual Planning**: Custom columns, drag-and-drop tasks, and color-coded tags.
- **Real-Time Collaboration**: Invite teammates and manage board access.
- **Secure Authentication**: JWT-based auth with encrypted passwords.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Context API.
- **Backend**: Node.js, Express, MongoDB (Mongoose).

## Setup Instructions
1. Clone the repository and run `npm install` in both `syncboard-client` and `syncboard-server`.
2. Create a `.env` file in the server directory based on `.env.example`.
3. Ensure MongoDB is running locally or provide a MongoDB Atlas URI in `MONGODB_URI`.
4. Start the backend: `cd syncboard-server && node src/server.js`
5. Start the frontend: `cd syncboard-client && npm run dev`
6. Open your browser to `http://localhost:5173`.

## Data Model Justification

| Relationship | Strategy | Justification |
|---|---|---|
| **User ↔ Board** | Reference | A user belongs to many boards, and boards have many users. Embedding would cause massive duplication and make updating user profiles a nightmare. |
| **Board ↔ Columns/Tags** | Embed | Columns and tags are strictly bound to a single board. They do not exist independently. Embedding ensures they are retrieved instantly with the board in a single query. |
| **Board ↔ Tasks** | Reference | Tasks grow indefinitely over the lifecycle of a project. Embedding them inside the board document would quickly hit MongoDB's 16MB document limit. |