import { Request, Response, NextFunction } from "express";

// Types
import { LabelCreationAttributes } from "@customTypes/Label";
import { UserDocument } from "@customTypes/User";

// Services
import labelsService from "@services/LabelsService";

class LabelsController {
  async create(req: Request, res: Response, next: NextFunction) {
    const authUser = res.locals.authUser as UserDocument;
    const labelData = req.body as LabelCreationAttributes;
    const label = await labelsService.create({ ...labelData, user: authUser._id });
    res.status(201).json(label);
  }
}

const labelsController = new LabelsController();

export default labelsController;
