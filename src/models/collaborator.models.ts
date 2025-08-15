import mongoose from "mongoose";

const collaboratorSchema = new mongoose.Schema({
  collaborator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Collaborator = mongoose.model("Collaborator", collaboratorSchema);
