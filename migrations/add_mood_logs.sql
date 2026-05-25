-- 情绪年轮：每日心情记录表
CREATE TABLE IF NOT EXISTS mood_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  mood_type TEXT NOT NULL CHECK (mood_type IN ('开心', '平静', '难过', '焦虑', '生气')),
  note TEXT,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE (user_id, created_at)
);

-- RLS: 用户只能读写自己的记录
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own mood_logs" ON mood_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood_logs" ON mood_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood_logs" ON mood_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood_logs" ON mood_logs
  FOR DELETE USING (auth.uid() = user_id);
