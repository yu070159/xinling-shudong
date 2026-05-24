# CLAUDE.md

为 Claude Code（claude.ai/code）提供项目上下文和开发指引。

## 项目概述

心灵树洞（Soul Tree Hollow）是一个匿名情感互助社区。用户可以匿名倾诉"心事"，收获温暖的回应，用"暖心"互动，做 MBTI/PHQ-9 心理测评，与 AI 伙伴"树灵"聊天，以及私信树友。

## 技术栈

- **前端**：原生 HTML5/CSS3/ES6+ JavaScript —— 无框架、无构建工具、无 npm 依赖
- **后端/BaaS**：Supabase（PostgreSQL + Auth + Storage）
- **AI**：DeepSeek API（聊天 + 审核/情绪分析/建议），均通过 Vercel Serverless 函数代理
- **部署**：Vercel

## 开发方式

无构建步骤。用 VS Code Live Server 从项目根目录启动，入口页面是 `welcome.html`。

服务端代码在 `api/` 目录（Vercel Serverless 函数）。本地测试：
```
vercel dev
```

## 架构

### 公共脚本（所有页面都加载）

- **`utils.js`** —— 公共工具函数（IIFE）。提供 `escapeHtml`、`formatDate`、`updateTextSmoothly` 和 `API_BASE`（本地 `http://localhost:3000`，生产用相对路径）。函数同时挂载到 `window` 全局和 `window.TreeHole.utils`。所有 13 个页面均加载此脚本，新页面勿重复定义这些函数。
- **`app.js`** —— 核心共享逻辑，IIFE 包裹。初始化 Supabase 客户端（`CONFIG.SUPABASE_URL` + `CONFIG.SUPABASE_ANON_KEY`），所有功能挂载在 `window.TreeHole`。暴露 `window.TreeHole.config` 和 `window.TreeHole.pageSize = 20`。处理导航栏登录态、`index.html` 的心事发布/搜索/情绪筛选、`detail.html` 的回答/详情（通过 DOM-ready 回调）。包含内容审核（调用 `/api/gemini`）、情绪标签分析（调用 `/api/gemini` + localStorage 缓存）、情绪筛选 UI，以及一个 `showUserPopup` 内联用户卡片。
- **`ai-float.js`** —— 全局浮动 AI 聊天按钮（IIFE）。创建可拖拽的 🌳 按钮和可缩放聊天窗口。调用 `/api/chat`（DeepSeek 代理）。对话持久化到 `localStorage`。引入即用，无需手动初始化。
- **`user-popup.js`** —— 用户资料弹窗（IIFE）。**独立运行**，自行初始化 Supabase 客户端（优先复用 `window.TreeHole.supabase`，否则自行创建）。在 `document` 捕获阶段全局监听 `[data-user-id]` 点击。拉取资料 + 统计数据 + 好友关系，弹出包含头像、MBTI、简介、注册时间、统计、好友申请/聊天按钮的浮层。好友申请使用 REST API（`POST /rest/v1/friend_requests`）。
- **`style.css`** —— 全局样式，CSS 自定义属性定义在 `:root`（暖色森林调色板：`--accent`、`--bg-main`、`--bg-card`、`--warm-heart`、`--danger`）。

### 页面结构（13 个 HTML 页面）

每个页面引入 `style.css`、CDN 加载 Supabase SDK、公共导航栏（`.forest-header`），以及页面专属的 `<style>` 和 `<script>` 块。页面脚本自行初始化 Supabase 客户端、处理鉴权守卫。

- `welcome.html` —— 欢迎页，无需登录
- `index.html` —— 树洞广场（主页）。心事卡片流、搜索、发布表单。情绪标签可点击筛选。使用 `app.js` 中的函数
- `detail.html` —— 心事详情 + 回答。**不加载 `app.js`**，独立实现 Supabase/工具函数。包含"AI 帮我想想"按钮（调用 `/api/gemini` 生成回复草稿）和独立的心暖逻辑
- `login.html` / `register.html` —— 登录/注册页
- `profile.html` —— 个人中心，含标签页（个人资料、我的内容、好友申请）。使用 REST API 进行资料写操作（`PATCH /rest/v1/profiles`）
- `shuling.html` —— 全屏 AI 聊天，"树灵"人格。调用 `/api/chat`。支持对话上下文记忆，超过 30 条自动裁剪，可清除对话
- `chat.html` —— 聊天列表。有固定置顶的管理员聊天按钮，标题旁显示未读消息红点
- `chat-detail.html` —— 一对一树友聊天。Supabase Realtime 订阅 + 每 5 秒轮询兜底
- `books.html` —— 资源库（心理书籍推荐）
- `mbti-test.html` —— 20 题 MBTI 性格测试。结果调用 `/api/gemini` 生成分析
- `mental-test.html` —— PHQ-9 抑郁筛查（9 题）。结果调用 `/api/gemini` 生成分析
- `feedback.html` —— 反馈提交

