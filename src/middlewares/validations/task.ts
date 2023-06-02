import { checkSchema, Schema } from "express-validator";

// Schema
import taskSchema from "@schemas/task";

// Express validator wrapper
import expressValidatorWrapper from "@helpers/expressValidator";

export const validateTask = expressValidatorWrapper(checkSchema(taskSchema), "Wrong values in the task data");

const updateTaskSchema: Schema = {
  ...taskSchema,
  checkList: {
    ...taskSchema.checkList,
    optional: undefined,
  },
  isCompleted: {
    ...taskSchema.isCompleted,
    optional: undefined,
  },
  labels: {
    ...taskSchema.labels,
    optional: undefined,
  },
};

export const validateUpdateTask = expressValidatorWrapper(
  checkSchema(updateTaskSchema),
  "Wrong values in the task data",
);

const updateIsCompletedSchema: Schema = {
  isCompleted: {
    ...taskSchema.isCompleted,
    optional: undefined,
    notEmpty: {
      errorMessage: "The isCompleted field must not be empty",
    },
  },
};

export const validateUpdateTaskIsCompleted = expressValidatorWrapper(
  checkSchema(updateIsCompletedSchema),
  "Wrong values in the task completion status data",
);
