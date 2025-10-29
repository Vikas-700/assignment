import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import storyRoutes from "./routes/storyroute.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: ["http://localhost:3000"], // your React frontend URL
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

// ✅ Root test route (optional)
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.use(cors({
  origin: "https://assignment-frontend-gtzd.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
