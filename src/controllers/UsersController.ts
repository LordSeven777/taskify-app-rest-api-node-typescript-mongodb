import { Request, Response, NextFunction } from "express";

// Services
import labelsService from "@services/LabelsService";
import tasksService from "@services/TasksService";

class UsersController {
  async getUserLabels(req: Request, res: Response, next: NextFunction) {
    try {
      const labels = await labelsService.getUserLabels({
        search: req.query.q as string | undefined,
        userId: req.params.userId,
      });
      res.json(labels);
    } catch (error) {
      next(error);
    }
  }

  async getUserTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await tasksService.getUserTasks({
        date: req.query.date as string,
        sort: req.query.sort as string,
        userId: req.params.userId,
      });
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }
}

const usersController = new UsersController();

export default usersController;
