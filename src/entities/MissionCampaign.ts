import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm"
import { MissionIncome } from "./MissionIncome"

export enum CampaignStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
}

@Entity("mission_campaigns")
export class MissionCampaign {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ type: "varchar", length: 120 })
  name!: string

  @Column({ type: "numeric", precision: 14, scale: 2 })
  target!: string

  @Column({ type: "timestamp" })
  startDate!: Date

  @Column({ type: "timestamp", nullable: true })
  endDate: Date | null = null

  @Column({
    type: "varchar",
    length: 20,
    default: CampaignStatus.ACTIVE,
  })
  status!: CampaignStatus

  @Column({ type: "uuid" })
  userId!: string

  @OneToMany(() => MissionIncome, income => income.campaign, {
    cascade: true,
  })
  incomes!: MissionIncome[]

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
