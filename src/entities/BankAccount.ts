import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity("accounts")
export class BankAccount {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ length: 120 })
  name!: string

  @Column({ nullable: true })
  bankName?: string

  @Column({ length: 40, default: "Conta Corrente" })
  type!: string

  @Column({ type: "numeric", precision: 14, scale: 2, default: 0 })
  initialBalance!: string // TypeORM com numeric -> string

  @Column({ type: "uuid" })
  userId!: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}
