import { checkSchema } from "express-validator";

// Schema
import taskSchema from "@schemas/task";

// Express validator wrapper
import expressValidatorWrapper from "@helpers/expressValidator";

export const validateTask = expressValidatorWrapper(checkSchema(taskSchema), "Wrong values in the task data");
