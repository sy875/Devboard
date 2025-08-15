/**
 * @type {{ GOOGLE: "GOOGLE"; GITHUB: "GITHUB"; EMAIL_PASSWORD: "EMAIL_PASSWORD"} as const}
 */
export const UserLoginType = {
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
};

export const AvailableSocialLogins = Object.values(UserLoginType);

export const EXCLUDE_API_KEY_VERIFICATION = "/api/v1/auth";

/**
 * @type {{ADMIN: "admin", PROJECT_ADMIN: "project_admin", MEMBER: "member"} as const}
 */
export const UserRolesEnum = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

/**
 * @type {{TODO: "todo", IN_PROGRESS: "in_progress", DONE: "done"} as const}
 */
export const StatusEnum = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

export const AvailableStatuses = Object.values(StatusEnum);

export const PriorityEnum = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export const AvailablePriority = Object.values(PriorityEnum);
