import type { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt"

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "")
  if (!token) return res.status(401).json({ message: "Token ausente" })
  try {
    const payload = verifyToken(token)
    ;(req as any).user = payload
    next()
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" })
  }
}

