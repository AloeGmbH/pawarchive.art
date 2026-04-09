-- Portraits table
create table if not exists portraits (
  id                uuid primary key default gen_random_uuid(),
  style             text not null,
  pet_name          text,
  image_url         text,        -- watermarked preview (shown before payment)
  full_image_url    text,        -- unwatermarked full-res (shown after payment)
  paid              boolean default false,
  format            text,        -- 'digital' | '8x10' | '12x16' | '16x20'
  stripe_session_id text,
  customer_email    text,
  shipping_address  jsonb,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index if not exists portraits_stripe_idx on portraits(stripe_session_id);
create index if not exists portraits_paid_idx on portraits(paid);

-- Storage buckets (create manually in Supabase Dashboard):
-- 1. "portrait-uploads"    → private  (customer pet photos)
-- 2. "generated-portraits" → public   (AI-generated portrait images)
