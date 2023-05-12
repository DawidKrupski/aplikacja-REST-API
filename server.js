import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import sgMail from "@sendgrid/mail";
import { api } from "./app.js";

dotenv.config();

const app = express();

app.use(express.static("public"));

app.use(express.json());

app.use("/api", api);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const PORT = 3000;

sgMail.setApiKey(process.env.SEND_GRID_PASSWORD);

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