### Supabase 数据库

- `profiles` —— 用户资料（nickname, mbti, bio, avatar_url, phq9_score, show_* 可见性开关）
- `questions` —— 心事（content, nickname, user_id）
- `answers` —— 回应（question_id, content, nickname, user_id）
- `reactions` —— 暖心反应（user_id, target_type: 'question'|'answer', target_id）
- `favorites` —— 收藏（user_id, question_id）
- `messages` —— 私信（sender_id, receiver_id, content, is_read）
- `friend_requests` —— 好友关系（from_user, to_user, status: 'pending'|'accepted'|'rejected'）
- `feedbacks` —— 用户反馈

鉴权使用 Supabase Auth（邮箱/密码）。所有表均启用 RLS 策略。

### API 代理

- **`api/chat.js`** —— DeepSeek 代理。从 `process.env.DEEPSEEK_API_KEY` 读取 Key，转发到 `api.deepseek.com/chat/completions`，模型 `deepseek-chat`。供 `ai-float.js` 和 `shuling.html` 使用。
- **`api/gemini.js`** —— DeepSeek 代理（历史文件名保留）。从 `process.env.DEEPSEEK_API_KEY` 读取 Key，转发到 `api.deepseek.com/chat/completions`，模型 `deepseek-v4-flash`，`max_tokens: 600`。响应包装为 Gemini 兼容格式（`{ candidates: [{ content: { parts: [{ text }] } }] }`）。供内容审核、情绪分析、AI 回应建议、MBTI/PHQ-9 分析使用。

### 环境变量

- `DEEPSEEK_API_KEY` —— Vercel 控制台或 `.env.local`。`api/chat.js` 和 `api/gemini.js` 共用此 Key。
- Supabase URL 和匿名 Key 硬编码在 `app.js` 的 `CONFIG` 对象中（公开可读，安全边界由 RLS 保障）。

## 关键模式

- **Supabase 客户端初始化**：`app.js` 在 `window.TreeHole.supabase` 上创建客户端。`user-popup.js` 和部分不依赖 `app.js` 的页面会自行初始化。
- **鉴权守卫**：需要登录的页面在 `DOMContentLoaded` 中检查 `sb.auth.getUser()`，若为 null 则跳转 `welcome.html`。
- **暖心去重**：通过 `reactions` 表 `user_id` 精确判断。`hasReacted` 为异步函数。`app.js`、`detail.html`、`user-popup.js` 均已同步。
- **工具函数**：`escapeHtml`、`formatDate`、`updateTextSmoothly` 已收敛到 `utils.js`，全局 `window` 和 `window.TreeHole.utils` 均可访问。新增页面勿自行定义这些函数。
- **API 调用基址**：`utils.js` 中 `API_BASE` 变量 —— 本地开发指向 `http://localhost:3000`，生产环境为空字符串（相对路径）。调用 API 代理时使用 `API_BASE + '/api/xxx'`。
- **暖心统计**：两步查询 —— 先查用户所有问题/回答 ID，再统计这些内容的暖心总数。
- **资料写入**：部分页面使用 Supabase REST API（`PATCH /rest/v1/profiles`）而非 JS 客户端 `.update()` 来绕过 RLS 限制。
- **AI API 调用模式**：`app.js` 中 `moderateContent` 和 `analyzeEmotion` 均调用 `/api/gemini`（实为 DeepSeek 代理），以 API 不可用时"放行"的方式优雅降级（审核失败/exceptions 时 `passed: true`；情绪分析失败时返回 null）。情绪分析结果缓存到 `localStorage`（key: `emotion_${questionId}`）。
- **内容审核**：发布心事前调用 `moderateContent`（`/api/gemini`），阻止暴力/自残/仇恨/色情内容。
- **情绪筛选**：情绪标签可点击触发按情绪筛选，与搜索关键词组合筛选。通过 `window.emotionFilter` 全局状态管理。
- **用户弹窗**：存在两套实现。`user-popup.js`（更完整，含好友申请/聊天按钮/统计数据）在捕获阶段全局监听。`app.js` 中的 `showUserPopup` 为简化版。新功能应优先增强 `user-popup.js`。
- **CSS**：所有样式使用 `:root` CSS 自定义属性。调色板固定为暖色亮调，无暗色模式。

## 优化路线图

基于用户调研（3类核心用户画像：自我耗竭的倾听者、高焦虑学子、高敏感孤岛寻找者）和竞品分析，以下是结构化演进方向。

### 已完成

