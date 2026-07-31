# New in this update

1. **Dark "mission control" theme** — the whole site now uses the deep-space
   palette that the existing helix/starfield/telemetry effects were built for.
2. **QR "scan to register" block removed** from the homepage Register section.
3. **Real registration storage + admin CRUD** via Supabase.
4. **Editable event timing** — the admin can change the date/time/venue/countdown
   and open/close registrations, and the homepage + register page reflect it live.
5. **Groq-powered chat widget** — floating assistant bubble, bottom-right, on every page.

## Setup

1. Copy `.env.local.example` to `.env.local` and fill in the values (see comments
   in that file for where to get each one). Add the same variables in Vercel's
   project settings for production.
2. In your Supabase project, open the SQL editor and run `supabase/schema.sql`
   once. That creates the `registrations` and `event_settings` tables.
3. `npm install` (no new dependencies were added — everything talks to
   Supabase/Groq over plain `fetch`, so this just reinstalls the existing
   `package.json`).
4. `npm run dev` to test locally, then deploy as usual.

## Notes / things worth knowing

- I wasn't able to run `npm install` or `next build` in the sandbox I worked in
  (no network access there), so this hasn't been build-verified. Please run
  `npm run build` locally before deploying, in case anything needs a small fix.
- The admin password check happens server-side (`ADMIN_PASSWORD` env var) —
  there's no separate password baked into the client code anymore.
- Until you set the Supabase and Groq env vars, the registration form, admin
  dashboard, and chat widget will show friendly "not configured yet" messages
  instead of crashing.
- Recommendation for a next step: right now "admin can edit everything" covers
  registrations + event timing/venue/status. If you want the admin to also edit
  page copy (speaker bios, competitions list, sponsor logos, etc.), that's a
  bigger content-management layer — happy to scope that out separately.
