/*
  Warnings:

  - Made the column `chordUrl` on table `Song` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Song` MODIFY `chordUrl` VARCHAR(191) NOT NULL;
