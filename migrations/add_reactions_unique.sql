-- 为 reactions 表添加唯一约束，防止同一用户对同一目标重复暖心
-- 这是防止并发重复插入的最后一道防线

-- 1. 清理已有重复数据（保留最早的一条）
DELETE FROM reactions
WHERE id IN (
  SELECT id FROM (
    SELECT id,
      ROW_NUMBER() OVER (
        PARTITION BY user_id, target_type, target_id
        ORDER BY created_at ASC
      ) AS rn
    FROM reactions
  ) dup
  WHERE dup.rn > 1
);

-- 2. 添加唯一约束
ALTER TABLE reactions
ADD CONSTRAINT unique_reaction_per_user_target
UNIQUE (user_id, target_type, target_id);
