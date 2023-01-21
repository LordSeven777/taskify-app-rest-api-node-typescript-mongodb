import { checkSchema } from "express-validator";

// Schema
import userSchema from "../../schemas/user";

// Express validator wrapper
import expressValidatorWrapper from "../../helpers/expressValidator";

export const validateRegistrationUser = expressValidatorWrapper(
  checkSchema(userSchema),
  "There are wrong values in the user data",
);
