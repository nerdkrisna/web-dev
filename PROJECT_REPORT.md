# PROJECT REPORT: Web Application Development (BE05000281)

**Page No:** 31  
**Project Title:** ProjectHub — Full-Stack Project Management System  
**Student Name:** Krishna  
**Enrollment No:** 241260116052  
**Faculty Guide:** Prof. Amitkumar J. Patel  

---

### 1. Problem Statement
Managing software deliverables, sprint milestones, cross-functional team assignments, and budgets across scattered spreadsheets creates bottlenecks and project failure risks. **ProjectHub** provides a centralized, secure web application with comprehensive CRUD capabilities, multi-attribute filtering, live search, role-based JWT security, and interactive analytics.

---

### 2. Technology Stack Used
- **Frontend**: React 19, Vite, React Router v7, Axios, Lucide React, Modern Glassmorphic Vanilla CSS
- **Backend**: Node.js v26, Express.js (ES Modules, REST API architecture)
- **Database**: MongoDB Atlas Cloud, Mongoose ODM
- **Security**: JSON Web Tokens (JWT), Bcrypt.js (10 salt rounds), CORS
- **Testing**: Automated REST API test runner, Error Handling assertion suite, Postman v2.1 Collection

---

### 3. Key Features Implemented
1. **JWT Authentication & Protected Routes**: Passwords securely hashed; tokens stored with `localStorage` persistence; `/projects/new`, `/projects/edit/:id`, and `/profile` routes protected.
2. **Dynamic Navbar**: Toggles between authenticated user profile badge/logout and guest login/sign up.
3. **Full Project CRUD Operations**: Create projects, view catalog, filter/sort initiatives, view detailed specs, update attributes, and delete with modal confirmation.
4. **Real-Time Search & Multi-Filters**: Debounced search by title/description, dropdown filters by Status, Priority, Category, and Sort order.
5. **Dashboard Analytics**: Real-time aggregated metrics for Total Projects, In Progress, Completed, and Total Budget.
6. **Robust Error Handling**: Centralized error middleware returning HTTP status codes (`200`, `201`, `400`, `401`, `404`, `500`), animated toast alerts, loading spinners, and empty states.

---

### 4. API Endpoints Documentation

| Method | Endpoint | Access | Request Body | Response (Success) | Status Code |
|---|---|---|---|---|---|
| `GET` | `/api/health` | Public | *None* | `{"status":"success","message":"Server is healthy"}` | `200 OK` |
| `POST` | `/api/auth/register` | Public | `{"name","email","password","role"}` | `{"success":true,"data":{"user","token"}}` | `201 Created` |
| `POST` | `/api/auth/login` | Public | `{"email","password"}` | `{"success":true,"data":{"user","token"}}` | `200 OK` |
| `GET` | `/api/auth/profile` | Protected | *None* (Bearer Token) | `{"success":true,"data":{"user"}}` | `200 OK` |
| `POST` | `/api/projects` | Protected | `{"title","category","status","budget",...}` | `{"success":true,"data":{project}}` | `201 Created` |
| `GET` | `/api/projects` | Public | *None* (Query: `?search=&status=&sort=`) | `{"success":true,"count":N,"data":[...]}` | `200 OK` |
| `GET` | `/api/projects/:id` | Public | *None* | `{"success":true,"data":{project}}` | `200 OK` |
| `PUT` | `/api/projects/:id` | Protected | `{"status","budget","priority",...}` | `{"success":true,"data":{updatedProject}}` | `200 OK` |
| `DELETE` | `/api/projects/:id` | Protected | *None* (Bearer Token) | `{"success":true,"message":"Project deleted"}` | `200 OK` |
| `GET` | `/api/projects/stats/summary`| Public | *None* | `{"success":true,"data":{"totalProjects",...}}` | `200 OK` |

---

### 5. Application Pages & Structure
1. **Dashboard (`/`)**: Overview metrics cards, hero banner, and recent project initiatives.
2. **Projects Catalog (`/projects`)**: Search bar, multi-category filters, status pills, and project cards grid.
3. **Project Details (`/projects/:id`)**: Comprehensive view, scope description, budget, and quick status changer.
4. **Project Form (`/projects/new` & `/projects/edit/:id`)**: Protected form with field validations and date pickers.
5. **Authentication (`/login` & `/register`)**: Glassmorphic auth cards with 1-click Demo credentials auto-fill.
6. **User Profile (`/profile`)**: Account details, role authorization, and join timestamp.

---

### 6. How to Run Instructions
```bash
# 1. Start Backend Server
cd backend
npm install
npm run verify:db      # Test MongoDB Atlas connection
npm run dev            # Runs on http://localhost:5000

# 2. Start Frontend Server
cd ../frontend
npm install
npm run dev            # Runs on http://localhost:5173
```
- **Demo Credentials**: `admin@projecthub.io` / `Password123!`
- **Postman Collection**: Import `backend/postman_collection.json`
