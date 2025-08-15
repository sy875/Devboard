import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import requestIp from "request-ip";
import morgan from "morgan";

const app = express();

dotenv.config({
  path: "./.env",
});

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return requestIp.getClientIp(req) || "unknown";
  },
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 500,
      `There are too many requests. You are only allowed ${
        options.max
      } requests per ${options.windowMs / 60000} minutes`,
    );
  },
});

app.use(limiter);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";

import { verifyApiKey } from "./middleware/auth.middleware.js";
import { ApiError } from "./utils/api-error.js";

app.use("/api/v1/auth", authRoutes);
app.use(verifyApiKey);

app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);

app.use(errorHandler);

export default app;
