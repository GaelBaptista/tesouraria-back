import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from "dotenv"
import { User } from "../entities/User"
import { BankAccount } from "../entities/BankAccount"
import { Transaction } from "../entities/Transaction"
import { Bill } from "../entities/Bill"
import { Settings } from "../entities/Settings"
import { MissionCampaign } from "../entities/MissionCampaign"
import { MissionIncome } from "../entities/MissionIncome"

dotenv.config()

const isProd = process.env.NODE_ENV === "production"

export const AppDataSource = new DataSource({
  type: "postgres",

  // ✅ Render: use DATABASE_URL
  // ✅ Local: cai para DB_HOST/DB_PORT/etc
  url: process.env.DATABASE_URL,

  host: process.env.DATABASE_URL
    ? undefined
    : process.env.DB_HOST || "localhost",
  port: process.env.DATABASE_URL
    ? undefined
    : Number(process.env.DB_PORT || 5432),
  username: process.env.DATABASE_URL
    ? undefined
    : process.env.DB_USER || "postgres",
  password: process.env.DATABASE_URL
    ? undefined
    : process.env.DB_PASS || "postgres",
  database: process.env.DATABASE_URL
    ? undefined
    : process.env.DB_NAME || "tesouraria",

  // ✅ SSL no Render (e em clouds em geral)
  ssl: isProd ? { rejectUnauthorized: false } : false,

  synchronize: false, // profissional: usar migration
  logging: false,

  entities: [
    User,
    BankAccount,
    Transaction,
    Bill,
    Settings,
    MissionCampaign,
    MissionIncome,
  ],

  // ✅ migrations: TS no dev, JS no build/prod
  migrations: isProd
    ? ["dist/db/migrations/*.{js,cjs}"]
    : ["src/db/migrations/*.{ts,js}"],
})
