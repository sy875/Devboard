import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { Project } from "../models/project.models.js";
import ApiResponse from "../utils/api-response.js";
import { Collaborator } from "../models/collaborator.models.js";

export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      description,
      startDate,
      dueDate,
      status,
      priority,
      collaborators,
    } = req.body;

    const collaboratorsCount = await User.countDocuments({
      _id: { $in: collaborators },
    });

    if (collaborators.length != collaboratorsCount) {
      throw new ApiError(400, "One or more collaborators does not exist");
    }

    const newProject = await Project.create({
      name,
      description,
      startDate,
      dueDate,
      status,
      priority,
      collaborators,
      createdBy: req.user._id,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { project: newProject },
          "Project created successfully",
        ),
      );
  },
);

export const getAllProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const allProjects = await Project.find({}).select("-createdBy").populate({
      path: "collaborators",
      select: "username",
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          201,
          { allProjects },
          "All projects fetched successfully",
        ),
      );
  },
);

export const getProjectById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: projectId } = req.params;

    const project = await Project.findById(projectId)
      .select("-createdBy")
      .populate({
        path: "collaborators",
        select: "username",
      });

    if (!project) {
      throw new ApiError(404, "Project does not exist");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { project }, "Project Fetched successfully"));
  },
);

export const updateProject = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: projectId } = req.params;
    const {
      name,
      description,
      startDate,
      dueDate,
      status,
      priority,
      collaborators,
    } = req.body;

    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        createdBy: req.user._id,
      },
      {
        $set: {
          name,
          description,
          startDate,
          dueDate,
          status,
          priority,
          collaborators,
        },
      },
      { new: true },
    )
      .select("-createdBy")
      .populate({
        path: "collaborators",
        select: "username",
      });

    if (!project) {
      throw new ApiError(404, "Project does not exist");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updatedProject: project },
          "Project updated successfully",
        ),
      );
  },
);
export const deleteProject = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: projectId } = req.params;

    const project = await Project.findOneAndDelete({
      _id: projectId,
      createdBy: req.user._id,
    })
      .select("-createdBy")
      .populate({
        path: "collaborators",
        select: "username",
      });

    if (!project) {
      throw new ApiError(404, "Project does not exist");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { deletedProject: project },
          "Project deleted successfully",
        ),
      );
  },
);
export const exportProjectData = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      createdBy: req.user._id,
    }).lean();

    
    if (!project) {
      throw new ApiError(404, "Project does not exist");
    }

    // Fetch collaborators
    const collaborators = await Collaborator.find({ project: projectId })
      .populate("collaborator", "username email")
      .lean();

    // Combine project + collaborators
    const data = { ...project, collaborators };

    // Send JSON as a file download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=project-${projectId}.json`,
    );
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(data, null, 2));
  },
);
