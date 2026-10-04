# Project Management REST API Documentation

- **Base URL**: `http://localhost:5000`
- **Database**: MongoDB Atlas (`Mongoose`)
- **Authentication**: JWT (Bearer Token in `Authorization` header)
- **Data Format**: `application/json`

---

## Table of Endpoints

| # | Endpoint | Method | Access | Description |
|---|---|---|---|---|
| 1 | `/api/health` | `GET` | Public | Server & Database connectivity check |
| 2 | `/api/auth/register` | `POST` | Public | Register new user & receive JWT token |
| 3 | `/api/auth/login` | `POST` | Public | Authenticate user & receive JWT token |
| 4 | `/api/auth/profile` | `GET` | Private | Get current authenticated user profile |
| 5 | `/api/projects` | `POST` | Private | Create a new project (CRUD: Create) |
| 6 | `/api/projects` | `GET` | Public | Get all projects with filters & search (CRUD: Read) |
| 7 | `/api/projects/:id` | `GET` | Public | Get single project by ID (CRUD: Read) |
| 8 | `/api/projects/:id` | `PUT` | Private | Update project by ID (CRUD: Update) |
| 9 | `/api/projects/:id` | `DELETE` | Private | Delete project by ID (CRUD: Delete) |
| 10 | `/api/projects/stats/summary` | `GET` | Public | Get project metrics & dashboard counts |

---

## 1. Health Check

### `GET /api/health`
- **Description**: Verify API server status and MongoDB connection.
- **Headers**: None

#### Sample Response (`200 OK`):
```json
{
  "status": "success",
  "message": "Server is healthy",
  "database": "Connected"
}
```

---

## 2. Authentication Endpoints

### `POST /api/auth/register`
- **Description**: Register a new user account.
- **Headers**: `Content-Type: application/json`

#### Sample Request Body:
```json
{
  "name": "Jane Developer",
  "email": "jane@example.com",
  "password": "Password123!",
  "role": "Manager"
}
```

#### Sample Response (`201 Created`):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "6ac200769cef00c57ffa7f25",
    "name": "Jane Developer",
    "email": "jane@example.com",
    "role": "Manager",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### `POST /api/auth/login`
- **Description**: Authenticate an existing user and get a JWT token.
- **Headers**: `Content-Type: application/json`

#### Sample Request Body:
```json
{
  "email": "jane@example.com",
  "password": "Password123!"
}
```

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "6ac200769cef00c57ffa7f25",
    "name": "Jane Developer",
    "email": "jane@example.com",
    "role": "Manager",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### `GET /api/auth/profile`
- **Description**: Retrieve the current user's profile.
- **Headers**: `Authorization: Bearer <your_jwt_token>`

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "_id": "6ac200769cef00c57ffa7f25",
    "name": "Jane Developer",
    "email": "jane@example.com",
    "role": "Manager",
    "createdAt": "2026-10-04T07:29:55.102Z",
    "updatedAt": "2026-10-04T07:29:55.102Z"
  }
}
```

---

## 3. Projects CRUD Endpoints

### `POST /api/projects` (Create)
- **Description**: Create a new project.
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_jwt_token>`

#### Sample Request Body:
```json
{
  "title": "Cloud Infrastructure Migration",
  "description": "Migrate on-premise microservices architecture to AWS and Kubernetes clusters with CI/CD automation.",
  "category": "DevOps",
  "status": "In Progress",
  "priority": "High",
  "budget": 45000,
  "deadline": "2026-11-30T00:00:00.000Z",
  "assignedTo": "DevOps Team Alpha"
}
```

