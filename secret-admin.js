// secret-admin.js — 管理员秘密面板（IIFE，自动注入导航栏）
(function() {
  'use strict';

  var ADMIN_PASSWORD = '070929';
  var STORAGE_KEY = 'admin_authenticated';

  function $(id) { return document.getElementById(id); }

  // 注入"秘密"按钮到导航栏
  function injectButton() {
    var header = document.querySelector('.forest-header');
    if (!header || document.getElementById('secretAdminBtn')) return;

    var btn = document.createElement('button');
    btn.id = 'secretAdminBtn';
    btn.textContent = '🔒 秘密';
    btn.style.cssText = 'background:none;border:1px solid rgba(255,255,255,0.15);color:var(--nav-text);cursor:pointer;font-size:0.85rem;padding:4px 10px;border-radius:6px;opacity:0.5;transition:opacity 0.2s;';
    btn.addEventListener('mouseenter', function() { btn.style.opacity = '0.8'; });
    btn.addEventListener('mouseleave', function() { btn.style.opacity = '0.5'; });
    btn.addEventListener('click', openPasswordPrompt);

    header.appendChild(btn);
  }

  // 密码输入弹窗
  function openPasswordPrompt() {
    // 已认证则直接打开面板
    if (sessionStorage.getItem(STORAGE_KEY) === '1') {
      openAdminPanel();
      return;
    }

    var overlay = createOverlay();
    overlay.innerHTML =
      '<div class="admin-pwd-box">' +
        '<div class="admin-pwd-title">🔐 管理员验证</div>' +
        '<input type="password" class="admin-pwd-input" id="adminPwdInput" placeholder="输入密码" autofocus>' +
        '<div class="admin-pwd-error" id="adminPwdError"></div>' +
        '<div class="admin-pwd-actions">' +
          '<button class="admin-pwd-btn cancel" id="adminPwdCancel">取消</button>' +
          '<button class="admin-pwd-btn confirm" id="adminPwdConfirm">确认</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.style.display = 'flex';

    var input = $('adminPwdInput');
    setTimeout(function() { input.focus(); }, 100);

    $('adminPwdCancel').addEventListener('click', function() {
      document.body.removeChild(overlay);
    });
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) document.body.removeChild(overlay);
    });

    $('adminPwdConfirm').addEventListener('click', function() { verifyPassword(overlay); });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') verifyPassword(overlay);
    });
  }

  function verifyPassword(overlay) {
    var input = $('adminPwdInput');
    var errorEl = $('adminPwdError');
    if (input.value === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      document.body.removeChild(overlay);
      openAdminPanel();
    } else {
      errorEl.textContent = '密码错误，请重试';
      errorEl.style.display = 'block';
      input.value = '';
      input.focus();
    }
  }

  // 主面板
  function openAdminPanel() {
    if (document.getElementById('adminPanelOverlay')) return;

    var overlay = createOverlay();
    overlay.id = 'adminPanelOverlay';
    overlay.innerHTML =
      '<div class="admin-panel">' +
        '<div class="admin-panel-header">' +
          '<h2 class="admin-panel-title">🛡️ 管理员面板</h2>' +
          '<button class="admin-panel-close" id="adminPanelClose">✕</button>' +
        '</div>' +
        '<div class="admin-tabs">' +
          '<button class="admin-tab active" data-tab="feedbacks">📝 用户反馈 <span class="admin-tab-count" id="fbCount">-</span></button>' +
          '<button class="admin-tab" data-tab="resources">📚 推荐书籍 <span class="admin-tab-count" id="resCount">-</span></button>' +
        '</div>' +
        '<div class="admin-tab-content" id="adminTabContent">' +
          '<div class="admin-loading">加载中...</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.style.display = 'flex';

    $('adminPanelClose').addEventListener('click', function() {
      document.body.removeChild(overlay);
    });
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) document.body.removeChild(overlay);
    });

    // Tab 切换
    overlay.querySelectorAll('.admin-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        overlay.querySelectorAll('.admin-tab').forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        renderTabContent(tab.dataset.tab);
      });
    });

    fetchData(overlay);
  }

  var cachedData = null;

  async function fetchData(overlay) {
    var apiBase = window.API_BASE || '';
    var content = $('adminTabContent');

    try {
      var res = await fetch(apiBase + '/api/admin', {
        headers: { 'Authorization': 'Bearer ' + ADMIN_PASSWORD }
      });
      if (!res.ok) {
        content.innerHTML = '<div class="admin-error">数据加载失败 (HTTP ' + res.status + ')</div>';
        return;
      }
      cachedData = await res.json();
      $('fbCount').textContent = (cachedData.feedbacks || []).length;
      $('resCount').textContent = (cachedData.resources || []).length;
      renderTabContent('feedbacks');
    } catch (e) {
      content.innerHTML = '<div class="admin-error">网络错误：' + e.message + '</div>';
    }
  }

  function renderTabContent(tab) {
    var content = $('adminTabContent');
    if (!cachedData) return;

    if (tab === 'feedbacks') {
      var feedbacks = cachedData.feedbacks || [];
      if (feedbacks.length === 0) {
        content.innerHTML = '<div class="admin-empty">暂无反馈数据</div>';
        return;
      }
      content.innerHTML = '<div class="admin-list">' + feedbacks.map(function(f) {
        var category = f.category ? ('<span class="admin-tag">' + escapeHtml(f.category) + '</span>') : '';
        var date = f.created_at ? new Date(f.created_at).toLocaleString('zh-CN') : '';
        return '<div class="admin-card">' +
          '<div class="admin-card-header">' +
            category +
            '<span class="admin-card-user">' + escapeHtml(f.nickname || f.user_id || '匿名') + '</span>' +
            '<span class="admin-card-date">' + date + '</span>' +
          '</div>' +
          '<div class="admin-card-body">' + escapeHtml(f.content || f.message || f.feedback || '') + '</div>' +
          (f.contact ? '<div class="admin-card-contact">📧 ' + escapeHtml(f.contact) + '</div>' : '') +
        '</div>';
      }).join('') + '</div>';
    } else {
      var resources = cachedData.resources || [];
      if (resources.length === 0) {
        content.innerHTML = '<div class="admin-empty">暂无推荐数据</div>';
        return;
      }
      content.innerHTML = '<div class="admin-list">' + resources.map(function(r) {
        var date = r.created_at ? new Date(r.created_at).toLocaleString('zh-CN') : '';
        return '<div class="admin-card">' +
          '<div class="admin-card-header">' +
            '<span class="admin-tag">' + escapeHtml(r.category || '未分类') + '</span>' +
            '<span class="admin-card-user">推荐人：' + escapeHtml(r.submitted_by || '未知') + '</span>' +
            '<span class="admin-card-date">' + date + '</span>' +
          '</div>' +
          '<div class="admin-card-body">' +
            '<strong>' + escapeHtml(r.title) + '</strong> — ' + escapeHtml(r.author) +
          '</div>' +
          '<div class="admin-card-desc">' + escapeHtml(r.description || r.reason || '') + '</div>' +
          '<a class="admin-card-link" href="' + escapeHtml(r.link) + '" target="_blank" rel="noopener">' + escapeHtml(r.link) + '</a>' +
        '</div>';
      }).join('') + '</div>';
    }
  }

  function createOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'admin-overlay';
    return overlay;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }
})();
