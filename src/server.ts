import express, { Request, Response } from "express"
import cors, { CorsOptions } from "cors"
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

  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",")
    .map(s => s.trim())
    .filter(Boolean) || ["http://localhost:3000", "http://localhost:5173"]

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      // Permite requests sem Origin (Postman, health-check, etc)
      if (!origin) return callback(null, true)

      // Em produção, exige ALLOWED_ORIGINS
      if (
        process.env.NODE_ENV === "production" &&
        !process.env.ALLOWED_ORIGINS
      ) {
        return callback(
          new Error("CORS bloqueado: ALLOWED_ORIGINS não definido"),
          false
        )
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error(`CORS bloqueado: ${origin}`), false)
    },
    credentials: true,
  }

  app.use(cors(corsOptions))
  app.use(helmet())
  app.use(express.json({ limit: "1mb" }))
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"))

  // Health check (Render / monitoramento)
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true })
  })

  app.use("/api", routes)

  const port = Number(process.env.PORT) || 3333
  const host = "0.0.0.0"

  app.listen(port, host, () => {
    console.log(`API rodando na porta ${port} ✅`)
  })
}

bootstrap().catch((error: unknown) => {
  console.error("Erro ao subir API:", error)
  process.exit(1)
})
