# 情绪年轮可视化 设计文档

## 概述

新增独立页面 `mood-ring.html`，每日用不同颜色银杏叶记录心情，月末聚合成同心圆"年轮树"SVG 可视化。

## 数据库

### 新建表 `mood_logs`

```sql
CREATE TABLE mood_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  mood_type TEXT NOT NULL CHECK (mood_type IN ('开心', '平静', '难过', '焦虑', '生气')),
  note TEXT,
  created_at DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE (user_id, created_at)
);
```

- RLS: 用户只能读写自己的记录
- `UNIQUE(user_id, created_at)` 每日一条，修改时 UPDATE 覆盖

### 迁移文件

`migrations/add_mood_logs.sql`

## 情绪配色

| 心情 | 颜色 | 色值 |
|------|------|------|
| 开心 | 金黄 | `#f0c040` |
| 平静 | 叶绿 | `#7ba878` |
| 难过 | 雾蓝 | `#6b8cce` |
| 焦虑 | 暖橙 | `#e07b39` |
| 生气 | 枫红 | `#e05555` |
| 未记录 | 浅灰 | `rgba(180, 170, 155, 0.25)` |

## 页面结构 (`mood-ring.html`)

### 布局

1. **导航栏** — 复用 `.forest-header`，新增强导航链接
2. **每日签到区** — 5 个银杏叶情绪按钮 + 可选备注 + 提交按钮
3. **年轮树 SVG** — 同心圆可视化，默认显示最近 12 个月
4. **图例 + 统计** — 颜色图例 + 本月情绪分布统计

### 交互流

- 今日未记录：签到区高亮，选择情绪 → 写备注(可选) → 点击记录
- 今日已记录：显示"今日心情：[叶] [情绪名]"，点击"修改"回到选择态
- 点击叶子：显示日期 + 心情 tooltip，有备注时额外显示备注内容
- 年轮导航：左右箭头切换年份，点击某一圈放大该月

## 年轮树 SVG 渲染

- 最内圈 = 最早月份，向外扩展
- 每圈 N 片银杏叶（N = 该月天数），均匀分布在圆周
- 银杏叶使用简化的扇形 SVG path（带裂口的银杏轮廓）
- 圆心显示月份标签
- 未记录日显示半透明叶子
- Hover: 叶子 scale(1.15) + shadow + tooltip 淡入

## 文件清单

- `migrations/add_mood_logs.sql` — 数据库迁移
- `mood-ring.html` — 独立页面（含内联 CSS/JS）
- `style.css` — 新增年轮相关全局样式
- 页头导航栏各页面需新增"年轮"入口链接

## 不在本次范围

- 日历热力图（后续优化）
- 精细银杏叶 SVG path（后续可替换）
- 大面积动效（仅保留 hover 微交互）
- 历史年份懒加载（12 个月数据量小，一次查完）
