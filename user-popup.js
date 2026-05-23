// ===================== 用户资料弹窗（含统计数据） =====================
(async function() {
  if (document.readyState === 'loading') {
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
  }

  let sb = window.TreeHole?.supabase;
  if (!sb) {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
      sb = window.supabase.createClient(
        'https://oazntpskcghfxzcylnef.supabase.co',
        'sb_publishable_5i3Z5mF3VCwoEaXPaIJebA_55H6w13g'
      );
    } else {
      console.warn('用户弹窗：Supabase 客户端不可用');
      return;
    }
  }

  // 注入 CSS（只注入一次）
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
    `;
    document.head.appendChild(style);
  }

  async function showPopup(userId) {
    const old = document.querySelector('.popup-overlay');
    if (old) old.remove();
    if (!userId) return;

    // 获取用户资料
    const { data: profile, error } = await sb
      .from('profiles')
      .select('nickname, avatar_url, mbti, bio, created_at, show_mbti, show_bio, show_join_date, show_hearts, show_favorites, show_posts, show_friends')
      .eq('user_id', userId)
      .single();

    if (error || !profile) return;

    // 并行查询统计数据
    const [
      { count: heartsCount },
      { count: favoritesCount },
      { count: questionsCount },
      { count: answersCount },
      { count: friends1 },
      { count: friends2 }
    ] = await Promise.all([
      // 暖心数（收到的）
      sb.from('reactions').select('*', { count: 'exact', head: true })
        .eq('target_id', userId)
        .eq('target_type', 'question'),
      // 收藏数
      sb.from('favorites').select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      // 发帖数
      sb.from('questions').select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      // 回答数
      sb.from('answers').select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      // 好友数（我发起的）
      sb.from('friend_requests').select('*', { count: 'exact', head: true })
        .eq('from_user', userId).eq('status', 'accepted'),
      // 好友数（接受我的）
      sb.from('friend_requests').select('*', { count: 'exact', head: true })
        .eq('to_user', userId).eq('status', 'accepted')
    ]);

    const postsTotal = (questionsCount || 0) + (answersCount || 0);
    const friendsTotal = (friends1 || 0) + (friends2 || 0);

    // 头像
    const avatarHTML = profile.avatar_url
      ? `<img src="${profile.avatar_url}" class="popup-avatar-img" alt="头像">`
      : `<div class="popup-avatar-placeholder">🌱</div>`;

    // 基本信息
    let contentHTML = `
      ${avatarHTML}
      <div class="popup-name">${profile.nickname || '匿名用户'}</div>
    `;

    // MBTI
    if (profile.show_mbti && profile.mbti) {
      contentHTML += `<div class="popup-row"><span class="popup-label">MBTI</span>${profile.mbti}</div>`;
    }

    // 简介
    if (profile.show_bio && profile.bio) {
      contentHTML += `<div class="popup-row"><span class="popup-label">简介</span>${profile.bio}</div>`;
    }

    // 注册时间
    if (profile.show_join_date && profile.created_at) {
      const d = new Date(profile.created_at);
      const dateStr = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
      contentHTML += `<div class="popup-row"><span class="popup-label">注册于</span>${dateStr}</div>`;
    }

    // 统计数据行
    let statsHTML = '';
    if (profile.show_hearts) {
      statsHTML += `<div class="popup-stat"><div class="popup-stat-num">${heartsCount || 0}</div><div class="popup-stat-text">暖心</div></div>`;
    }
    if (profile.show_favorites) {
      statsHTML += `<div class="popup-stat"><div class="popup-stat-num">${favoritesCount || 0}</div><div class="popup-stat-text">收藏</div></div>`;
    }
    if (profile.show_posts) {
      statsHTML += `<div class="popup-stat"><div class="popup-stat-num">${postsTotal}</div><div class="popup-stat-text">发帖/回应</div></div>`;
    }
    if (profile.show_friends) {
      statsHTML += `<div class="popup-stat"><div class="popup-stat-num">${friendsTotal}</div><div class="popup-stat-text">树友</div></div>`;
    }

    if (statsHTML) {
      contentHTML += `<div class="popup-divider"></div><div class="popup-stats">${statsHTML}</div>`;
    }

    // 创建弹窗
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
  }

  // 全局头像点击事件委托
  document.body.addEventListener('click', function(e) {
    const avatar = e.target.closest('[data-user-id]');
    if (!avatar) return;
    const userId = avatar.dataset.userId;
    if (userId) showPopup(userId);
  });

})();