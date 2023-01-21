import http from "http";

// Database setup
import setupDatabase from "./db/setup";

// Express REST API application
import app from "./app";

// HTTP server
const server = http.createServer(app);

setupDatabase();

// Listening to a port
const PORT: number | string = process.env.PORT || 5000;
server.listen(PORT, () => { console.log(`Server running on port ${PORT} ...`); });