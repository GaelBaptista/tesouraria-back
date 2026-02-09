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
const hasDbUrl = !!process.env.DATABASE_URL

export const AppDataSource = new DataSource({
  type: "postgres",

  ...(hasDbUrl
    ? {
        url: process.env.DATABASE_URL,
        ssl: isProd ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 5432),
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASS || "postgres",
        database: process.env.DB_NAME || "tesouraria",
        ssl: false,
      }),

  synchronize: false,
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

  migrations: isProd
    ? ["dist/db/migrations/*.{js,cjs}"]
    : ["src/db/migrations/*.{ts,js}"],
})
