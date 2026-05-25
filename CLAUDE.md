# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

为 Claude Code（claude.ai/code）提供项目上下文和开发指引。

**启动指令：每次对话开始，先执行 `/init` 刷新项目上下文，紧接着执行 `/compact`。**

## 交互规则

**强制中文交互**：在所有与用户的交互环节（包括但不限于 AskUserQuestion、确认提示、选项列表、任务进度汇报、错误提示、代码注释、commit message 等），必须使用中文。不允许使用英文提问或展示选项。此规则永久生效。

**任务通知**：通过 Claude Code Hooks + PowerShell 控制键盘指示灯闪烁，永久替换所有声音和弹窗方案：

### Elicitation 事件（AskUserQuestion 触发，即等待用户确认操作前）
执行 Scroll Lock 键闪烁 3 次（每次亮 300ms、灭 300ms）：
```powershell
PowerShell -Command "$wsh = New-Object -ComObject WScript.Shell; for ($i = 0; $i -lt 3; $i++) { $wsh.SendKeys('{SCROLLLOCK}'); Start-Sleep -Milliseconds 300; $wsh.SendKeys('{SCROLLLOCK}'); Start-Sleep -Milliseconds 300 }"
```

### Stop 事件（任务完成/回答问题后）
执行 Scroll Lock 键闪烁 1 次（亮 300ms、灭 300ms）：
```powershell
PowerShell -Command "$wsh = New-Object -ComObject WScript.Shell; $wsh.SendKeys('{SCROLLLOCK}'); Start-Sleep -Milliseconds 300; $wsh.SendKeys('{SCROLLLOCK}')"
```

### 备用方案
如果键盘没有 Scroll Lock 键，将所有 `{SCROLLLOCK}` 替换为 `{CAPSLOCK}`（闪烁 Caps Lock 键）。

### 配置位置（两处同步）
- 全局：`C:\Users\YU\.claude\settings.json`
- 项目本地：`.claude/settings.local.json`

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
`vercel dev` 启动在 `localhost:3000`，前端页面通过 Live Server（`localhost:5500`）访问时，`utils.js` 中的 `API_BASE` 会自动指向 `http://localhost:3000` 以调用本地 API 代理。

**测试：** 项目有 26 个 Playwright 用例（`tests/full-test.spec.js`），需要 Live Server 在 5500 端口运行。
```
npx playwright test                  # 运行全部测试
npx playwright test --headed         # 有头模式（观察浏览器）
npx playwright test --grep "广场"    # 按名称筛选用例
```

## 架构

### 公共脚本（所有页面都加载）

- **`utils.js`** —— 公共工具函数 + Supabase 初始化（IIFE）。提供 `escapeHtml`、`formatDate`、`updateTextSmoothly`、`moderateContent`（内容审核，调用 `/api/gemini`）、`analyzeEmotion`（已提至 `app.js` 的 `window.TreeHole`，`detail.html` 复用此版本）和 `API_BASE`（本地 `http://localhost:3000`，生产用相对路径）。函数同时挂载到 `window` 全局和 `window.TreeHole.utils`。所有 15 个页面均加载此脚本，新页面勿重复定义这些函数。在此处初始化了全局 Supabase 客户端 `window.TreeHole.supabase`。
- **`app.js`** —— 核心共享逻辑，IIFE 包裹。初始化 Supabase 客户端（`CONFIG.SUPABASE_URL` + `CONFIG.SUPABASE_ANON_KEY`），所有功能挂载在 `window.TreeHole`。暴露 `window.TreeHole.config`、`window.TreeHole.pageSize = 20`、`window.TreeHole.analyzeEmotion`。处理导航栏登录态、`index.html` 的心事发布/搜索/情绪筛选、`detail.html` 的回答/详情（通过 DOM-ready 回调）。`moderateContent` 委托给 `utils.js` 的 `window.moderateContent`。`renderQuestions` 使用 `_renderVersion` 竞态保护避免快速切换筛选时旧异步结果覆盖新结果。包含情绪标签分析（调用 `/api/gemini` + localStorage 缓存）、情绪筛选 UI。用户弹窗功能已迁移至 `user-popup.js`。
- **`ai-float.js`** —— 全局浮动 AI 聊天按钮（IIFE）。创建可拖拽的 🌳 按钮和可缩放聊天窗口。调用 `/api/chat`（DeepSeek 代理）。对话持久化到 `localStorage`。引入即用，无需手动初始化。
- **`user-popup.js`** —— 用户资料弹窗（IIFE）。**独立运行**，自行初始化 Supabase 客户端（优先复用 `window.TreeHole.supabase`，否则自行创建）。在 `document` 捕获阶段全局监听 `[data-user-id]` 点击。拉取资料 + 统计数据 + 好友关系，弹出包含头像、MBTI、简介、注册时间、统计、好友申请/聊天按钮的浮层。好友申请使用 REST API（`POST /rest/v1/friend_requests`）。
- **`notifications.js`** —— 全站通知中心（IIFE）。通过 `utils.js` 自动注入到所有页面，在导航栏创建铃铛按钮和下拉面板。30s 轮询 `notifications` 表未读计数，页面后台时触发 Browser Notification API 桌面通知。暴露 `window.TreeHole.Notifications` API（create / upsertMessage / refreshBadge / markAllRead）。通知类型：reply（回复）、message（私信）、friend_request（好友申请）、friend_accept（接受好友）、peer_support（危机优先通知认证倾听者）、match_letter（收到匿名信）。
- **`style.css`** —— 全局样式，CSS 自定义属性定义在 `:root`（暖色森林调色板：`--accent`、`--bg-main`、`--bg-card`、`--warm-heart`、`--danger`）。

