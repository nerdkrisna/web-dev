# ProjectHub — Enterprise Project Management System

> **Course**: Web Application Development (`BE05000281`)  
> **Faculty Guide**: Prof. Amitkumar J. Patel  
> **Student Name**: Krishna  
> **Enrollment No**: `241260116052`  
> **Semester / Academic Year**: 2026  

---

## 1. Problem Statement

Modern software engineering and business teams often suffer from fragmented communication, decentralized task management, opaque project budgets, and untracked deliverable deadlines. Without a unified system, project managers and team members face delayed sprints, overspent budgets, and administrative overhead.

**ProjectHub** resolves this by delivering a full-stack, responsive web application that streamlines project tracking, budget oversight, sprint progress, and team collaboration. Featuring a secure JSON Web Token (JWT) authentication system, role-based controls, real-time multi-attribute filtering, and comprehensive CRUD capabilities backed by MongoDB Atlas.

---

## 2. Tech Stack Used

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **React 19 + Vite** | High-performance SPA with fast HMR |
| **Routing** | **React Router v7** | Client-side navigation & route protection |
| **HTTP Client** | **Axios** | REST API calls with interceptors for JWT auth |
| **UI & Styling** | **Vanilla CSS3** | Custom dark glassmorphic design system |
| **Icons** | **Lucide React** | Clean, modern iconography |
| **Backend Runtime** | **Node.js (v26)** | Asynchronous server execution (ES Modules) |
| **Backend Framework** | **Express.js** | RESTful routing, middleware & error handling |
| **Database** | **MongoDB Atlas** | Cloud NoSQL document database |
| **Object Modeling** | **Mongoose ODM** | Schemas, validations, queries & aggregations |
| **Security & Auth** | **JWT & Bcrypt.js** | Token authentication & password hashing |
| **Environment** | **dotenv & CORS** | Environment config & cross-origin policies |

---

## 3. Features List

- 🔐 **JWT Authentication & Session Management**:
  - Secure registration and login with encrypted passwords (`bcryptjs`).
  - Persistent login state stored in `localStorage` with automated token refresh validation.
  - Route protection for creating, editing, and deleting projects, plus user profile views.
  - Dynamic navbar toggling between authenticated user avatar / logout and guest login / sign up.
- 📁 **Comprehensive Project CRUD Operations**:
  - **Create**: Add new projects with title, category, status, priority, budget, deadline, and assigned team.
  - **Read**: View aggregated stats on the dashboard, full catalog with search and multi-criteria filters, and detailed single-project views.
  - **Update**: Full edit form and 1-click rapid status progression buttons.
  - **Delete**: Protected deletion with modal confirmation prompt.
- 🔍 **Live Search, Filter & Sort**:
  - Instant debounced search by project title or description.
  - Filtering by status (*Planning, In Progress, Completed, On Hold*).
  - Filtering by priority (*Low, Medium, High, Urgent*).
  - Filtering by category (*Web Development, Mobile App, UI/UX Design, DevOps, etc.*).
  - Multi-attribute sorting (*Newest, Oldest, Budget High/Low, Deadline Soonest*).
- 📊 **Analytics & Metrics Dashboard**:
  - Aggregated cards showing Total Projects, Active Sprints, Completed Initiatives, and Total Budget Allocation.
- 🛡️ **Robust Error Handling & UX Feedback**:
  - Floating Toast notifications for immediate success and error alerts.
  - Animated loading spinners during asynchronous API calls.
  - Contextual empty states when search/filters yield zero results.
  - Clean HTTP status codes (`200`, `201`, `400`, `401`, `404`, `500`) returned by the API.

---

## 4. API Documentation (Table Format)

All API endpoints are hosted at `http://localhost:5000/api`.

