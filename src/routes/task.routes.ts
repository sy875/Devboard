import { Router } from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../controllers/project.controllers";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../controllers/task.controllers.js";

const router = Router();

router.route("/:id").all(verifyJWT).put(updateTask).delete(deleteTask);

export default router;
