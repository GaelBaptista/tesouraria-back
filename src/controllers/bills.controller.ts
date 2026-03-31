import type { Request, Response } from "express"
import { AppDataSource } from "../db/data-source"
import { Bill } from "../entities/Bill"
import { getAuthUserId } from "../utils/auth-user"

export async function listBills(req: Request, res: Response) {
  const userId = getAuthUserId(req)
  if (!userId) return res.status(401).json({ message: "Token inválido" })

  const repo = AppDataSource.getRepository(Bill)
  const bills = await repo.find({
    where: { userId },
    order: { created_at: "DESC" },
  })
  return res.json(
    bills.map((b: Bill) => ({
      id: b.id,
      description: b.description,
      value: Number(b.value),
      dueDate: b.dueDate,
      category: b.category,
      isRecurring: b.isRecurring,
      status: b.status,
      lastPaymentDate: b.lastPaymentDate,
    }))
  )
}

export async function createBill(req: Request, res: Response) {
  const userId = getAuthUserId(req)
  if (!userId) return res.status(401).json({ message: "Token inválido" })

  const { description, value, dueDate, category, isRecurring, status } =
    req.body
  if (!description || !value || !dueDate || !category) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes" })
  }

  const repo = AppDataSource.getRepository(Bill)
  const bill = repo.create({
    description,
    value: String(Number(value)),
    dueDate: Number(dueDate),
    category,
    isRecurring: isRecurring ?? true,
    status: status || "Pendente",
    userId,
  })

  const created = await repo.save(bill)
  return res.status(201).json({
    id: created.id,
    description: created.description,
    value: Number(created.value),
    dueDate: created.dueDate,
    category: created.category,
    isRecurring: created.isRecurring,
    status: created.status,
    lastPaymentDate: created.lastPaymentDate,
  })
}

export async function updateBill(req: Request, res: Response) {
  const userId = getAuthUserId(req)
  if (!userId) return res.status(401).json({ message: "Token inválido" })

  const { id } = req.params as { id: string }
  const repo = AppDataSource.getRepository(Bill)

  const existing = await repo.findOne({ where: { id, userId } })
  if (!existing)
    return res.status(404).json({ message: "Conta não encontrada" })

  const payload = req.body
  const updated = repo.merge(existing, {
    ...payload,
    value:
      payload.value !== undefined
        ? String(Number(payload.value))
        : existing.value,
  })

  const saved = await repo.save(updated)
  return res.json({
    id: saved.id,
    description: saved.description,
    value: Number(saved.value),
    dueDate: saved.dueDate,
    category: saved.category,
    isRecurring: saved.isRecurring,
    status: saved.status,
    lastPaymentDate: saved.lastPaymentDate,
  })
}

export async function deleteBill(req: Request, res: Response) {
  const userId = getAuthUserId(req)
  if (!userId) return res.status(401).json({ message: "Token inválido" })

  const { id } = req.params as { id: string }
  const repo = AppDataSource.getRepository(Bill)
  await repo.delete({ id, userId })
  return res.status(204).send()
}
