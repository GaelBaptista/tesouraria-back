import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm"
import { MissionCampaign } from "./MissionCampaign"

export enum MissionIncomeSource {
  OFFERINGS = "Ofertas",
  CANTEEN = "Cantina",
  BAZAAR = "Bazzar",
  OTHER = "Outro",
}

@Entity("mission_incomes")
@Index("idx_mission_incomes_campaign_id", ["campaignId"])
@Index("idx_mission_incomes_source", ["source"])
@Index("idx_mission_incomes_date", ["date"])
export class MissionIncome {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ type: "uuid" })
  campaignId!: string

  @ManyToOne(() => MissionCampaign, campaign => campaign.incomes, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "campaignId" })
  campaign!: MissionCampaign

  @Column({ type: "varchar", length: 80 })
  source!: MissionIncomeSource

  @Column({ type: "numeric", precision: 14, scale: 2 })
  value!: string

  @Column({ type: "date" })
  date!: string

  @Column({ type: "varchar", length: 200, nullable: true })
  description!: string | null

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
