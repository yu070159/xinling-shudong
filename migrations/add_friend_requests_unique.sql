-- 为 friend_requests 表添加唯一约束，防止同一用户对重复发送好友申请
-- 同时清理历史冗余数据

-- 1. 清理所有已拒绝的记录（不再需要保留，应用层改为直接 DELETE）
DELETE FROM friend_requests WHERE status = 'rejected';

-- 2. 清理重复的 pending 记录（保留最早的一条）
DELETE FROM friend_requests
WHERE id IN (
  SELECT id FROM (
    SELECT id,
      ROW_NUMBER() OVER (
        PARTITION BY from_user, to_user
        ORDER BY created_at ASC
      ) AS rn
    FROM friend_requests
    WHERE status = 'pending'
  ) dup
  WHERE dup.rn > 1
);

-- 3. 添加部分唯一索引：同一对用户之间只允许存在一条 pending 申请
CREATE UNIQUE INDEX IF NOT EXISTS unique_pending_friend_request
ON friend_requests (from_user, to_user)
WHERE status = 'pending';
