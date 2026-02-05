import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import { AppDataSource } from "../db/data-source"
import { User, UserRole } from "../entities/User"
import { signToken } from "../utils/jwt"

export async function register(req: Request, res: Response) {
  const { username, password, name, email, churchName, pastorName } = req.body

  if (!username || !password || !churchName) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes" })
  }

  const repo = AppDataSource.getRepository(User)
  const exists = await repo.findOne({ where: { username } })
  if (exists) return res.status(409).json({ message: "Usuário já existe" })

  const passwordHash = await bcrypt.hash(password, 10)

  const user = repo.create({
    username,
    name: name || username,
    email,
    churchName,
    pastorName,
    passwordHash,
    role: UserRole.ADMIN, // primeiro usuário vira ADMIN (profissional)
  })

  const created = await repo.save(user)
  const token = signToken({
    id: created.id,
    role: created.role,
    username: created.username,
  })

  return res.json({
    token,
    user: {
      id: created.id,
      name: created.name,
      username: created.username,
      role: created.role,
      email: created.email,
      churchName: created.churchName,
      pastorName: created.pastorName,
    },
  })
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: "Usuário e senha são obrigatórios" })
  }

  const repo = AppDataSource.getRepository(User)
  const user = await repo.findOne({ where: { username } })
  if (!user) return res.status(401).json({ message: "Credenciais inválidas" })

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ message: "Credenciais inválidas" })

  const token = signToken({
    id: user.id,
    role: user.role,
    username: user.username,
  })

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      email: user.email,
      churchName: user.churchName,
      pastorName: user.pastorName,
    },
  })
}

