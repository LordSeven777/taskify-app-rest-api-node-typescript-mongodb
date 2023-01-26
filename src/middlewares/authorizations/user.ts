import { Request, Response, NextFunction } from "express";

// Types
import { UserTokenPayload, UserDocument } from "@customTypes/User";

import ResponseError from "@helpers/ResponseError";

// Middlewares
import { authenticate } from "@middlewares/authenticate";
import { bindParams } from "@middlewares/bindParams";

// Ensures that auth user and the user specified in the request param are the same
export const matchesUserParam = [
  authenticate(),
  (req: Request, res: Response, next: NextFunction) => {
    const authUser = res.locals.authUser as UserTokenPayload;
    const { userId } = req.params;
    if (userId !== authUser._id) {
      return next(new ResponseError(403, "You are not the user specified in the request parameter"));
    }
    next();
  },
];
