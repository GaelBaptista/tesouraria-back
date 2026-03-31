import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity("settings")
export class Settings {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ type: "numeric", precision: 14, scale: 2, default: 2000 })
  missionTarget!: string

  @Column({ type: "jsonb", nullable: true })
  missionProjects?: { name: string; value: number }[]

  @Column({ type: "uuid" })
  userId!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
