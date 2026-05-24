DROP POLICY IF EXISTS "允许用户删除自己的收藏" ON favorites;
DROP POLICY IF EXISTS "允许查看自己的收藏" ON favorites;
DROP POLICY IF EXISTS "允许添加收藏" ON favorites;
DROP POLICY IF EXISTS "允许取消收藏" ON favorites;
CREATE POLICY "允许查看收藏" ON favorites FOR SELECT USING (true);
CREATE POLICY "允许添加收藏" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "允许删除自己的收藏" ON favorites FOR DELETE USING (auth.uid() = user_id);
