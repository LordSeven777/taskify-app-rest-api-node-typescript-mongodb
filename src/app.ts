import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// The error handler
import errorHandlerMiddleware from "@middlewares/errorHandler";

// Controllers
import authController from "@controllers/AuthController";
import usersController from "@controllers/UsersController";
import labelsController from "@controllers/LabelsController";

// Middlewares
import { authenticate } from "@middlewares/authenticate";
import { validateRegistrationUser } from "@middlewares/validations/user";
import { validateLabel, validateUpdateLabel } from "@middlewares/validations/label";
import { ownsLabel } from "@middlewares/authorizations/label";

// The express application
const app = express();

// CORS handling
app.use(cors());

// Cookie parser
app.use(cookieParser());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Index
app.get("/", (req, res) => {
  console.log(req.cookies);
  res.send(`
    <h1>This is the taskify app's rest api.</h1>
    <p>If you want to access the resources, please point the routes available.</p>
  `);
});

/* Authentication related routes ********************************* */

app.post("/api/register", validateRegistrationUser, authController.register);

app.post("/api/login", authController.login);

// Gets the authenticated user from the token
app.get("/api/auth-user", authenticate({ fetch: true }), authController.getAuthUser);

app.get("/api/refresh-token", authenticate({ tokenType: "refresh" }), authController.refreshToken);

app.delete("/api/logout", authenticate(), authController.logout);

app.delete("/api/unregister", authenticate(), authController.unregister);

/* *************************************************************** */

/* Users routes ************************************************** */

// Gets labels scoped to a user
app.get("/api/users/:userId/labels", authenticate(), usersController.getUserLabels);

/* *************************************************************** */

/* Labels routes ************************************************* */

app.post("/api/labels", authenticate({ fetch: true }), validateLabel, labelsController.create);

app.put("/api/labels/:Label", ownsLabel, validateUpdateLabel, labelsController.update);

app.delete("/api/labels/:Label", ownsLabel, labelsController.delete);

/* *************************************************************** */

app.use(errorHandlerMiddleware);

export default app;
