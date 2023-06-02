import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// Response error helper
import ResponseError from "./ResponseError";

// Express middleware type
type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void;

// Express validator error handler
const expressValidatorErrorHandler = (errorMessage: string = "Validation failed") => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Extraction of the validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Throwing an unprocessable content error
      return next(new ResponseError(422, errorMessage, errors.array()));
    }

    next();
  };
};

// Express validator wrapper
const expressValidatorWrapper = (
  validationMiddlewares: ExpressMiddleware[],
  errorMessage?: string,
): ExpressMiddleware[] => [...validationMiddlewares, expressValidatorErrorHandler(errorMessage)];

export default expressValidatorWrapper;
