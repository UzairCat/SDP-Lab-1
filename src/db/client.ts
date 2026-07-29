import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { dirname, resolve } from "node:path";
import { mkdirSync } from "node:fs";
import * as schema from "./schema";

export const DEFAULT_DATABASE_PATH = "./data/todo.db";

export function getDatabasePath() {
  return process.env.DATABASE_PATH ?? DEFAULT_DATABASE_PATH;
}

export function openSqliteDatabase(databasePath = getDatabasePath()) {
  if (databasePath !== ":memory:") {
    mkdirSync(dirname(resolve(databasePath)), { recursive: true });
  }

  return new Database(databasePath);
}

export function createDatabaseClient(sqlite = openSqliteDatabase()) {
  return drizzle(sqlite, { schema });
}

export const sqlite = openSqliteDatabase();
export const db = createDatabaseClient(sqlite);