| # | Method | Endpoint | Access | Sample Request Body | Sample Response (Summary) | Status Code |
|:---:|:---:|:---|:---:|:---|:---|:---:|
| **1** | `GET` | `/health` | Public | *None* | `{"status":"success","message":"Server is healthy"}` | `200 OK` |
| **2** | `POST` | `/auth/register` | Public | `{"name":"Jane","email":"jane@test.com","password":"Pass123!","role":"Manager"}` | `{"success":true,"data":{"_id":"...","token":"eyJ..."}}` | `201 Created` |
| **3** | `POST` | `/auth/login` | Public | `{"email":"jane@test.com","password":"Pass123!"}` | `{"success":true,"data":{"_id":"...","token":"eyJ..."}}` | `200 OK` |
| **4** | `GET` | `/auth/profile` | **Private** | *None* (`Authorization: Bearer <token>`) | `{"success":true,"data":{"name":"Jane","role":"Manager"}}` | `200 OK` |
| **5** | `POST` | `/projects` | **Private** | `{"title":"Migration","budget":45000,"status":"In Progress",...}` | `{"success":true,"data":{"_id":"...","title":"Migration"}}` | `201 Created` |
| **6** | `GET` | `/projects` | Public | *None* (Optional: `?search=...&status=...`) | `{"success":true,"count":4,"data":[{...},{...}]}` | `200 OK` |
| **7** | `GET` | `/projects/:id` | Public | *None* | `{"success":true,"data":{"_id":"...","title":"..."}}` | `200 OK` |
| **8** | `PUT` | `/projects/:id` | **Private** | `{"status":"Completed","budget":52000}` | `{"success":true,"data":{"_id":"...","status":"Completed"}}` | `200 OK` |
| **9** | `DELETE` | `/projects/:id` | **Private** | *None* (`Authorization: Bearer <token>`) | `{"success":true,"message":"Project deleted successfully"}` | `200 OK` |
| **10** | `GET` | `/projects/stats/summary` | Public | *None* | `{"success":true,"data":{"totalProjects":4,"totalBudget":...}}` | `200 OK` |

> *A complete Postman collection is ready to import at [`backend/postman_collection.json`](file:///c:/Users/Krishna/Desktop/janus%20projects/backend/postman_collection.json).*

---

## 5. Application Pages & UI Architecture

The application includes the following pages and responsive layouts:

```
├── 1. Dashboard View (/)
│   ├── Metrics Grid (Total Projects, In Progress, Completed, Budget)
│   ├── Welcome Hero Banner with Quick Navigation
│   └── Recent Active Projects Grid
│
├── 2. Projects Catalog View (/projects)
│   ├── Live Search Input (Title & Description)
│   ├── Multi-Dropdown Filters (Status, Priority, Category, Sorting)
│   ├── Responsive Cards Grid with Badges & Currency Formatting
│   └── Empty State View with "Reset Filters" CTA
│
├── 3. Project Details View (/projects/:id)
│   ├── Detailed Scope, Budget, Deadline & Assigned Team
│   ├── 1-Click Status Progression Buttons (Planning ➔ Completed)
│   └── Edit & Protected Deletion Modal
│
├── 4. Project Form View (/projects/new & /projects/edit/:id)
│   ├── Protected Form with Validation Warnings
│   └── Date Picker, Priority Selector, Category Selector & Currency Input
│
├── 5. Authentication Views (/login & /register)
│   ├── Glassmorphic Auth Cards
│   └── 1-Click "Use Demo Account (Admin)" Auto-fill Button
│
└── 6. User Profile View (/profile)
    ├── Authenticated Member Information, Role & Join Date
    └── Quick Sign Out & Project Browsing Links
```

---

## 6. How to Run Instructions

### Prerequisites
- **Node.js** (v18.0 or higher installed)
- **npm** (v9.0 or higher)
- **MongoDB Atlas** cluster connection URI

---

### Step A: Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Ensure `.env` is configured with your credentials:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.l4qpoq7.mongodb.net/web_project_db?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=jwt_super_secret_key_84920183920194829103
   ```

4. Verify database connectivity:
   ```bash
   npm run verify:db
   ```

5. *(Optional)* Seed initial sample projects:
   ```bash
   node src/seed.js
   ```

6. Start the backend server:
   ```bash
   npm run dev
   # Server runs at: http://localhost:5000
   ```

7. Run automated test suite:
   ```bash
   npm run test:api
   node src/test-error-handling.js
   ```

---

### Step B: Frontend Setup

1. Open a second terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   # Application opens at: http://localhost:5173
   ```

4. *(Optional)* Build for production:
   ```bash
   npm run build
   ```

---

### Demo Credentials:
- **Email**: `admin@projecthub.io`
- **Password**: `Password123!`
*(Or click the **"Use Demo Account (Admin)"** button on the Login page).*