### 页面结构（15 个 HTML 页面）

每个页面引入 `style.css`、CDN 加载 Supabase SDK、公共导航栏（`.forest-header`），以及页面专属的 `<style>` 和 `<script>` 块。页面脚本自行初始化 Supabase 客户端、处理鉴权守卫。

- `welcome.html` —— 欢迎页，无需登录
- `index.html` —— 树洞广场（主页）。心事卡片流、搜索、发布表单。情绪标签可点击筛选。使用 `app.js` 中的函数
- `detail.html` —— 心事详情 + 回答。加载 `app.js`，复用 `window.TreeHole` 的暖心/收藏/情绪分析/头像映射等共享函数。包含"AI 帮我想想"按钮（调用 `/api/gemini` 生成回复草稿）
- `login.html` / `register.html` —— 登录/注册页
- `profile.html` —— 个人中心，含标签页（个人资料、我的内容、好友申请、PHQ-9趋势图）。使用 REST API 进行资料写操作（`PATCH /rest/v1/profiles`），显示倾听者认证状态
- `shuling.html` —— 全屏 AI 聊天，"树灵"人格。调用 `/api/chat`。支持对话上下文记忆、情绪关键词提取与记忆注入，超过 30 条自动裁剪，可清除对话
- `chat.html` —— 聊天列表。有固定置顶的管理员聊天按钮，标题旁显示未读消息红点
- `chat-detail.html` —— 一对一树友聊天。Supabase Realtime 订阅 + 每 5 秒轮询兜底
- `books.html` —— 资源库（心理书籍推荐，静态卡片）
- `mbti-test.html` —— 20 题 MBTI 性格测试。结果调用 `/api/gemini` 生成分析
- `mental-test.html` —— PHQ-9 抑郁筛查（9 题）。结果调用 `/api/gemini` 生成分析，历史存入 localStorage
- `peer-cert.html` —— 朋辈倾听者认证考试（8 道场景题，AI 评分 3 维度：共情/边界/危机，≥30/40 分通过）
- `match.html` —— 提灯寻友（MBTI 落叶盲盒）。匹配算法（MBTI互补40分+情绪共鸣20分），每日限投1封匿名长信，收件箱模式 `?view=inbox`。匿名信存入 `match_letters` 表，回复后双方身份揭示
- `feedback.html` —— 反馈提交

### Supabase 数据库

