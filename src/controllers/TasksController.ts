import { Request, Response, NextFunction } from "express";

// Types
import { UserDocument } from "@customTypes/User";
import { TaskDocument } from "@customTypes/Task";

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

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const task = res.locals.task as TaskDocument;
      const updatedTask = await tasksService.update(task, req.body);
      res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  }

  async updateIsCompleted(req: Request, res: Response, next: NextFunction) {
    try {
      const task = res.locals.task as TaskDocument;
      task.isCompleted = req.body.isCompleted as boolean;
      await task.save();
      res.json({ isCompleted: req.body.isCompleted });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const task = res.locals.task as TaskDocument;
      await tasksService.delete(task._id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}

const tasksController = new TasksController();

export default tasksController;
