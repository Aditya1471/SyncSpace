# SyncSpace Team Roster & Technical Suitability Matrix

This document defines the team composition, role assignments, and technical suitability for the SyncSpace project. It serves as a guide for task delegation and team alignment.

---

## 👥 Roster & Suitability Summary

| Team Member | Role | Technical Suitability & Domain | Primary Focus Areas |
| :--- | :--- | :--- | :--- |
| **Aditya** | Team Leader & Systems Architect | Core coordinator, repository owner, experienced in integration testing, CI/CD pipeline structures, and release delivery. | • GitHub Workflow & Code Reviews<br>• Integration Testing & Staging Deployments<br>• Project Roadmap Coordination |
| **Akshay** | Lead Frontend Developer | Expert in React UI design, responsive design, Canvas/Konva rendering systems, and interactive interface animations. | • Responsive UI & Mobile Compatibility<br>• Whiteboard Toolbars & Canvas Drawing Tools<br>• Interactive Sidebar States & User Presence |
| **Chandramahesh** | Lead Backend Developer | Strong background in Node.js/Express APIs, secure server middleware, MongoDB Schema design, and WebSockets (Socket.io). | • API Validations & Error Boundaries<br>• Socket.io Room Event Handlers<br>• MongoDB Persistence Scheduling |
| **Alex Dev** | DevOps & Cloud Integrator | Specializes in storage integrations (AWS S3 / Cloudinary), environment variables, security protocols, and CI/CD. | • Cloud Asset Storage & File Vault Backend<br>• Drag-and-Drop file uploads & Validation<br>• Deployment environments config |
| **Jordan Dev** | Editor & Sandbox specialist | Proficient with Monaco Editor settings, sandboxed environments, real-time sync engines (Yjs / CRDTs), and compilers. | • Monaco collaborative editing (Yjs)<br>• Sandboxed execution runtime & Code Runner<br>• Remote Cursor synchronization |

---

## 🛠️ Direct Task Suitability Profiles

### 👤 Aditya (Team Leader & Architect)
*   **Why Suitable**: As repository owner and architect, Aditya has a high-level view of the entire codebase and systems topology.
*   **Key Responsibilities**:
    *   Reviewing and merging PRs into the `development` branch.
    *   Deploying to Vercel/Render.
    *   Writing end-to-end integration tests to verify features work harmoniously.

### 👤 Akshay (Frontend Specialist)
*   **Why Suitable**: Handled the whiteboard responsiveness implementation in `feature/whiteboard-responsiveness` and the custom premium layouts.
*   **Key Responsibilities**:
    *   Testing canvas resize listeners across devices.
    *   Polishing layout CSS grids and responsive break-points for mobile screens.
    *   Building UI roster panels and tooltips.

### 👤 Chandramahesh (Backend Specialist)
*   **Why Suitable**: Authored the improved backend database schemas, routers, and controllers in the `feature/backend-api` branch.
*   **Key Responsibilities**:
    *   Extending MongoDB endpoints with validation rules (`express-validator`).
    *   Integrating and testing socket channels for whiteboard canvas streaming.
    *   Writing MongoDB indexes and caching policies.

### 👤 Alex Dev (Full-Stack & DevOps)
*   **Why Suitable**: Experienced in asset delivery systems, cloud assets management, and deployment pipelines.
*   **Key Responsibilities**:
    *   Integrating Cloudinary/AWS S3 SDK on the backend.
    *   Handling file upload streams and verifying secure file metadata properties.

### 👤 Jordan Dev (Database & Editor Specialist)
*   **Why Suitable**: Expert in collaborative text synchronizers and sandboxed environment configurations.
*   **Key Responsibilities**:
    *   Integrating `y-websocket` or socket.io providers for Yjs editor documents.
    *   Setting up isolated API routing to execute untrusted user code (JS/Python/C++) safely.
