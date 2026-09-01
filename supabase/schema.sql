create table if not exists pantry_items (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  barcode text,
  raw_title text not null,
  canonical_id text not null,
  category text not null,
  quantity integer not null default 1,
  unit text not null default 'item',
  image_url text,
  added_at timestamptz not null default now()
);

create table if not exists shopping_list (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  canonical_id text not null,
  display_name text not null,
  amount numeric not null default 1,
  unit text not null default 'item',
  source_recipe_title text,
  is_checked boolean not null default false
);

alter table pantry_items enable row level security;
alter table shopping_list enable row level security;

create policy "Users manage their pantry" on pantry_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their list" on shopping_list
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
