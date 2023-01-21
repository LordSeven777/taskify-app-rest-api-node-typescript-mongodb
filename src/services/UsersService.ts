import bcrypt from "bcrypt";

// Types
import type { UserCreationAttributes, UserAttributes } from "../types/User";

// Models
import User from "../models/User";

class UsersService {
  async checkIfExists(field: string, value: unknown): Promise<boolean> {
    return !!(await User.findOne({ [field]: value }));
  }

  async getFirst(attributes: Partial<UserAttributes>) {
    return await User.findOne(attributes);
  }

  async create(payload: UserCreationAttributes) {
    const password = await bcrypt.hash(payload.password, 10);
    return await User.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      username: payload.username,
      email: payload.email,
      password,
    });
  }
}

const usersService = new UsersService();

export default usersService;
