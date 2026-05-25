-- 关怀代币闭环：微光代币系统
-- 在 Supabase SQL Editor 中执行

-- 1. 微光账本表
CREATE TABLE IF NOT EXISTS public.glimmer_ledger (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL CHECK (amount != 0),
  reason TEXT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 索引
CREATE INDEX IF NOT EXISTS idx_glimmer_user_date
  ON public.glimmer_ledger (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_glimmer_reference
  ON public.glimmer_ledger (reference_id, reason);

-- 3. RLS（不可删除、不可修改）
ALTER TABLE public.glimmer_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own ledger" ON public.glimmer_ledger;
CREATE POLICY "Users can view own ledger" ON public.glimmer_ledger
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own ledger" ON public.glimmer_ledger;
CREATE POLICY "Users can insert own ledger" ON public.glimmer_ledger
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 注意：不创建 DELETE/UPDATE 策略，账本记录不可篡改

-- 4. profiles 新增微光字段
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS glimmer_themes TEXT[] DEFAULT '{}';

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS glimmer_donated INT DEFAULT 0;
