import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateComplaintTable1647649200000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'complaint',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'complaintType',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'priority',
            type: 'int',
            isNullable: true, 
          },
          {
            name: 'date',
            type: 'varchar',
          },
          {
            name: 'time',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'varchar',
            default: `'Upcoming'`, 
          },
          {
            name: 'complaint_userId',
            type: 'varchar',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('complaint');
  }
}
