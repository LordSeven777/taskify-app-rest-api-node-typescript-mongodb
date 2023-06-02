import mongoose, { Schema } from "mongoose";

// Task attributes
import { TaskAttributes } from "@customTypes/Task";

const taskSchema = new Schema<TaskAttributes>(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    checkList: [
      {
        type: String,
        default: [],
      },
    ],
    startsAt: {
      type: Date,
      required: true,
    },
    endsAt: {
      type: Date,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    labels: [
      {
        type: Schema.Types.ObjectId,
        default: [],
        ref: "Label",
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
  },
);

// Model
const Task = mongoose.model("Task", taskSchema);

export default Task;
