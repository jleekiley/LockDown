ALTER TABLE `reminders` ADD `time` integer;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_reminders` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`date` integer,
	`weekday` integer NOT NULL,
	`time` integer,
	`repeating` integer DEFAULT false NOT NULL,
	`repeatList` text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_reminders`(`id`, `name`, `date`, `weekday`, `repeating`, `repeatList`) SELECT `id`, `name`, `date`, `weekday`, `repeating`, `repeatList` FROM `reminders`;--> statement-breakpoint
DROP TABLE `reminders`;--> statement-breakpoint
ALTER TABLE `__new_reminders` RENAME TO `reminders`;--> statement-breakpoint
PRAGMA foreign_keys=ON;