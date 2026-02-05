import type { Request, Response } from "express"
import { AppDataSource } from "../db/data-source"
import { MissionIncome, MissionIncomeSource } from "../entities/MissionIncome"
import { MissionCampaign } from "../entities/MissionCampaign"

export async function listMissionIncomes(req: Request, res: Response) {
  const { campaignId } = req.query as { campaignId?: string }

  const repo = AppDataSource.getRepository(MissionIncome)
  let query = repo.createQueryBuilder("income").orderBy("income.date", "DESC")

  if (campaignId) {
    query = query.where("income.campaignId = :campaignId", { campaignId })
  }

  const items = await query.getMany()

  return res.json(
    items.map((m: MissionIncome) => ({
      id: m.id,
      campaignId: m.campaignId,
      source: m.source,
      value: Number(m.value),
      date: m.date,
      description: m.description,
      createdAt: m.created_at,
      updatedAt: m.updated_at,
    }))
  )
}

export async function createMissionIncome(req: Request, res: Response) {
  const { campaignId, source, value, date, description } = req.body

  if (!campaignId || !source || !value || !date) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes" })
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(campaignId)) {
    return res
      .status(400)
      .json({ message: "campaignId deve ser um UUID válido" })
  }

  const validSources = Object.values(MissionIncomeSource)
  if (!validSources.includes(source)) {
    return res.status(400).json({
      message: `Source inválido. Use: ${validSources.join(", ")}`,
    })
  }

  const valueNum = Number(value)
  if (isNaN(valueNum) || valueNum <= 0) {
    return res
      .status(400)
      .json({ message: "Value deve ser um número maior que 0" })
  }

  const campaignRepo = AppDataSource.getRepository(MissionCampaign)
  const campaign = await campaignRepo.findOne({ where: { id: campaignId } })

  if (!campaign) {
    return res.status(404).json({ message: "Campanha não encontrada" })
  }

  const repo = AppDataSource.getRepository(MissionIncome)
  const income = repo.create({
    campaignId,
    source,
    value: String(valueNum),
    date,
    description: description || null,
  })

  const created = await repo.save(income)

  return res.status(201).json({
    id: created.id,
    campaignId: created.campaignId,
    source: created.source,
    value: Number(created.value),
    date: created.date,
    description: created.description,
    createdAt: created.created_at,
    updatedAt: created.updated_at,
  })
}

export async function getMissionReport(req: Request, res: Response) {
  const { campaignId } = req.query as { campaignId: string }

  if (!campaignId) {
    return res.status(400).json({ message: "campaignId é obrigatório" })
  }

  const repo = AppDataSource.getRepository(MissionIncome)
  const items = await repo.find({ where: { campaignId } })

  const sourceValues: Record<string, number> = {
    Ofertas: 0,
    Cantina: 0,
    Bazzar: 0,
    Outro: 0,
  }

  let total = 0
  items.forEach(item => {
    const value = Number(item.value)
    sourceValues[item.source] = (sourceValues[item.source] || 0) + value
    total += value
  })

  const breakdown = Object.entries(sourceValues).map(([source, value]) => ({
    source,
    value,
    percentage: total > 0 ? ((value / total) * 100).toFixed(2) : "0.00",
  }))

  return res.json({
    total: total.toFixed(2),
    breakdown,
  })
}

export async function getMissionTotal(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(MissionIncome)
  const items = await repo.find()
  const total = items.reduce((sum, item) => sum + Number(item.value), 0)
  return res.json({ total: total.toFixed(2) })
}

export async function getMissionProgress(req: Request, res: Response) {
  const missionRepo = AppDataSource.getRepository(MissionIncome)
  const missionItems = await missionRepo.find()
  const currentProgress = missionItems.reduce(
    (sum, item) => sum + Number(item.value),
    0
  )

  const { Settings } = await import("../entities/Settings")
  const settingsRepo = AppDataSource.getRepository(Settings)
  const settings = await settingsRepo.findOne({ where: {} })

  const missionTarget = settings ? Number(settings.missionTarget) : 5000

  return res.json({
    currentProgress: currentProgress.toFixed(2),
    missionTarget: missionTarget.toFixed(2),
    percentage: ((currentProgress / missionTarget) * 100).toFixed(2),
    remaining: Math.max(0, missionTarget - currentProgress).toFixed(2),
  })
}

export async function deleteMissionIncome(req: Request, res: Response) {
  const { id } = req.params as { id: string }
  const repo = AppDataSource.getRepository(MissionIncome)
  const result = await repo.delete({ id })

  if (result.affected === 0) {
    return res.status(404).json({ message: "Entrada não encontrada" })
  }

  return res.status(204).send()
}
