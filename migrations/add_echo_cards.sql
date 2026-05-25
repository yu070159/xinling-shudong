-- 树洞回音壁：echo_cards 表
-- 在 Supabase SQL Editor 中执行

-- 1. 创建回音卡表
CREATE TABLE IF NOT EXISTS public.echo_cards (
  id BIGSERIAL PRIMARY KEY,
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id BIGINT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  music_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 索引
CREATE INDEX IF NOT EXISTS idx_echo_cards_to_user
  ON public.echo_cards (to_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_echo_cards_question
  ON public.echo_cards (question_id);

-- 3. RLS
ALTER TABLE public.echo_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own echo cards" ON public.echo_cards;
CREATE POLICY "Users can view own echo cards" ON public.echo_cards
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

DROP POLICY IF EXISTS "Users can create echo cards" ON public.echo_cards;
CREATE POLICY "Users can create echo cards" ON public.echo_cards
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

DROP POLICY IF EXISTS "Users can delete received echo cards" ON public.echo_cards;
CREATE POLICY "Users can delete received echo cards" ON public.echo_cards
  FOR DELETE USING (auth.uid() = to_user_id);

-- 4. 扩展 notifications 类型约束
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('reply', 'message', 'friend_request', 'friend_accept', 'peer_support', 'match_letter', 'echo'));
