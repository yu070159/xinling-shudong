-- 创建 questions 表
CREATE TABLE questions (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  nickname VARCHAR(50) DEFAULT '匿名树友',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建 answers 表
CREATE TABLE answers (
  id BIGSERIAL PRIMARY KEY,
  question_id BIGINT REFERENCES questions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  nickname VARCHAR(50) DEFAULT '匿名树友',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用行级安全
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- 允许所有人 select 和 insert
CREATE POLICY "Allow select for all" ON questions FOR SELECT USING (true);
CREATE POLICY "Allow insert for all" ON questions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select for all" ON answers FOR SELECT USING (true);
CREATE POLICY "Allow insert for all" ON answers FOR INSERT WITH CHECK (true);