import { Router } from "express";
import type { Request, Response } from "express";
import { prisma } from "@myapp/db";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const sessionId = (req as any).cookies?.session_id;
    console.log("session_id cookie:", sessionId);

    if (!sessionId) return res.status(401).json({ error: "Unauthorized" });

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    console.log("session found:", session?.id, "user:", session?.user?.name);

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: "Session expired" });
    }

    const { ratings, topValues } = req.body;
    console.log("ratings:", ratings);
    console.log("topValues:", topValues);

    const result = await prisma.testResult.create({
      data: {
        userId: session.user.id,
        ratings,
        topValues,
      },
    });

    console.log("result saved:", result.id);
    res.json(result);
  } catch (err) {
    console.error("Save results error:", err);
    res.status(500).json({ error: "Failed to save results" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const sessionId = (req as any).cookies?.session_id;
    if (!sessionId) return res.status(401).json({ error: "Unauthorized" });

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: "Session expired" });
    }

    const results = await prisma.testResult.findMany({
      where: { userId: session.user.id },
      orderBy: { completedAt: "desc" },
    });

    res.json(results);
  } catch (err) {
    console.error("Fetch results error:", err);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

export default router;