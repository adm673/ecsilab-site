-- Área do cliente (/callim e futuras): cada cliente tem uma pasta no bucket privado "portal".
-- Quem pode ler é decidido pela tabela portal_clientes (usuário -> pasta). Cadastro de usuários e
-- arquivos é feito pelo painel do Supabase (Authentication e Storage); o site só lê.

create table if not exists public.portal_clientes (
  user_id uuid not null references auth.users (id) on delete cascade,
  cliente text not null check (cliente ~ '^[a-z0-9-]+$'),
  criado_em timestamptz not null default now(),
  primary key (user_id, cliente)
);

alter table public.portal_clientes enable row level security;

drop policy if exists "Cada usuário vê o próprio acesso" on public.portal_clientes;
create policy "Cada usuário vê o próprio acesso"
  on public.portal_clientes for select to authenticated
  using (user_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portal', 'portal', false, 20971520, array['text/html', 'application/pdf', 'text/plain', 'text/markdown'])
on conflict (id) do nothing;

drop policy if exists "Cliente lê a própria pasta do portal" on storage.objects;
create policy "Cliente lê a própria pasta do portal"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'portal'
    and exists (
      select 1 from public.portal_clientes pc
      where pc.user_id = auth.uid()
        and pc.cliente = (storage.foldername(name))[1]
    )
  );
