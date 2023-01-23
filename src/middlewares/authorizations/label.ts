import { Request, Response, NextFunction } from "express";

// Types
import { UserDocument } from "@customTypes/User";
import { LabelDocument } from "@customTypes/Label";

import ResponseError from "@helpers/ResponseError";

// Other middlewares
import { authenticate } from "@middlewares/authenticate";
import { bindParams } from "@middlewares/bindParams";

export const belongsToAuthUser = [
  authenticate({ fetch: true }),
  bindParams(),
  (req: Request, res: Response, next: NextFunction) => {
    const authUser = res.locals.authUser as UserDocument;
    const label = res.locals.label as LabelDocument;
    if (!label.user.equals(authUser._id)) {
      return next(new ResponseError(403, "You are not allowed to touch this label"));
    }
    next();
  },
];
