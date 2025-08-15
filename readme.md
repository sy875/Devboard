# DevBoard – Task Management API

A **production-ready REST API** built with **Express.js** and **TypeScript**, designed for managing projects and tasks like a simplified Trello. Users can organize projects, create tasks, manage collaborators, and export project data.

---

## 🎯 End Goal

- Fully working **Express.js API**  
- **JWT authentication** and **API key** access  
- CRUD operations for **Projects** & **Tasks**  
- Proper **project-task-user relationships**  
- Postman collection for testing all routes  
- Production-ready, modular structure with environment configs  

---

## 📦 Project Setup

### **Clone & Install**

```bash
git clone <repo-url>
cd devboard
npm install
npm run dev


| Table           | Purpose                                   |
| --------------- | ----------------------------------------- |
| `users`         | Store user credentials & details          |
| `api_keys`      | Store API keys for authenticated access   |
| `projects`      | Store project details                     |
| `tasks`         | Store tasks under projects                |
| `collaborators` | Optional: share projects with other users |


| Method | Route           | Description                            |
| ------ | --------------- | -------------------------------------- |
| POST   | `/projects`     | Create a project                       |
| GET    | `/projects`     | List all user projects                 |
| GET    | `/projects/:id` | Get project by ID                      |
| PUT    | `/projects/:id` | Update project                         |
| DELETE | `/projects/:id` | Delete project (soft delete supported) |


