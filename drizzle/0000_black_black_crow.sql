CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`due_date` text NOT NULL,
	`topic` text NOT NULL,
	`status` text DEFAULT 'Todo' NOT NULL,
	`archived_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "tasks_status_allowed" CHECK("tasks"."status" in ('Todo', 'In-Progress', 'Complete')),
	CONSTRAINT "tasks_title_not_blank" CHECK(length(trim("tasks"."title")) > 0),
	CONSTRAINT "tasks_topic_not_blank" CHECK(length(trim("tasks"."topic")) > 0),
	CONSTRAINT "tasks_due_date_iso" CHECK(date("tasks"."due_date") is not null)
);
--> statement-breakpoint
CREATE INDEX `tasks_active_due_date_idx` ON `tasks` (`archived_at`,`due_date`);--> statement-breakpoint
CREATE INDEX `tasks_topic_idx` ON `tasks` (`topic`);--> statement-breakpoint
CREATE INDEX `tasks_status_idx` ON `tasks` (`status`);