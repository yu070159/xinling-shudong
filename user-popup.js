// ===================== 用户资料弹窗（终极懒人包） =====================
(async function() {
  if (document.readyState === 'loading') {
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
  }

  const sb = window.TreeHole?.supabase;
  if (!sb) {
    console.warn('用户弹窗：Supabase 客户端不可用');
    return;
  }
  const SUPABASE_URL = window.TreeHole.config?.SUPABASE_URL || atob('aHR0cHM6Ly9vYXpudHBza2NnaGZ4emN5bG5lZi5zdXBhYmFzZS5jbw==');

  async function getCurrentUserId() {
    const { data: { user } } = await sb.auth.getUser();
    return user?.id || null;
  }

  async function checkFriendStatus(myUserId, targetUserId) {
    if (!myUserId || !targetUserId) return null;
    if (myUserId === targetUserId) return 'self';

    const { data: accepted } = await sb
      .from('friend_requests')
      .select('id, status')
      .or(`and(from_user.eq.${myUserId},to_user.eq.${targetUserId}),and(from_user.eq.${targetUserId},to_user.eq.${myUserId})`)
      .eq('status', 'accepted')
      .maybeSingle();
    if (accepted) return 'accepted';

    const { data: pendingSent } = await sb
      .from('friend_requests')
      .select('id')
      .eq('from_user', myUserId)
      .eq('to_user', targetUserId)
      .eq('status', 'pending')
      .maybeSingle();
    if (pendingSent) return 'pending_sent';

    const { data: pendingReceived } = await sb
      .from('friend_requests')
      .select('id')
      .eq('from_user', targetUserId)
      .eq('to_user', myUserId)
      .eq('status', 'pending')
      .maybeSingle();
    if (pendingReceived) return 'pending_received';

    return null;
  }

  async function sendFriendRequest(myUserId, targetUserId) {
    try {
      const token = (await sb.auth.getSession()).data.session?.access_token;
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/friend_requests`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': window.TreeHole.config.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${token}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            from_user: myUserId,
            to_user: targetUserId,
            status: 'pending'
          })
        }
      );
      if (!response.ok) {
        const errText = await response.text();
        console.error('发送好友申请失败:', errText);
        return false;
      }
      return true;
    } catch (err) {
      console.error('发送好友申请异常:', err);
      return false;
    }
  }

  if (!document.getElementById('popup-style')) {
    const style = document.createElement('style');
    style.id = 'popup-style';
    style.textContent = `
      .popup-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.45); display:flex; justify-content:center; align-items:center; z-index:9999; backdrop-filter:blur(2px); }
      .popup-card { background:var(--bg-card, #fff); border-radius:18px; padding:28px 24px; width:90%; max-width:340px; position:relative; box-shadow:0 12px 30px rgba(0,0,0,0.2); text-align:center; }
      .popup-close { position:absolute; top:12px; right:14px; background:none; border:none; font-size:20px; color:var(--text-muted, #999); cursor:pointer; line-height:1; }
      .popup-avatar-img { width:64px; height:64px; border-radius:50%; object-fit:cover; margin:0 auto 12px; display:block; border:2px solid var(--border-light, #eee); }
      .popup-avatar-placeholder { width:64px; height:64px; border-radius:50%; margin:0 auto 12px; display:flex; align-items:center; justify-content:center; font-size:32px; background:var(--accent-glow); border:2px solid var(--accent); }
      .popup-name { font-size:18px; font-weight:700; color:var(--text-primary, #333); margin-bottom:6px; }
      .popup-row { font-size:14px; color:var(--text-secondary, #666); margin-bottom:6px; }
      .popup-label { font-weight:600; color:var(--text-primary, #333); margin-right:6px; }
      .popup-stats { display:flex; justify-content:center; gap:18px; margin:14px 0 10px; flex-wrap:wrap; }
      .popup-stat { text-align:center; }
      .popup-stat-num { font-size:20px; font-weight:700; color:var(--accent); }
      .popup-stat-text { font-size:11px; color:var(--text-secondary); }
      .popup-divider { height:1px; background:var(--border-light, #eee); margin:10px 0; }
      .popup-friend-btn, .popup-chat-btn { display:inline-block; padding:8px 24px; border-radius:20px; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s; margin-top:8px; border:none; margin-left:6px; margin-right:6px; }
      .popup-friend-btn.add, .popup-chat-btn.chat { background:var(--accent); color:white; }
      .popup-friend-btn.add:hover, .popup-chat-btn.chat:hover { opacity:0.85; transform:scale(1.03); }
      .popup-friend-btn.pending, .popup-chat-btn.disabled { background:var(--text-muted, #999); color:white; cursor:not-allowed; }
      .popup-friend-btn.accepted { background:var(--accent-glow); color:var(--accent); cursor:default; }
      .popup-friend-btn.self { display:none; }
    `;
    document.head.appendChild(style);
  }

  var activePopupRequest = 0;

  async function showPopup(userId) {
    var requestId = ++activePopupRequest;
    var old = document.querySelector('.popup-overlay');
    if (old) old.remove();
    if (!userId) return;

    var myUserId = await getCurrentUserId();

    const [profileRes, userQuestionsRes, userAnswersRes, favoritesRes, friends1Res, friends2Res, friendStatus] = await Promise.all([
      sb.from('profiles').select('*').eq('user_id', userId).single(),
      sb.from('questions').select('id').eq('user_id', userId),
      sb.from('answers').select('id').eq('user_id', userId),
      sb.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      sb.from('friend_requests').select('*', { count: 'exact', head: true }).eq('from_user', userId).eq('status', 'accepted'),
      sb.from('friend_requests').select('*', { count: 'exact', head: true }).eq('to_user', userId).eq('status', 'accepted'),
      myUserId ? checkFriendStatus(myUserId, userId) : Promise.resolve(null)
    ]);

    const { data: profile, error } = profileRes;
    if (error || !profile) return;

    const questionIds = (userQuestionsRes.data || []).map(q => q.id);
    const answerIds = (userAnswersRes.data || []).map(a => a.id);
    let heartsCount = 0;
    if (questionIds.length > 0) {
      const { count: qHearts } = await sb.from('reactions').select('*', { count: 'exact', head: true })
        .eq('target_type', 'question').in('target_id', questionIds);
      heartsCount += qHearts || 0;
    }
    if (answerIds.length > 0) {
      const { count: aHearts } = await sb.from('reactions').select('*', { count: 'exact', head: true })
        .eq('target_type', 'answer').in('target_id', answerIds);
      heartsCount += aHearts || 0;
    }

    if (requestId !== activePopupRequest) return;

    var favoritesCount = favoritesRes.count || 0;
    var postsTotal = questionIds.length + answerIds.length;
    var friendsTotal = (friends1Res.count || 0) + (friends2Res.count || 0);

    var avatarHTML = profile.avatar_url
      ? `<img src="${profile.avatar_url}" class="popup-avatar-img" alt="头像">`
      : `<div class="popup-avatar-placeholder">🌱</div>`;

    let contentHTML = `
      ${avatarHTML}
      <div class="popup-name">${profile.nickname || '匿名用户'}${profile.is_peer_supporter ? ' <span class="peer-supporter-badge">🌿 认证倾听者</span>' : ''}</div>
    `;

    if (profile.show_mbti && profile.mbti) {
      contentHTML += `<div class="popup-row"><span class="popup-label">MBTI</span>${profile.mbti}</div>`;
    }
    if (profile.show_bio && profile.bio) {
      contentHTML += `<div class="popup-row"><span class="popup-label">简介</span>${profile.bio}</div>`;
    }
    if (profile.show_join_date && profile.created_at) {
      const d = new Date(profile.created_at);
      const dateStr = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
      contentHTML += `<div class="popup-row"><span class="popup-label">注册于</span>${dateStr}</div>`;
    }

    let statsHTML = '';
    if (profile.show_hearts !== false) {
      statsHTML += `<div class="popup-stat"><div class="popup-stat-num">${heartsCount}</div><div class="popup-stat-text">暖心</div></div>`;
    }
    if (profile.show_favorites !== false) {
      statsHTML += `<div class="popup-stat"><div class="popup-stat-num">${favoritesCount}</div><div class="popup-stat-text">收藏</div></div>`;
    }
    if (profile.show_posts !== false) {
      statsHTML += `<div class="popup-stat"><div class="popup-stat-num">${postsTotal}</div><div class="popup-stat-text">发帖/回应</div></div>`;
    }
    if (profile.show_friends !== false) {
      statsHTML += `<div class="popup-stat"><div class="popup-stat-num">${friendsTotal}</div><div class="popup-stat-text">树友</div></div>`;
    }

    if (statsHTML) {
      contentHTML += `<div class="popup-divider"></div><div class="popup-stats">${statsHTML}</div>`;
    }

    // 公益捐赠徽章
    var donated = profile.glimmer_donated || 0;
    if (donated > 0) {
      var badges = [];
      if (donated >= 100) badges.push('<span title="微光使者 · 累计捐赠100微光">🥉</span>');
      if (donated >= 500) badges.push('<span title="温暖之光 · 累计捐赠500微光">🥈</span>');
      if (donated >= 1000) badges.push('<span title="星火相传 · 累计捐赠1000微光">🥇</span>');
      if (badges.length > 0) {
        contentHTML += '<div style="text-align:center;margin-top:8px;font-size:11px;color:var(--text-secondary);">💛 公益徽章：' + badges.join(' ') + '</div>';
      }
    }

    let actionBtnsHTML = '';
    if (myUserId && myUserId !== userId) {
      if (friendStatus === 'accepted') {
        actionBtnsHTML = `
          <button class="popup-friend-btn accepted" disabled>已是树友</button>
          <button class="popup-chat-btn chat" id="popupChatBtn">发送消息</button>
        `;
      } else if (friendStatus === 'pending_sent') {
        actionBtnsHTML = `
          <button class="popup-friend-btn pending" disabled>已申请，等待对方通过</button>
          <button class="popup-chat-btn disabled" disabled>请先添加好友</button>
        `;
      } else if (friendStatus === 'pending_received') {
        actionBtnsHTML = `
          <button class="popup-friend-btn pending" disabled>对方已向你发出申请</button>
          <button class="popup-chat-btn disabled" disabled>请先添加好友</button>
        `;
      } else {
        actionBtnsHTML = `
          <button class="popup-friend-btn add" id="popupAddFriendBtn">申请加为树友</button>
          <button class="popup-chat-btn disabled" disabled>请先添加好友</button>
        `;
      }
    } else if (myUserId === userId) {
      actionBtnsHTML = `<button class="popup-friend-btn self">这是你自己</button>`;
    } else {
      actionBtnsHTML = `
        <button class="popup-friend-btn pending" disabled>登录后即可添加树友</button>
        <button class="popup-chat-btn disabled" disabled>请先登录</button>
      `;
    }

    if (actionBtnsHTML) {
      contentHTML += `<div class="popup-divider"></div>${actionBtnsHTML}`;
    }

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = `
      <div class="popup-card">
        <button class="popup-close">✕</button>
        ${contentHTML}
      </div>
    `;

    const close = () => overlay.remove();
    overlay.querySelector('.popup-close').onclick = close;
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) close();
    });

    document.body.appendChild(overlay);

    const addBtn = overlay.querySelector('#popupAddFriendBtn');
    if (addBtn && myUserId) {
      addBtn.addEventListener('click', async function() {
        this.textContent = '发送中...';
        this.disabled = true;
        const success = await sendFriendRequest(myUserId, userId);
        if (success) {
          // 通知对方
          if (window.TreeHole.Notifications) {
            window.TreeHole.Notifications.create({
              userId: userId,
              type: 'friend_request',
              fromUserId: myUserId,
              entityId: null,
              link: 'profile.html',
              contentPreview: '向你发送了好友申请'
            }).catch(function(){});
          }
          this.textContent = '已申请，等待对方通过';
          this.className = 'popup-friend-btn pending';
        } else {
          this.textContent = '发送失败，请重试';
          this.disabled = false;
          setTimeout(() => {
            this.textContent = '申请加为树友';
            this.className = 'popup-friend-btn add';
          }, 2000);
        }
      });
    }

    const chatBtn = overlay.querySelector('#popupChatBtn');
    if (chatBtn) {
      chatBtn.addEventListener('click', function() {
        close();
        window.location.href = `chat-detail.html?user=${userId}`;
      });
    }
  }

  // 我是唯一的弹窗入口，谁也别想绕过我！
  document.addEventListener('click', function(e) {
    const avatar = e.target.closest('[data-user-id]');
    if (!avatar) return;
    const userId = avatar.dataset.userId;
    if (userId) {
      e.preventDefault();
      e.stopPropagation();
      showPopup(userId);
    }
  }, true);

})();
