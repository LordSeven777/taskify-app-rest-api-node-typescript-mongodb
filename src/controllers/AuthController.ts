import { Request, Response, NextFunction, CookieOptions } from "express";
import { v4 as uuidv4 } from "uuid";

// Types
import type {
  UserCreationAttributes,
  LoginCredentials,
  UserTokenPayload,
  UserDocument,
} from "@customTypes/User";

// Response error
import ResponseError from "@helpers/ResponseError";

// Services
import authService from "@services/AuthService";
import usersService from "@services/UsersService";

const tokenCookieOptions: CookieOptions = {
  sameSite: "none",
  secure: true,
  httpOnly: true
};

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as UserCreationAttributes;
      const authResult = await authService.register(payload);
      res
        .cookie("access_token", authResult.accessToken, tokenCookieOptions)
        .cookie("refresh_token", authResult.refreshToken, tokenCookieOptions)
        .cookie("csrf_token", authResult.csrfToken, tokenCookieOptions)
        .status(201)
        .json(authResult);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as LoginCredentials;
      if (!payload.email || !payload.password)
        return next(new ResponseError(422, "The email address and password must not be empty"));
      const authResult = await authService.login(payload);
      if (!authResult) return next(new ResponseError(422, "The email address or password is wrong"));
      res
        .cookie("access_token", authResult.accessToken, tokenCookieOptions)
        .cookie("refresh_token", authResult.refreshToken, tokenCookieOptions)
        .cookie("csrf_token", authResult.csrfToken, tokenCookieOptions)
        .status(201)
        .json(authResult);
    } catch (error) {
      next(error);
    }
  }

  getAuthUser(req: Request, res: Response, next: NextFunction) {
    const authUser = res.locals.authUser as UserDocument;
    const csrfToken = req.cookies.csrf_token || uuidv4();
    res.cookie("csrf_token", csrfToken, tokenCookieOptions).json({
      user: res.locals.authUser,
      csrfToken,
      accessToken: authService.generateToken("access", { _id: authUser._id.toString() }),
    });
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    const authUser = res.locals.authUser as UserTokenPayload;
    const accessToken = authService.generateToken("access", authUser);
    res.cookie("access_token", accessToken, tokenCookieOptions).json({ accessToken });
  }

  logout(req: Request, res: Response, next: NextFunction) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.clearCookie("csrf_token");
    res.sendStatus(204);
  }

  async unregister(req: Request, res: Response, next: NextFunction) {
    try {
      const authUser = res.locals.authUser as UserTokenPayload;
      await usersService.delete(authUser._id);
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      res.clearCookie("csrf_token");
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}

const authController = new AuthController();

export default authController;