- `profiles` —— 用户资料（nickname, mbti, bio, avatar_url, email, phq9_score, is_peer_supporter, last_active_at, last_email_digest_at, show_* 可见性开关）
- `questions` —— 心事（content, nickname, user_id）
- `answers` —— 回应（question_id, content, nickname, user_id）
- `reactions` —— 暖心反应（user_id, target_type: 'question'|'answer', target_id）
- `favorites` —— 收藏（user_id, question_id）
- `messages` —— 私信（sender_id, receiver_id, content, is_read）
- `friend_requests` —— 好友关系（from_user, to_user, status: 'pending'|'accepted'|'rejected'）
- `notifications` —— 通知（user_id, type, from_user_id, entity_id, link, content_preview, is_read, created_at）。类型：reply / message / friend_request / friend_accept / peer_support / match_letter。INSERT RLS：`auth.uid() = from_user_id AND user_id != auth.uid()`（发送者创建通知给他人）。SELECT/UPDATE/DELETE RLS：`auth.uid() = user_id`（接收者读写）。DELETE 额外允许 `auth.uid() = from_user_id`（发送者删除自己创建的通知，用于消息去重）。部分唯一索引防重复：reply（user_id+entity_id）、friend_request（user_id+from_user_id）、friend_accept（user_id+entity_id）。message 类型用应用层 upsert（先删旧未读再插入新）。
- `match_letters` —— 提灯寻友匿名信（from_user_id, to_user_id, content, is_read, created_at）
- `feedbacks` —— 用户反馈

鉴权使用 Supabase Auth（邮箱/密码）。所有表均启用 RLS 策略。

- `migrations/` —— 数据库迁移 SQL：
  - `add_message_review.sql` —— 消息审核相关
  - `fix_favorites_rls.sql` —— 收藏 RLS 策略修复
  - `add_reactions_unique.sql` —— reactions 表唯一约束
  - `add_friend_requests_unique.sql` —— friend_requests pending 部分唯一索引，清理 rejected 记录
  - `add_notifications.sql` —— 通知系统（notifications 表 + 4 种类型 + RLS + 部分唯一索引）
  - `add_peer_supporter.sql` —— 朋辈倾听者认证（profiles 加 `is_peer_supporter` 字段 + notifications 扩展 `peer_support` 类型）
  - `add_match_letters.sql` —— MBTI 落叶盲盒（match_letters 表 + RLS + notifications 扩展 `match_letter` 类型）
  - `add_peer_supporter_and_match_letters.sql` —— 合并迁移（peer_supporter + match_letters + 统一 notifications 类型约束，一次性执行）
  - `add_offline_email.sql` —— 离线邮件通知（profiles 加 email, last_active_at, last_email_digest_at + 回填已有用户邮箱）
  - `add_resources.sql` —— 资源库动态化（resources 表 + 21 条种子数据 + RLS 策略）

### 部署与 SEO

- **Vercel 部署**：项目根目录直接作为 Vercel 部署根目录，`vercel.json` 包含 Cron Job 配置（每天 UTC 10:00 触发 `/api/cron` 发送离线邮件摘要）。
- **`robots.txt`** —— 爬虫规则：允许广场/书洞/欢迎页，禁止登录/注册/个人中心等隐私页面。
- **`sitemap.xml`** —— 网站地图，指向生产环境各页面 URL。
- **`images/`** —— 静态资源（`og-image.jpg` 社交分享图、`wechat-share-icon.jpg` 微信分享图标）。

### 测试

- **Playwright**（`tests/full-test.spec.js`）：26 个自动化用例，需 Live Server 在 5500 端口。配置文件为根目录的 `playwright.config.js`（baseURL: `http://localhost:5500`，chromium，无头模式）。依赖 `package.json` 中的 `@playwright/test`。
- **手动测试**（`测试方案.md`）：聊天功能、敏感词过滤、删除聊天、未读消息的系统测试方案。

### API 代理

- **`api/chat.js`** —— DeepSeek 代理。从 `process.env.DEEPSEEK_API_KEY` 读取 Key，转发到 `api.deepseek.com/chat/completions`，模型 `deepseek-chat`。供 `ai-float.js` 和 `shuling.html` 使用。
- **`api/gemini.js`** —— DeepSeek 代理（历史文件名保留）。从 `process.env.DEEPSEEK_API_KEY` 读取 Key，转发到 `api.deepseek.com/chat/completions`，模型 `deepseek-v4-flash`，`max_tokens: 600`。响应包装为 Gemini 兼容格式。供内容审核、情绪分析、AI 回应建议、MBTI/PHQ-9 分析使用。
- **`api/cron.js`** —— 离线邮件摘要（Vercel Cron 触发）。查询 `last_active_at < N 天前` 且有未读通知的用户，通过 Resend API 发送邮件摘要。需 `RESEND_API_KEY` 和 `SUPABASE_SERVICE_KEY` 环境变量。

### 环境变量

