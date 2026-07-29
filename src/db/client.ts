import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { dirname, resolve } from "node:path";
import { mkdirSync } from "node:fs";
import * as schema from "./schema";

export const DEFAULT_DATABASE_PATH = "./data/todo.db";
export type AppDatabase = ReturnType<typeof createDatabaseClient>;

let defaultSqlite: Database.Database | undefined;
let defaultDb: AppDatabase | undefined;

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

export function getDefaultDatabaseClient() {
  if (!defaultSqlite || !defaultDb) {
    defaultSqlite = openSqliteDatabase();
    defaultDb = createDatabaseClient(defaultSqlite);
  }

  return defaultDb;
}

export function closeDefaultDatabaseClient() {
  defaultSqlite?.close();
  defaultSqlite = undefined;
  defaultDb = undefined;
}
