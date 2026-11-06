PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_assignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL,
	`description` text,
	`dueDate` integer,
	`parentTaskId` integer,
	CONSTRAINT `fk_assignments_parentTaskId_assignments_id_fk` FOREIGN KEY (`parentTaskId`) REFERENCES `assignments`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
INSERT INTO `__new_assignments`(`id`, `title`, `description`, `dueDate`, `parentTaskId`) SELECT `id`, `title`, `description`, `dueDate`, `parentTaskId` FROM `assignments`;--> statement-breakpoint
DROP TABLE `assignments`;--> statement-breakpoint
ALTER TABLE `__new_assignments` RENAME TO `assignments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;