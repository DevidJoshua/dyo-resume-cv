-- AlterTable
ALTER TABLE `site_settings` ADD COLUMN `enable_pages` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `show_skill_proficiency` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `layout_mode` VARCHAR(191) NOT NULL DEFAULT 'single';

-- AlterTable
ALTER TABLE `users` MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'admin';
