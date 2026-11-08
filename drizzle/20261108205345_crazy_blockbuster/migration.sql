CREATE TABLE `reminders` (
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
ALTER TABLE `assignments` DROP COLUMN `complete`;