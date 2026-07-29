-- AlterTable
-- Convert selected VARCHAR columns to TEXT so admin bio / portfolio descriptions
-- can exceed the legacy 191-character limit without hitting Prisma P2000.

ALTER TABLE `home_settings` MODIFY `about_text` TEXT NULL;

ALTER TABLE `portfolio` MODIFY `short_description` TEXT NULL,
                       MODIFY `full_description`  TEXT NULL;