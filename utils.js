// utils.js —— 全站公共工具函数 + 统一 Supabase 初始化（所有页面加载）
(function() {
  window.TreeHole = window.TreeHole || {};

  // 统一配置 — 唯一一处 Supabase 密钥定义
  var CONFIG = {
    SUPABASE_URL: 'https://oazntpskcghfxzcylnef.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_5i3Z5mF3VCwoEaXPaIJebA_55H6w13g',
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

  // API 地址：本地开发指向 vercel dev（默认3001），生产环境用相对路径
  var API_BASE = (function() {
    var hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    return '';
  })();

  // AI 内容审核（所有页面可复用，不依赖 Supabase）
  async function moderateContent(content) {
    try {
      var response = await fetch(API_BASE + '/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: '你是一个温暖的社区内容审核员。请审核以下用户发布的内容是否合适。判断标准：\n- 包含暴力、自残、自杀方法描述 → 不合适\n- 包含恶意攻击、仇恨言论、人身攻击 → 不合适\n- 包含色情、性骚扰内容 → 不合适\n- 正常的情绪倾诉、压力表达、寻求安慰 → 合适\n- 日常生活的烦恼、困惑、感悟 → 合适\n\n请只回复"合适"或"不合适"，不要加任何其他文字。\n\n内容：' + content
        })
      });

      if (!response.ok) {
        console.warn('内容审核服务不可用，放行');
        return { passed: true, reason: '' };
      }

      var data = await response.json();
      var text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

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
})();
