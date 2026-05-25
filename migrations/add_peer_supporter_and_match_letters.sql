-- 合并迁移：朋辈倾听者认证 + MBTI 落叶盲盒
-- 在 Supabase SQL Editor 中一次性执行
-- 2026-05-25

-- ============================================================
-- Part 1: 朋辈倾听者认证
-- ============================================================

-- 1.1 profiles 表新增倾听者认证字段
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_peer_supporter BOOLEAN NOT NULL DEFAULT false;

-- ============================================================
-- Part 2: MBTI 落叶盲盒
-- ============================================================

-- 2.1 创建匹配信件表
CREATE TABLE IF NOT EXISTS public.match_letters (
  id BIGSERIAL PRIMARY KEY,
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.2 索引
CREATE INDEX IF NOT EXISTS idx_match_letters_from_date
  ON public.match_letters (from_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_match_letters_to
  ON public.match_letters (to_user_id, is_read, created_at DESC);

-- 2.3 RLS
ALTER TABLE public.match_letters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own match letters" ON public.match_letters;
CREATE POLICY "Users can view own match letters" ON public.match_letters
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

DROP POLICY IF EXISTS "Users can create match letters" ON public.match_letters;
CREATE POLICY "Users can create match letters" ON public.match_letters
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

DROP POLICY IF EXISTS "Users can update received letters" ON public.match_letters;
CREATE POLICY "Users can update received letters" ON public.match_letters
  FOR UPDATE USING (auth.uid() = to_user_id)
  WITH CHECK (auth.uid() = to_user_id);

-- ============================================================
-- Part 3: 统一扩展 notifications 类型约束（包含所有 6 种类型）
-- ============================================================

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('reply', 'message', 'friend_request', 'friend_accept', 'peer_support', 'match_letter'));
