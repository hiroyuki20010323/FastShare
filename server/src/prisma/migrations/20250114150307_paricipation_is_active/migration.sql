/*
  Warnings:

  - A unique constraint covering the columns `[userId,groupId]` on the table `Participation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Participation` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `Participation_userId_groupId_key` ON `Participation`(`userId`, `groupId`);
