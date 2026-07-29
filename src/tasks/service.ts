import { asc, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { getDefaultDatabaseClient } from "../db/client";
import {
  type NewTask,
  type Task,
  type TaskStatus,
  tasks,
  taskStatuses,
} from "../db/schema";

export type TaskSort = "topic" | "status" | "dueDate";
export type TaskListMode = "active" | "archived";

export type TaskView = Task & {
  isOverdue: boolean;
};

export type CreateTaskInput = {
  title: string;
  description: string;
  dueDate: string;
  topic: string;
  status?: TaskStatus;
};

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type ListTasksOptions = {
  mode?: TaskListMode;
  sortBy?: TaskSort;
  sortDirection?: "asc" | "desc";
  now?: Date;
};

export function createTask(
  input: CreateTaskInput,
  database = getDefaultDatabaseClient(),
) {
  const [created] = database
    .insert(tasks)
    .values(normalizeCreateInput(input))
    .returning()
    .all();

  return toTaskView(created);
}

export function updateTask(
  id: number,
  input: UpdateTaskInput,
  database = getDefaultDatabaseClient(),
) {
  assertPositiveId(id);

  const changes = normalizeUpdateInput(input);
  const [updated] = database
    .update(tasks)
    .set({
      ...changes,
      updatedAt: currentTimestamp(),
    })
    .where(eq(tasks.id, id))
    .returning()
    .all();

  if (!updated) {
    throw new Error(`Task ${id} was not found.`);
  }

  return toTaskView(updated);
}

export function archiveTask(id: number, database = getDefaultDatabaseClient()) {
  assertPositiveId(id);

  const timestamp = currentTimestamp();
  const [archived] = database
    .update(tasks)
    .set({
      archivedAt: timestamp,
      updatedAt: timestamp,
    })
    .where(eq(tasks.id, id))
    .returning()
    .all();

  if (!archived) {
    throw new Error(`Task ${id} was not found.`);
  }

  return toTaskView(archived);
}

export function getTaskById(id: number, database = getDefaultDatabaseClient()) {
  assertPositiveId(id);

  const task = database.select().from(tasks).where(eq(tasks.id, id)).get();
  return task ? toTaskView(task) : null;
}

export function listTasks(
  options: ListTasksOptions = {},
  database = getDefaultDatabaseClient(),
) {
  const mode = options.mode ?? "active";
  const sortBy = options.sortBy ?? "dueDate";
  const direction = options.sortDirection ?? "asc";
  const archiveFilter =
    mode === "archived" ? isNotNull(tasks.archivedAt) : isNull(tasks.archivedAt);
  const order = direction === "asc" ? asc : desc;
  const statusOrder = sql<number>`
    case ${tasks.status}
      when 'Todo' then 1
      when 'In-Progress' then 2
      when 'Complete' then 3
    end
  `;

  const query = database.select().from(tasks).where(archiveFilter);
  const rows =
    sortBy === "topic"
      ? query.orderBy(order(tasks.topic), order(tasks.dueDate), asc(tasks.id)).all()
      : sortBy === "status"
        ? query.orderBy(order(statusOrder), order(tasks.dueDate), asc(tasks.id)).all()
        : query.orderBy(order(tasks.dueDate), asc(tasks.id)).all();

  return rows.map((task) => toTaskView(task, options.now));
}

export function listActiveTasks(
  options: Omit<ListTasksOptions, "mode"> = {},
  database = getDefaultDatabaseClient(),
) {
  return listTasks({ ...options, mode: "active" }, database);
}

export function listArchivedTasks(
  options: Omit<ListTasksOptions, "mode"> = {},
  database = getDefaultDatabaseClient(),
) {
  return listTasks({ ...options, mode: "archived" }, database);
}

export function isTaskOverdue(
  task: Pick<Task, "dueDate" | "status">,
  now = new Date(),
) {
  return task.status !== "Complete" && task.dueDate < localDateString(now);
}

function normalizeCreateInput(input: CreateTaskInput): NewTask {
  const status = normalizeStatus(input.status ?? "Todo");

  return {
    title: normalizeRequiredText(input.title, "Title"),
    description: input.description.trim(),
    dueDate: normalizeDueDate(input.dueDate),
    topic: normalizeRequiredText(input.topic, "Topic"),
    status,
  };
}

function normalizeUpdateInput(input: UpdateTaskInput): Partial<NewTask> {
  const changes: Partial<NewTask> = {};

  if (input.title !== undefined) {
    changes.title = normalizeRequiredText(input.title, "Title");
  }

  if (input.description !== undefined) {
    changes.description = input.description.trim();
  }

  if (input.dueDate !== undefined) {
    changes.dueDate = normalizeDueDate(input.dueDate);
  }

  if (input.topic !== undefined) {
    changes.topic = normalizeRequiredText(input.topic, "Topic");
  }

  if (input.status !== undefined) {
    changes.status = normalizeStatus(input.status);
  }

  if (Object.keys(changes).length === 0) {
    throw new Error("At least one task field must be changed.");
  }

  return changes;
}

function normalizeRequiredText(value: string, label: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(`${label} is required.`);
  }

  return trimmed;
}

function normalizeDueDate(value: string) {
  const trimmed = value.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);

  if (!match) {
    throw new Error("Due date must use YYYY-MM-DD format.");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  const isRealCalendarDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  if (!isRealCalendarDate) {
    throw new Error("Due date must be a real calendar date.");
  }

  return trimmed;
}

function normalizeStatus(status: TaskStatus) {
  if (!taskStatuses.includes(status)) {
    throw new Error("Status must be Todo, In-Progress, or Complete.");
  }

  return status;
}

function assertPositiveId(id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Task id must be a positive integer.");
  }
}

function toTaskView(task: Task, now = new Date()): TaskView {
  return {
    ...task,
    isOverdue: isTaskOverdue(task, now),
  };
}

function currentTimestamp() {
  return new Date().toISOString();
}

function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
