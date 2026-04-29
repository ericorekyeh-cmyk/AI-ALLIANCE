# Supabase Schema Setup Guide

You need to create these tables in Supabase:

## 1. ingredients table
```sql
create table ingredients (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamp default now()
);
```

## 2. recipe_ingredients table
```sql
create table recipe_ingredients (
  id uuid default gen_random_uuid() primary key,
  recipe_id uuid references recipes(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete cascade,
  amount text,
  unit text,
  created_at timestamp default now()
);
```

## 3. Update recipes table (add instructions column)
```sql
alter table recipes add column instructions text;
```

## Steps to apply:
1. Go to Supabase dashboard
2. SQL Editor
3. Paste each SQL command above
4. Click "Run"

The recipes table will keep: id, title, description, cuisine_type, image_url, user_id, created_at
Plus new: instructions (for cooking instructions)
