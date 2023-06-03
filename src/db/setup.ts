import mongoose from "mongoose";

// Database connection config
import { development, production } from "@configs/db";

// Database seeding
import { seedDatabase, clearDatabase } from "./seeder";

interface SetupOptions {
  seed?: boolean;
}

// Suppress mongoose warning
mongoose.set("strictQuery", true);

export default async function setupDatabase(options?: SetupOptions) {
  try {
    const NODE_ENV = process.env.NODE_ENV as (string | undefined);
    const connectionConfig = (!NODE_ENV || NODE_ENV === "DEVELOPMENT") ? development : production;
    await mongoose.connect(connectionConfig.uri, connectionConfig.options);
    console.log("Connected to the database ...");
  } catch (error) {
    console.log("Failed to connect to the database ...", (error as Error).message);
    console.log(error);
    return;
  }
  if (options?.seed) {
    await clearDatabase();
    await seedDatabase();
  }
}
