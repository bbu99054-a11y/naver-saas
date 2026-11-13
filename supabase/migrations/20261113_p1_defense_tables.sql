-- PostSync P1 방어선 공용 테이블 (비파괴 추가 전용)
-- 로컬 또는 운영 DB에서 prisma db push 대신 수동 적용이 필요한 경우 Supabase SQL Editor에서 실행하세요.

CREATE TABLE IF NOT EXISTS "api_rate_limits" (
  "key" TEXT NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 1,
  "reset_at" TIMESTAMPTZ(6) NOT NULL,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  CONSTRAINT "api_rate_limits_pkey" PRIMARY KEY ("key")
);

CREATE INDEX IF NOT EXISTS "idx_api_rate_limits_reset_at"
  ON "api_rate_limits" ("reset_at");

CREATE TABLE IF NOT EXISTS "place_rank_caches" (
  "cache_key" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "expires_at" TIMESTAMPTZ(6) NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  CONSTRAINT "place_rank_caches_pkey" PRIMARY KEY ("cache_key")
);

CREATE INDEX IF NOT EXISTS "idx_place_rank_caches_expires_at"
  ON "place_rank_caches" ("expires_at");
