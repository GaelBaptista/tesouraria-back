import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"
import { AppDataSource } from "./db/data-source"
import { routes } from "./routes/index"

dotenv.config()

async function bootstrap() {
  await AppDataSource.initialize()
  console.log("DB conectado ✅")

  const app = express()

  app.use(
    cors({
      origin: process.env.ALLOWED_ORIGINS?.split(",") || [
        "http://localhost:3000",
        "http://localhost:5173",
      ],
      credentials: true,
    })
  )
  app.use(helmet())
  app.use(express.json({ limit: "1mb" }))
  app.use(morgan("dev"))

  app.use("/api", routes)

  const port = Number(process.env.PORT || 3333)
  app.listen(port, () =>
    console.log(`API rodando em http://localhost:${port}/api ✅`)
  )
}

bootstrap().catch(e => {
  console.error("Erro ao subir API:", e)
  process.exit(1)
})
