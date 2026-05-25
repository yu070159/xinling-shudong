# 心事语义共振网络 设计文档

## 概述

发布心事后，后台异步调用 DeepSeek 提取 3-8 个语义主题标签存入 `questions.tags` 数组字段。详情页底部通过 PostgreSQL 数组重叠度匹配，展示全站语义最相似的 3 条心事。

## 数据库

### ALTER TABLE questions

```sql
ALTER TABLE questions ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT NULL;
```

无需 pgvector 扩展。PostgreSQL 原生数组 + `&&` 重叠运算符即可实现匹配。

## 标签提取

### Prompt 设计

```
你是一个中文情绪标签提取器。阅读以下心事，提取3-8个语义主题标签
（如"考研焦虑""原生家庭""友情裂痕""孤独感""自我怀疑"等），
只返回JSON数组，不要其他文字。

心事内容：
<user_content>...</user_content>
```

### 执行时机

发布心事 → INSERT questions → 立即返回（不阻塞）→ 后台异步：
1. 查询刚插入的心事 ID
2. `fetch(API_BASE + '/api/gemini', { prompt })` 提取标签
3. `UPDATE questions SET tags = [...] WHERE id = ?`
4. 失败时静默丢弃，不阻塞任何流程

## 相似度匹配

### 查询策略

```sql
SELECT * FROM questions
WHERE tags IS NOT NULL
  AND id != $currentId
ORDER BY 与当前心事的tags重叠数 DESC
LIMIT 10
```

应用层再做精确重叠计数排序，取 Top 3。

### 展示位置

详情页「回应」列表下方，「送出回应」表单上方。卡片包含：
- 作者昵称 + 日期
- 内容摘要（100字截断，2行省略）
- 共享标签（小圆角标签展示）

## 文件清单

- `migrations/add_tags_to_questions.sql` — ALTER TABLE
- `app.js` — `extractAndSaveTags()` + `submitQuestionAPI` 异步调用
- `detail.html` — 相似心事推荐区块（HTML + CSS + JS）

## 不在本次范围

- pgvector 向量化（DeepSeek 不支持 embedding API）
- 实时更新相似推荐（需刷新页面或重新进入详情页才更新）
- 标签编辑/人工干预
