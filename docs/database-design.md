# Database Design

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

- Tasks are never deleted by the app. Archiving sets `archived_at`; archived tasks remain viewable from the Archived Tasks section.
- Overdue is not stored as a column and is not a status. The app derives `isOverdue` at read time from `due_date` and `status`.
- A task is overdue when its due date is before the current local date and its status is not `Complete`.

Schema source:

- Drizzle schema: `src/db/schema.ts`
- Generated SQLite migration: `drizzle/0000_black_black_crow.sql`
