-- CreateTable
CREATE TABLE `Calendar` (
    `id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Calendar_date_key`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `taskTitle` VARCHAR(191) NOT NULL,
    `taskDetail` VARCHAR(191) NULL,
    `taskImageUrl` TEXT NULL,
    `period` DATETIME(3) NOT NULL,
    `participationCreatedUserId` VARCHAR(191) NOT NULL,
    `participationCreatedGroupId` INTEGER NOT NULL,
    `participationAssigneeUserId` VARCHAR(191) NULL,
    `participationAssigneeGroupId` INTEGER NULL,
    `calendarId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_participationCreatedUserId_participationCreatedGroupId_fkey` FOREIGN KEY (`participationCreatedUserId`, `participationCreatedGroupId`) REFERENCES `Participation`(`userId`, `groupId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_participationAssigneeUserId_participationAssigneeGroup_fkey` FOREIGN KEY (`participationAssigneeUserId`, `participationAssigneeGroupId`) REFERENCES `Participation`(`userId`, `groupId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_calendarId_fkey` FOREIGN KEY (`calendarId`) REFERENCES `Calendar`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
