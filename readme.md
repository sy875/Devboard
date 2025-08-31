# DevBoard – Task Management API

A **production-ready REST API** built with **Express.js** and **TypeScript**, designed for managing projects and tasks like a simplified Trello. Users can organize projects, create tasks, manage collaborators, and export project data.

---

#Postman Collection : https://www.postman.com/lively-firefly-527899/workspace/devboard/request/22923065-3e9a48e1-71b8-4211-b5af-213a1f998fa0?action=share&source=copy-link&creator=22923065

## 🎯 Features

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
git clone https://github.com/sy875/Devboard.git
cd devboard
npm install
npm run prepare
npm run dev


| Table           | Purpose                                   |
| --------------- | ----------------------------------------- |
| `users`         | Store user credentials & details          |
| `api_keys`      | Store API keys for authenticated access   |
| `projects`      | Store project details                     |
| `tasks`         | Store tasks under projects                |
| `collaborators` | collaborate on projects with other users |



