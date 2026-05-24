<br />

# 🌳 心灵树洞 (Soul Tree Hollow)

> "最让人安心的抚慰，不是大声的鼓励与说教，而是安静的接纳、陪伴与共情。"

## 📖 1. 项目简介

**心灵树洞 (Soul Tree Hollow)** 是一个专注于匿名倾诉与情绪互助的温暖 Web 社区。

在这个快节奏的时代，无论是学业的重压还是人际的内耗，都需要一个安全的结界来释放。本项目致力于构建这样一个深夜里的"深林避难所"，结合原生前端技术与 AI 大语言模型，为每一个疲惫的灵魂提供无评判的倾听。在这里，夜色会隐去你的姓名，落叶会守口如瓶，所有的悲喜都能被温柔接住。

## 🎯 2. 解决的问题

针对当代青年（特别是面临校园内卷、学业压力与社交困境的群体），现实生活中往往缺乏绝对安全的情绪排解渠道。许多人在日常生活中经常充当朋友间的"心理导师"，善于开导他人，但自身的负面情绪却鲜少有被妥善接纳的地方。

本项目打破了熟人社交的评判压力，弥补了传统树洞缺乏正向反馈的缺陷。它为高度敏感、关注精神世界的群体（如 INFJ 等性格倾向），或是暂时陷入低谷、渴望共鸣的用户，提供了一个可以卸下防备、反向汲取能量的栖息地。

## 🔗 3. 在线演示

