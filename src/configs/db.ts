import { ConnectOptions } from "mongoose";

// Type for a database connection config
interface DatabaseConnectionConfig {
  uri: string;
  options: ConnectOptions;
}

export const development: DatabaseConnectionConfig = {
  uri: "mongodb://127.0.0.1:27017/taskify",
  options: {},
};

export const production: DatabaseConnectionConfig = {
  uri: process.env.DATABASE_URL as string,
  options: {},
};
