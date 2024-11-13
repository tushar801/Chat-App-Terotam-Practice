import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateComplaintHistoryTable1647649200001 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'complaint_history',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'complaintId',
            type: 'int',
          },
          {
            name: 'title',
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

    await queryRunner.createForeignKey(
      'complaint_history',
      new TableForeignKey({
        columnNames: ['complaintId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'complaint',
        onDelete: 'CASCADE', 
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('complaint_history', 'complaintId');
    await queryRunner.dropTable('complaint_history');
  }
}
