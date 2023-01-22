import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";

// Types
import { UserCreationAttributes, UserTokenPayload, UserDocument, LoginCredentials } from "../types/User";

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
  generateToken(type: TokenType, payload: UserTokenPayload): string {
    const params: [UserTokenPayload, string, SignOptions | undefined] = [
      payload,
      type === "access" ? tokenSecretsConfig.access : tokenSecretsConfig.refresh,
      type === "access" ? { expiresIn: "3d" } : undefined,
    ];
    return jwt.sign(...params);
  }

  async verifyToken(type: TokenType, token: string) {
    const secret = type === "access" ? tokenSecretsConfig.access : tokenSecretsConfig.refresh;
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, payload) => {
        if (err) reject(err);
        else resolve(payload);
      });
    });
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

  async login(credentials: LoginCredentials): Promise<AuthenticationResult | null> {
    const userHavingEmail = await usersService.getFirst({ email: credentials.email });
    if (!userHavingEmail) return null;
    if (!(await bcrypt.compare(credentials.password, userHavingEmail.password))) return null;
    const tokenPayload = {
      _id: userHavingEmail._id.toString(),
    };
    const accessToken = this.generateToken("access", tokenPayload);
    const refreshToken = this.generateToken("refresh", tokenPayload);
    return {
      user: userHavingEmail,
      accessToken,
      refreshToken,
    };
  }
}

const authService = new AuthService();

export default authService;
