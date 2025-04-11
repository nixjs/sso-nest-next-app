import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1744332571519 implements MigrationInterface {
    name = 'SchemaUpdate1744332571519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "walletAddress" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "walletAddress"`);
    }

}
