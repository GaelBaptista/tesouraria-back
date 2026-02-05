import { AppDataSource } from "./data-source"

async function run() {
  await AppDataSource.initialize()
  await AppDataSource.runMigrations()
  console.log("Migrations OK ✅")
  await AppDataSource.destroy()
}

run().catch(e => {
  console.error(e)
  process.exit(1)
})
