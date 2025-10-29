import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import storyRoutes from "./routes/storyroute.js";

dotenv.config();

const app = express();

// ✅ Middleware (CORS setup)
app.use(
  cors({
    origin: [
      "http://localhost:3000", // for local testing
      "https://assignment-frontend-gtzd.onrender.com", // your live frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Database connection
connectDB();

// ✅ API routes
app.use("/api/stories", storyRoutes);

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
