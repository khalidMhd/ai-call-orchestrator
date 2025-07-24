import { MigrationInterface, QueryRunner } from "typeorm";

export class CallInit1753272641838 implements MigrationInterface {
    name = 'CallInit1753272641838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "call" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "payload" jsonb NOT NULL, "status" character varying NOT NULL, "attempts" integer NOT NULL DEFAULT '0', "lastError" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "startedAt" TIMESTAMP, "endedAt" TIMESTAMP, CONSTRAINT "PK_2098af0169792a34f9cfdd39c47" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "call"`);
    }

}
