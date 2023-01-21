import { Request, Response, NextFunction, CookieOptions } from "express";

// Types
import type { UserCreationAttributes, LoginCredentials } from "../types/User";

// Response error
import ResponseError from "../helpers/ResponseError";

// Services
import authService from "../services/AuthService";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    const payload = req.body as UserCreationAttributes;
    const authResult = await authService.register(payload);
    const tokenCookieOptions: CookieOptions = {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    };
    res
      .cookie("access_token", authResult.accessToken, tokenCookieOptions)
      .cookie("refresh_token", authResult.refreshToken, tokenCookieOptions)
      .status(201)
      .json(authResult);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const payload = req.body as LoginCredentials;
    if (!payload.email || !payload.password)
      return next(new ResponseError(422, "The email address and password must not be empty"));
    const authResult = await authService.login(payload);
    if (!authResult) return next(new ResponseError(422, "The email address or password is wrong"));
    const tokenCookieOptions: CookieOptions = {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    };
    res
      .cookie("access_token", authResult.accessToken, tokenCookieOptions)
      .cookie("refresh_token", authResult.refreshToken, tokenCookieOptions)
      .status(201)
      .json(authResult);
  }
}

const authController = new AuthController();

export default authController;
