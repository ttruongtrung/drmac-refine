import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddThumbnailFieldToProductMedia1704067201000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'product_media',
      new TableColumn({
        name: 'isThumbnail',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('product_media', 'isThumbnail');
  }
}
