import { Request, Response, NextFunction } from "express";

import ResponseError from "@helpers/ResponseError";

// Request paths excluded from CSRF protection
const EXCLUDED_PATHS = ["/api/login", "/api/register"];

// HTTP methods subject to CSRF protection
const PROTECTED_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  if (EXCLUDED_PATHS.includes(req.path)) return next();
  if (!PROTECTED_METHODS.includes(req.method)) return next();
  if (!req.cookies.csrf_token) {
    return next(new ResponseError(401, "You are not attached a CRSF token"));
  }
  const token = req.headers["x-csrf-token"];
  if (!token) {
    return next(new ResponseError(401, "You did not provide a CSRF token"));
  }
  if (token !== req.cookies.csrf_token) {
    return next(new ResponseError(401, "The CSRF token does not match"));
  }
  next();
}
