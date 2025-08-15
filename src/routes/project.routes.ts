import { Router } from "express";
import {
  createProject,
  deleteProject,
  exportProjectData,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../controllers/project.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createTask, getAllTasks } from "../controllers/task.controllers.js";
import {
  createCollaborator,
  getCollaborators,
} from "../controllers/collaborator.controller.js";

const router = Router();

router.route("/").get(getAllProjects).post(verifyJWT, createProject);

router
  .route("/:id")
  .get(getProjectById)
  .put(verifyJWT, updateProject)
  .delete(verifyJWT, deleteProject);

router.route("/:projectId/tasks").get(getAllTasks).post(verifyJWT, createTask);
router
  .route("/:projectId/collaborators")
  .post(verifyJWT, createCollaborator)
  .get(verifyJWT, getCollaborators);

router.route("/:projectId/exportdata").get(verifyJWT, exportProjectData);

export default router;