- `DEEPSEEK_API_KEY` —— Vercel 控制台。`api/chat.js` 和 `api/gemini.js` 共用此 Key。
- `RESEND_API_KEY` —— Resend API Key（`api/cron.js` 发送邮件）。
- `SUPABASE_SERVICE_KEY` —— Supabase `service_role` Key（`api/cron.js` 绕过 RLS 查询）。
- `CRON_SECRET` —— Vercel Cron 请求验证密钥（可选，默认 `soul-tree-cron-secret`）。
- `EMAIL_FROM` —— 邮件发件人地址（可选，默认 `noreply@soultree.fun`）。
- `SITE_URL` —— 站点 URL（可选，默认 `https://soultree.fun`）。
- Supabase URL 和匿名 Key 硬编码在 `app.js` 的 `CONFIG` 对象中（公开可读，安全边界由 RLS 保障）。

## 关键模式

- **Supabase 客户端初始化**：`utils.js` 在 `window.TreeHole.supabase` 上创建全局共享客户端。`app.js` 和 `user-popup.js` 均复用此实例，不再各自初始化。
- **鉴权守卫**：需要登录的页面在 `DOMContentLoaded` 中检查 `sb.auth.getUser()`，若为 null 则跳转 `welcome.html`。
- **暖心去重**：通过 `reactions` 表 `user_id` 精确判断。`hasReacted` 为异步函数。`app.js`、`detail.html`、`user-popup.js` 均已同步。
- **工具函数**：`escapeHtml`、`formatDate`、`updateTextSmoothly` 已收敛到 `utils.js`，全局 `window` 和 `window.TreeHole.utils` 均可访问。新增页面勿自行定义这些函数。
- **API 调用基址**：`utils.js` 中 `API_BASE` 变量 —— 本地开发指向 `http://localhost:3000`，生产环境为空字符串（相对路径）。调用 API 代理时使用 `API_BASE + '/api/xxx'`。
- **暖心统计**：两步查询 —— 先查用户所有问题/回答 ID，再统计这些内容的暖心总数。
- **资料写入**：部分页面使用 Supabase REST API（`PATCH /rest/v1/profiles`）而非 JS 客户端 `.update()` 来绕过 RLS 限制。
- **AI API 调用模式**：`utils.js` 中 `moderateContent` 和 `app.js` 中 `analyzeEmotion` 均调用 `/api/gemini`（实为 DeepSeek 代理），以 API 不可用时"放行"的方式优雅降级（审核失败/exceptions 时 `passed: true`；情绪分析失败时返回 null）。情绪分析结果缓存到 `localStorage`（key: `emotion_${questionId}`）。`ai-float.js` 和 `shuling.html` 中的 `callDeepSeekAPI` 使用 `AbortController` 实现 30 秒超时，超时时抛出友好提示而非静默挂起。
- **聊天消息去重**：`chat-detail.html` 使用 `knownMessageIds` Set 跟踪已渲染消息 ID，轮询时只追加新消息（`filter` + `appendChild`），不再使用 `innerHTML = ''` 全量重绘，避免闪烁。
- **内容审核**：发布心事前调用 `moderateContent`（`/api/gemini`），阻止暴力/自残/仇恨/色情内容。
- **情绪筛选**：情绪标签可点击触发按情绪筛选，与搜索关键词组合筛选。通过 `window.emotionFilter` 全局状态管理。
- **用户弹窗**：由 `user-popup.js` 统一处理（含好友申请/聊天按钮/统计数据），在捕获阶段全局监听。`app.js` 中的旧版 `showUserPopup`（~90行）已删除。`user-popup.js` 使用 `activePopupRequest` 递增版本号防止快速连续点击时旧异步结果覆盖新弹窗。
- **危机干预**：24 个危机关键词集中定义在 `utils.js` 的 `window.TreeHole.CRISIS_KEYWORDS` 数组中，`CRISIS_HOTLINE` 热线电话也可全局访问。`ai-float.js` 和 `shuling.html` 的内置 `detectCrisis` 均复用此共享数组，匹配后即时展示热线提示。不依赖网络和 AI 判断，即使 API 不可用也会在 catch 中追加热线信息。`app.js` 的 `notifyPeerSupportersForCrisis` 在心事提交后异步检测危机关键词（本地命中或 AI 情绪分析判定高危），自动通知所有认证倾听者（`peer_support` 通知类型）。
- **Prompt 注入防护**：`moderateContent`（`utils.js`）和"AI 帮我想想"（`detail.html`）使用 `<user_content>...</user_content>` XML 标签包裹用户输入，在 prompt 中明确指令只审核/回应标签内内容，防止用户输入中的"忽略指令"类注入绕过审核。
- **好友请求清理**：拒绝好友申请时直接 DELETE（不再保留 rejected 状态记录）。解除好友时同时清除双方聊天记录。`friend_requests` 表通过部分唯一索引 `WHERE status = 'pending'` 防止重复申请。
- **离线活跃心跳**：`utils.js` 在 DOMContentLoaded 时及每 5 分钟通过 `sb.from('profiles').update({ last_active_at })` 上报活跃时间。`api/cron.js` 据此判断用户离站天数。
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
- [x] 危机干预关键词本地预检 + 热线提示（`ai-float.js` + `shuling.html`，20+ 危机词，即使 API 不可用也展示）
- [x] Prompt 注入防护（`<user_content>` XML 标签包裹用户输入，防止"忽略指令"类注入）
- [x] reactions 表唯一约束 + friend_requests pending 部分唯一索引
- [x] chat-detail 消息增量渲染（`knownMessageIds` Set 去重，消除 `innerHTML` 全量重绘闪烁）
- [x] profile.html 硬编码 Supabase Key 收敛到 `window.TreeHole.config`
- [x] AI API 30s 超时（`AbortController`，超时友好提示）
- [x] **全站通知中心**：`notifications` 表 + `notifications.js` 导航栏铃铛，30s 轮询未读计数，Browser Notification API 桌面通知。回复/私信/好友申请/接受好友 4 种通知类型，部分唯一索引防重复，message 类型 upsert 去重。通过 `utils.js` 自动注入所有页面，零 HTML 改动。

