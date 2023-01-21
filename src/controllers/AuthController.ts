import { Request, Response, NextFunction, CookieOptions } from "express";

// Types
import type { UserCreationAttributes } from "../types/User";

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
}

const authController = new AuthController();

export default authController;
