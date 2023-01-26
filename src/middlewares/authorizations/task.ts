import { Request, Response, NextFunction } from "express";

// Types
import { UserTokenPayload } from "@customTypes/User";
import { TaskDocument } from "@customTypes/Task";

import ResponseError from "@helpers/ResponseError";

// Other middlewares
import { authenticate } from "@middlewares/authenticate";
import { bindParams } from "@middlewares/bindParams";

export const ownsTask = [
  authenticate(),
  bindParams(),
  async (req: Request, res: Response, next: NextFunction) => {
    const authUser = res.locals.authUser as UserTokenPayload;
    const task = res.locals.task as TaskDocument;
    if (!task.user.equals(authUser._id)) {
      return next(new ResponseError(403, "You are not allowed to touch this task"));
    }
    next();
  },
];
