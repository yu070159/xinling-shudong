-- 心事语义共振：为 questions 表新增语义标签数组字段
ALTER TABLE questions ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT NULL;
