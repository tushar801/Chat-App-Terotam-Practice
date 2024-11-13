import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1728182901030 implements MigrationInterface {
    name = 'Migrations1728182901030'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO "user"(name, email, mobile, "uniqueId", password) VALUES ('Shyamlaal', 'shyamlaal@gmail.com', '537497988449', 'SH0004', 'passwordshyams')`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "user" WHERE "uniqueId" = 'TUS0001'`
        );
    }
}
