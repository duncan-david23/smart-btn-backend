import express from "express";
import cors from "cors";
import messagesRouter from "./routers/messagesRouter.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin || "*"); // Allow the requesting origin
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false // set to false unless you REALLY need cookies/auth
}));

// Preflight response handler
app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/users", messagesRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
