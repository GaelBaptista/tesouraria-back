import { Router, Request, Response } from "express"
import { login, register } from "../controllers/auth.controller"
import { auth } from "../middlewares/auth"

import {
  listAccounts,
  createAccount,
  deleteAccount,
} from "../controllers/accounts.controller"

import {
  listTransactions,
  createTransaction,
  deleteTransaction,
} from "../controllers/transactions.controller"

import {
  listMissionIncomes,
  createMissionIncome,
  getMissionReport,
  getMissionTotal,
  getMissionProgress,
  deleteMissionIncome,
} from "../controllers/missions.controller"

import {
  listCampaigns,
  createCampaign,
  updateCampaign,
  getCampaignProgress,
} from "../controllers/campaigns.controller"

import {
  listBills,
  createBill,
  updateBill,
  deleteBill,
} from "../controllers/bills.controller"

import {
  listUsers,
  createUser,
  deleteUser,
} from "../controllers/users.controller"

import { getSettings, patchSettings } from "../controllers/settings.controller"

export const routes = Router()

routes.get("/health", (_req: Request, res: Response) => res.json({ ok: true }))

routes.post("/auth/register", register)
routes.post("/auth/login", login)

// A partir daqui, protegido
routes.use(auth)

routes.get("/accounts", listAccounts)
routes.get("/contas", listAccounts) // alias em português
routes.post("/accounts", createAccount)
routes.post("/contas", createAccount)
routes.delete("/accounts/:id", deleteAccount)
routes.delete("/contas/:id", deleteAccount)

routes.get("/transactions", listTransactions)
routes.get("/lancamentos", listTransactions) // alias em português
routes.post("/transactions", createTransaction)
routes.post("/lancamentos", createTransaction)
routes.delete("/transactions/:id", deleteTransaction)
routes.delete("/lancamentos/:id", deleteTransaction)

routes.get("/bills", listBills)
routes.get("/pagamentos", listBills) // alias em português
routes.post("/bills", createBill)
routes.post("/pagamentos", createBill)
routes.put("/bills/:id", updateBill)
routes.put("/pagamentos/:id", updateBill)
routes.delete("/bills/:id", deleteBill)
routes.delete("/pagamentos/:id", deleteBill)

// Mission Campaigns
routes.get("/mission-campaigns", listCampaigns)
routes.get("/campanhas", listCampaigns) // alias em português
routes.get("/missoes/campaigns", listCampaigns) // alias frontend
routes.post("/mission-campaigns", createCampaign)
routes.post("/campanhas", createCampaign)
routes.post("/missoes/campaigns", createCampaign) // alias frontend
routes.patch("/mission-campaigns/:id", updateCampaign)
routes.patch("/campanhas/:id", updateCampaign)
routes.patch("/missoes/campaigns/:id", updateCampaign) // alias frontend
routes.get("/mission-campaigns/progress", getCampaignProgress)
routes.get("/campanhas/progress", getCampaignProgress)

// Mission Incomes (Separate from transactions)
routes.get("/mission-incomes", listMissionIncomes)
routes.get("/missoes", listMissionIncomes) // alias em português
routes.post("/mission-incomes", createMissionIncome)
routes.post("/missoes", createMissionIncome)
routes.get("/mission-incomes/report", getMissionReport)
routes.get("/missoes/report", getMissionReport)
routes.get("/mission-incomes/total", getMissionTotal)
routes.get("/missoes/total", getMissionTotal)
routes.get("/mission-incomes/progress", getMissionProgress)
routes.get("/missoes/progress", getMissionProgress)
routes.delete("/mission-incomes/:id", deleteMissionIncome)
routes.delete("/missoes/:id", deleteMissionIncome)

routes.get("/users", listUsers)
routes.get("/usuarios", listUsers) // alias em português
routes.post("/users", createUser)
routes.post("/usuarios", createUser)
routes.delete("/users/:id", deleteUser)
routes.delete("/usuarios/:id", deleteUser)

routes.get("/settings", getSettings)
routes.get("/configuracoes", getSettings) // alias em português
routes.patch("/settings", patchSettings)
routes.patch("/configuracoes", patchSettings)

// Health check/placeholder
routes.get("/closings", (_req: Request, res: Response) => res.json([]))
