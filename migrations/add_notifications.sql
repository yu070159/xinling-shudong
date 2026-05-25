-- 全站通知中心：notifications 表
-- 在 Supabase SQL Editor 中执行

-- 1. 创建通知表
CREATE TABLE IF NOT EXISTS public.notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('reply', 'message', 'friend_request', 'friend_accept')),
  from_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_id TEXT,
  link TEXT NOT NULL,
  content_preview TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 性能索引
CREATE INDEX IF NOT EXISTS idx_notif_user_unread
  ON public.notifications (user_id, is_read, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notif_user_created
  ON public.notifications (user_id, created_at DESC);

-- 3. 去重：部分唯一索引
CREATE UNIQUE INDEX IF NOT EXISTS unique_reply_notification
  ON public.notifications (user_id, entity_id)
  WHERE type = 'reply';

CREATE UNIQUE INDEX IF NOT EXISTS unique_friend_request_notification
  ON public.notifications (user_id, from_user_id)
  WHERE type = 'friend_request';

CREATE UNIQUE INDEX IF NOT EXISTS unique_friend_accept_notification
  ON public.notifications (user_id, entity_id)
  WHERE type = 'friend_accept';

-- message 类型不用唯一索引，应用层 upsert（同一发送者的未读通知更新而非重复插入）

-- 4. RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- SELECT: 只读自己的通知
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT: 发送者创建通知，禁止自己给自己发
DROP POLICY IF EXISTS "Users can create notifications for others" ON public.notifications;
CREATE POLICY "Users can create notifications for others" ON public.notifications
  FOR INSERT WITH CHECK (
    auth.uid() = from_user_id
    AND user_id != auth.uid()
  );

-- UPDATE: 只有接收者可以标记已读
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: 接收者可以删除自己的通知；发送者可以删除自己创建的通知（消息去重场景）
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id OR auth.uid() = from_user_id);
