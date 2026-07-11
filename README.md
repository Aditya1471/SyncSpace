# SyncSpace

SyncSpace is a real-time collaborative workspace that combines a shared whiteboard and a collaborative code editor in a responsive split-screen layout.

---

## 1. Project Architecture

The system uses a React frontend communicating over real-time Socket.io connections to an Express server, persisting configuration and session rooms inside MongoDB.

```
               React Frontend (Vite)
        ----------------------------------
        |   Whiteboard   |  Code Editor  |
        |   (Konva.js)   |   (Monaco)    |
        ----------------------------------
                        ||
            Socket.io / Yjs WebSockets
                        ||
             Express + Node Server
                        ||
             Room & Collaboration Manager
                        ||
                    MongoDB
```

---

## 2. Directory Structure

```
SyncSpace/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # UI components (Whiteboard, Editor, SplitScreen)
│   │   ├── hooks/          # Custom hooks (useSocket, useYjs)
│   │   ├── context/        # Socket and collaboration contexts
│   │   └── assets/
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # DB & environmental configuration
│   ├── controllers/        # Request handling logic
│   ├── middleware/         # Auth, validation, error handlers
│   ├── models/             # Mongoose schemas (Room, User, Document)
│   ├── routes/             # API routes
│   ├── sockets/            # Socket.io event handlers
│   ├── server.js           # Server entrypoint
│   └── package.json
├── docs/                   # Project documentation
│   ├── architecture.md
│   └── team_meeting.md
├── .gitignore
└── README.md               # Main onboarding and team guidelines
```

---

## 3. Team Responsibilities

Our team has 6 members. Work is distributed as follows:

| Role | Responsibility | Main Focus |
|---|---|---|
| **Member 1 (Team Leader)** | Project Architect / Lead | Architecture, API design, code reviews, process alignment. |
| **Member 2** | Frontend Specialist | Split-screen interface, CSS layouts, and UI transitions. |
| **Member 3** | Backend Specialist | Express server setup, API routes, Mongoose models, DB integrity. |
| **Member 4** | Real-time Specialist | Socket.io server logic, client connection setup, room management. |
| **Member 5** | Whiteboard Developer | Konva.js integration, drawing actions, canvas broadcast sync. |
| **Member 6** | Code Editor Developer | Monaco editor config, Yjs bindings, collaborative sync integration. |

---

## 4. Development Environment Setup

Each member must install and configure the following dependencies:

1. **Node.js**: Install latest LTS version.
2. **MongoDB**: Install MongoDB Community Server locally or use MongoDB Atlas.
3. **Git**: Install CLI client.
4. **VS Code**: Recommended editor (install Prettier & ESLint extensions).

### Server Setup
1. Open terminal inside the `/server` directory:
   ```bash
   cd server
   ```
2. Copy environmental variables:
   ```bash
   cp .env.example .env
   ```
3. Run in development mode:
   ```bash
   npm run dev
   ```

### Client Setup
1. Open terminal inside the `/client` directory:
   ```bash
   cd client
   ```
2. Start development server:
   ```bash
   npm run dev
   ```

---

## 5. Git Workflow

- **Branching Policy**: 
  - `main` is production-ready code.
  - `development` is the target branch for feature releases.
  - Features should be developed in `feature/<feature-name>` branches.
- **Workflow**:
  1. Pull latest code from `development`.
  2. Create feature branch: `git checkout -b feature/my-feature`.
  3. Commit often with descriptive commit messages.
  4. Push to remote: `git push origin feature/my-feature`.
  5. Open a Pull Request (PR) against `development` for review.
