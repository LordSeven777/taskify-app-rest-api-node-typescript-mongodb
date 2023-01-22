import { Types } from "mongoose";
import { MongooseDocument } from "./utils/document";

export interface LabelAttributes {
  _id: Types.ObjectId;
  name: string;
  color: string;
  user: Types.ObjectId;
}

export type LabelDocument = MongooseDocument<LabelAttributes>;
