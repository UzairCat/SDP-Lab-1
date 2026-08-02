# COMS3011A Lab 1 Todo

Student Number: 2802191, Name: Uzair Mahomed

A local-first todo application built with Next.js and SQLite for COMS3011A Lab 1.
The app runs locally for a single user and stores tasks in `data/todo.db`.

Repository: <https://github.com/UzairCat/SDP-Lab-1>

## Running It

Required runtime:

- Node.js `v24.15.0`
- npm `11.12.1`

From a clean clone, run:

```bash
npm install
npm run db:migrate
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

If port `3000` is already in use, run:

```bash
npm run dev -- --port 3001
```

Then open:

```text
http://localhost:3001
```

WSL note:

- Prefer running the project from the WSL Linux filesystem rather than a Windows-mounted `/mnt/c/...` path.
- If `npm run dev` prints `next dev` and then exits without showing a local URL, reinstall dependencies:

```bash
rm -rf node_modules .next
npm ci
npm run db:migrate
npm run dev
```

Run the automated tests with:

```bash
npm test
```

Create a production build with:

```bash
npm run build
```

Run a production server after building with:

```bash
npm start
```

Regenerate migrations after schema changes with:

```bash
npm run db:generate
```

Apply migrations with:

```bash
npm run db:migrate
```

## Third-Party Code

- `next`: Provides the App Router, server components, server actions, and local web app runtime.
- `react`: Provides the component model used by the Next.js UI.
- `react-dom`: Renders React components in the browser through Next.js.
- `better-sqlite3`: Provides the local SQLite driver used to persist task data in `data/todo.db`.
- `drizzle-orm`: Provides typed SQLite schema definitions and query builders for task persistence.
- `drizzle-kit`: Generates and applies SQLite migrations from the Drizzle schema.
- `typescript`: Provides static typing for application, database, and test code.
- `vitest`: Runs deterministic automated tests for task behavior.
- `@types/better-sqlite3`: Provides TypeScript types for the SQLite driver.
- `@types/node`: Provides TypeScript types for Node.js APIs used by the database and tests.
- `@types/react`: Provides TypeScript types for React components.
- `@types/react-dom`: Provides TypeScript types for React DOM and form hooks.

## Database Design

The app uses one SQLite database file:

```text
data/todo.db
```

The database has one application table: `tasks`.

Columns:

- `id`: integer primary key with autoincrement.
- `title`: required task title.
- `description`: required text column; empty descriptions are allowed as an empty string.
- `due_date`: required ISO-style date text in `YYYY-MM-DD` form.
- `topic`: required task topic.
- `status`: required task status. Allowed values are exactly `Todo`, `In-Progress`, and `Complete`.
- `archived_at`: nullable timestamp. `NULL` means active; a timestamp means archived.
- `created_at`: required creation timestamp, defaulted by SQLite.
- `updated_at`: required update timestamp, defaulted by SQLite and updated by the service layer.

Constraints and indexes:

- `tasks_status_allowed` prevents any status outside `Todo`, `In-Progress`, and `Complete`.
- `tasks_title_not_blank` prevents blank titles.
- `tasks_topic_not_blank` prevents blank topics.
- `tasks_due_date_iso` checks that SQLite can parse the due date as a date.
- `tasks_active_due_date_idx` supports active/archived filtering and due-date ordering.
- `tasks_topic_idx` supports topic sorting.
- `tasks_status_idx` supports status sorting.

Relationships:

- There are no relationships to other tables. The lab describes a single-user local app, so all task data lives in `tasks`.

Archive and overdue design:

- Tasks are never deleted by the app. Archiving sets `archived_at`; archived tasks remain viewable in the Archived Tasks section.
- Overdue is not stored as a column and is not a status. The app derives `isOverdue` at read time from `due_date` and `status`.
- A task is overdue when its due date is before the current local date and its status is not `Complete`.

Schema source:

- Drizzle schema: `src/db/schema.ts`
- Generated SQLite migration: `drizzle/0000_black_black_crow.sql`

## Testing

The repository contains deterministic Vitest tests in `src/tasks/service.test.ts`.
They run against a throwaway in-memory SQLite database and apply the shipped migration SQL before each test.
They do not use or modify `data/todo.db`.

Covered behavior:

- Creating a task with all required fields.
- Editing a task and reading the persisted changes.
- Archiving a task without deleting it.
- Deriving overdue from due date and status.
- Sorting active tasks by topic, status, and due date.

Run all tests with:

```bash
npm test
```

## AI Usage Declaration

This repository makes use of AI code generation using the following tools: Codex[GPT-5].

This repository does not use AI in-line editing tools.

This repository makes use of AI code review using the following tools: Codex[GPT-5].

AI Declaration: The preceding document was generated, reviewed, and edited with the assistance of Codex[GPT-5].
