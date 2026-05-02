import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(3001, "0.0.0.0", () => {
  console.log("API running on :3001");
});