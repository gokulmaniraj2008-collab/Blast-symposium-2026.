-- BLAST Symposium 2026 — run this once in your Supabase project's SQL editor.

create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  ticket_id text unique not null,
  name text not null,
  email text not null,
  phone text not null,
  institution text not null,
  department text,
  category text not null,
  competitions text[] not null default '{}',
  workshops text[] not null default '{}',
  notes text,
  status text not null default 'confirmed' check (status in ('confirmed', 'waitlisted', 'cancelled'))
);

create table if not exists event_settings (
  id int primary key default 1,
  event_dates text not null default '13–14 March 2026',
  event_time text not null default '09:00 AM Onwards',
  venue text not null default 'Dr. Mahalingam Auditorium, RVS ITECH Campus',
  launch_iso timestamptz not null default '2026-03-13T09:00:00+05:30',
  registrations_open boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into event_settings (id) values (1)
  on conflict (id) do nothing;

-- Row Level Security stays ON with no public policies: only requests using the
-- service role key (server-side API routes, never the browser) can read/write.
alter table registrations enable row level security;
alter table event_settings enable row level security;