### 短期（提升留存与体验）

- [x] **树灵情绪记忆增强**：从历史对话提取情绪关键词（焦虑、考研、失眠等），下次会话注入 SYSTEM_PROMPT 开篇，实现"被记住"的延续感。已实现：`shuling.html` 的 `saveConversation` 中调用 `/api/gemini` 提取高频情绪词，存入 localStorage，下次 `buildSystemPrompt` 时拼接。
- [x] **广场滚动加载优化**：已确认 `app.js` 中 `fetchQuestions` 正确使用 `.range(from, to)` 分页，修复搜索关键词时 `hasMore` 误设为 true 导致滚动加载未过滤数据的 Bug。
- [x] **PHQ-9 历史趋势图**：测评结果保存到 localStorage `phq9_history`，`profile.html` 渲染最近 10 次彩色柱状趋势图（绿→黄→橙→红，按分数严重程度）。无需新建数据库表。

### 中期（构建社区机制）

- [x] **朋辈倾听者认证**：`profiles` 增加 `is_peer_supporter` 字段。用户通过 `peer-cert.html` 共情答题申请认证（8 道场景题，AI 3 维度评分），高危机心事优先推送给认证倾听者。已完成。
- [x] **MBTI 慢匹配"落叶盲盒"**：在 `chat.html` 新增"提灯寻友"入口。基于 MBTI 互补度 + 情绪标签交集匹配，每日限投1封匿名长信。匹配池须服从 `profiles.show_*` 隐私开关，关闭 show_mbti 的用户彻底排除。已完成。
- [x] **离线通知 Phase 1（全站通知铃铛）**：`notifications` 表 + `notifications.js`，导航栏铃铛未读徽标、下拉面板、桌面通知。已覆盖回复/私信/好友申请/好友接受 4 种类型。
- [x] **离线通知 Phase 2（离线邮件）**：Vercel Cron Job + Resend 邮件服务，用户离站超 3 天后发送通知摘要邮件。需配置 `RESEND_API_KEY` 和 `SUPABASE_SERVICE_KEY` 环境变量。
- [x] **书洞资源动态化**：`books.html` 新增 `loadResources()` 从 Supabase `resources` 表动态加载，失败降级到静态 `libraryData`。登录用户可见"+ 推荐资源"按钮和推荐弹窗（6 字段表单），提交后即时插入列表顶部并重置筛选。`migrations/add_resources.sql` 已执行（resources 表 + 21 条种子数据 + RLS）。

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

- **离线邮件通知已完成**：Phase 1（桌面通知 + 铃铛）+ Phase 2（Vercel Cron + Resend 邮件摘要）均已实现。用户离站 3 天后会收到未读通知摘要邮件。需在 Vercel 配置 `RESEND_API_KEY` 和 `SUPABASE_SERVICE_KEY` 环境变量后生效。

