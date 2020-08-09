import {MigrationInterface, QueryRunner} from "typeorm";

export class Auth1595757093879 implements MigrationInterface {
    name = 'Auth1595757093879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `users_tokens` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `token` varchar(127) NOT NULL, `expirationDate` datetime NOT NULL, `user_id` int UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `users_tokens`");
    }

}
