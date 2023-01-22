import { Request, Response, NextFunction, CookieOptions } from "express";

// Types
import type { UserCreationAttributes, LoginCredentials, UserTokenPayload } from "@customTypes/User";

// Response error
import ResponseError from "@helpers/ResponseError";

// Services
import authService from "@services/AuthService";
import usersService from "@services/UsersService";

const tokenCookieOptions: CookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: "none",
};

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
    res
      .cookie("access_token", authResult.accessToken, tokenCookieOptions)
      .cookie("refresh_token", authResult.refreshToken, tokenCookieOptions)
      .status(201)
      .json(authResult);
  }

  getAuthUser(req: Request, res: Response, next: NextFunction) {
    res.json(res.locals.authUser);
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    const authUser = res.locals.authUser as UserTokenPayload;
    const accessToken = authService.generateToken("access", authUser);
    res.cookie("access_token", accessToken, tokenCookieOptions).json({ accessToken });
  }

  logout(req: Request, res: Response, next: NextFunction) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.sendStatus(204);
  }

  async unregister(req: Request, res: Response, next: NextFunction) {
    const authUser = res.locals.authUser as UserTokenPayload;
    await usersService.delete(authUser._id);
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.sendStatus(204);
  }
}

const authController = new AuthController();

export default authController;
