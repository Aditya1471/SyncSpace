# Day 1 Kick-Off Team Meeting Agenda

**Project**: SyncSpace  
**Role**: Team Leader (Facilitator)  
**Time**: Week 1 - Day 1  
**Duration**: 30 Minutes  

---

## Meeting Goals
1. Align the team on the overall vision and target deliverables of SyncSpace.
2. Formally assign roles and explain each member's focus area.
3. Establish Git workflows, directory structures, coding guidelines, and status update cadences.

---

## 1. Project Goal & Architecture Overview (10 Mins)
- **Problem SyncSpace Solves**: Developers and designers need a unified, zero-latency space where they can draw whiteboard concepts and write/sync code in real-time, eliminating window switching during remote pairing sessions.
- **System Flow**: Explain that the React UI feeds updates into a centralized Socket.io gateway, backed by Express server routing, which handles persistent rooms and hooks into MongoDB.

---

## 2. Directory Structure Setup (5 Mins)
Walk the team through the local codebase folder layout:
- `server/`: Express backend setup, configurations, models, and WebSocket channels.
- `client/`: Vite-configured React codebase. UI components, Contexts, Hooks.
- `docs/`: Systems diagrams, meeting summaries, API contracts.

---

## 3. Git Branching & Workflow (5 Mins)
- **Rule**: NEVER commit directly to `main` or `development` branches.
- **Workflow**:
  1. Pull latest from `development` branch.
  2. Create a feature branch: `feature/<feature-name>` (e.g. `feature/socket-rooms`, `feature/canvas-draw`).
  3. Work locally, run tests.
  4. Push feature branch and open a Pull Request (PR) against `development`.
  5. Require at least one peer code review before merge.
  6. The `main` branch will only be updated for stable production releases.

---

## 4. Coding Standards & Naming Conventions (5 Mins)
- **Naming Style**:
  - *Frontend (React)*: PascalCase for file names & components (e.g. `SplitScreen.jsx`, `WhiteboardCanvas.jsx`). camelCase for functions and states.
  - *Backend (Node)*: camelCase for controllers, middleware, and route functions. models/schemas should be uppercase singular (e.g., `Room.js`).
  - *Variables & Database*: camelCase fields.
- **Formatting**:
  - Always write clean, self-documenting code with descriptive comments.
  - Keep functions focused and small (SRP: Single Responsibility Principle).
  - Use environment variables (`.env`) for secrets; never hardcode URIs or keys.

---

## 5. Daily Sync Process (5 Mins)
- **Daily Standup**: A quick 10-minute check-in every morning.
- **Three Questions**:
  1. What did you work on yesterday?
  2. What are you working on today?
  3. Are there any blockers in your way?
- **Communication Channels**: Utilize Discord/Slack for quick chats and GitHub Issues to track task updates.
