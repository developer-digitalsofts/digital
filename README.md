# DigitalManager — Landing site & JSON CMS

This repository contains the **public marketing site** (React + Vite + TypeScript) and a **JSON-backed CMS API** (Node + Express) that powers the admin panel and dynamic content.

## Quick start (local)

### Environment setup

1. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace placeholder values:
   - `AUTH_SECRET` — long random string for admin JWT signing
   - `SMTP_*` and `CONTACT_RECEIVER_EMAIL` — if you want contact/lead emails
   - Leave `NEXT_PUBLIC_CMS_API_URL` empty for normal local dev (Vite proxies `/api` to the Express API)

3. Install dependencies:

   ```bash
   npm install
   ```

4. Optional database step (only if you use Prisma in this project):

   ```bash
   npx prisma db push
   ```

   **Note:** CMS content is stored as JSON under `server/data/` by default. Skip Prisma unless you have added a `prisma/schema.prisma`.

5. Seed the default admin user:

   ```bash
   npm run db:seed:admin
   ```

6. Run frontend + API:

   ```bash
   npm run dev
   ```

`.env.local` is gitignored — never commit secrets to GitHub.

After `npm run dev`:

- **Website (public):** [http://127.0.0.1:5280/](http://127.0.0.1:5280/) (default Vite port)
- **Admin panel:** `/admin` on the same origin
- **API (direct):** [http://127.0.0.1:3040/api/health](http://127.0.0.1:3040/api/health)

Alternate frontend ports if one is busy: `npm run dev:4001`, `npm run dev:4002`.

## Default admin login (local development)

After running `npm run db:seed:admin`:

| Field    | Value              |
| -------- | ------------------ |
| Email    | `admin@admin.com`  |
| Password | `Admin@123`        |
| Role     | Super Admin        |
| Status   | Active             |

Sign in at `/admin/login`. The seed command is idempotent — it will **not** create a duplicate if `admin@admin.com` already exists.

Change this password immediately in production (`Admin Profile` → **Password**).

## Troubleshooting

### `EADDRINUSE: address already in use`

Another process is using the API port (default **3040**, or whatever `PORT=` is set to in `.env`).

- Stop the old Node process, or use: `npm run dev:api:3041` and `npm run dev:full:3041`
- Do **not** set `PORT=4000` unless you intend the **API** to run on 4000 (this project is not Next.js).

### Admin dashboard: “Data could not be loaded” / API offline

- Run `npm run dev` (starts **both** frontend and API). Running only `npm run dev:web` without the API causes this.
- Leave `VITE_API_URL` / `NEXT_PUBLIC_CMS_API_URL` **empty** in local `.env.local` so requests use `/api/...` on the same origin.
- Seed admin: `npm run db:seed:admin` then log in with `admin@admin.com` / `Admin@123`.

## CMS data storage

All editable CMS content is stored as JSON under:

`server/data/*.json`

Examples: `header.json`, `hero.json`, `modules.json`, `leads.json`, `siteSettings.json`, `pageSections.json`, `activityLog.json`, etc.

Uploaded media files are stored under:

`server/uploads/`

## Backup and restore

- In the admin UI, open **Backup / restore** to **download** a single JSON bundle of all `server/data` files or **import** a previously exported bundle.
- The server writes `backup-pre-import-<timestamp>-<filename>.json` snapshots before overwriting files when possible.

You can also copy the `server/data` folder manually for a cold backup.

## Production build

**Frontend:**

```bash
npm run build
```

Output: `dist/`. Serve `dist/` as static files (nginx, S3 + CloudFront, Azure Static Web Apps, etc.). Configure your host so that **client-side routes** (e.g. `/contact`, `/admin/...`) fall back to `index.html`.

**Backend:**

```bash
npm --prefix server start
```

Set environment variables in `.env.local` (local) or your host’s secret store (production):

| Variable | Purpose |
| -------- | ------- |
| `AUTH_SECRET` / `JWT_SECRET` | **Required in production** — signing key for admin JWTs |
| `DATABASE_URL` | Optional — for Prisma/SQLite if you add a database layer |
| `ALLOW_ADMIN_BOOTSTRAP` | Allow `npm run db:seed:admin` (default `true`; set `false` in production) |
| `PORT` | API port (default **3040**) |
| `NEXT_PUBLIC_CMS_API_URL` / `VITE_API_URL` | Public CMS API origin when frontend and API are on different hosts |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | SMTP transport for lead/contact emails |
| `SMTP_FROM_EMAIL` | Default sender address (falls back to `SMTP_USER`) |
| `CONTACT_RECEIVER_EMAIL` | Default lead notification recipient |

Point `VITE_API_URL` at your public API origin when the frontend is **not** served on the same host as the API (see `src/cms/api.ts`).

## JSON CMS limitations (important)

- **No built-in multi-user locking:** two editors saving at the same time can overwrite each other’s last write.
- **File-based storage:** not a substitute for a relational DB at high write volume; scale by moving to a database when needed.
- **Backups are your safety net:** export regularly before bulk imports or risky edits.
- **Secrets:** keep `AUTH_SECRET` / `JWT_SECRET` and SMTP credentials in `.env.local` or your deployment secrets — never commit them.

## Project scripts (root)

| Script        | Description                          |
| ------------- | ------------------------------------ |
| `npm run dev` | Frontend + API (use this for admin) |
| `npm run dev:web` | Vite frontend only              |
| `npm run dev:api` | Express API with `--watch`      |
| `npm run dev:4001` | Frontend on port 4001 + API    |
| `npm run dev:full` | Alias for `npm run dev`        |
| `npm run build` | Typecheck + production frontend build |
| `npm run db:seed:admin` | Create default local admin (`admin@admin.com`) |

---

For ESLint and TypeScript tooling notes, see the upstream Vite template documentation if you extend the lint configuration.
