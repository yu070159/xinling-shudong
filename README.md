<br />

# 🌳 心灵树洞 (Soul Tree Hollow)

> “最让人安心的抚慰，不是大声的鼓励与说教，而是安静的接纳、陪伴与共情。”

## 📖 1. 项目简介

**心灵树洞 (Soul Tree Hollow)** 是一个专注于匿名倾诉与情绪互助的温暖 Web 社区。

在这个快节奏的时代，无论是学业的重压还是人际的内耗，都需要一个安全的结界来释放。本项目致力于构建这样一个深夜里的“深林避难所”，结合原生前端技术与 AI 大语言模型，为每一个疲惫的灵魂提供无评判的倾听。在这里，夜色会隐去你的姓名，落叶会守口如瓶，所有的悲喜都能被温柔接住。

## 🎯 2. 解决的问题

针对当代青年（特别是面临校园内卷、学业压力与社交困境的群体），现实生活中往往缺乏绝对安全的情绪排解渠道。许多人在日常生活中经常充当朋友间的“心理导师”，善于开导他人，但自身的负面情绪却鲜少有被妥善接纳的地方。

本项目打破了熟人社交的评判压力，弥补了传统树洞缺乏正向反馈的缺陷。它为高度敏感、关注精神世界的群体（如 INFJ 等性格倾向），或是暂时陷入低谷、渴望共鸣的用户，提供了一个可以卸下防备、反向汲取能量的栖息地。

## 🔗 3. 在线演示

- 🌍 **Live Demo:** [https://your-project-name.vercel.app](https://www.google.com/search?q=https://your-project-name.vercel.app) *(请在此替换为你的真实链接)*
- 🎨 **UI 风格:** 深色暖调 / 森林光晕 / 极简诗意

## ✨ 4. 功能列表

- **🍂 匿名树洞广场**
  - 发布、浏览匿名心事，无社交压力。
  - 通过“暖心”按钮给予轻量级情感支持。
  - 支持基于关键词的模糊搜索，寻找相似回声。
- **👤 用户系统**
  - 完整的注册、登录与状态管理逻辑。
  - 可自定义昵称与查看个人互动足迹。
- **🧭 心理探索与测试**
  - **MBTI 性格测试：** 20 题精简量表，直觉选择，自动计算并更新至个人资料。
  - **PHQ-9 情绪自评：** 9 题标准化量表，提供客观的情绪分级评估与专业求助指引。
- **🌿 树灵 AI 陪伴**
  - **独立对话页：** 专属的情感抚慰空间。
  - **全局悬浮窗：** 支持跨页面的呼吸光晕 AI 浮窗，随时唤醒陪伴。
  - 内置严格的 Prompt 边界与危机干预提示词。
- **📚 资源书洞**
  - 收录心理学经典、自我成长指南及免费优质的公开课资源，指引成长路径。
- **📮 森林信箱 (反馈系统)**
  - 收集用户意见，共同建设社区。

## 🛠 5. 技术栈

本项目采用“重体验、轻架构”的设计思路，最大程度保证前端的纯粹性与加载性能：

- **前端:** HTML5 / CSS3 / ES6+ JavaScript (原生无框架，追求极致轻量)
- **后端 / BaaS:** Supabase (基于 PostgreSQL，处理 Auth 与 Database)
- **AI 引擎:** Google Gemini API (提供深层共情与诗意回复)
- **部署:** Vercel (Edge CDN 加速分发)

## 🏗 6. 页面架构

共计 12 个核心视图/组件：

1. `welcome.html` - 引导页 (诗意交互与入口)
2. `index.html` - 树洞广场 (主信息流)
3. `detail.html` - 问题详情 (回答与互动区)
4. `login.html` / `register.html` - 鉴权页面
5. `profile.html` - 个人中心
6. `mbti.html` - MBTI 探索
7. `phq9.html` - 心理健康自评
8. `shuling.html` - 树灵 AI 对话
9. `books.html` - 书洞资源库
10. `feedback.html` - 意见反馈
11. `ai-float.js` - 全局 AI 浮窗独立组件

## 🗄️ 7. 数据库设计 (Supabase)

采用 PostgreSQL 关系型数据库，配置了严格的 Row Level Security (RLS) 策略以保障匿名与数据安全：

- `profiles`: 用户资料表 (记录昵称、MBTI 类型等衍生信息)
- `questions`: 心事主表 (内容、时间戳、关联用户)
- `answers`: 回应表 (内容、关联心事 ID)
- `reactions`: 暖心互动表 (防止重复点赞的关联表)
- `feedbacks`: 反馈收集表

## 🚀 8. 本地运行步骤

由于项目为原生前端架构，无需复杂的 Node.js 依赖即可运行：

1. 克隆仓库到本地：

   Bash
   ```
   git clone https://github.com/your-username/soul-tree-hollow.git
   cd soul-tree-hollow

   ```
2. 推荐使用 VS Code 编辑器，安装 **Live Server** 插件。
3. 右键点击 `welcome.html`，选择 `Open with Live Server`。
4. 浏览器将自动打开 `http://127.0.0.1:5500/welcome.html` 即可预览。

## 🔐 9. 环境变量配置

要使数据库与 AI 功能正常运作，请在项目相关的 JS 文件（如全局配置或特定的 API 调用文件）中配置你的个人密钥（生产环境建议通过 Vercel 配置并使用代理）：

JavaScript

```
// 示例：全局配置文件或直接在 SDK 初始化中填入
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';

```

## 📁 10. 项目结构

Plaintext

```
soul-tree-hollow/
├── css/
│   ├── global.css        # 全局主题与颜色变量
│   └── animations.css    # 核心呼吸与浮动动效
├── js/
│   ├── app.js            # 全局导航与鉴权状态管理
│   ├── ai-float.js       # AI 浮窗组件逻辑
│   └── ...               # 页面专属逻辑脚本
├── assets/               # 图像、SVG 与占位符
├── index.html
├── books.html
├── shuling.html
└── ... (其他 HTML 视图)

```

## 📈 11. 后续优化方向

- **代码结构重构：** 对冗杂的 JavaScript 脚本进行面向对象的 Class 重构，提升模块的复用性与可维护性。
- **算法增强：** 引入更精确的匹配逻辑（如利用文本向量与欧氏距离算法），为用户推荐高度相似的“历史心事”，增强跨时空的共鸣感。
- **性能优化：** 对 CSS/JS 进行生产环境压缩，并将第三方 CDN 资源更换为国内更稳定的代理节点，提升首屏渲染速度。

## 📄 12. 许可证

本项目基于 [MIT License](https://www.google.com/search?q=LICENSE) 开源。允许自由使用、修改和分发，愿这片树洞能把温暖传递给更多人。
