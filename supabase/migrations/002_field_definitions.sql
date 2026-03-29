-- ============================================================
-- CareTrack: Configurable Custom Fields
-- ============================================================

create table if not exists field_definitions (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  field_key text not null unique,
  field_type text check (field_type in ('text', 'number', 'date', 'boolean')) default 'text' not null,
  is_required boolean default false not null,
  sort_order int default 0 not null,
  created_at timestamptz default now() not null
);

-- RLS
alter table field_definitions enable row level security;

-- All authenticated users can read field definitions
create policy "field_definitions_read" on field_definitions
  for select using (auth.role() = 'authenticated');

-- Only admins can manage field definitions (enforced in app layer via profile role check)
create policy "field_definitions_insert" on field_definitions
  for insert with check (auth.role() = 'authenticated');

create policy "field_definitions_update" on field_definitions
  for update using (auth.role() = 'authenticated');

create policy "field_definitions_delete" on field_definitions
  for delete using (auth.role() = 'authenticated');

create index if not exists field_definitions_sort_order on field_definitions(sort_order);
