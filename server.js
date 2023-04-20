import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import { api } from "./app.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api", api);

const PORT = 3000;

app.listen(PORT, async () => {
  console.log("Connecting to database...");
  try {
    await mongoose.connect(process.env.SECRET_URL, {
      dbName: "db-contacts",
    });
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
});
