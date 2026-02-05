import type { Request, Response } from "express"
import { AppDataSource } from "../db/data-source"
import { BankAccount } from "../entities/BankAccount"

export async function listAccounts(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(BankAccount)
  const accounts = await repo.find({ order: { created_at: "DESC" } })
  return res.json(
    accounts.map((a: BankAccount) => ({
      id: a.id,
      name: a.name,
      bankName: a.bankName,
      type: a.type,
      initialBalance: Number(a.initialBalance),
    }))
  )
}

export async function createAccount(req: Request, res: Response) {
  const { name, bankName, type, initialBalance } = req.body
  if (!name) return res.status(400).json({ message: "name é obrigatório" })

  const repo = AppDataSource.getRepository(BankAccount)
  const acc = repo.create({
    name,
    bankName,
    type: type || "Conta Corrente",
    initialBalance: String(Number(initialBalance || 0)),
  })

  const created = await repo.save(acc)
  return res.status(201).json({
    id: created.id,
    name: created.name,
    bankName: created.bankName,
    type: created.type,
    initialBalance: Number(created.initialBalance),
  })
}

export async function deleteAccount(req: Request, res: Response) {
  const { id } = req.params as { id: string }
  const repo = AppDataSource.getRepository(BankAccount)
  await repo.delete({ id })
  return res.status(204).send()
}

