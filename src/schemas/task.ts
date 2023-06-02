import { Schema } from "express-validator";

import labelsService from "@services/LabelsService";

// The task schema object
const taskSchema: Schema = {
  name: {
    trim: true,
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: "The task name must exceed 50 charactrers",
    },
    notEmpty: {
      errorMessage: "The task name is required",
    },
  },
  description: {
    trim: true,
    optional: true,
  },
  checkList: {
    isArray: {
      errorMessage: "The check list must be an array of string",
    },
    optional: true,
  },
  startsAt: {
    trim: true,
    isISO8601: {
      errorMessage: "The starting time must be in a ISO format",
    },
    notEmpty: {
      errorMessage: "The staring time is required",
    },
  },
  endsAt: {
    trim: true,
    isISO8601: {
      errorMessage: "The ending time format is not valid",
    },
    notEmpty: {
      errorMessage: "The ending time is required",
    },
  },
  isCompleted: {
    isBoolean: {
      errorMessage: "The completion status must be a boolean",
    },
    optional: true,
  },
  labels: {
    isArray: {
      errorMessage: "The labels must be an array of label object ids",
    },
    default: {
      options: [],
    },
    customSanitizer: {
      options(labels) {
        return [...new Set(labels)];
      },
    },
    custom: {
      async options(labelIds) {
        if (!(await labelsService.idsExist(labelIds))) {
          throw new Error("The label ids must exist inside the database");
        }
        return true;
      },
    },
    optional: true,
  },
  "labels.*": {
    isMongoId: {
      errorMessage: "The label ids must be valid mongo db ids",
    },
  },
};

export default taskSchema;
