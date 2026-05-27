// notifications.js — 全站通知中心（铃铛 + 下拉面板 + 桌面通知）
(function() {
  'use strict';

  var sb = window.TreeHole && window.TreeHole.supabase;
  if (!sb) return;

  var currentUserId = null;
  var unreadCount = 0;
  var lastDesktopNotifCount = 0;
  var pollTimer = null;
  var notifPermission = localStorage.getItem('notif_permission');

  var typeIcons = {
    reply: '💬',
    message: '✉️',
    friend_request: '🤝',
    friend_accept: '✅',
    peer_support: '🆘',
    match_letter: '📮',
    echo: '💌'
  };

  function $(id) { return document.getElementById(id); }

  // === DOM 注入 ===
  function injectBell() {
    var header = document.querySelector('.forest-header');
    if (!header || document.getElementById('notifBell')) return;

    var container = document.createElement('div');
    container.className = 'notif-container';
    container.innerHTML =
      '<button id="notifBell" class="notif-bell" title="通知">' +
        '🔔<span id="notifBadge" class="notif-badge" style="display:none">0</span>' +
      '</button>' +
      '<div id="notifDropdown" class="notif-dropdown" style="display:none">' +
        '<div class="notif-header">' +
          '<span>消息通知</span>' +
          '<button id="notifMarkAllRead">全部已读</button>' +
        '</div>' +
        '<div id="notifList" class="notif-list"></div>' +
        '<div id="notifEmpty" class="notif-empty">暂无通知 ✨</div>' +
      '</div>';

    header.appendChild(container);

    $('notifBell').addEventListener('click', toggleDropdown);
    $('notifMarkAllRead').addEventListener('click', markAllRead);
    document.addEventListener('click', onDocumentClick);
  }

  // === 下拉面板 ===
  function toggleDropdown(e) {
    e.stopPropagation();
    var dd = $('notifDropdown');
    var isOpen = dd.style.display !== 'none';
    dd.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) {
      loadNotifications();
      requestDesktopPermission();
    }
  }

  function onDocumentClick(e) {
    var dd = $('notifDropdown');
    var bell = $('notifBell');
    if (dd && bell && !bell.contains(e.target) && !dd.contains(e.target)) {
      dd.style.display = 'none';
    }
  }

  async function loadNotifications() {
    if (!currentUserId) return;
    var list = $('notifList');
    var empty = $('notifEmpty');
    if (!list) return;

    try {
      var { data } = await sb.from('notifications')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false })
        .limit(30);

      if (!data || data.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'block';
        return;
      }
      empty.style.display = 'none';

      list.innerHTML = data.map(function(n) {
        return '<div class="notif-item ' + (n.is_read ? '' : 'unread') + '" data-id="' + n.id + '" data-link="' + escapeHtml(n.link) + '">' +
          '<span class="notif-icon">' + (typeIcons[n.type] || '🔔') + '</span>' +
          '<div class="notif-body">' +
            '<div class="notif-text">' + escapeHtml(n.content_preview || '') + '</div>' +
            '<div class="notif-time">' + formatTime(n.created_at) + '</div>' +
          '</div>' +
        '</div>';
      }).join('');

      list.querySelectorAll('.notif-item').forEach(function(item) {
        item.addEventListener('click', function() {
          var id = parseInt(this.dataset.id);
          var link = this.dataset.link;
          markOneRead(id);
          $('notifDropdown').style.display = 'none';
          if (link) window.location.href = link;
        });
      });
    } catch (e) {
      console.warn('加载通知失败:', e.message);
    }
  }

  // === 轮询 ===
  async function pollUnreadCount() {
    if (!currentUserId) return;
    try {
      var { count, error } = await sb.from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUserId)
        .eq('is_read', false);
      if (error) return;

      var newCount = count || 0;
      updateBadge(newCount);

      // 桌面通知：页面后台 + 新通知
      if (document.visibilityState === 'hidden' && newCount > lastDesktopNotifCount) {
        showDesktopNotif(newCount);
      }
      lastDesktopNotifCount = newCount;
    } catch (e) { /* 静默 */ }
  }

  function updateBadge(count) {
    unreadCount = count;
    var badge = $('notifBadge');
    var bell = $('notifBell');
    if (!badge || !bell) return;
    if (count > 0) {
      badge.style.display = 'flex';
      badge.textContent = count > 99 ? '99+' : count;
      bell.classList.add('has-notif');
    } else {
      badge.style.display = 'none';
      bell.classList.remove('has-notif');
    }
  }

  // === 桌面通知 ===
  function requestDesktopPermission() {
    if (notifPermission === 'granted' || notifPermission === 'denied') return;
    if (!('Notification' in window)) return;
    Notification.requestPermission().then(function(p) {
      notifPermission = p;
      localStorage.setItem('notif_permission', p);
    });
  }

  function showDesktopNotif(count) {
    if (notifPermission !== 'granted' || !('Notification' in window)) return;
    var titles = {
      reply: '有人回复了你',
      message: '有新私信',
      friend_request: '新的好友申请',
      friend_accept: '好友申请已通过',
      peer_support: '有树友需要紧急支持',
      match_letter: '收到一封匿名信'
    };
    try {
      // 查最新一条通知获取详情
      sb.from('notifications')
        .select('type, content_preview, link')
        .eq('user_id', currentUserId)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
        .then(function(r) {
          if (!r.data) return;
          var n = new Notification(titles[r.data.type] || '心灵树洞新消息', {
            body: r.data.content_preview || '',
            icon: '/images/wechat-share-icon.jpg',
            tag: 'soul-tree-notif'
          });
          n.onclick = function() {
            window.focus();
            if (r.data.link) window.location.href = r.data.link;
            n.close();
          };
        });
    } catch (e) { /* 静默 */ }
  }

  // === 标记已读 ===
  async function markOneRead(id) {
    try {
      await sb.from('notifications').update({ is_read: true }).eq('id', id);
      updateBadge(Math.max(0, unreadCount - 1));
    } catch (e) {}
  }

  async function markAllRead(e) {
    e.stopPropagation();
    if (!currentUserId) return;
    try {
      await sb.from('notifications')
        .update({ is_read: true })
        .eq('user_id', currentUserId)
        .eq('is_read', false);
      updateBadge(0);
      loadNotifications();
    } catch (e) {}
  }

  // === 公开 API ===
  window.TreeHole.Notifications = {
    create: async function(opts) {
      if (!currentUserId) return;
      try {
        var { error } = await sb.from('notifications').insert({
          user_id: opts.userId,
          type: opts.type,
          from_user_id: opts.fromUserId,
          entity_id: opts.entityId || null,
          link: opts.link,
          content_preview: (opts.contentPreview || '').substring(0, 50)
        });
        // 409 冲突（重复通知）静默忽略
        if (error && error.code !== '23505') console.warn('创建通知失败:', error.message);
      } catch (e) {}
    },

    upsertMessage: async function(opts) {
      if (!currentUserId) return;
      try {
        // 删除同发送者的旧未读消息通知
        await sb.from('notifications')
          .delete()
          .eq('user_id', opts.userId)
          .eq('from_user_id', opts.fromUserId)
          .eq('type', 'message')
          .eq('is_read', false);
        // 插入新通知
        await sb.from('notifications').insert({
          user_id: opts.userId,
          type: 'message',
          from_user_id: opts.fromUserId,
          entity_id: null,
          link: 'chat-detail.html?user=' + opts.fromUserId,
          content_preview: (opts.contentPreview || '').substring(0, 50)
        });
      } catch (e) {}
    },

    refreshBadge: pollUnreadCount
  };

  // === 辅助函数（复用 utils.js 全局函数） ===
  var escapeHtml = window.escapeHtml || function(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  var formatTime = window.formatDate || function(isoStr) {
    if (!isoStr) return '';
    var d = new Date(isoStr);
    var now = new Date();
    var diff = now - d;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
    return d.toLocaleDateString();
  };

  // === 初始化 ===
  function init() {
    sb.auth.getUser().then(function(r) {
      if (!r.data.user) return;
      currentUserId = r.data.user.id;
      injectBell();
      pollUnreadCount();
      pollTimer = setInterval(pollUnreadCount, 30000);
    }).catch(function() {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
