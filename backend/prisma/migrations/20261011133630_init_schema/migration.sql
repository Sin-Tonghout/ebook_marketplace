/*
  Warnings:

  - You are about to drop the column `details` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `socialLinks` on the `authors` table. All the data in the column will be lost.
  - Made the column `targetLabel` on table `audit_logs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `audit_logs` DROP COLUMN `details`,
    ADD COLUMN `detail` TEXT NULL,
    MODIFY `targetLabel` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `authors` DROP COLUMN `socialLinks`,
    ADD COLUMN `instagram` VARCHAR(255) NULL,
    ADD COLUMN `x` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `books` ADD COLUMN `downloads` INTEGER NOT NULL DEFAULT 0;
