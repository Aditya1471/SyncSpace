# SyncSpace Architecture Design

SyncSpace is a real-time collaborative workspace containing a split-screen layout with a shared whiteboard (left pane) and a shared code editor (right pane). This document details the technical architecture and how the components interact.

---

## 1. System Topology

```
                     +---------------------------------------+
                     |            React Frontend             |
                     |  +---------------------------------+  |
                     |  |  Split-Screen Container Layout   |  |
                     |  +---------------------------------+  |
                     |  |  Whiteboard    |  Code Editor   |  |
                     |  |  (Konva.js)    |  (Monaco)      |  |
                     |  +---------------------------------+  |
                     +---------------------------------------+
                                        ||
                                        || WebSocket / Socket.io
                                        ||
                     +---------------------------------------+
                     |         Express + Node Server         |
                     |  +---------------------------------+  |
                     |  |  Socket.io Router Connection    |  |
                     |  +---------------------------------+  |
                     |  |  Room Manager Logic Component   |  |
                     |  +---------------------------------+  |
                     +---------------------------------------+
                                        ||
                                        || Mongoose
                                        ||
                     +---------------------------------------+
                     |           MongoDB Database            |
                     +---------------------------------------+
```

---

## 2. Key Technologies

### A. Konva.js (Whiteboard)
- **Role**: Renders the 2D canvas layout for drawing, erasing, selecting shapes, and text annotations.
- **Integration**: React-Konva wrapper coordinates drawings and mouse events into state arrays, then serializes updates to be emitted over Socket.io to synchronize other room members.

### B. Monaco Editor (Code Editor)
- **Role**: Provides a high-fidelity code editor interface in the web browser, including syntax highlighting, auto-completions, and basic linting.
- **Integration**: Loaded via `@monaco-editor/react`. Captures changes to synchronize real-time updates across room participants.

### C. Yjs (Shared Editing Engine)
- **Role**: Conflict-free Replicated Data Type (CRDT) engine that manages document edits, ensures state convergence, and avoids conflict-resolution races.
- **Integration**: Bound directly to the Monaco Editor. Propagates changes over standard WebSockets (`y-websocket` provider) or custom Socket.io adapter to ensure character-level collaboration works flawlessly.

### D. Socket.io (Real-time Broker)
- **Role**: Full-duplex communication channel. Handles room management events, whiteboard stroke replication, presence updates, and peer synchronization.
- **Integration**: React client connects to the Express-managed socket namespace; rooms are logically created and managed in-memory on the server.

### E. MongoDB (State Persistence)
- **Role**: Long-term storage of user accounts, room documents (saved whiteboard assets, code files), and metadata.
- **Integration**: Express server connects to MongoDB using Mongoose schemas. When users save their session, the current room state is committed to database records.

---

## 3. Communication Flow

1. **Room Join Protocol**:
   - User inputs a Room ID and username.
   - Client emits a `join-room` socket event.
   - Server processes connection, creates room if new, joins the socket client to the room channel, and queries MongoDB to load prior state if it exists.
   - Server responds with successful join, user list, and initial code/canvas snapshot.

2. **Whiteboard Sync**:
   - User draws a line on Konva.js canvas.
   - Canvas fires `draw` event; line coordinates are serialized.
   - Client sends coordinate updates to socket room.
   - Server broadcasts the line coordinates to all other sockets in the same room.
   - Recipients draw the line on their local Konva canvas instance.

3. **Code Sync**:
   - Monaco Editor captures user keypresses.
   - Yjs processes local edits and transforms them using CRDT rules.
   - Edit-deltas are sent via websocket provider.
   - Peer clients apply delta, rendering the updated text dynamically without cursor jumps.
