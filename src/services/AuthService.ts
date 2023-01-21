import jwt, { SignOptions } from "jsonwebtoken";

// Types
import { UserCreationAttributes, UserTokenPayload, UserDocument } from "../types/User";

// Configs
import { development, production } from "../configs/tokenSecrets";

// Other services
import usersService from "./UsersService";

type TokenType = "access" | "refresh";

interface AuthenticationResult {
  user: UserDocument;
  accessToken: string;
  refreshToken: string;
}

// The token secrets config
const tokenSecretsConfig = process.env.NODE_ENV ? production : development;

class AuthService {
  // HELPER
  private generateToken(type: TokenType, payload: UserTokenPayload): string {
    const params: [UserTokenPayload, string, SignOptions | undefined] = [
      payload,
      type === "access" ? tokenSecretsConfig.access : tokenSecretsConfig.refresh,
      type === "access" ? { expiresIn: "3d" } : undefined,
    ];
    return jwt.sign(...params);
  }

  async register(userPayload: UserCreationAttributes): Promise<AuthenticationResult> {
    const user = await usersService.create(userPayload);
    const tokenPayload = {
      _id: user._id.toString(),
    };
    const accessToken = this.generateToken("access", tokenPayload);
    const refreshToken = this.generateToken("refresh", tokenPayload);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}

const authService = new AuthService();

export default authService;
