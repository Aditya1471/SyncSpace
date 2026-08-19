# Project Report: SyncSpace
**A Real-Time Collaborative Workspace for Developers and Designers**

*   **Project Name**: SyncSpace
*   **Version**: 1.0.0
*   **Target Release Date**: August 20, 2026
*   **Team Leader**: Aditya
*   **Team Members**: Aditya, Akshay, Chandramahesh, Hima Varshitha, Janvi, Satyam Kumar

---

## 1. Executive Summary & Abstract
In the modern landscape of software engineering, remote collaboration is essential. Pair programming and architecture brainstorming are key activities that dictate project quality. However, team collaboration typically requires switching between separate applications: video/chat tools, sketching platforms (like Figma or Miro), and text editors (like VS Code or GitHub). This context-switching breaks developer flow and introduces friction.

**SyncSpace** is a unified, low-latency, real-time collaborative workspace that integrates a shared whiteboard and a collaborative code editor in a responsive split-screen layout. By combining visual sketch boards with high-fidelity coding interfaces, SyncSpace eliminates context-switching, streamlining collaborative pair programming.

---

## 2. Problem Statement
Collaborative development suffers from fragmentation:
1.  **Context-Switching Fatigue**: Moving between code editors and sketching canvases reduces focus.
2.  **State Desynchronization**: Code and designs often get disconnected when stored in different environments.
3.  **Low-Latency Barriers**: Synchronizing mouse inputs and character-level edits across networks in real-time requires robust conflict resolution.
4.  **Cross-Device Disparity**: Web tools often lack support for touchscreen inputs (tablets/smartphones) for drawing, restricting developer mobility.

---

## 3. Proposed Solution & Architecture
SyncSpace solves these issues with a web-based, real-time split-screen application. 

### System Topology
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

### Key Technologies
*   **Frontend UI (React/Vite)**: Delivers a rapid build pipeline and hot module updates (HMR).
*   **Whiteboard Engine (Konva.js)**: Renders vector strokes on a 2D canvas with fast rendering loops.
*   **IDE Engine (Monaco Editor)**: Powers the code editor with standard auto-completions, search, and syntax highlighting.
*   **Conflict Resolution (Yjs)**: Implements CRDTs (Conflict-free Replicated Data Types) for character-level code syncing.
*   **Network Protocol (Socket.io)**: Brokers low-latency socket messages.
*   **Backend Server (Express/Node.js)**: Built using the MVC design pattern.
*   **Database (MongoDB/Mongoose)**: Persists session metadata, user credentials, and folder structures.

---

## 4. Comprehensive Feature Analysis

### A. Authentication & Room Lobby
*   **Secure Session Handles**: Utilizes JWT authentication to secure room access.
*   **Dynamic Room Channels**: Users can create rooms or join active ones using a Room ID.

### B. Interactive Whiteboard (Left Pane)
*   **Drawing Suite**: Supports pen brushes, shapes, stroke adjustments, custom colors, and canvas resets.
*   **Touchscreen Event Benders**: Listens to touch events (`onTouchStart`/`Move`/`End`), making it fully compatible with tablets and mobile emulators.
*   **State Toggle**: Supports a Fullscreen toggle to maximize drawing focus.

### C. Monaco IDE Editor (Right Pane)
*   **IDE Features**: Autocompletion, line highlighting, and error diagnostics.
*   **Multi-Language Engine**: Support for JavaScript, Python, C++, HTML, and CSS.
*   **Keystroke Sync**: Integrates conflict-free replication to sync edits without cursor jumping.

### D. Collaborative Sidebar Tools
*   **Live Roster**: Displays dynamic indicators of online users in the room.
*   **File Vault**: Supports drag-and-drop file selection to share SQL schemas, mocks, or documentation.
*   **Room Chat**: Synchronous room chat with timestamps for direct developer messaging.

---

## 5. Backend Database & API Schema Design

The backend is structured under a clean MVC pattern. 

### Database Models
1.  **User Model (`User.js`)**: Handles user profiles, password hashing (via `bcryptjs`), and session tokens.
2.  **Room Model (`Room.js`)**: Tracks room metadata, owners, members, and timestamps.
3.  **Chat Model (`Chat.js`)**: Persists room chat histories.
4.  **Editor Model (`Editor.js`)**: Saves real-time code file revisions.
5.  **File & Folder Models (`File.js`, `Folder.js`)**: Manages the workspace file directory tree structure.

### API Endpoints
*   **Auth**: `POST /api/auth/signup`, `POST /api/auth/login`
*   **Rooms**: `POST /api/rooms`, `GET /api/rooms/:roomId`
*   **Files**: `POST /api/files/upload`, `GET /api/files/:roomId`

---

## 6. Git Workflows & Team Contributions

Work was divided across branches, and commits followed Conventional Commits naming patterns. The distribution of effort is measured by the **number of unique active commit days** on the repository:

*   **Aditya (Team Leader & Architect)**: **13 active commit days**
    *   *Focus*: Systems topology, code reviews, staging, connection diagnostics.
*   **Akshay (Lead Frontend)**: **6 active commit days**
    *   *Focus*: Canvas touch events, layout grids, responsive design.
*   **Chandramahesh (Lead Backend)**: **6 active commit days**
    *   *Focus*: Mongoose indexes, database controllers, Socket.io setup.
*   **Hima Varshitha (Frontend & Testing)**: **4 active commit days**
    *   *Focus*: UI quality, component validations, test suites.
*   **Janvi (UI Design & Docs)**: **3 active commit days**
    *   *Focus*: Style constants, meeting summaries, design drafts.
*   **Satyam Kumar (Developer)**: **1 active commit day**
    *   *Focus*: Code Runner config, sandbox route validations.

---

## 7. Quality Assurance & System Stability

To ensure commercial viability, two stability fixes were implemented:
1.  **Database Connection Safety**: Enhanced database connection logic in `db.js` to parse connection failures. If a DNS or SRV error occurs (such as local ISP DNS blocks), it prints a step-by-step diagnostic guide to the console (e.g. flushing DNS cache, configuring Google DNS `8.8.8.8`).
2.  **Redundant Schema Indexes**: Removed duplicate index warnings by cleaning up Mongoose schema declarations, improving index build performance.
3.  **Real-Time Data Alignment**: Fixed payload mismatches in chat and code events to ensure instant UI updates.

---

## 8. Conclusion & Future Roadmap
SyncSpace successfully builds a unified real-time collaboration workspace for developers. Future work includes:
1.  Adding WebRTC voice/video calls inside rooms.
2.  Integrating sandboxed code execution runtimes directly on the server to execute Python, JS, and C++ files.
3.  Enabling Git repository imports to load projects directly into the editor.
