import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const taskStatuses = ["Todo", "In-Progress", "Complete"] as const;
export type TaskStatus = (typeof taskStatuses)[number];

export const tasks = sqliteTable(
  "tasks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    dueDate: text("due_date").notNull(),
    topic: text("topic").notNull(),
    status: text("status", { enum: taskStatuses }).notNull().default("Todo"),
    archivedAt: text("archived_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("tasks_active_due_date_idx").on(table.archivedAt, table.dueDate),
    index("tasks_topic_idx").on(table.topic),
    index("tasks_status_idx").on(table.status),
    check(
      "tasks_status_allowed",
      sql`${table.status} in ('Todo', 'In-Progress', 'Complete')`,
    ),
    check("tasks_title_not_blank", sql`length(trim(${table.title})) > 0`),
    check("tasks_topic_not_blank", sql`length(trim(${table.topic})) > 0`),
    check("tasks_due_date_iso", sql`date(${table.dueDate}) is not null`),
  ],
);

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
