import type { MigrationInterface, QueryRunner } from "typeorm"

export class AddMissionIncomes1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS mission_incomes (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        source varchar(80) NOT NULL,
        value numeric(14,2) NOT NULL,
        date date NOT NULL,
        description varchar(200) NULL,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS mission_incomes`)
  }
}
