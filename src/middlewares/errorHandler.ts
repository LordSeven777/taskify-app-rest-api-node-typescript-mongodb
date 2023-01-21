import { ErrorRequestHandler } from "express";

// Response error helper
import ResponseError from "../helpers/ResponseError";

// Type of error response data
interface ErrorResponseData {
  message: string;
  payload?: any
}

// Request error handler
const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ResponseError) {
    if (err.status >= 500) console.log(err.message);
    const error: ErrorResponseData = { message: err.message };
    if (err.payload) error.payload = err.payload;
    return res.status(err.status).send(error);
  }
  console.log(err.message || err);
  next(err);
}

export default errorHandlerMiddleware;