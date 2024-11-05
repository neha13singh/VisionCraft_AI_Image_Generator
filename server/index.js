import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import generateImageRoute from "./routes/GenerateImage.js";
import posts from "./routes/Posts.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // for form data

app.use("/api/generateImage/", generateImageRoute);
app.use("/api/post/", posts);

// Add timeout middleware
app.use((req, res, next) => {
  res.setTimeout(120000, () => {
    console.log('⏰ Request has timed out.');
    res.status(408).send('Request has timed out');
  });
  next();
});

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello developers from GFG",
  });
});

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🌟 MongoDB Connected Successfully!');
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err; // Propagate error to startServer
  }
};

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 8080; // fallback to 8080 if PORT not set
    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    process.exit(1); // Exit process with failure
  }
};

startServer();
