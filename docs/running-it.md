# Running It

This project is a local-first Next.js application backed by SQLite.
The app runs locally for a single user and stores its SQLite database in `data/todo.db`.

Required runtime:

- Node.js `v24.15.0`
- npm `11.12.1`

## Clean Clone Setup

Clone the repository:

```bash
git clone https://github.com/UzairCat/SDP-Lab-1.git
```

Move into the project folder:

```bash
cd SDP-Lab-1
```

Install dependencies from `package-lock.json`:

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

The app creates and uses this local database file:

```text
data/todo.db
```

## Verification Commands

Run the automated tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

After a successful build, run the production server:

```bash
npm start
```

## Database Commands

Apply existing migrations:

```bash
npm run db:migrate
```

Regenerate migrations after changing `src/db/schema.ts`:

```bash
npm run db:generate
```

Then apply the new migration:

```bash
npm run db:migrate
```

## Troubleshooting

If `npm run dev` says port `3000` is already in use, start the app on another port:

```bash
npm run dev -- --port 3001
```

Then open:

```text
http://localhost:3001
```

If `npm run dev` prints `next dev` and exits without showing a local URL, reinstall dependencies:

```bash
rm -rf node_modules .next
npm ci
npm run db:migrate
npm run dev
```

If you are using WSL, prefer running the project from the WSL Linux filesystem rather than a Windows-mounted `/mnt/c/...` path. Native Node dependencies such as `better-sqlite3` are more reliable when installed and run from the Linux filesystem.

If the app starts but has no tasks, that is expected on a new local database. Create a task in the form and refresh the page to confirm SQLite persistence.

## AI Declaration

AI Declaration: The preceding document was generated, reviewed, and edited with the assistance of Codex[GPT-5].
