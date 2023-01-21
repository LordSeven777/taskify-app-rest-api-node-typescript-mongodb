import express from "express";

// The error handler
import errorHandlerMiddleware from "./middlewares/errorHandler";

// The express application
const app = express();

// Index
app.get("/", (req, res) => {
  res.send(`
    <h1>This is the taskify app's rest api.</h1>
    <p>If you want to access the resources, please point the routes available.</p>
  `);
});

app.use(errorHandlerMiddleware);

export default app;
