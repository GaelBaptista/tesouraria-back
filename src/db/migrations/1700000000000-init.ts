import type { MigrationInterface, QueryRunner } from "typeorm"

export class Init1700000000000 implements MigrationInterface {
  name = "Init1700000000000"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name varchar(120) NOT NULL,
        username varchar(60) UNIQUE NOT NULL,
        email varchar NULL,
        "passwordHash" varchar NOT NULL,
        role varchar NOT NULL DEFAULT 'TREASURER',
        "churchName" varchar NULL,
        "pastorName" varchar NULL,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name varchar(120) NOT NULL,
        "bankName" varchar NULL,
        type varchar(40) NOT NULL DEFAULT 'Conta Corrente',
        "initialBalance" numeric(14,2) NOT NULL DEFAULT 0,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        type varchar NOT NULL,
        value numeric(14,2) NOT NULL,
        date date NOT NULL,
        description varchar(200) NOT NULL,
        category varchar(80) NOT NULL,
        "accountId" uuid NOT NULL,
        "toAccountId" uuid NULL,
        "isRecurring" boolean NOT NULL DEFAULT false,
        "userId" uuid NOT NULL,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS bills (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        description varchar(160) NOT NULL,
        value numeric(14,2) NOT NULL,
        "dueDate" int NOT NULL,
        category varchar(80) NOT NULL,
        "isRecurring" boolean NOT NULL DEFAULT true,
        status varchar NOT NULL DEFAULT 'Pendente',
        "lastPaymentDate" varchar NULL,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "missionTarget" numeric(14,2) NOT NULL DEFAULT 2000,
        "missionProjects" jsonb NULL,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS settings`)
    await queryRunner.query(`DROP TABLE IF EXISTS bills`)
    await queryRunner.query(`DROP TABLE IF EXISTS transactions`)
    await queryRunner.query(`DROP TABLE IF EXISTS accounts`)
    await queryRunner.query(`DROP TABLE IF EXISTS users`)
  }
}

