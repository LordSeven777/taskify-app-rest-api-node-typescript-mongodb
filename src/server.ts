import http from "http";
import path from "path";
import dotenv from "dotenv";

// Database setup
import setupDatabase from "@db/setup";

// Express REST API application
import app from "./app";

// Loading environment variables (only for local development)
if (!process.env.NODE_ENV) dotenv.config({ path: path.join(__dirname, "../", ".env") });

// HTTP server
const server = http.createServer(app);

setupDatabase();

// Listening to a port
const PORT: number | string = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ...`);
});
