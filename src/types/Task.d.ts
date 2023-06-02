import { Types } from "mongoose";
import { MongooseDocument } from "./utils/document";

export interface TaskAttributes {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  checkList: string[];
  startsAt: Date;
  endsAt: Date;
  isCompleted: boolean;
  labels: Types.ObjectId[];
  user: Types.ObjectId;
}

export type TaskDocument = MongooseDocument<TaskAttributes>;

export type TaskCreationAttributes = Partial<Omit<TaskAttributes, "_id">> &
  Pick<TaskAttributes, "name" | "startsAt" | "endsAt" | "user">;

export type TaskUpdateAttributes = Omit<TaskAttributes, "_id" | "user">;
