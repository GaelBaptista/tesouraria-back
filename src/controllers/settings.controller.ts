import type { Request, Response } from "express"
import { AppDataSource } from "../db/data-source"
import { Settings } from "../entities/Settings"

async function getOrCreateSettings() {
  const repo = AppDataSource.getRepository(Settings)
  let s = await repo.findOne({ where: {} as any })
  if (!s) {
    s = repo.create({ missionTarget: "2000", missionProjects: [] })
    s = await repo.save(s)
  }
  return s
}

export async function getSettings(req: Request, res: Response) {
  const s = await getOrCreateSettings()
  return res.json({
    ...s,
    missionTarget: Number(s.missionTarget),
  })
}

export async function patchSettings(req: Request, res: Response) {
  const repo = AppDataSource.getRepository(Settings)
  const s = await getOrCreateSettings()

  const { missionTarget, missionProjects } = req.body

  const updated = repo.merge(s, {
    missionTarget:
      missionTarget !== undefined
        ? String(Number(missionTarget))
        : s.missionTarget,
    missionProjects:
      missionProjects !== undefined ? missionProjects : s.missionProjects,
  })

  const saved = await repo.save(updated)
  return res.json({ ...saved, missionTarget: Number(saved.missionTarget) })
}

