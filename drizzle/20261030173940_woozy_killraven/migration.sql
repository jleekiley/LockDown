CREATE TABLE `assignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL,
	`description` text,
	`dueDate` text,
	`parentTaskId` integer,
	CONSTRAINT `fk_assignments_parentTaskId_assignments_id_fk` FOREIGN KEY (`parentTaskId`) REFERENCES `assignments`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
ALTER TABLE `goals` ADD `complete` integer DEFAULT false NOT NULL;