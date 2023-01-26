import { Request, Response, NextFunction } from "express";

// Types
import { UserDocument } from "@customTypes/User";

// Services
import tasksService from "@services/TasksService";

class TasksController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const authUser = res.locals.authUser as UserDocument;
      const task = await tasksService.create({
        ...req.body,
        user: authUser._id,
      });
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }
}

const tasksController = new TasksController();

export default tasksController;
