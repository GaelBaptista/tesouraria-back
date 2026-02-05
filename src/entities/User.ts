import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

enum UserRole {
  ADMIN = "ADMIN",
  TREASURER = "TREASURER",
  VIEWER = "VIEWER",
}

@Entity("users")
class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ length: 120 })
  name!: string

  @Column({ unique: true, length: 60 })
  username!: string

  @Column({ nullable: true })
  email?: string

  @Column()
  passwordHash!: string

  @Column({ type: "enum", enum: UserRole, default: UserRole.TREASURER })
  role!: UserRole

  @Column({ nullable: true })
  churchName?: string

  @Column({ nullable: true })
  pastorName?: string

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date
}

export { User, UserRole }

