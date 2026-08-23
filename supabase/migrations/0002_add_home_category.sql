-- Add 'home' as a main category. Run against the existing Supabase project (SQL editor).
alter table public.categories drop constraint if exists categories_main_category_check;
alter table public.products drop constraint if exists products_main_category_check;
alter table public.categories add constraint categories_main_category_check check (main_category in ('bags', 'jewelry', 'accessories', 'home'));
alter table public.products add constraint products_main_category_check check (main_category in ('bags', 'jewelry', 'accessories', 'home'));
