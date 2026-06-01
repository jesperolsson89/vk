import { Router } from "express";
import { bankid } from "../lib/bankid";
import { prisma } from "@myapp/db";

const router = Router();

router.post("/auth", async (req, res) => {
  try {
    const rawIp = (req.headers["x-forwarded-for"] as string) ?? req.ip ?? "127.0.0.1";
    const ip = rawIp.includes("::ffff:") ? rawIp.replace("::ffff:", "") : rawIp === "::1" ? "127.0.0.1" : rawIp;
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

    if (result.status === "complete") {
      const { personalNumber, name, givenName, surname } = result.completionData.user;

      // 1. Upsert user — create on first login, update name on subsequent logins
      const user = await prisma.user.upsert({
        where: { personalNumber },
        create: { personalNumber, name, givenName, surname },
        update: { name, givenName, surname },
      });

      // 2. Create session
      const session = await prisma.session.create({
        data: {
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      // 3. Set session cookie
      res.cookie("session_id", session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: session.expiresAt,
      });
    }

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