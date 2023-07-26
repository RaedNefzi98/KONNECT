import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import {register} from "./controllers/auth.js";
import {createPost} from "./controllers/posts.js"
import { verifyToken } from "./middleware/auth.js";
import User from "./Models/User.js";
import Post from "./Models/post.js";
import { users, posts } from "./data/index.js";



// Get the current file's path
const __filename = fileURLToPath(import.meta.url);

// Get the current directory's path
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express application
const app = express();

// Parse incoming requests with JSON payloads
app.use(express.json());

// Add security-related HTTP headers
app.use(helmet());

// Configure Cross-Origin Resource Policy
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));

// Log HTTP requests to the console using the "common" format
app.use(morgan("common"));

// Parse JSON payloads with a limit of 30MB
app.use(bodyParser.json({ limit: "30mb", extended: true }));

// Parse URL-encoded payloads with a limit of 30MB
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Enable Cross-Origin Resource Sharing (CORS) for allowing requests from different origins
app.use(cors());

// Serve static files from the '/public/assets' directory when the URL starts with '/assets'
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));




/* FILE STORAGE : Multer config */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage });

 /* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

  /* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    /*  User.insertMany(users);
     Post.insertMany(posts); */
  })
  .catch((error) => console.log(`${error} did not connect`));