## 近期变更摘要（2026-05-24 ~ 2026-05-25）

### 已完成的重大功能
- **全站通知中心**：`notifications` 表 + `notifications.js`（铃铛/下拉面板/桌面通知/6种通知类型），通过 `utils.js` 自动注入全部 15 页面，零 HTML 改动
- **朋辈倾听者认证**：`peer-cert.html`（8 道场景题，AI 3 维度评分 ≥30/40 通过），`profiles.is_peer_supporter` 字段，危机优先通知认证倾听者
- **MBTI 落叶盲盒**：`match.html`（匹配算法纯客户端：MBTI 互补 40 分 + 情绪共鸣 20 分，每日限投 1 封匿名长信），回复后双方身份揭示
- **代码安全优化**：全域 API Key 收敛到 `utils.js` 单一定义，删除 `app.js` 死代码（`showUserPopup`/~90行），CSS 冲突修复（`.question-card` → `.test-question-card`），危机关键词集中管理
- **树灵情绪记忆增强**：`shuling.html` 从历史对话提取情绪关键词注入 SYSTEM_PROMPT
- **PHQ-9 历史趋势图**：`profile.html` localStorage 存储历次测评，渲染最近 10 次彩色柱状图
- **离线通知 Phase 2（离线邮件）**：`api/cron.js` + `vercel.json` Cron Job + Resend，用户离站 3 天后发送未读通知摘要邮件。`utils.js` 心跳上报 `last_active_at`（5 分钟节流）。需 Vercel 环境变量配置后生效。
- **Claude Code Hooks 任务通知**：全局 + 项目本地配置 `Elicitation`（AskUserQuestion 触发，同步阻塞式 MessageBox）和 `Stop`（任务完成，系统响铃）事件

### 关键技术决策
- 通知 message 类型用应用层 upsert（先删旧未读再插新），reply/friend_request/friend_accept 用部分唯一索引 + ON CONFLICT DO NOTHING
- INSERT RLS：`auth.uid() = from_user_id AND user_id != auth.uid()`（发送者创建通知给接收方）
- DELETE RLS 额外允许 `auth.uid() = from_user_id`（支持 message upsert 流程）
- 匹配算法纯客户端计算，不依赖 AI API；`match_letters` 查询须 try/catch 包裹确保迁移执行前优雅降级
- 任务通知权限：全局 + 项目本地各 2 条 PowerShell 自动允许规则（`*PresentationFramework*` / `*MessageBox*`），替代旧的 5 条 SoundPlayer 规则

### 用户设定
- 核心工作哲学：结果导向、极致耐心、产品思维
- 代码优化规范：完整阅读 → 安全操作 → 风险告知 → 16 项核心功能验证 → 修改清单
- 一次性本地工具不入库，用完即删
- Vercel 冷启动 5-8s 属正常现象；X-Frame-Options/CSP 未设置是 Vercel 默认行为，低优先级

### Playwright 状态
9 通过 / 17 失败（全为预存问题：URL 匹配 + 缺 Supabase 测试凭证），"所有页面无 400 错误"通过。

### 当前待办
- [x] ~~在 Supabase SQL Editor 运行迁移文件~~ 已执行
- [ ] 在 Vercel 控制台配置 `RESEND_API_KEY`、`SUPABASE_SERVICE_KEY` 等环境变量（离线邮件生效）
- [x] ~~书洞资源动态化~~ 已完成（`migrations/add_resources.sql` 已执行，`books.html` 改造已完成）

## 2026-05-25（会话来）对话总结

### 解决了什么问题
- CLAUDE.md 膨胀至 378 行，7 段重复对话总结占据近半篇幅，维护成本高且 AI 上下文浪费
- 提示音依赖手动 PowerShell 调用，每次触发需代码显式播放，不够实时和可靠
- 两个 SQL 迁移（peer_supporter + match_letters）存在约束冲突依赖，分开执行顺序不当会失败
- 离线通知仅有 Phase 1（页面打开时的桌面通知），用户关掉所有标签页后完全无法感知新动态
- books.html 20 条资源硬编码在 JS 数组中，新增资源需改代码部署

