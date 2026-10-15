-- Vlach Fitting — databáze e-shopu (Supabase / PostgreSQL)
-- Spusť celé najednou: Supabase → SQL Editor → New query → vložit → Run.
-- Skript jde spustit i opakovaně, nic nesmaže.
--
-- Web se k databázi připojuje jen ze serveru klíčem service_role, který RLS obchází.
-- Pro veřejný (anon) klíč je RLS zapnuté bez pravidel = nemá přístup k ničemu.

create extension if not exists pgcrypto;

-- Objednávky -------------------------------------------------------------
create table if not exists public.vf_orders (
  id            uuid primary key default gen_random_uuid(),
  number        text not null unique,                 -- FV-2610146411
  vs            text not null,                        -- variabilní symbol
  created_at    timestamptz not null default now(),
  status        text not null default 'nova'
                check (status in ('nova','zpracovava','odeslano','dorucena','zrusena')),
  customer      jsonb not null,                       -- {name,email,phone,note}
  address       jsonb,                                -- {street,city,zip}
  pickup_point  jsonb,                                -- {id,name}
  delivery      jsonb not null,                       -- {id,label,price}
  payment       jsonb not null,                       -- {id,label,fee}
  items         jsonb not null,                       -- [{slug,name,qty,unit,config,digital}]
  total         numeric(12,2) not null,
  no_marketing  boolean not null default false,
  admin_note    text,
  tracking      text,
  paid_at       timestamptz
);

create index if not exists vf_orders_created_idx on public.vf_orders (created_at desc);
create index if not exists vf_orders_status_idx  on public.vf_orders (status);

-- Dárkové poukazy ---------------------------------------------------------
create table if not exists public.vf_vouchers (
  code          text primary key,                     -- VF-ABCD-EFGH
  order_id      uuid references public.vf_orders(id) on delete set null,
  order_number  text,
  value         numeric(12,2) not null,
  remaining     numeric(12,2) not null,
  valid_until   date not null,
  recipient     text,
  status        text not null default 'aktivni'
                check (status in ('aktivni','uplatneno','zruseno')),
  note          text,
  created_at    timestamptz not null default now()
);

create index if not exists vf_vouchers_order_idx on public.vf_vouchers (order_id);

-- Účel poukazu z roletky „Na co" (přidáno 10/2026)
alter table public.vf_vouchers add column if not exists purpose text;

-- Nastavení (bankovní účty apod.) ----------------------------------------
create table if not exists public.vf_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- Zabezpečení -------------------------------------------------------------
alter table public.vf_orders   enable row level security;
alter table public.vf_vouchers enable row level security;
alter table public.vf_settings enable row level security;

revoke all on public.vf_orders, public.vf_vouchers, public.vf_settings from anon, authenticated;
grant  all on public.vf_orders, public.vf_vouchers, public.vf_settings to service_role;
