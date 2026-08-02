import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createDatabaseClient } from "../db/client";
import {
  archiveTask,
  createTask,
  getTaskById,
  listActiveTasks,
  listArchivedTasks,
  updateTask,
} from "./service";

const migrationSql = readFileSync(
  new URL("../../drizzle/0000_black_black_crow.sql", import.meta.url),
  "utf8",
);

let sqlite: Database.Database;
let db: ReturnType<typeof createDatabaseClient>;

beforeEach(() => {
  sqlite = new Database(":memory:");

  for (const statement of migrationSql.split("--> statement-breakpoint")) {
    if (statement.trim()) {
      sqlite.exec(statement);
    }
  }

  db = createDatabaseClient(sqlite);
});

afterEach(() => {
  sqlite.close();
});

describe("task service", () => {
  it("creates active tasks with all required fields", () => {
    const task = createTask(
      {
        title: "Write lab report",
        description: "Document schema and setup",
        dueDate: "2026-08-04",
        topic: "Documentation",
      },
      db,
    );

    const activeTasks = listActiveTasks({}, db);

    expect(activeTasks).toHaveLength(1);
    expect(activeTasks[0]).toMatchObject({
      id: task.id,
      title: "Write lab report",
      description: "Document schema and setup",
      dueDate: "2026-08-04",
      topic: "Documentation",
      status: "Todo",
      archivedAt: null,
    });
  });

  it("edits an existing task and persists the changed fields", () => {
    const task = createTask(
      {
        title: "Initial title",
        description: "Initial description",
        dueDate: "2026-08-04",
        topic: "Planning",
        status: "Todo",
      },
      db,
    );

    updateTask(
      task.id,
      {
        title: "Updated title",
        description: "Updated description",
        dueDate: "2026-08-05",
        topic: "Implementation",
        status: "In-Progress",
      },
      db,
    );

    expect(getTaskById(task.id, db)).toMatchObject({
      title: "Updated title",
      description: "Updated description",
      dueDate: "2026-08-05",
      topic: "Implementation",
      status: "In-Progress",
    });
  });

  it("archives tasks without deleting them", () => {
    const task = createTask(
      {
        title: "Archive me",
        description: "Keep this visible later",
        dueDate: "2026-08-04",
        topic: "Workflow",
        status: "Todo",
      },
      db,
    );

    const archived = archiveTask(task.id, db);

    expect(archived.archivedAt).toEqual(expect.any(String));
    expect(listActiveTasks({}, db)).toHaveLength(0);
    expect(listArchivedTasks({}, db)).toHaveLength(1);
    expect(listArchivedTasks({}, db)[0]).toMatchObject({
      id: task.id,
      title: "Archive me",
    });
  });

  it("derives overdue from due date and status", () => {
    createTask(
      {
        title: "Past todo",
        description: "",
        dueDate: "2026-07-29",
        topic: "Dates",
        status: "Todo",
      },
      db,
    );
    createTask(
      {
        title: "Past complete",
        description: "",
        dueDate: "2026-07-29",
        topic: "Dates",
        status: "Complete",
      },
      db,
    );

    const tasks = listActiveTasks({ now: new Date("2026-07-30T10:00:00") }, db);

    expect(tasks.find((task) => task.title === "Past todo")?.isOverdue).toBe(
      true,
    );
    expect(tasks.find((task) => task.title === "Past complete")?.isOverdue).toBe(
      false,
    );
  });

  it("sorts active tasks by topic, status, and due date", () => {
    createTask(
      {
        title: "Third",
        description: "",
        dueDate: "2026-08-03",
        topic: "Zulu",
        status: "Complete",
      },
      db,
    );
    createTask(
      {
        title: "First",
        description: "",
        dueDate: "2026-08-01",
        topic: "Alpha",
        status: "Todo",
      },
      db,
    );
    createTask(
      {
        title: "Second",
        description: "",
        dueDate: "2026-08-02",
        topic: "Middle",
        status: "In-Progress",
      },
      db,
    );

    expect(
      listActiveTasks({ sortBy: "topic" }, db).map((task) => task.title),
    ).toEqual(["First", "Second", "Third"]);
    expect(
      listActiveTasks({ sortBy: "status" }, db).map((task) => task.title),
    ).toEqual(["First", "Second", "Third"]);
    expect(
      listActiveTasks({ sortBy: "dueDate" }, db).map((task) => task.title),
    ).toEqual(["First", "Second", "Third"]);
  });
});
