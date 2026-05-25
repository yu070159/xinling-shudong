-- 离线通知 Phase 2：邮件通知摘要
-- 在 Supabase SQL Editor 中执行
-- 2026-05-25

-- 1. profiles 表新增字段
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_email_digest_at TIMESTAMPTZ;

COMMENT ON COLUMN public.profiles.email IS '用户邮箱（注册时写入，用于离线邮件通知）';
COMMENT ON COLUMN public.profiles.last_active_at IS '用户最后一次页面活跃时间（前端心跳上报）';
COMMENT ON COLUMN public.profiles.last_email_digest_at IS '上次发送离线邮件摘要的时间';

-- 2. 回填已有用户的邮箱（从 auth.users 同步）
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.user_id = u.id AND p.email IS NULL;

-- 3. 创建索引加速 cron 查询
CREATE INDEX IF NOT EXISTS idx_profiles_inactive
  ON public.profiles (last_active_at, last_email_digest_at)
  WHERE last_active_at IS NOT NULL;
