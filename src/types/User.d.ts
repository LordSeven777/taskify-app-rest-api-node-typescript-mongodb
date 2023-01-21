import { Types } from "mongoose";
import { MongooseDocument } from "./utils/document";

export interface UserAttributes {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export type UserCreationAttributes = Omit<UserAttributes, "_id">;

export interface UserTokenPayload {
  _id: string;
}

export type UserDocument = MongooseDocument<UserAttributes>;
