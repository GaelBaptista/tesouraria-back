import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

export enum BillStatus {
  PENDING = "Pendente",
  OVERDUE = "Atrasado",
  PAID = "Pago",
}

@Entity("bills")
export class Bill {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ length: 160 })
  description!: string

  @Column({ type: "numeric", precision: 14, scale: 2 })
  value!: string

  @Column({ type: "int" })
  dueDate!: number // dia do mês

  @Column({ length: 80 })
  category!: string

  @Column({ default: true })
  isRecurring!: boolean

  @Column({ type: "enum", enum: BillStatus, default: BillStatus.PENDING })
  status!: BillStatus

  @Column({ nullable: true })
  lastPaymentDate?: string

  @Column({ type: "uuid" })
  userId!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
