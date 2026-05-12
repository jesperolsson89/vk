import express from "express";
import cors from "cors"

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



const userRouter = require("./routes/users")

app.use("/users", userRouter)

function logger(req: any, res: any, next: any) {
  if (req.originalUrl !== "/health") {
    console.log(req.originalUrl);
  }
  next();
}

app.listen(3001, "0.0.0.0", () => {
  console.log("API running on :3001");
});