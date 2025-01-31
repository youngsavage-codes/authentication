import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/dbConn.js";
import rootRoute from "./route/root.js";

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3005; // Ensure correct port

// Connect to database
connectDB();

// CORS Configuration
const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Handle Preflight Requests
app.options("*", cors());

// Routes
app.use("/api/v1", rootRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});