#### Sample Response (`201 Created`):
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "_id": "6ac200769cef00c57ffa7f2b",
    "title": "Cloud Infrastructure Migration",
    "description": "Migrate on-premise microservices architecture to AWS and Kubernetes clusters with CI/CD automation.",
    "category": "DevOps",
    "status": "In Progress",
    "priority": "High",
    "budget": 45000,
    "deadline": "2026-11-30T00:00:00.000Z",
    "assignedTo": "DevOps Team Alpha",
    "createdBy": "6ac200769cef00c57ffa7f25",
    "createdAt": "2026-10-04T07:29:55.334Z",
    "updatedAt": "2026-10-04T07:29:55.334Z"
  }
}
```

---

### `GET /api/projects` (Read All & Filter)
- **Description**: Fetch all projects with optional query params for search, status, priority, and sorting.
- **Query Parameters**:
  - `search`: Filter by text in title or description (e.g. `?search=Cloud`)
  - `status`: Filter by status (`Planning`, `In Progress`, `Completed`, `On Hold`)
  - `priority`: Filter by priority (`Low`, `Medium`, `High`, `Urgent`)
  - `category`: Filter by category (`Web Development`, `Mobile App`, `DevOps`, etc.)
  - `sort`: `oldest`, `budget-asc`, `budget-desc`, `deadline-asc`

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "6ac200769cef00c57ffa7f2b",
      "title": "Cloud Infrastructure Migration",
      "description": "Migrate on-premise microservices architecture to AWS and Kubernetes clusters with CI/CD automation.",
      "category": "DevOps",
      "status": "In Progress",
      "priority": "High",
      "budget": 45000,
      "deadline": "2026-11-30T00:00:00.000Z",
      "assignedTo": "DevOps Team Alpha",
      "createdBy": {
        "_id": "6ac200769cef00c57ffa7f25",
        "name": "Jane Developer",
        "email": "jane@example.com",
        "role": "Manager"
      },
      "createdAt": "2026-10-04T07:29:55.334Z",
      "updatedAt": "2026-10-04T07:29:55.334Z"
    }
  ]
}
```

---

### `GET /api/projects/:id` (Read Single)
- **Description**: Fetch detailed information of a single project by its ID.

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "_id": "6ac200769cef00c57ffa7f2b",
    "title": "Cloud Infrastructure Migration",
    "description": "Migrate on-premise microservices architecture to AWS and Kubernetes clusters with CI/CD automation.",
    "category": "DevOps",
    "status": "In Progress",
    "priority": "High",
    "budget": 45000,
    "deadline": "2026-11-30T00:00:00.000Z",
    "assignedTo": "DevOps Team Alpha",
    "createdBy": {
      "_id": "6ac200769cef00c57ffa7f25",
      "name": "Jane Developer",
      "email": "jane@example.com"
    },
    "createdAt": "2026-10-04T07:29:55.334Z",
    "updatedAt": "2026-10-04T07:29:55.334Z"
  }
}
```

#### Error Response when not found (`404 Not Found`):
```json
{
  "success": false,
  "message": "Project not found with id of 6ac200769cef00c57ffa7f2b"
}
```

---

### `PUT /api/projects/:id` (Update)
- **Description**: Update fields of an existing project.
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_jwt_token>`

#### Sample Request Body:
```json
{
  "status": "Completed",
  "priority": "Urgent",
  "budget": 52000
}
```

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "_id": "6ac200769cef00c57ffa7f2b",
    "title": "Cloud Infrastructure Migration",
    "status": "Completed",
    "priority": "Urgent",
    "budget": 52000,
    "updatedAt": "2026-10-04T07:29:55.720Z"
  }
}
```

---

### `DELETE /api/projects/:id` (Delete)
- **Description**: Remove a project by its ID.
- **Headers**: `Authorization: Bearer <your_jwt_token>`

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "message": "Project deleted successfully",
  "data": {}
}
```

---

### `GET /api/projects/stats/summary` (Analytics / Metrics)
- **Description**: Get aggregated counts of projects by status, priority, and total budget.

#### Sample Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "totalProjects": 4,
    "totalBudget": 140000,
    "byStatus": {
      "Planning": 1,
      "In Progress": 2,
      "Completed": 1,
      "On Hold": 0
    },
    "byPriority": {
      "Low": 0,
      "Medium": 2,
      "High": 1,
      "Urgent": 1
    }
  }
}
```

---

## 4. How to Test with Postman

1. Open **Postman**.
2. Click **Import** (top left).
3. Select the file: `backend/postman_collection.json`.
4. Run the **Register User** or **Login User** request first — it automatically saves your JWT `token` into collection variables.
5. Execute any of the **Projects CRUD** requests (`Create Project`, `Get All Projects`, `Update Project`, `Delete Project`). All authorization headers are pre-wired.
