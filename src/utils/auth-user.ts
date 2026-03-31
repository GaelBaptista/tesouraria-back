import type { Request } from "express"

type AuthPayload = {
  id?: string
}

export function getAuthUserId(req: Request): string | null {
  const payload = (req as any).user as AuthPayload | undefined
  return payload?.id || null
}
