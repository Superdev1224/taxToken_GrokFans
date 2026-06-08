-- GrokFANS Referral DApp Schema
-- Run this in your Supabase SQL editor

create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  wallet_address text unique not null,
  referral_code text unique not null,
  created_at timestamptz default now() not null
);

create table if not exists referrals (
  id uuid primary key default uuid_generate_v4(),
  child_wallet text unique not null,
  parent_wallet text not null,
  created_at timestamptz default now() not null
);

create table if not exists rewards (
  id uuid primary key default uuid_generate_v4(),
  wallet_address text not null,
  tier text not null check (tier in ('builder', 'leader', 'holder')),
  amount_token numeric not null default 0,
  source_tx text,
  created_at timestamptz default now() not null
);

create index if not exists idx_referrals_parent on referrals(parent_wallet);
create index if not exists idx_referrals_child on referrals(child_wallet);
create index if not exists idx_rewards_wallet on rewards(wallet_address);
create index if not exists idx_users_code on users(referral_code);

alter table users enable row level security;
alter table referrals enable row level security;
alter table rewards enable row level security;

create policy "Users are publicly readable"
  on users for select using (true);

create policy "Referrals are publicly readable"
  on referrals for select using (true);

create policy "Rewards are publicly readable"
  on rewards for select using (true);

create policy "Service role can insert users"
  on users for insert with check (true);

create policy "Service role can insert referrals"
  on referrals for insert with check (true);

create policy "Service role can insert rewards"
  on rewards for insert with check (true);
