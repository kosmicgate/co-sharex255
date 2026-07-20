-- Run this in the Supabase SQL editor for your project.

create table if not exists bills (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null,
  created_at timestamptz not null default now()
);

alter table bills enable row level security;

-- Anyone with the link can read a bill (share links are the access control).
create policy "bills are publicly readable"
  on bills for select
  using (true);

-- Anyone can create a bill (no auth in this app yet).
create policy "anyone can insert a bill"
  on bills for insert
  with check (true);
