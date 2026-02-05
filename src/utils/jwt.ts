import jwt from "jsonwebtoken"
import type { SignOptions } from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const secret = (process.env.JWT_SECRET || "change_me") as string

export function signToken(payload: object) {
  const options: SignOptions = { expiresIn: "7d" }
  return jwt.sign(payload, secret, options)
}

export function verifyToken(token: string) {
  return jwt.verify(token, secret) as any
}

