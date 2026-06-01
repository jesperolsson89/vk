import express from "express";
import cors from "cors";
import bankidRouter from "./routes/bankid";
import meRouter from "./routes/me";
import resultsRouter from "./routes/results";
import cookieParser from "cookie-parser";

const app = express();
app.use(logger);
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/hello", (req, res) => {
  res.json({ message: "Hello from Express!", time: new Date().toISOString() });
});

const userRouter = require("./routes/users");
app.use(cookieParser());
app.use("/users", userRouter);
app.use("/api/bankid", bankidRouter);

app.use("/api/bankid", bankidRouter);
app.use("/api/me", meRouter);
app.use("/api/logout", meRouter);

function logger(req: any, res: any, next: any) {
  if (req.originalUrl !== "/health") {
    console.log(req.originalUrl);
  }
  next();
}

app.use("/api/results", resultsRouter);

app.listen(3001, "0.0.0.0", () => {
  console.log("API running on :3001");
});