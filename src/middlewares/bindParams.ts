import { Request, Response, NextFunction } from "express";
import { Model, FilterQuery, Types } from "mongoose";

// Utils
import { lowerFirstLetter, firstLetterIsUpperCase } from "@utils/strings";

// Models
import User from "@models/User";
import Task from "@models/Task";
import Label from "@models/Label";

import ResponseError from "@helpers/ResponseError";

// Map for the models
const modelsMap = new Map<string, Model<any>>();
modelsMap.set("User", User);
modelsMap.set("Task", Task);
modelsMap.set("Label", Label);

const DEFAULT_FIELD = "id";
const NOT_FOUND_ERR_MESSAGE = "Could not find the resource specified in the request parameters";

// Binds the request params to the corresponding models
// so that the fetch of the corresponding document is handled within this middleware
export function bindParams(bindings?: Record<string, string[]>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const model in req.params) {
      if (!firstLetterIsUpperCase(model)) continue;
      const value = req.params[model];
      const Model = modelsMap.get(model);
      if (!Model)
        return next(new ResponseError(500, `The ${model} model in the request parameters is not defined`));
      const fields: string[] = bindings && bindings[model] ? bindings[model] : [DEFAULT_FIELD];
      let query: FilterQuery<any>;
      if (fields.length === 0) {
        const field = fields[0];
        if (field === "_id" && !Types.ObjectId.isValid(value)) {
          return next(new ResponseError(404, NOT_FOUND_ERR_MESSAGE));
        }
        query = { [field]: value };
      } else {
        let _fields = !Types.ObjectId.isValid(value) ? fields.filter((field) => field !== "_id") : fields;
        if (_fields.length === 0) {
          return next(new ResponseError(404, NOT_FOUND_ERR_MESSAGE));
        }
        query = {
          $or: _fields.map((field) => ({ [field]: value })),
        };
      }
      try {
        const document = await Model.findOne(query);
        if (!document) return next(new ResponseError(404, NOT_FOUND_ERR_MESSAGE));
        res.locals[lowerFirstLetter(model)] = document;
      } catch (error) {
        return next(error);
      }
    }
    next();
  };
}
