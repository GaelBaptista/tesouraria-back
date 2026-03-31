import type { Request, Response } from "express"
import { AppDataSource } from "../db/data-source"
import { Transaction } from "../entities/Transaction"
import { BankAccount } from "../entities/BankAccount"
import { getAuthUserId } from "../utils/auth-user"

export async function listTransactions(req: Request, res: Response) {
  const userId = getAuthUserId(req)
  if (!userId) return res.status(401).json({ message: "Token inválido" })

  const repo = AppDataSource.getRepository(Transaction)
  const items = await repo.find({
    where: { userId },
    order: { date: "DESC" as any },
  })
  return res.json(
    items.map((t: Transaction) => ({
      id: t.id,
      type: t.type,
      value: Number(t.value),
      date: t.date,
      description: t.description,
      category: t.category,
      accountId: t.accountId,
      toAccountId: t.toAccountId,
      isRecurring: t.isRecurring,
      userId: t.userId,
    }))
  )
}

export async function createTransaction(req: Request, res: Response) {
  const userId = getAuthUserId(req)
  if (!userId) return res.status(401).json({ message: "Token inválido" })

  const {
    type,
    value,
    date,
    description,
    category,
    accountId,
    toAccountId,
    isRecurring,
  } = req.body
  if (!type || !value || !date || !description || !category || !accountId) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes" })
  }

  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(accountId)) {
    return res.status(400).json({
      message: `accountId deve ser um UUID válido. Recebido: "${accountId}". Use o ID de uma conta bancária cadastrada.`,
    })
  }

  const accountsRepo = AppDataSource.getRepository(BankAccount)
  const sourceAccount = await accountsRepo.findOne({
    where: { id: accountId, userId },
  })
  if (!sourceAccount) {
    return res.status(400).json({
      message: "Conta de origem não encontrada para o usuário autenticado",
    })
  }

  if (toAccountId) {
    if (!uuidRegex.test(toAccountId)) {
      return res.status(400).json({
        message: "toAccountId deve ser um UUID válido",
      })
    }

    const destinationAccount = await accountsRepo.findOne({
      where: { id: toAccountId, userId },
    })
    if (!destinationAccount) {
      return res.status(400).json({
        message: "Conta de destino não encontrada para o usuário autenticado",
      })
    }
  }

  const repo = AppDataSource.getRepository(Transaction)
  const tx = repo.create({
    type,
    value: String(Number(value)),
    date,
    description,
    category,
    accountId,
    toAccountId: toAccountId || null,
    isRecurring: !!isRecurring,
    userId,
  })

  const created = await repo.save(tx)
  return res.status(201).json({
    id: created.id,
    type: created.type,
    value: Number(created.value),
    date: created.date,
    description: created.description,
    category: created.category,
    accountId: created.accountId,
    toAccountId: created.toAccountId,
    isRecurring: created.isRecurring,
    userId: created.userId,
  })
}

export async function deleteTransaction(req: Request, res: Response) {
  const userId = getAuthUserId(req)
  if (!userId) return res.status(401).json({ message: "Token inválido" })

  const { id } = req.params as { id: string }
  const repo = AppDataSource.getRepository(Transaction)
  await repo.delete({ id, userId })
  return res.status(204).send()
}
