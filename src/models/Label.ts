import mongoose, { Schema } from "mongoose";

// Label attributes
import { LabelAttributes } from "@customTypes/Label";

const labelSchema = new Schema<LabelAttributes>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    color: {
      type: String,
      default: "#777777",
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
  },
);

// Model
const Label = mongoose.model("Label", labelSchema);

export default Label;
