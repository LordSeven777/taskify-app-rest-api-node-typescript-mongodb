import { Types } from "mongoose"

export interface LabelAttributes {
  _id: Types.ObjectId;
  name: string;
  color: string;
}