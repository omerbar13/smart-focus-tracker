# Smart Focus Tracker

A full-stack backend API for tracking tasks and focus sessions.  
Built with Node.js, Express, and MongoDB (Mongoose).

This project demonstrates a clean REST API architecture using separation of concerns (controllers, services, models).

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- dotenv

---

## 📦 Features

- Create tasks
- Read all tasks
- Update tasks
- Delete tasks
- Persistent storage with MongoDB
- Clean layered backend architecture

---

## 🧱 Project Structure

```bash
backend/
├── src/
│   ├── controllers/      # Handles HTTP requests
│   ├── services/         # Business logic + database operations
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   └── app.js            # Entry point
├── .env                  # Environment variables (NOT committed)
├── package.json
├── package-lock.json
```

---

## ⚙️ Setup Instructions

### 1. Clone repository

```bash
git clone https://github.com/your-username/smart-focus-tracker.git
cd smart-focus-tracker/backend
```

### 2. Install dependencies

```bash
npm install
```

---

### 3. Create environment variables

Create a `.env` file inside the backend folder:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskdb
```

---

### 4. Start the server

```bash
node src/app.js
```

Server runs at:

`http://localhost:5000`

---

## 📡 API Endpoints

### Get all tasks

```http
GET /tasks
```

#### Example response

```json
[
  {
    "_id": "661f123abc...",
    "title": "Study backend architecture",
    "createdAt": "2026-04-30T10:00:00.000Z",
    "updatedAt": "2026-04-30T10:00:00.000Z"
  }
]
```

---

### Create a task

```http
POST /tasks
Content-Type: application/json

{
  "title": "Study backend architecture"
}
```

#### Error response

```json
{
  "error": "Title is required"
}
```

---

### Update a task

```http
PUT /tasks/:id
Content-Type: application/json

{
  "title": "Updated task title"
}
```

---

### Delete a task

```http
DELETE /tasks/:id
```

---

## 🧪 Example Flow

1. Create a task  
2. Fetch all tasks  
3. Update a task  
4. Delete a task  

---

## 🧠 Architecture Overview

- Routes → define API endpoints  
- Controllers → handle HTTP requests  
- Services → business logic + DB operations  
- Models → MongoDB schema  

This separation improves:
- scalability
- maintainability
- testability

---

## 📌 Future Improvements

- JWT authentication
- User accounts
- Task categories/tags
- Frontend dashboard (React)
- Deployment (Render / Railway / Vercel)