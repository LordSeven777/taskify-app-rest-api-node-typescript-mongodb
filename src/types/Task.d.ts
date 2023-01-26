import { Types } from "mongoose";

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

export type TaskCreationAttributes = Partial<Omit<TaskAttributes, "_id">> &
  Pick<TaskAttributes, "name" | "startsAt" | "endsAt" | "user">;