### 做了哪些修改
- **CLAUDE.md 重构**：加英文前缀、修 13→15 页面、删 showUserPopup 死代码引用、7 段对话总结合并为 1 段，净减 150 行
- **Claude Code Hooks 配置**：全局 `settings.json` + 项目 `.claude/settings.local.json` 添加 `Elicitation`（AskUserQuestion 触发，同步阻塞式 MessageBox）和 `Stop`（任务完成，系统响铃）hooks，规则写入 CLAUDE.md
- **SQL 迁移合并**：`add_peer_supporter_and_match_letters.sql` 将三个操作合为一次执行，避免约束冲突
- **离线通知 Phase 2**：新建 5 个文件——`migrations/add_offline_email.sql`（profiles 加 email/last_active_at/last_email_digest_at）、`api/cron.js`（Vercel Cron 邮件摘要端点）、`vercel.json`（Cron 配置）；修改 2 个文件——`app.js` signUp 存储 email、`utils.js` 心跳上报 last_active_at（5min 节流）
- **书洞资源动态化（部分）**：`migrations/add_resources.sql` 已创建（resources 表 + 21 条种子数据 + RLS），books.html 改造被中断
- **已执行迁移**：`add_peer_supporter_and_match_letters.sql` 和 `add_offline_email.sql` 已在 Supabase SQL Editor 执行成功

### 达成的共识
- 任务通知通过 Hooks 系统级触发（Elicitation 阻塞式 MessageBox + Stop 响铃），替代原有 SoundPlayer 方案，AskUserQuestion 前必须手动确认弹窗
- 离线邮件用 Resend 发送，Cron 每天 UTC 10:00 检查不活跃用户（last_active_at < 3 天前 + 有未读通知），每个离站周期最多发一次
- profiles.email 在注册时写入（回填已有用户），cron 直接读此字段发邮件
- SQL 迁移有依赖关系时合并为单文件，避免分开执行顺序问题
- 书洞动态化保留静态数据作为 Supabase 加载失败时的优雅降级

### 待办事项
- [ ] 在 Vercel 控制台配置 `RESEND_API_KEY`、`SUPABASE_SERVICE_KEY`（离线邮件生效的前提）
- [x] 在 Supabase SQL Editor 运行 `migrations/add_resources.sql`
- [x] 完成 `books.html` 改造：Supabase 动态加载 + 用户推荐表单 + 静态数据降级
- [ ] 长期路线图剩余 4 项：心事语义共振、情绪年轮可视化、树洞回音壁、关怀代币闭环
- [ ] 重启 Claude Code 使新 Hooks 生效（MessageBox + echo ^G）

## 2026-05-25（二次会话）对话总结

### 解决了什么问题
- 提示音方案不可靠，用户需要更强的感知——需要在 AskUserQuestion 前有阻塞式弹窗确保不遗漏交互确认
- 书洞资源动态化被中断，books.html 改造需完成
- Stop 通知方式从 Beep 改为 echo ^G，与用户终端习惯一致

### 做了哪些修改
- **Hooks 规则全面替换**：Elicitation → 同步阻塞式 MessageBox（`PresentationFramework`），Stop → `[System.Console]::Write([char]7)`（等价 `echo ^G`）。CLAUDE.md + 全局 + 项目本地 settings 三处同步更新
- **权限精简**：从 5 条 SoundPlayer 规则 → 2 条（`*PresentationFramework*` / `*MessageBox*`），移除所有声音播放权限
- **books.html 动态化**：新增 `loadResources()` 从 Supabase `resources` 表加载，失败降级到静态 `libraryData`；登录用户可见"+ 推荐资源"按钮和推荐弹窗（6 字段表单），提交后即时插入列表顶部并重置筛选
- **待办更新**：`add_resources.sql` 已执行 + books.html 改造已完成，两项勾销

### 达成的共识
- Hooks 在会话启动时一次性加载，中途修改配置文件需重启 Claude Code 才生效
- Elicitation MessageBox 是强制阻塞的，点击确定前程序不继续——作为每次 AskUserQuestion 的硬性前置动作
- Stop 通知使用 `echo ^G`（BEL 字符），不依赖 Windows 声音方案或 Media.SoundPlayer
- 书洞资源推荐表单仅登录用户可见，推荐成功即时回显到当前页面无需刷新
- books.html 静态数据永久保留作为 Supabase 不可用时的优雅降级

### 当前待办
- [ ] 重启 Claude Code 使新 Hooks（MessageBox + echo ^G）生效
- [ ] 在 Vercel 控制台配置 `RESEND_API_KEY`、`SUPABASE_SERVICE_KEY`（离线邮件生效）
- [ ] 长期路线图剩余 4 项
