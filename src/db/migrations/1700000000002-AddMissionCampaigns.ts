import type { MigrationInterface, QueryRunner } from "typeorm"

export class AddMissionCampaigns1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela mission_campaigns
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS mission_campaigns (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name varchar(120) NOT NULL,
        target numeric(14,2) NOT NULL,
        "startDate" timestamp NOT NULL,
        "endDate" timestamp NULL,
        status varchar(20) NOT NULL DEFAULT 'active',
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )
    `)

    // Criar índice em status
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_mission_campaigns_status ON mission_campaigns(status)
    `)

    // Adicionar coluna campaignId em mission_incomes
    await queryRunner.query(`
      ALTER TABLE mission_incomes ADD COLUMN "campaignId" uuid
    `)

    // Adicionar constraint FK
    await queryRunner.query(`
      ALTER TABLE mission_incomes 
      ADD CONSTRAINT fk_mission_incomes_campaign_id 
      FOREIGN KEY ("campaignId") REFERENCES mission_campaigns(id) ON DELETE CASCADE
    `)

    // Criar índices em mission_incomes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_mission_incomes_campaign_id ON mission_incomes("campaignId")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_mission_incomes_campaign_id`)
    await queryRunner.query(`ALTER TABLE mission_incomes DROP CONSTRAINT fk_mission_incomes_campaign_id`)
    await queryRunner.query(`ALTER TABLE mission_incomes DROP COLUMN "campaignId"`)
    await queryRunner.query(`DROP INDEX IF EXISTS idx_mission_campaigns_status`)
    await queryRunner.query(`DROP TABLE IF EXISTS mission_campaigns`)
  }
}
