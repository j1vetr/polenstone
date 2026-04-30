-- Task #81: Guest reviews + admin approval workflow
-- Tarih: 2026-04-30
--
-- Bu migration product_reviews tablosunu misafir yorumlarını ve
-- admin onay akışını destekleyecek şekilde günceller.
--
-- DEPLOY YÖNTEMİ (production):
--   psql "$DATABASE_URL" -f migrations/2026_04_30_guest_reviews.sql
--
-- Yerel/staging için drizzle de kullanılabilir:
--   npm run db:push
-- Drizzle interactive prompt başka bir tablo (refresh_tokens) için
-- takılırsa ENTER ile "No, add the constraint without truncating"
-- seçeneğini onaylayın.
--
-- IDEMPOTENT: tüm komutlar IF NOT EXISTS / DROP NOT NULL kullanır,
-- güvenli bir şekilde birden fazla kere çalıştırılabilir.
--
-- VERİ KORUMA: Mevcut onaylanmış yorumlar (is_approved=true) etkilenmez.
-- Yeni eklenen kolonlar nullable olduğu için backfill gerekmez.
-- is_approved varsayılanının "true" → "false" olarak değişmesi sadece
-- bu tarihten SONRA eklenen yeni yorumları etkiler.

BEGIN;

-- 1) user_id artık nullable (misafir yorumları)
ALTER TABLE product_reviews
  ALTER COLUMN user_id DROP NOT NULL;

-- 2) is_approved varsayılanı false (her yorum admin onayı bekler)
ALTER TABLE product_reviews
  ALTER COLUMN is_approved SET DEFAULT false;

-- 3) Misafir bilgileri ve onay/red metadata
ALTER TABLE product_reviews
  ADD COLUMN IF NOT EXISTS guest_name       text,
  ADD COLUMN IF NOT EXISTS guest_email      text,
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS approved_at      timestamp,
  ADD COLUMN IF NOT EXISTS approved_by      varchar;

COMMIT;
