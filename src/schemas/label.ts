import { Schema } from "express-validator";

// Types
import { UserDocument } from "@customTypes/User";

// Services
import labelsService from "@services/LabelsService";

// The label schema object
const labelSchema: Schema = {
  name: {
    trim: true,
    notEmpty: { errorMessage: "The label name must not be empty" },
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "The label name must be 2 to 50 characters length",
    },
  },
  color: {
    trim: true,
    isHexColor: true,
    optional: true,
  },
};

export default labelSchema;
