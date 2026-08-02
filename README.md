# COMS3011A Lab 1 Todo

Student Number: 2802191, Name: Uzair Mahomed

A local-first todo application built with Next.js and SQLite for COMS3011A Lab 1.

## Features

- Local SQLite task storage in `data/todo.db`.
- Task creation with title, topic, due date, and description.
- New tasks default to `Todo`.
- Inline editing for task details and status changes.
- Status tracking with `Todo`, `In-Progress`, and `Complete`.
- Archived tasks stay hidden until `View Archived Tasks` is opened.
- Dark-mode default with browser-based appearance preference saving.

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

Run the automated tests with:

```bash
npm test
```

Create a production build with:

```bash
npm run build
```

## Documentation

- [Running Guide](docs/running-it.md)
- [Dependencies](docs/dependencies.md)
- [Database Design](docs/database-design.md)

## Testing

The repository contains deterministic Vitest tests in `src/tasks/service.test.ts`.
They run against a throwaway in-memory SQLite database and apply the shipped migration SQL before each test.
They do not use or modify `data/todo.db`.

Covered behavior:

- Creating a task with the required fields and default `Todo` status.
- Editing a task, including status, and reading the persisted changes.
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

The exported Codex transcript should be submitted separately with the repository link.

AI Declaration: The preceding document was generated, reviewed, and edited with the assistance of Codex[GPT-5].
