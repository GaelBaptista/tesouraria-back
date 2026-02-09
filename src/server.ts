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

  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",")
    .map(s => s.trim())
    .filter(Boolean) || ["http://localhost:3000", "http://localhost:5173"]

  app.use(
    cors({
      origin: (origin, callback) => {
        // Permite requests sem Origin (ex: Postman, health-checks)
        if (!origin) return callback(null, true)

        // Se ALLOWED_ORIGINS não estiver setado em produção, bloqueia por segurança
        if (
          process.env.NODE_ENV === "production" &&
          !process.env.ALLOWED_ORIGINS
        ) {
          return callback(
            new Error("CORS bloqueado: ALLOWED_ORIGINS não definido"),
            false
          )
        }

        if (allowedOrigins.includes(origin)) return callback(null, true)
        return callback(new Error(`CORS bloqueado: ${origin}`), false)
      },
      credentials: true,
    })
  )

  app.use(helmet())
  app.use(express.json({ limit: "1mb" }))
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"))

  // Health check pro Render (opcional, mas recomendo)
  app.get("/health", (_req, res) => res.status(200).json({ ok: true }))

  app.use("/api", routes)

  const port = Number(process.env.PORT) || 3333
  const host = process.env.HOST || "0.0.0.0"

  app.listen(port, host, () => {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://SEU-SERVICO.onrender.com"
        : `http://localhost:${port}`

    console.log(`API rodando em ${baseUrl}/api ✅`)
  })
}

bootstrap().catch(e => {
  console.error("Erro ao subir API:", e)
  process.exit(1)
})
