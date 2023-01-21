import mongoose, { Schema } from "mongoose";

// User attrinbutes
import { UserAttributes } from "../types/User";

const userSchema = new Schema<UserAttributes>(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
  }
)

// Model
const User = mongoose.model("User", userSchema);

export default User;