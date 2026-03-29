-- ============================================================
-- CareTrack: Initial Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable pgvector for semantic search (P2)
create extension if not exists vector;

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('admin', 'staff')) default 'staff' not null,
  full_name text,
  created_at timestamptz default now() not null
);

-- Auto-create a profile whenever a new user signs up
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- CLIENTS
-- ============================================================
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  org_id uuid,
  first_name text not null,
  last_name text not null,
  date_of_birth date,
  phone text,
  email text,
  gender text,
  language text default 'English',
  household_size int,
  address text,
  notes text,
  custom_fields jsonb default '{}' not null,
  is_active boolean default true not null,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ============================================================
-- SERVICE / VISIT ENTRIES
-- ============================================================
create table if not exists service_entries (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade not null,
  service_type text not null,
  service_date date not null default current_date,
  staff_id uuid references profiles(id) on delete set null,
  notes text,
  ai_summary text,
  follow_up_date date,
  embedding vector(1536),  -- for semantic search (P2-AI-4)
  created_at timestamptz default now() not null
);

-- ============================================================
-- APPOINTMENTS
-- ============================================================
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade not null,
  staff_id uuid references profiles(id) on delete set null,
  scheduled_at timestamptz not null,
  notes text,
  status text check (status in ('scheduled', 'completed', 'cancelled')) default 'scheduled',
  created_at timestamptz default now() not null
);

-- ============================================================
-- FOLLOW-UPS (AI Nudges — P2-AI-6)
-- ============================================================
create table if not exists follow_ups (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade not null,
  service_entry_id uuid references service_entries(id) on delete cascade,
  staff_id uuid references profiles(id) on delete set null,
  action_text text not null,
  due_date date,
  urgency text check (urgency in ('low', 'medium', 'high')) default 'medium',
  category text,
  is_completed boolean default false,
  created_at timestamptz default now() not null
);

-- ============================================================
-- AUDIT LOG
-- Note: we log actions, NOT PII values (per SRD)
-- ============================================================
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  action text check (action in ('create', 'update', 'delete')) not null,
  table_name text not null,
  record_id uuid,
  created_at timestamptz default now() not null
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles enable row level security;
alter table clients enable row level security;
alter table service_entries enable row level security;
alter table appointments enable row level security;
alter table follow_ups enable row level security;
alter table audit_log enable row level security;

-- Profiles: users can read all, update own
create policy "profiles_read_all" on profiles
  for select using (auth.role() = 'authenticated');

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- Clients: all authenticated users can read + create; no delete for staff
create policy "clients_read" on clients
  for select using (auth.role() = 'authenticated');

create policy "clients_insert" on clients
  for insert with check (auth.role() = 'authenticated');

create policy "clients_update" on clients
  for update using (auth.role() = 'authenticated');

-- Service entries: all authenticated users
create policy "service_entries_read" on service_entries
  for select using (auth.role() = 'authenticated');

create policy "service_entries_insert" on service_entries
  for insert with check (auth.role() = 'authenticated');

create policy "service_entries_update" on service_entries
  for update using (auth.role() = 'authenticated');

-- Appointments: all authenticated users
create policy "appointments_read" on appointments
  for select using (auth.role() = 'authenticated');

create policy "appointments_insert" on appointments
  for insert with check (auth.role() = 'authenticated');

create policy "appointments_update" on appointments
  for update using (auth.role() = 'authenticated');

-- Follow-ups: all authenticated users
create policy "follow_ups_read" on follow_ups
  for select using (auth.role() = 'authenticated');

create policy "follow_ups_insert" on follow_ups
  for insert with check (auth.role() = 'authenticated');

create policy "follow_ups_update" on follow_ups
  for update using (auth.role() = 'authenticated');

-- Audit log: all authenticated users can read + insert, no update/delete
create policy "audit_log_read" on audit_log
  for select using (auth.role() = 'authenticated');

create policy "audit_log_insert" on audit_log
  for insert with check (auth.role() = 'authenticated');

-- ============================================================
-- INDEXES for performance
-- ============================================================
create index if not exists clients_is_active on clients(is_active);
create index if not exists clients_last_name on clients(last_name);
create index if not exists service_entries_client_id on service_entries(client_id);
create index if not exists service_entries_service_date on service_entries(service_date desc);
create index if not exists appointments_scheduled_at on appointments(scheduled_at);
create index if not exists follow_ups_due_date on follow_ups(due_date);
create index if not exists follow_ups_is_completed on follow_ups(is_completed);
