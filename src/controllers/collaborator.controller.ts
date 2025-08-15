import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { Collaborator } from "../models/collaborator.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { Project } from "../models/project.models.js";
import ApiResponse from "../utils/api-response.js";
import mongoose from "mongoose";

export const createCollaborator = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const { collaboratorId } = req.body;
    const collaborator = await User.findOne({ _id: collaboratorId });
    if (!collaborator) {
      throw new ApiError(404, "collaborators not found");
    }
    const project = await Project.findOne({ _id: projectId });
    if (!project) {
      throw new ApiError(404, "project not found");
    }
    const existingCollaborator = await Collaborator.findOne({
      collaborator: collaborator._id,
      project: project._id,
    });
    if (existingCollaborator) {
      throw new ApiError(400, "collaborator already exists in this project");
    }
    const newCollaborator = await Collaborator.create({
      collaborator: collaborator._id,
      project: project._id,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { collaborator: newCollaborator },
          "Collaborators created successfully",
        ),
      );
  },
);
export const getCollaborators = asyncHandler(
  async (req: Request, res: Response) => {
    const { projectId } = req.params;

    const collaborators = await Collaborator.aggregate([
      {
        $match: {
          project: new mongoose.Types.ObjectId(projectId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "collaborator",
          foreignField: "_id",
          as: "collaboratorInfo",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                email: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "projectInfo",
        },
      },
      {
        $addFields: {
          projectInfo: { $first: "$projectInfo" },
          collaboratorInfo: { $first: "$collaboratorInfo" },
        },
      },
      
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          collaborators,
          "Collaborators fetched successfully",
        ),
      );
  },
);
