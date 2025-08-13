import express from "express";
import cors from "cors";
import messagesRouter from "./routers/messagesRouter.js";

const app = express();
const port = process.env.PORT || 3000;

// ✅ Safe universal CORS for Express 5
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, "*"); // allow non-browser requests (Postman, curl)
    return callback(null, origin);           // allow the requesting origin
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Handle preflight requests
app.options("*", cors());

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/users", messagesRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port} http://localhost:${port}`);
});
