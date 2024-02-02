import { MigrationInterface, QueryRunner } from "typeorm";

export class Testmigration1706896031697 implements MigrationInterface {
    name = 'Testmigration1706896031697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`video\` (\`id\` int NOT NULL AUTO_INCREMENT, \`idUser\` varchar(255) NOT NULL, \`thumbnailUrl\` varchar(255) NOT NULL, \`videoUrl\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`createAt\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`avatar\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`passwordChangedAt\` datetime NOT NULL, \`passwordResetToken\` varchar(255) NOT NULL, \`passwordResetExpires\` datetime NOT NULL, \`createAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`video\``);
    }

}
