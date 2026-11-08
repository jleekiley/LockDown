ALTER TABLE `reminders` ADD `id` integer;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_reminders` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`month` integer NOT NULL,
	`date` integer NOT NULL,
	`weekday` integer NOT NULL,
	`hour` integer NOT NULL,
	`min` integer NOT NULL,
	`repeating` integer DEFAULT false NOT NULL,
	`repeatList` text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_reminders`(`name`, `month`, `date`, `weekday`, `hour`, `min`, `repeating`, `repeatList`) SELECT `name`, `month`, `date`, `weekday`, `hour`, `min`, `repeating`, `repeatList` FROM `reminders`;--> statement-breakpoint
DROP TABLE `reminders`;--> statement-breakpoint
ALTER TABLE `__new_reminders` RENAME TO `reminders`;--> statement-breakpoint
PRAGMA foreign_keys=ON;