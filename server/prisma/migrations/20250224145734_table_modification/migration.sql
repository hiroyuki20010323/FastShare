/*
  Warnings:

  - You are about to drop the column `participationAssigneeGroupId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `participationAssigneeUserId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `participationCreatedGroupId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `participationCreatedUserId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `requestor_id` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- 下記は、デフォルトの記述、本番のdbに適応ができれば削除して良い

-- -- DropForeignKey
-- ALTER TABLE `Task` DROP FOREIGN KEY `Task_participationAssigneeUserId_participationAssigneeGroup_fkey`;

-- -- DropForeignKey
-- ALTER TABLE `Task` DROP FOREIGN KEY `Task_participationCreatedUserId_participationCreatedGroupId_fkey`;

-- -- AlterTable
-- ALTER TABLE `Task` DROP COLUMN `participationAssigneeGroupId`,
--     DROP COLUMN `participationAssigneeUserId`,
--     DROP COLUMN `participationCreatedGroupId`,
--     DROP COLUMN `participationCreatedUserId`,
--     ADD COLUMN `contractor_id` VARCHAR(191) NULL,
--     ADD COLUMN `requestor_id` VARCHAR(191) NOT NULL;



-- Taskテーブルごと削除
DROP TABLE IF EXISTS `Task`;


CREATE TABLE `Task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `taskTitle` VARCHAR(191) NOT NULL,
    `taskDetail` VARCHAR(191) NULL,
    `taskImageUrl` TEXT NULL,
    `period` DATETIME(3) NOT NULL,
    `contractor_id` VARCHAR(191) NULL,
    `requestor_id` VARCHAR(191) NOT NULL,
    `calendarId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,


    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- CreateTable
CREATE TABLE `Contractors` (
    `id` VARCHAR(191) NOT NULL,
    `participation_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Requestors` (
    `id` VARCHAR(191) NOT NULL,
    `participation_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Contractors` ADD CONSTRAINT `Contractors_participation_id_fkey` FOREIGN KEY (`participation_id`) REFERENCES `Participation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Requestors` ADD CONSTRAINT `Requestors_participation_id_fkey` FOREIGN KEY (`participation_id`) REFERENCES `Participation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_contractor_id_fkey` FOREIGN KEY (`contractor_id`) REFERENCES `Contractors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_requestor_id_fkey` FOREIGN KEY (`requestor_id`) REFERENCES `Requestors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE `Task` ADD CONSTRAINT `Task_calendarId_fkey` FOREIGN KEY (`calendarId`) REFERENCES `Calendar`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;