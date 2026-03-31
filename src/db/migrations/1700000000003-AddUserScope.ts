import type { MigrationInterface, QueryRunner } from "typeorm"

export class AddUserScope1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE accounts ADD COLUMN IF NOT EXISTS "userId" uuid`
    )
    await queryRunner.query(
      `ALTER TABLE bills ADD COLUMN IF NOT EXISTS "userId" uuid`
    )
    await queryRunner.query(
      `ALTER TABLE settings ADD COLUMN IF NOT EXISTS "userId" uuid`
    )
    await queryRunner.query(
      `ALTER TABLE mission_campaigns ADD COLUMN IF NOT EXISTS "userId" uuid`
    )
    await queryRunner.query(
      `ALTER TABLE mission_incomes ADD COLUMN IF NOT EXISTS "userId" uuid`
    )

    await queryRunner.query(`
      UPDATE accounts
      SET "userId" = (
        SELECT id FROM users ORDER BY created_at ASC LIMIT 1
      )
      WHERE "userId" IS NULL
    `)

    await queryRunner.query(`
      UPDATE bills
      SET "userId" = (
        SELECT id FROM users ORDER BY created_at ASC LIMIT 1
      )
      WHERE "userId" IS NULL
    `)

    await queryRunner.query(`
      UPDATE settings
      SET "userId" = (
        SELECT id FROM users ORDER BY created_at ASC LIMIT 1
      )
      WHERE "userId" IS NULL
    `)

    await queryRunner.query(`
      UPDATE mission_campaigns
      SET "userId" = (
        SELECT id FROM users ORDER BY created_at ASC LIMIT 1
      )
      WHERE "userId" IS NULL
    `)

    await queryRunner.query(`
      UPDATE mission_incomes mi
      SET "userId" = mc."userId"
      FROM mission_campaigns mc
      WHERE mi."campaignId" = mc.id AND mi."userId" IS NULL
    `)

    await queryRunner.query(`
      UPDATE mission_incomes
      SET "userId" = (
        SELECT id FROM users ORDER BY created_at ASC LIMIT 1
      )
      WHERE "userId" IS NULL
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts("userId")
    `)
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_bills_user_id ON bills("userId")
    `)
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_settings_user_id ON settings("userId")
    `)
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_mission_campaigns_user_id ON mission_campaigns("userId")
    `)
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_mission_incomes_user_id ON mission_incomes("userId")
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'fk_accounts_user_id'
        ) THEN
          ALTER TABLE accounts
          ADD CONSTRAINT fk_accounts_user_id
          FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;
        END IF;
      END
      $$
    `)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'fk_bills_user_id'
        ) THEN
          ALTER TABLE bills
          ADD CONSTRAINT fk_bills_user_id
          FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;
        END IF;
      END
      $$
    `)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'fk_settings_user_id'
        ) THEN
          ALTER TABLE settings
          ADD CONSTRAINT fk_settings_user_id
          FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;
        END IF;
      END
      $$
    `)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'fk_mission_campaigns_user_id'
        ) THEN
          ALTER TABLE mission_campaigns
          ADD CONSTRAINT fk_mission_campaigns_user_id
          FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;
        END IF;
      END
      $$
    `)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'fk_mission_incomes_user_id'
        ) THEN
          ALTER TABLE mission_incomes
          ADD CONSTRAINT fk_mission_incomes_user_id
          FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;
        END IF;
      END
      $$
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE mission_incomes DROP CONSTRAINT IF EXISTS fk_mission_incomes_user_id`
    )
    await queryRunner.query(
      `ALTER TABLE mission_campaigns DROP CONSTRAINT IF EXISTS fk_mission_campaigns_user_id`
    )
    await queryRunner.query(
      `ALTER TABLE settings DROP CONSTRAINT IF EXISTS fk_settings_user_id`
    )
    await queryRunner.query(
      `ALTER TABLE bills DROP CONSTRAINT IF EXISTS fk_bills_user_id`
    )
    await queryRunner.query(
      `ALTER TABLE accounts DROP CONSTRAINT IF EXISTS fk_accounts_user_id`
    )

    await queryRunner.query(`DROP INDEX IF EXISTS idx_mission_incomes_user_id`)
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_mission_campaigns_user_id`
    )
    await queryRunner.query(`DROP INDEX IF EXISTS idx_settings_user_id`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_bills_user_id`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_accounts_user_id`)

    await queryRunner.query(
      `ALTER TABLE mission_incomes DROP COLUMN IF EXISTS "userId"`
    )
    await queryRunner.query(
      `ALTER TABLE mission_campaigns DROP COLUMN IF EXISTS "userId"`
    )
    await queryRunner.query(
      `ALTER TABLE settings DROP COLUMN IF EXISTS "userId"`
    )
    await queryRunner.query(`ALTER TABLE bills DROP COLUMN IF EXISTS "userId"`)
    await queryRunner.query(
      `ALTER TABLE accounts DROP COLUMN IF EXISTS "userId"`
    )
  }
}
