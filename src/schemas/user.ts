import { Schema } from "express-validator";

// Users service
import usersService from "../services/UsersService";

// Regex for the valid user name
const validUsernameSchema = /^('?[A-z]+'?\s?)+$/;

// The user schema object
const userSchema: Schema = {
  firstName: {
    trim: true,
    notEmpty: { errorMessage: "The first name must not be empty" },
    matches: {
      options: validUsernameSchema,
      errorMessage: "The first name is not valid",
    },
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "The first name must be 2 to 50 characters length",
    },
  },
  lastName: {
    trim: true,
    notEmpty: { errorMessage: "The last name must not be empty" },
    matches: {
      options: validUsernameSchema,
      errorMessage: "The last name is not valid",
    },
    isLength: {
      options: { min: 2, max: 30 },
      errorMessage: "The last name must be 2 to 30 characters length",
    },
  },
  username: {
    trim: true,
    notEmpty: { errorMessage: "The username must not be empty" },
    custom: {
      // Username must be unique
      async options(username) {
        if (await usersService.checkIfExists("username", username))
          throw new Error("The username is already taken");
        return true;
      },
    },
  },
  email: {
    trim: true,
    notEmpty: { errorMessage: "The email address must not be empty" },
    isEmail: { errorMessage: "The email address is not valid" },
    custom: {
      // Email must be unique
      async options(email) {
        if (await usersService.checkIfExists("email", email))
          throw new Error("The email address is already being used");
        return true;
      },
    },
  },
  password: {
    trim: true,
    notEmpty: { errorMessage: "The password must not be empty" },
    isStrongPassword: {
      errorMessage:
        "The password must have at leat 8 characters and must contain at least 1 lowercase, 1 uppercase, and 1 special character",
    },
  },
  passwordConfirmation: {
    trim: true,
    notEmpty: { errorMessage: "The password must be confirmed" },
    custom: {
      options(passwordConfirmation, { req }) {
        const { password } = req.body;
        if (!password) return true; // Not throwing an error until the password is filled
        if (passwordConfirmation !== password) throw new Error("The password confirmation is wrong");
        return true;
      },
    },
  },
};

export default userSchema;
