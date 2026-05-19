# DigitalManager — Landing site & JSON CMS

This repository contains the **public marketing site** (React + Vite + TypeScript) and a **JSON-backed CMS API** (Node + Express) that powers the admin panel and dynamic content.

## Quick start (local)

1. Install dependencies:

   ```bash
   npm install
   npm --prefix server install
   ```

2. Run **frontend and API together** (recommended):

   ```bash
   npm run dev:full
   ```

   - **Website (public):** [http://127.0.0.1:5280/](http://127.0.0.1:5280/) (Vite dev server; proxies `/api` and `/uploads` to the API on port **3040**)
   - **Admin panel:** [http://127.0.0.1:5280/admin](http://127.0.0.1:5280/admin)
   - **API health:** [http://127.0.0.1:5280/api/health](http://127.0.0.1:5280/api/health)

3. Alternatively, run them in two terminals:

   ```bash
   npm run dev:api
   ```

   ```bash
   npm run dev
   ```

## Default admin login

| Field    | Value                      |
| -------- | -------------------------- |
| Email    | `admin@digitalmanager.local` |
| Password | `Admin@123`                |

Change this password immediately in production (`Admin` → **Password**).

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

Set environment variables as needed, for example:

| Variable       | Purpose                                      |
| -------------- | -------------------------------------------- |
| `PORT`         | API port (default **3040**)                  |
| `JWT_SECRET`   | **Required in production** — signing key for admin JWTs |
| SMTP variables | Optional — for lead notification email via Nodemailer (see `server/index.mjs` and `emailSettings.json`) |

Point `VITE_API_URL` at your public API origin when the frontend is **not** served on the same host as the API (see `src/cms/api.ts`).

## JSON CMS limitations (important)

- **No built-in multi-user locking:** two editors saving at the same time can overwrite each other’s last write.
- **File-based storage:** not a substitute for a relational DB at high write volume; scale by moving to a database when needed.
- **Backups are your safety net:** export regularly before bulk imports or risky edits.
- **Secrets:** keep `JWT_SECRET` and any SMTP credentials out of version control; use environment variables in production.

## Project scripts (root)

| Script        | Description                          |
| ------------- | ------------------------------------ |
| `npm run dev` | Vite dev server only                 |
| `npm run dev:api` | Express API with `--watch`      |
| `npm run dev:full` | Frontend + API via `concurrently` |
| `npm run build` | Typecheck + production frontend build |

---

For ESLint and TypeScript tooling notes, see the upstream Vite template documentation if you extend the lint configuration.
