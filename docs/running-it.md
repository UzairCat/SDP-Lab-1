# Running It

This project is a local-first Next.js application backed by SQLite.
It should be run from the project root.

Required runtime:

- Node.js `v24.15.0`
- npm `11.12.1`

Install dependencies:

```bash
npm install
```

Apply the shipped SQLite migration:

```bash
npm run db:migrate
```

Start the development server:

```bash
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

The local SQLite database is stored at:

```text
data/todo.db
```

Run the automated tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

After building, run the production server:

```bash
npm start
```

If the database schema changes, regenerate and apply migrations:

```bash
npm run db:generate
npm run db:migrate
```
