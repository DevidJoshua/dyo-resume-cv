-- AlterTable
-- Expand JSON payload columns to TEXT so seed/admin content payloads don't
-- overflow the legacy 191-character VARCHAR limit.

ALTER TABLE `homepage_configurations` MODIFY `configuration_json` TEXT NOT NULL;

ALTER TABLE `page_contents` MODIFY `content_json` TEXT NOT NULL;