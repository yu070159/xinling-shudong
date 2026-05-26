// glimmer-badge.js — 导航栏微光余额展示（自动注入，IIFE）
(function() {
  'use strict';

  var sb = window.TreeHole && window.TreeHole.supabase;
  if (!sb) return;

  var currentUserId = null;
  var currentBalance = 0;

  function $(id) { return document.getElementById(id); }

  // 注入微光徽章到导航栏
  function injectBadge() {
    var header = document.querySelector('.forest-header');
    if (!header || document.getElementById('glimmerBadge')) return;

    var container = document.createElement('div');
    container.className = 'glimmer-container';
    container.innerHTML =
      '<div id="glimmerBadge" class="glimmer-badge" style="display:none" title="微光余额">' +
        '<span class="glimmer-icon">✨</span>' +
        '<span class="glimmer-balance" id="glimmerBalance">0</span>' +
      '</div>' +
      '<button id="glimmerHelpBtn" class="glimmer-help-btn" style="display:none" title="微光是什么？">?</button>' +
      '<div id="glimmerPopover" class="glimmer-popover" style="display:none">' +
        '<div class="glimmer-popover-title">✨ 微光是什么？</div>' +
        '<div class="glimmer-popover-section">' +
          '<div class="glimmer-popover-label">🌟 获取途径</div>' +
          '<div class="glimmer-popover-item">💬 收到暖心回应 <span class="glimmer-amount">+1</span></div>' +
          '<div class="glimmer-popover-item">📮 发布心事 <span class="glimmer-amount">+1</span>（每日上限5条）</div>' +
          '<div class="glimmer-popover-item">🔥 连续签到7天 <span class="glimmer-amount">+5</span></div>' +
        '</div>' +
        '<div class="glimmer-popover-section">' +
          '<div class="glimmer-popover-label">🎨 使用方式</div>' +
          '<div class="glimmer-popover-item">🎭 兑换树灵主题外观 <span class="glimmer-cost">20 微光/套</span></div>' +
          '<div class="glimmer-popover-item">💛 公益捐赠获徽章 <span class="glimmer-cost">100/500/1000</span></div>' +
          '<div class="glimmer-popover-sub">虚拟捐赠，不涉及真实金钱。在个人中心操作。</div>' +
        '</div>' +
        '<div class="glimmer-popover-footer">' +
          '当前余额：<strong id="glimmerPopoverBalance">0</strong> 微光' +
        '</div>' +
      '</div>';

    header.appendChild(container);

    $('glimmerHelpBtn').addEventListener('click', function(e) {
      e.stopPropagation();
      var popover = $('glimmerPopover');
      var isOpen = popover.style.display === 'block';
      popover.style.display = isOpen ? 'none' : 'block';
    });

    document.addEventListener('click', function(e) {
      var popover = $('glimmerPopover');
      if (!popover || popover.style.display !== 'block') return;
      if (!e.target.closest('.glimmer-container')) {
        popover.style.display = 'none';
      }
    });
  }

  // 获取微光余额
  async function fetchBalance(userId) {
    try {
      var { data, error } = await sb.from('glimmer_ledger')
        .select('amount')
        .eq('user_id', userId);
      if (error) throw error;
      var balance = (data || []).reduce(function(s, r) { return s + r.amount; }, 0);
      currentBalance = balance;
      updateDisplay(balance);
    } catch (e) {
      console.warn('获取微光余额失败:', e.message);
    }
  }

  function updateDisplay(balance) {
    var badge = $('glimmerBadge');
    var helpBtn = $('glimmerHelpBtn');
    var balanceEl = $('glimmerBalance');
    var popoverBalance = $('glimmerPopoverBalance');

    if (badge) badge.style.display = 'inline-flex';
    if (helpBtn) helpBtn.style.display = 'inline-flex';
    if (balanceEl) balanceEl.textContent = balance;
    if (popoverBalance) popoverBalance.textContent = balance;
  }

  function hideBadge() {
    var badge = $('glimmerBadge');
    var helpBtn = $('glimmerHelpBtn');
    if (badge) badge.style.display = 'none';
    if (helpBtn) helpBtn.style.display = 'none';
  }

  // 鉴权状态监听
  function init() {
    injectBadge();

    sb.auth.onAuthStateChange(function(event, session) {
      if (session && session.user) {
        currentUserId = session.user.id;
        fetchBalance(currentUserId);
      } else {
        currentUserId = null;
        currentBalance = 0;
        hideBadge();
      }
    });

    // 初始状态
    sb.auth.getUser().then(function(r) {
      if (r.data.user) {
        currentUserId = r.data.user.id;
        fetchBalance(currentUserId);
      }
    });
  }

  // 暴露刷新接口供外部调用（暖心/发帖/签到后更新）
  window.TreeHole.refreshGlimmer = function() {
    if (currentUserId) fetchBalance(currentUserId);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
