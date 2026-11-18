-- Administradores da área do cliente (equipe Écsilab): enviam, substituem e apagam materiais pelo site.
-- O cadastro de administradores é feito somente pelo painel do Supabase (SQL), nunca pelo site.

create table if not exists public.portal_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  criado_em timestamptz not null default now()
);

alter table public.portal_admins enable row level security;

drop policy if exists "Administrador vê o próprio cadastro" on public.portal_admins;
create policy "Administrador vê o próprio cadastro"
  on public.portal_admins for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "Administrador lê o portal" on storage.objects;
create policy "Administrador lê o portal"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'portal'
    and exists (select 1 from public.portal_admins a where a.user_id = auth.uid())
  );

drop policy if exists "Administrador envia ao portal" on storage.objects;
create policy "Administrador envia ao portal"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'portal'
    and exists (select 1 from public.portal_admins a where a.user_id = auth.uid())
  );

drop policy if exists "Administrador substitui no portal" on storage.objects;
create policy "Administrador substitui no portal"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'portal'
    and exists (select 1 from public.portal_admins a where a.user_id = auth.uid())
  )
  with check (
    bucket_id = 'portal'
    and exists (select 1 from public.portal_admins a where a.user_id = auth.uid())
  );

drop policy if exists "Administrador apaga do portal" on storage.objects;
create policy "Administrador apaga do portal"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'portal'
    and exists (select 1 from public.portal_admins a where a.user_id = auth.uid())
  );
