import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import inventoryRoutes from "./routes/inventory.route";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURL = process.env.MONGO_URL || "";

mongoose
  .connect(mongoURL)
  .then(() => console.log("MongoDB connected"))
  .catch((err: Error) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/inventory", inventoryRoutes);
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
