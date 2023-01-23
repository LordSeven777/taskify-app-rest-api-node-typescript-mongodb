import { Request, Response, NextFunction } from "express";

// Types
import { LabelCreationAttributes, LabelDocument } from "@customTypes/Label";
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

  async update(req: Request, res: Response, next: NextFunction) {
    const labelData = req.body as LabelCreationAttributes;
    const label = res.locals.label as LabelDocument;
    const updatedLabel = await labelsService.update(label, labelData);
    return res.json(updatedLabel);
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const label = res.locals.label as LabelDocument;
    await labelsService.delete(label._id);
    res.sendStatus(204);
  }
}

const labelsController = new LabelsController();

export default labelsController;
