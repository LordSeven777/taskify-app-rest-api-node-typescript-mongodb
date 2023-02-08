import { Request, Response, NextFunction } from "express";

// Types
import type { UserTokenPayload } from "@customTypes/User";

// Response error
import ResponseError from "@helpers/ResponseError";

// Services
import authService from "@services/AuthService";
import usersService from "@services/UsersService";

interface AuthenticationOptions {
  tokenType?: "access" | "refresh";
  required?: boolean;
  fetch?: boolean;
}

// Authenticates a route from the provided token
export function authenticate(options?: AuthenticationOptions) {
  const tokenType = options?.tokenType || "access";
  const required = options?.required ?? true;
  const fetch = options?.fetch ?? false;
  return async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers["authorization"]?.split(" ")[1];
    const cookieToken: string | undefined =
      tokenType === "access" ? req.cookies.access_token : req.cookies.refresh_token;
    let token = bearerToken || cookieToken;
    console.log(cookieToken)
    if (!token && required) {
      return next(new ResponseError(401, `You are unauthenticated`));
    }
    if (token) {
      let payload: UserTokenPayload;
      try {
        payload = (await authService.verifyToken(tokenType, token)) as UserTokenPayload;
      } catch (error) {
        return next(new ResponseError(400, `The ${tokenType} token is not valid`));
      }
      if (fetch) {
        const user = await usersService.getOne(payload._id);
        if (!user) return next(new ResponseError(404, `Could not find user that matches with the token`));
        res.locals.authUser = user;
      } else res.locals.authUser = payload;
    }
    next();
  };
}
