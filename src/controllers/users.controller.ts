import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import { AppDataSource } from "../db/data-source"
import { User } from "../entities/User"

export async function listUsers(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(User)
  const users = await repo.find({ order: { created_at: "DESC" } })
  return res.json(
    users.map((u: User) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      role: u.role,
      email: u.email,
      churchName: u.churchName,
      pastorName: u.pastorName,
    }))
  )
}

export async function createUser(req: Request, res: Response) {
  const { name, username, password, role } = req.body
  if (!name || !username || !password || !role) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes" })
  }

  const repo = AppDataSource.getRepository(User)
  const exists = await repo.findOne({ where: { username } })
  if (exists) return res.status(409).json({ message: "Usuário já existe" })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = repo.create({ name, username, passwordHash, role })
  const created = await repo.save(user)

  return res.status(201).json({
    id: created.id,
    name: created.name,
    username: created.username,
    role: created.role,
  })
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params as { id: string }
  const repo = AppDataSource.getRepository(User)
  await repo.delete({ id })
  return res.status(204).send()
}

