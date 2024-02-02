import { MigrationInterface, QueryRunner } from "typeorm";

export class TestMigration21706896799619 implements MigrationInterface {
    name = 'TestMigration21706896799619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`avatar\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`passwordChangedAt\` datetime NOT NULL, \`passwordResetToken\` varchar(255) NOT NULL, \`passwordResetExpires\` datetime NOT NULL, \`createAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
