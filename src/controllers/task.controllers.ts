import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { Project } from "../models/project.models.js";
import ApiResponse from "../utils/api-response.js";
import { Task } from "../models/task.models.js";
import { getMongoosePaginationOptions } from "../utils/helper.js";
import mongoose from "mongoose";

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { title, description, assignedTo, status, attachments } = req.body;

  const isProjectExist = await Project.findById(projectId);

  if (!isProjectExist) {
    throw new ApiError(404, "Project not found");
  }

  const isAssigneeExist = await User.findById(assignedTo);

  if (!isAssigneeExist) {
    throw new ApiError(404, "Assignee not found");
  }

  const newTask = await Task.create({
    title,
    description,
    project: isProjectExist._id,
    assignedTo,
    assignedBy: req.user._id,
    status,
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { task: newTask }, "Task created successfully"));
});

export const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const taskAggregate = Task.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
        isDeleted: false,
      },
    },
    { $project: { isDeleted: 0, deletedAt: 0 } },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
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
        from: "users",
        localField: "assignedBy",
        foreignField: "_id",
        as: "assignedBy",
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
        as: "project",
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: { $first: "$assignedTo" },
        assignedBy: { $first: "$assignedBy" },
        project: { $first: "$project" },
      },
    },
  ]);

  const tasks = await Task.aggregatePaginate(
    taskAggregate,
    getMongoosePaginationOptions({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      customLabels: {
        totalDocs: "totalTasks",
        docs: "tasks",
      },
    }),
  );

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "All task fetched successfully"));
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, assignedTo, status, attachments } = req.body;

  const task = await Task.findOneAndUpdate(
    {
      _id: id,
      assignedBy: req.user._id,
      isDeleted: false,
    },
    {
      $set: {
        title,
        description,
        assignedTo,
        status,
        attachments,
      },
    },
    { new: true },
  );

  if (!task) {
    throw new ApiError(404, "Task does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedProject: task },
        "Task updated successfully",
      ),
    );
});
export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const task = await Task.findOneAndUpdate(
    {
      _id: id,
      assignedBy: req.user._id,
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    },
  );

  if (!task) {
    throw new ApiError(404, "Task does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { deletedTask: task }, "Task deleted successfully"),
    );
});
