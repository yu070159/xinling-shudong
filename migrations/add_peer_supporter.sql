-- 朋辈倾听者认证：profiles 表新增字段 + notifications 表扩展类型
-- 在 Supabase SQL Editor 中执行

-- 1. profiles 表新增倾听者认证字段
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_peer_supporter BOOLEAN NOT NULL DEFAULT false;

-- 2. notifications 表放宽 CHECK 约束以支持 peer_support 类型
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('reply', 'message', 'friend_request', 'friend_accept', 'peer_support'));
