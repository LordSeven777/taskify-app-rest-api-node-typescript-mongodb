import express from "express";

// The express application
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello world" })
})

export default app;