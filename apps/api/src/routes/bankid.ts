import { Router } from "express";
import { bankid } from "../lib/bankid";

const router = Router();

router.post("/auth", async (req, res) => {
  try {
    const ip = (req.headers["x-forwarded-for"] as string) ?? req.ip ?? "127.0.0.1";
    console.log("endUserIp:", ip);
    const order = await bankid.auth(ip);
    res.json(order);
  } catch (err) {
    console.error("BankID auth error:", err);
    res.status(500).json({ error: "Failed to start BankID auth" });
  }
});

router.post("/collect", async (req, res) => {
  try {
    const { orderRef } = req.body;
    const result = await bankid.collect(orderRef);
    res.json(result);
  } catch (err) {
    console.error("BankID collect error:", err);
    res.status(500).json({ error: "Collect failed" });
  }
});

router.post("/cancel", async (req, res) => {
  try {
    const { orderRef } = req.body;
    await bankid.cancel(orderRef);
    res.json({ ok: true });
  } catch (err) {
    console.error("BankID cancel error:", err);
    res.status(500).json({ error: "Cancel failed" });
  }
});

export default router;