- 🌍 **Live Demo:** [https://xinling-shudong.vercel.app](https://xinling-shudong.vercel.app)
- 🎨 **UI 风格:** 暖色森林调色板 / 光晕呼吸动效 / 极简诗意

## ✨ 4. 功能列表

- **🍂 匿名树洞广场**
  - 发布、浏览匿名心事，无社交压力。
  - 通过"暖心"按钮给予轻量级情感支持。
  - 支持基于关键词的模糊搜索，寻找相似回声。
- **👤 用户系统**
  - 完整的注册、登录与状态管理。
  - 自定义昵称、头像上传、查看个人互动足迹。
  - 隐私可见性设置（MBTI、简介、注册时间、统计数据等均可独立开关）。
- **🌿 树友社交**
  - 好友申请、接受/拒绝、解除好友关系。
  - 一对一私信聊天，每 5 秒自动轮询新消息。
  - 全局用户资料弹窗（点击头像即可查看对方信息并发起好友申请）。
- **🧭 心理探索与测试**
  - **MBTI 性格测试：** 20 题精简量表，自动计算并更新至个人资料。
  - **PHQ-9 情绪筛查：** 9 题标准化量表，提供客观的情绪分级评估与专业求助指引。
- **🌳 树灵 AI 陪伴**
  - **独立对话页：** 专属的情感抚慰空间（`shuling.html`）。
  - **全局悬浮窗：** 跨页面的呼吸光晕 AI 浮窗，可拖拽、可缩放，随时唤醒陪伴。
  - 内置严格的 Prompt 边界与危机干预提示词。
- **📚 资源书洞**
  - 收录心理学经典、自我成长指南及免费优质的公开课资源，指引成长路径。
- **📮 森林信箱**
  - 收集用户意见反馈，共同建设社区。

## 🛠 5. 技术栈

本项目采用"重体验、轻架构"的设计思路，最大程度保证前端的纯粹性与加载性能：

- **前端:** HTML5 / CSS3 / ES6+ JavaScript（原生无框架、无构建工具、无 npm 依赖）
- **后端 / BaaS:** Supabase（PostgreSQL + Auth + Storage + RLS）
- **AI 引擎:** DeepSeek API（通过 Vercel Serverless 函数代理，API Key 不暴露客户端）
- **部署:** Vercel

## 🏗 6. 页面架构

共计 12 个 HTML 页面 + 3 个公共 JS 脚本：

| 页面 | 说明 |
|------|------|
| `welcome.html` | 欢迎引导页，无需登录 |
| `index.html` | 树洞广场（心事信息流、搜索、发布） |
| `detail.html` | 心事详情 + 回答互动区 |
| `login.html` / `register.html` | 登录 / 注册 |
| `profile.html` | 个人中心（资料编辑、我的内容、好友管理） |
| `shuling.html` | 全屏树灵 AI 对话 |
| `chat.html` | 聊天列表（树友会话） |
| `chat-detail.html` | 一对一树友私信 |
| `books.html` | 书洞资源库 |
| `mbti-test.html` | MBTI 性格测试（20 题） |
| `mental-test.html` | PHQ-9 情绪筛查（9 题） |
| `feedback.html` | 意见反馈 |

公共脚本：

| 脚本 | 说明 |
|------|------|
| `app.js` | 核心共享逻辑，Supabase 初始化、API 函数、UI 渲染、鉴权辅助 |
| `ai-float.js` | 全局 AI 浮窗组件，可拖拽、可缩放 |
| `user-popup.js` | 用户资料弹窗，点击头像触发，展示资料 + 统计 + 好友操作 |
| `style.css` | 全局样式，CSS 自定义属性（暖色森林调色板） |

## 🗄️ 7. 数据库设计 (Supabase)

采用 PostgreSQL 关系型数据库，所有表均配置 Row Level Security (RLS) 策略以保障数据安全：

| 表名 | 说明 | 关键字段 |
|------|------|----------|
| `profiles` | 用户资料 | nickname, mbti, bio, avatar_url, phq9_score, show_* 可见性开关 |
| `questions` | 心事主表 | content, nickname, user_id |
| `answers` | 回应表 | question_id, content, nickname, user_id |
| `reactions` | 暖心互动 | user_id, target_type, target_id |
| `favorites` | 收藏 | user_id, question_id |
| `messages` | 私信 | sender_id, receiver_id, content, is_read |
| `friend_requests` | 好友关系 | from_user, to_user, status (pending/accepted/rejected) |
| `feedbacks` | 反馈收集 | content, user_id |

鉴权使用 Supabase Auth（邮箱/密码）。

## 🚀 8. 本地运行步骤

由于项目为原生前端架构，无需 Node.js 依赖即可运行：

1. 克隆仓库到本地：
   ```bash
   git clone https://github.com/your-username/soul-tree-hollow.git
   cd soul-tree-hollow
   ```

2. 推荐使用 VS Code 编辑器，安装 **Live Server** 插件。

3. 右键点击 `welcome.html`，选择 `Open with Live Server`。

4. 浏览器将自动打开 `http://127.0.0.1:5500/welcome.html` 即可预览。

> 如需测试 AI 聊天功能，需配置 `api/chat.js` 中的环境变量并运行 `vercel dev`。

## 🔐 9. 环境变量配置

AI 聊天功能依赖服务端代理（`api/chat.js`），在生产环境（Vercel）中设置：

```
DEEPSEEK_API_KEY=你的 DeepSeek API Key
```

本地开发时，创建 `.env.local` 文件并写入上述变量，然后运行 `vercel dev`。

Supabase 的 URL 和匿名 Key 已硬编码在 JS 中（设计上即为公开可读，安全边界由 RLS 保障）。

## 📁 10. 项目结构

```
soul-tree-hollow/
├── welcome.html              # 欢迎引导页
├── index.html                # 树洞广场
├── detail.html               # 心事详情
├── login.html / register.html # 登录/注册
├── profile.html              # 个人中心
├── shuling.html              # 树灵 AI 对话
├── chat.html                 # 聊天列表
├── chat-detail.html          # 树友私信
├── books.html                # 书洞资源库
├── mbti-test.html            # MBTI 测试
├── mental-test.html          # PHQ-9 筛查
├── feedback.html             # 意见反馈
├── app.js                    # 核心共享逻辑
├── ai-float.js               # AI 浮窗组件
├── user-popup.js             # 用户资料弹窗
├── style.css                 # 全局样式
├── api/
│   └── chat.js               # DeepSeek 代理（Vercel Serverless）
├── images/                   # 图片、OG 分享图
└── schema.sql                # 数据库初始化 SQL
```

## 📈 11. 后续优化方向

- **代码结构重构：** 对重复的工具函数进行统一整合，减少页面间的代码冗余，提升模块复用性。
- **算法增强：** 引入文本相似度匹配，为用户推荐高度相似的"历史心事"，增强跨时空的共鸣感。
- **性能优化：** 对 CSS/JS 进行生产环境压缩，将第三方 CDN 资源更换为国内更稳定的代理节点，提升首屏渲染速度。

## 📄 12. 许可证

本项目基于 [MIT License](LICENSE) 开源。允许自由使用、修改和分发，愿这片树洞能把温暖传递给更多人。
