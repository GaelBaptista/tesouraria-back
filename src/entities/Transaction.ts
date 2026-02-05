import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  TRANSFER = "TRANSFER",
}

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ type: "enum", enum: TransactionType })
  type!: TransactionType

  @Column({ type: "numeric", precision: 14, scale: 2 })
  value!: string

  @Column({ type: "date" })
  date!: string

  @Column({ length: 200 })
  description!: string

  @Column({ length: 80 })
  category!: string

  @Column()
  accountId!: string

  @Column({ nullable: true })
  toAccountId?: string

  @Column({ default: false })
  isRecurring?: boolean

  @Column()
  userId!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}