- [x] 公共工具函数收敛到 `utils.js`（escapeHtml/formatDate/updateTextSmoothly）
- [x] 广场分页加载（`pageSize = 20`，Supabase `.range()`）
- [x] 树灵对话 localStorage 持久化 + 30条自动裁剪
- [x] 情绪标签筛选（`window.emotionFilter` + localStorage 缓存 `emotion_${id}`）
- [x] 聊天未读红点
- [x] 用户资料弹窗（`user-popup.js`，含好友申请/统计数据）
- [x] 内容审核（`moderateContent` → `/api/gemini`，暴力/自残/仇恨/色情拦截）
- [x] 聊天敏感词本地过滤（去除 AI 审核延迟，27个敏感词即时星号替换）
- [x] 点赞/收藏去重 + REST API DELETE 模式
- [x] Playwright 自动化测试（26 用例）

### 短期（提升留存与体验）

- [ ] **树灵情绪记忆增强**：从历史对话提取情绪关键词（焦虑、考研、失眠等），下次会话注入 SYSTEM_PROMPT 开篇，实现"被记住"的延续感。实现：`shuling.html` 的 `saveConversation` 中调用 `/api/gemini` 提取高频情绪词，存入 localStorage，下次 `buildSystemPrompt` 时拼接。注意控制上下文长度避免 Token 超限。
- [ ] **广场滚动加载优化**：确认 `app.js` 中 `fetchQuestions` 是否正确使用 `.range(from, to)` 分页，情绪筛选切换时重置页码。当前 `pageSize = 20` 已定义，需验证触底加载实际生效。
- [ ] **PHQ-9 历史趋势图**：在 `profile.html` 展示用户历次测评分数曲线。`profiles` 表当前只存最新 `phq9_score`，需新建 `phq9_history` 表（user_id, score, created_at）或用 localStorage 暂存。

### 中期（构建社区机制）

- [ ] **朋辈倾听者认证**：`profiles` 增加 `is_peer_supporter` 字段。用户通过共情答题申请认证，高危机心事优先推送给认证倾听者。复用现有测评框架。风险：倾听者"替代性创伤"需配套 AI 疏导机制。
- [ ] **MBTI 慢匹配"落叶盲盒"**：在 `chat.html` 新增"提灯寻友"入口。基于 MBTI 互补度 + 情绪标签交集匹配，每日限投1封匿名长信。匹配池须服从 `profiles.show_*` 隐私开关，关闭 show_mbti 的用户彻底排除。
- [ ] **离线通知**：注册 Service Worker 接收 Web Push，或 Supabase Edge Functions + 邮件网关（Resend/SendGrid）。`answers` 或 `messages` 表 INSERT 时触发异步通知。通知文案保持诗意、低频，避免打扰焦虑。
- [ ] **书洞资源动态化**：`books.html` 当前为静态硬编码卡片。建立 `resources` 表（title, author, category, url, description, submitted_by），支持用户匿名推荐 + AI 自动分类标签。

### 长期（差异化壁垒）

- [ ] **心事语义共振网络**：Supabase 启用 `pgvector` 扩展。发布心事时通过 `/api/gemini` 生成 1536 维 Embedding，存入向量字段。详情页底部展示全站语义最相似的3条往期心事（余弦距离）。必须异步生成，不阻塞发布回显。
- [ ] **情绪年轮可视化**：每日用不同颜色银杏叶记录心情，月末聚合成"情绪年轮树"。存储：`mood_logs` 表（user_id, mood_type, note, created_at）或 localStorage。
- [ ] **树洞回音壁**：允许树友为沉重心事匿名寄送"情绪急救包"（手写文字 + 治愈音乐链接），以卡片形式悬挂在收件人个人中心。
- [ ] **关怀代币闭环**：内循环"微光"代币，通过高质量回帖/维护社区获得。可兑换 AI 主题外观、电子书，或达标后以社区名义向心理援助公益组织捐赠。须严防刷帖灌水扭曲生态。

### 竞品差异化护城河

项目3个核心壁垒须在所有优化中坚守：
1. **人机协同双轨共情**：AI 24h在线 + 人类树友 Peer Support，不可偏废
2. **去商业化纯净结界**：无框架、无广告、无算法成瘾、无信息流投喂
3. **临床严谨 × 诗意美学**：PHQ-9/MBTI 量化工具包裹在文学隐喻中，降低"病理心理防御"

### 当前最大短板

- **离线通知断层**：用户退出页面后无法感知回复/私信，完全依赖页面内轮询。复访率瓶颈。
- **广场全量加载风险**：需确认分页是否在所有路径（搜索、情绪筛选、初次加载）均生效。
- **详情页独立重复代码**：`detail.html` 不加载 `app.js`，自维护一套 Supabase/工具函数，与全站模式不一致。
