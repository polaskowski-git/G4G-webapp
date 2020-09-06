import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1592498233722 implements MigrationInterface {
    name = 'Init1592498233722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `levels` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `title` varchar(64) NOT NULL, `lowXpTreshold` int NOT NULL, `highXpTreshold` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `weapons` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `model` varchar(255) NOT NULL, `magazineSize` int NOT NULL, `caliberSize` decimal(10,2) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `shots` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `coordinates_x` int NOT NULL, `coordinates_y` int NOT NULL, `points` int NOT NULL, `round_id` int UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `rounds` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `points` int NOT NULL, `accuracy` decimal(10,4) NOT NULL, `precision` decimal(10,4) NOT NULL, `overallScore` int NOT NULL, `training_id` int UNSIGNED NULL, `weapon_id` int UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `trainings` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `startDateTime` datetime NOT NULL, `endDateTime` datetime NULL, `earnedXp` int NOT NULL, `user_id` int UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `username` varchar(64) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(64) NOT NULL, `avatar` varchar(255) NULL, `streak` int NOT NULL, `xpPoints` int NOT NULL, `level_id` int UNSIGNED NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `achievements` (`id` int UNSIGNED NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `icon` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users_achievements` (`usersId` int UNSIGNED NOT NULL, `achievementsId` int UNSIGNED NOT NULL, INDEX `IDX_81957c31576d4f197cd0ba1a2f` (`usersId`), INDEX `IDX_8e1deb8be9261f2b186ecdd9e9` (`achievementsId`), PRIMARY KEY (`usersId`, `achievementsId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `shots` ADD CONSTRAINT `FK_119f235d6072734eaa7d0908e89` FOREIGN KEY (`round_id`) REFERENCES `rounds`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `rounds` ADD CONSTRAINT `FK_202d0fa44c6b1643f42300e89a8` FOREIGN KEY (`training_id`) REFERENCES `trainings`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `rounds` ADD CONSTRAINT `FK_ad05880b9d33ab94a0e43d44496` FOREIGN KEY (`weapon_id`) REFERENCES `weapons`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `trainings` ADD CONSTRAINT `FK_0a6488e45e7e8ed7d5f69e0dead` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users` ADD CONSTRAINT `FK_08f642b752f63f945086eccbc8d` FOREIGN KEY (`level_id`) REFERENCES `levels`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users_achievements` ADD CONSTRAINT `FK_81957c31576d4f197cd0ba1a2f0` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users_achievements` ADD CONSTRAINT `FK_8e1deb8be9261f2b186ecdd9e9a` FOREIGN KEY (`achievementsId`) REFERENCES `achievements`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users_achievements` DROP FOREIGN KEY `FK_8e1deb8be9261f2b186ecdd9e9a`");
        await queryRunner.query("ALTER TABLE `users_achievements` DROP FOREIGN KEY `FK_81957c31576d4f197cd0ba1a2f0`");
        await queryRunner.query("ALTER TABLE `users` DROP FOREIGN KEY `FK_08f642b752f63f945086eccbc8d`");
        await queryRunner.query("ALTER TABLE `trainings` DROP FOREIGN KEY `FK_0a6488e45e7e8ed7d5f69e0dead`");
        await queryRunner.query("ALTER TABLE `rounds` DROP FOREIGN KEY `FK_ad05880b9d33ab94a0e43d44496`");
        await queryRunner.query("ALTER TABLE `rounds` DROP FOREIGN KEY `FK_202d0fa44c6b1643f42300e89a8`");
        await queryRunner.query("ALTER TABLE `shots` DROP FOREIGN KEY `FK_119f235d6072734eaa7d0908e89`");
        await queryRunner.query("DROP INDEX `IDX_8e1deb8be9261f2b186ecdd9e9` ON `users_achievements`");
        await queryRunner.query("DROP INDEX `IDX_81957c31576d4f197cd0ba1a2f` ON `users_achievements`");
        await queryRunner.query("DROP TABLE `users_achievements`");
        await queryRunner.query("DROP TABLE `achievements`");
        await queryRunner.query("DROP TABLE `users`");
        await queryRunner.query("DROP TABLE `trainings`");
        await queryRunner.query("DROP TABLE `rounds`");
        await queryRunner.query("DROP TABLE `shots`");
        await queryRunner.query("DROP TABLE `weapons`");
        await queryRunner.query("DROP TABLE `levels`");
    }

}
