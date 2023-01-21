import { Types } from "mongoose"

export interface UserAttributes {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}