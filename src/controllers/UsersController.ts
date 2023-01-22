import { Request, Response, NextFunction, CookieOptions } from "express";

// Types
import { UserTokenPayload } from "@customTypes/User";

// Response error
import ResponseError from "@helpers/ResponseError";

// Services
import labelsService from "@services/LabelsService";

class UsersController {
  async getUserLabels(req: Request, res: Response, next: NextFunction) {
    const authUser = res.locals.authUser as UserTokenPayload;
    const { userId } = req.params;
    if (authUser._id !== userId) {
      return next(new ResponseError(403, "Your are not the allowed to access this route"));
    }
    const labels = await labelsService.getUserLabels({
      search: req.query.q as string | undefined,
      userId,
    });
    res.json(labels);
  }
}

const usersController = new UsersController();

export default usersController;
