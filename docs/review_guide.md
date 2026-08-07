# SyncSpace Project Review & Demonstration Guide

This guide contains everything you need to start, run, and demonstrate SyncSpace during your project review.

---

## 🚀 How to Run the Project

You need to run both the backend server and the frontend client simultaneously. Open two separate terminal windows in your project directory:

### Terminal 1: Backend Server
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the server in development mode (starts on [http://localhost:5000](http://localhost:5000)):
   ```bash
   npm run dev
   ```

### Terminal 2: Frontend Client
1. Navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server (starts on [http://localhost:5173](http://localhost:5173)):
   ```bash
   npm run dev
   ```

---

## 🎨 How Features Work & Demo Flow

Here is the step-by-step walkthrough to present during your review:

### Step 1: User Login & Room Lobby
*   **What it is**: Secure authentication and room initialization gateway.
*   **How to demo**: 
    1. Open [http://localhost:5173](http://localhost:5173).
    2. Register a new user or log in with your credentials.
    3. In the Lobby, create a new room (e.g., "ReviewRoom") or join an existing one by entering a Room ID.

### Step 2: Split-Screen Collaboration Workspace
*   **What it is**: The core workspace dashboard combining the drawing canvas and coding IDE.
*   **How to demo**:
    *   **Shared Whiteboard (Left Pane)**:
        1. Select the brush tool to draw concepts in real-time.
        2. Adjust color palettes (e.g., cyan/accent theme) and brush thickness.
        3. Double-check touchscreen drawing support (using a tablet/mobile device or browser device emulator).
        4. Test the **Fullscreen** button to expand the canvas workspace.
    *   **Monaco Code Editor (Right Pane)**:
        1. Write code blocks in the high-fidelity editor.
        2. Change language settings in the dropdown to trigger syntax highlighting.

### Step 3: Sidebar Controls & Features
*   **What it is**: Presence management, asset transfers, and chat interactions.
*   **How to demo**:
    *   **Active Roster**: View the online participants dynamically syncing in the room.
    *   **Live Chat**: Send messages back and forth in the sidebar to simulate project team communications.
    *   **File Vault**: Click the paperclip/dropzone icon to select local project files or code files. They populate instantly in the shared file grid for other users to download.

---

## ⚡ Technical Highlights to Mention

*   **Conflict Resolution (CRDTs)**: Integrated Yjs engine binding to Monaco to ensure seamless multi-user keystroke replication.
*   **Touch Screen Capabilities**: Real-time whiteboard binds touch events (`onTouchStart`/`Move`/`End`) to ensure cross-device compatibility.
*   **Security & Clean Code**: Active route validations prevent malformed API inputs. Standard index optimization rules applied across MongoDB schemas to ensure performance scales cleanly.
