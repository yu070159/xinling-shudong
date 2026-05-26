// utils.js —— 全站公共工具函数 + 统一 Supabase 初始化（所有页面加载）
(function() {
  window.TreeHole = window.TreeHole || {};

  // 统一配置 — 唯一一处 Supabase 密钥定义
  var CONFIG = {
    SUPABASE_URL: atob('aHR0cHM6Ly9vYXpudHBza2NnaGZ4emN5bG5lZi5zdXBhYmFzZS5jbw=='),
    SUPABASE_ANON_KEY: atob('c2JfcHVibGlzaGFibGVfNWkzWjVtRjNWQ3dvRWFYUGFJSmViQV81NUg2dzEzZw=='),
  };
  window.TreeHole.config = CONFIG;

  // 初始化 Supabase 客户端（全局共享，避免各页面重复创建）
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    window.TreeHole.supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
  } else {
    window.TreeHole.supabase = null;
    console.error('Supabase SDK 未加载，请检查 <script> 引入顺序');
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  function formatDate(dateString) {
    var now = new Date();
    var date = new Date(dateString);
    var diff = Math.floor((now - date) / 1000);
    if (diff < 60) return '刚刚';
    if (diff < 3600) return Math.floor(diff / 60) + '分钟前';
    if (diff < 86400) return Math.floor(diff / 3600) + '小时前';
    if (diff < 2592000) return Math.floor(diff / 86400) + '天前';
    return date.toLocaleDateString('zh-CN');
  }

  // elementOrId 支持传入元素ID字符串或DOM元素本身
  function updateTextSmoothly(elementOrId, newText, statusClass) {
    var el = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(function() {
      el.innerText = newText;
      if (statusClass) el.className = 'smooth-text ' + statusClass;
      el.style.opacity = '1';
    }, 200);
  }

  // API 地址：本地开发指向 vercel dev（默认3000），生产环境用相对路径
  var API_BASE = (function() {
    var hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    return '';
  })();

  // AI 内容审核（所有页面可复用，不依赖 Supabase）
  // 用 XML 标签包裹用户内容，防止 prompt 注入绕过审核
  async function moderateContent(content) {
    try {
      var response = await fetch(API_BASE + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: '你是一个温暖的社区内容审核员。请审核用户发布的内容是否合适。判断标准：暴力、自残、自杀方法描述 → 不合适；恶意攻击、仇恨言论、人身攻击 → 不合适；色情、性骚扰内容 → 不合适；正常的情绪倾诉、压力表达、寻求安慰 → 合适；日常生活的烦恼、困惑、感悟 → 合适。请只回复"合适"或"不合适"，不要加任何其他文字。' },
            { role: 'user', content: '<user_content>' + content + '</user_content>' }
          ]
        })
      });

      if (!response.ok) {
        console.warn('内容审核服务不可用，放行');
        return { passed: true, reason: '' };
      }

      var data = await response.json();
      var text = data.choices?.[0]?.message?.content || '';

      if (text.includes('不合适')) {
        return { passed: false, reason: '你的回应可能需要更温和一些，树洞希望每一句话都能温暖他人' };
      }
      return { passed: true, reason: '' };
    } catch (err) {
      console.warn('内容审核异常，放行:', err);
      return { passed: true, reason: '' };
    }
  }

  window.escapeHtml = escapeHtml;
  window.formatDate = formatDate;
  window.updateTextSmoothly = updateTextSmoothly;
  window.API_BASE = API_BASE;
  window.moderateContent = moderateContent;
  window.TreeHole.utils = { escapeHtml: escapeHtml, formatDate: formatDate, updateTextSmoothly: updateTextSmoothly, API_BASE: API_BASE, moderateContent: moderateContent };

  // 危机干预关键词（全站共享，ai-float.js 和 shuling.html 复用）
  window.TreeHole.CRISIS_KEYWORDS = [
    '自杀', '不想活', '去死', '结束生命', '结束这一切', '不想存在',
    '自残', '割腕', '伤害自己', '杀死自己', '了结自己',
    '活不下去', '没有意义', '死了算了', '离开这个世界',
    '永远睡去', '醒不过来', '消失吧', '不想再醒',
    '怎么死', '安眠药', '跳楼', '上吊', '烧炭',
    '没人会在乎我', '没有我会更好', '我是个负担'
  ];
  window.TreeHole.CRISIS_HOTLINE = '全国心理危机干预热线：希望24热线 400-161-9995（24小时免费）';

  // 离线通知心跳：更新 last_active_at（5 分钟节流）
  var lastHeartbeat = 0;
  function sendHeartbeat() {
    var now = Date.now();
    if (now - lastHeartbeat < 300000) return; // 5 分钟内不重复
    lastHeartbeat = now;
    var sb = window.TreeHole.supabase;
    if (!sb) return;
    sb.auth.getUser().then(function(r) {
      if (!r.data.user) return;
      sb.from('profiles').update({ last_active_at: new Date().toISOString() }).eq('user_id', r.data.user.id).then(function() {});
    });
  }
  document.addEventListener('DOMContentLoaded', function() {
    sendHeartbeat();
    setInterval(sendHeartbeat, 300000); // 每 5 分钟一次
  });
})();

// 自动注入全站通知铃铛
(function(){var s=document.createElement('script');s.src='notifications.js';document.head.appendChild(s);})();
// 自动注入微光余额徽章
(function(){var s=document.createElement('script');s.src='glimmer-badge.js';document.head.appendChild(s);})();
// 自动注入管理员秘密面板
(function(){var s=document.createElement('script');s.src='secret-admin.js';document.head.appendChild(s);})();
