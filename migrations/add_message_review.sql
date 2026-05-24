-- 清理 messages 表的 AI 审核字段
-- 在 Supabase SQL Editor 中执行

-- 删除不再使用的审核列
ALTER TABLE public.messages DROP COLUMN IF EXISTS review_status;
ALTER TABLE public.messages DROP COLUMN IF EXISTS review_reason;

-- 确保 is_read 有默认值
ALTER TABLE public.messages ALTER COLUMN is_read SET DEFAULT false;
UPDATE public.messages SET is_read = false WHERE is_read IS NULL;

-- 确保 RLS 开启
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 重建 RLS 策略
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;
  DROP POLICY IF EXISTS "Users can insert own messages" ON public.messages;
  DROP POLICY IF EXISTS "Users can update own messages" ON public.messages;
  DROP POLICY IF EXISTS "Users can delete own messages" ON public.messages;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert own messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can delete own messages" ON public.messages
  FOR DELETE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
