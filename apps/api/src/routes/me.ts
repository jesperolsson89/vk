import { Router } from "express";
import type { Request, Response } from "express";
import { prisma } from "@myapp/db";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const sessionId = (req as any).cookies?.session_id;
  if (!sessionId) return res.status(401).json(null);

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return res.status(401).json(null);
  }

  res.json({
    name: session.user.name,
    givenName: session.user.givenName,
    surname: session.user.surname,
    personalNumber: session.user.personalNumber,
  });
});

router.post("/logout", async (req: Request, res: Response) => {
  const sessionId = (req as any).cookies?.session_id;
  if (sessionId) {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
  }
  res.clearCookie("session_id");
  res.json({ ok: true });
});

export default router;