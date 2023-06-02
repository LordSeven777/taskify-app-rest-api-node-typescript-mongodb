import type { Document, Types } from "mongoose";

// Gets the mongoose document type from a model's attributes
export type MongooseDocument<Attributes> = Document<unknown, any, Attributes> &
  Attributes &
  Required<{
    _id: Types.ObjectId;
  }>;
