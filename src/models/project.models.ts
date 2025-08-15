import mongoose, { Schema } from "mongoose";
import {
  AvailablePriority,
  AvailableStatuses,
  PriorityEnum,
  StatusEnum,
} from "../utils/constants.js";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase:true,
      trim: true,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: AvailableStatuses,
      default: StatusEnum.TODO,
    },
    priority: {
      type: String,
      enum: AvailablePriority,
      default: PriorityEnum.LOW,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Project = mongoose.model("Project", projectSchema);
