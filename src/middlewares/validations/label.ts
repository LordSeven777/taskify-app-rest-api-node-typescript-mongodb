import { Request, Response, NextFunction } from "express";
import { checkSchema } from "express-validator";

// Types
import { LabelCreationAttributes, LabelDocument } from "@customTypes/Label";
import { UserDocument } from "@customTypes/User";

import ResponseError from "@helpers/ResponseError";

// Schema
import labelSchema from "@schemas/label";

// Express validator wrapper
import expressValidatorWrapper from "@helpers/expressValidator";

// Services
import labelsService from "@services/LabelsService";

export const validateLabel = [
  ...expressValidatorWrapper(checkSchema(labelSchema), "There are wrong values in the label data"),
  // Verify if the label name is unique for the authenticated user
  async (req: Request, res: Response, next: NextFunction) => {
    const authUser = res.locals.authUser as UserDocument;
    const labelData = req.body as LabelCreationAttributes;
    if (await labelsService.existsForUser(labelData.name, authUser._id)) {
      return next(
        new ResponseError(422, "There are wrong values in the label data", [
          { param: "name", msg: "The label name already exists" },
        ]),
      );
    }
    next();
  },
];

export const validateUpdateLabel = [
  ...expressValidatorWrapper(checkSchema(labelSchema), "There are wrong values in the label data"),
  // Verify if the label name is unique for the authenticated user
  async (req: Request, res: Response, next: NextFunction) => {
    const authUser = res.locals.authUser as UserDocument;
    const labelData = req.body as LabelCreationAttributes;
    const label = res.locals.label as LabelDocument;
    if (label.name !== labelData.name && (await labelsService.existsForUser(labelData.name, authUser._id))) {
      return next(
        new ResponseError(422, "There are wrong values in the label data", [
          { param: "name", msg: "The label name already exists" },
        ]),
      );
    }
    next();
  },
];
