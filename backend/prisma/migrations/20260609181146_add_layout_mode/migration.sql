-- AlterTable
ALTER TABLE `site_settings` ADD COLUMN `layout_mode` VARCHAR(191) NOT NULL DEFAULT 'single';

-- AlterTable
ALTER TABLE `users` MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'admin';
