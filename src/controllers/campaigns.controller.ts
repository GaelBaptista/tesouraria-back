import type { Request, Response } from "express"
import { AppDataSource } from "../db/data-source"
import { MissionCampaign, CampaignStatus } from "../entities/MissionCampaign"
import { getAuthUserId } from "../utils/auth-user"

export async function listCampaigns(req: Request, res: Response) {
  const userId = getAuthUserId(req)
  if (!userId) return res.status(401).json({ message: "Token inválido" })

  const repo = AppDataSource.getRepository(MissionCampaign)
  const campaigns = await repo.find({
    where: { userId },
    order: { created_at: "DESC" as any },
  })

  return res.json(
    campaigns.map((c: MissionCampaign) => ({
      id: c.id,
      name: c.name,
      target: Number(c.target),
      startDate: c.startDate,
      endDate: c.endDate,
      status: c.status,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }))
  )
}

export async function createCampaign(req: Request, res: Response) {
  const userId = getAuthUserId(req)
  if (!userId) return res.status(401).json({ message: "Token inválido" })

  const { name, target, startDate } = req.body

  // Validações
  if (!name || !target || !startDate) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes" })
  }

  if (typeof name !== "string" || name.trim().length === 0) {
    return res
      .status(400)
      .json({ message: "Nome deve ser uma string não-vazia" })
  }

  const targetNum = Number(target)
  if (isNaN(targetNum) || targetNum <= 0) {
    return res
      .status(400)
      .json({ message: "Target deve ser um número maior que 0" })
  }

  const startDateObj = new Date(startDate)
  if (isNaN(startDateObj.getTime())) {
    return res.status(400).json({ message: "startDate inválido" })
  }

  // Verificar se já existe campanha ativa
  const repo = AppDataSource.getRepository(MissionCampaign)
  const existingActive = await repo.findOne({
    where: { status: CampaignStatus.ACTIVE, userId },
  })

  if (existingActive) {
    return res.status(409).json({
      message:
        "Já existe uma campanha ativa. Finalize a atual antes de criar uma nova.",
    })
  }

  const campaign = repo.create({
    name,
    target: String(targetNum),
    startDate: startDateObj,
    endDate: null,
    status: CampaignStatus.ACTIVE,
    userId,
  })

  const created = await repo.save(campaign)

  return res.status(201).json({
    id: created.id,
    name: created.name,
    target: Number(created.target),
    startDate: created.startDate,
    endDate: created.endDate,
    status: created.status,
    createdAt: created.created_at,
    updatedAt: created.updated_at,
  })
}

export async function updateCampaign(req: Request, res: Response) {
  const userId = getAuthUserId(req)
  if (!userId) return res.status(401).json({ message: "Token inválido" })

  const { id } = req.params as { id: string }
  const { status, endDate } = req.body

  const repo = AppDataSource.getRepository(MissionCampaign)
  const campaign = await repo.findOne({ where: { id, userId } })

  if (!campaign) {
    return res.status(404).json({ message: "Campanha não encontrada" })
  }

  if (status === CampaignStatus.COMPLETED) {
    if (!endDate) {
      return res
        .status(400)
        .json({ message: "endDate é obrigatório para completar campanha" })
    }

    const endDateObj = new Date(endDate)
    if (isNaN(endDateObj.getTime())) {
      return res.status(400).json({ message: "endDate inválido" })
    }

    campaign.endDate = endDateObj
  }

  if (status) {
    campaign.status = status
  }

  const updated = await repo.save(campaign)

  return res.json({
    id: updated.id,
    name: updated.name,
    target: Number(updated.target),
    startDate: updated.startDate,
    endDate: updated.endDate,
    status: updated.status,
    createdAt: updated.created_at,
    updatedAt: updated.updated_at,
  })
}

export async function getCampaignProgress(req: Request, res: Response) {
  const userId = getAuthUserId(req)
  if (!userId) return res.status(401).json({ message: "Token inválido" })

  const { campaignId } = req.query as { campaignId: string }

  if (!campaignId) {
    return res.status(400).json({ message: "campaignId é obrigatório" })
  }

  const campaignRepo = AppDataSource.getRepository(MissionCampaign)
  const campaign = await campaignRepo.findOne({
    where: { id: campaignId, userId },
  })

  if (!campaign) {
    return res.status(404).json({ message: "Campanha não encontrada" })
  }

  const { MissionIncome } = await import("../entities/MissionIncome")
  const incomeRepo = AppDataSource.getRepository(MissionIncome)
  const incomes = await incomeRepo.find({ where: { campaignId, userId } })

  const currentProgress = incomes.reduce(
    (sum, income) => sum + Number(income.value),
    0
  )
  const target = Number(campaign.target)
  const percentage = ((currentProgress / target) * 100).toFixed(2)
  const remaining = Math.max(0, target - currentProgress)

  return res.json({
    campaignId,
    campaignName: campaign.name,
    currentProgress: currentProgress.toFixed(2),
    target: target.toFixed(2),
    percentage,
    remaining: remaining.toFixed(2),
    status: campaign.status,
  })
}
