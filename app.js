(function() {
  // 防御性检查：确保 Supabase SDK 已加载
  if (typeof window.supabase === 'undefined') {
    console.error('Supabase SDK 未加载，请检查 <script> 引入顺序');
  }
  
  // 1. 统一的全局配置（将所有密钥收敛于此）
  const CONFIG = {
    SUPABASE_URL: 'https://oazntpskcghfxzcylnef.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_5i3Z5mF3VCwoEaXPaIJebA_55H6w13g',
    GEMINI_API_KEY: 'AIzaSyDa-FGYMW0LR54JKz4uv4wJJApBmzqMgLE'
  };
  
  window.TreeHole = window.TreeHole || {};
  window.TreeHole.config = CONFIG;
  window.TreeHole.supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
  const sb = window.TreeHole.supabase;

  // 常量配置
  const NICKNAME_KEY = 'treehole_nickname';
  const DEFAULT_NICKNAME = '匿名树友';

  // =====================
  // 工具与本地存储函数
  // =====================
  function getNickname() {
    return localStorage.getItem(NICKNAME_KEY) || DEFAULT_NICKNAME;
  }

  function saveNickname(nickname) {
    if (nickname.trim()) {
      localStorage.setItem(NICKNAME_KEY, nickname.trim());
    } else {
      localStorage.removeItem(NICKNAME_KEY);
    }
  }

  function hasReacted(targetType, targetId) {
    return localStorage.getItem(`reacted_${targetType}_${targetId}`) === '1';
  }

  function setReactedLocal(targetType, targetId) {
    localStorage.setItem(`reacted_${targetType}_${targetId}`, '1');
  }

  function formatDate(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return '刚刚';
    if (diff < 3600) return Math.floor(diff / 60) + '分钟前';
    if (diff < 86400) return Math.floor(diff / 3600) + '小时前';
    if (diff < 2592000) return Math.floor(diff / 86400) + '天前';
    return date.toLocaleDateString('zh-CN');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showMessage(elementId, message, type, timeout = 2000) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.className = `form-message ${type}`;
    el.style.display = 'block';
    el.style.opacity = '0';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.3s';
      el.style.opacity = '1';
    });
    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => el.style.display = 'none', 300);
    }, timeout);
  }

  function hideMessage(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.style.display = 'none';
  }

  function validateContent(content, maxLength = 500) {
    const trimmed = content.trim();
    if (!trimmed) return { valid: false, error: '请写下你想说的话' };
    if (trimmed.length > maxLength) return { valid: false, error: `内容不能超过${maxLength}字` };
    return { valid: true, trimmed };
  }

  function updateTextSmoothly(elementId, newText, statusClass = '') {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(() => {
      el.innerText = newText;
      if (statusClass) el.className = `smooth-text ${statusClass}`;
      el.style.opacity = '1';
    }, 200);
  }

  function initEmptyStateCursors() {
    const emptyStates = document.querySelectorAll('.empty-state-text');
    emptyStates.forEach(el => {
      el.classList.add('blinking-cursor');
      setTimeout(() => {
        el.classList.remove('blinking-cursor');
      }, 3500);
    });
  }

  // =====================
  // API 请求层
  // =====================
  async function getReactionCounts(targetType, targetIds) {
    if (!targetIds || targetIds.length === 0) return {};
    try {
      const { data, error } = await sb
        .from('reactions')
        .select('target_id')
        .eq('target_type', targetType)
        .in('target_id', targetIds);
      
      if (error) throw error;
      
      return data.reduce((counts, r) => {
        counts[r.target_id] = (counts[r.target_id] || 0) + 1;
        return counts;
      }, {});
    } catch (err) {
      console.error('获取反应计数失败:', err);
      return {};
    }
  }

  async function addReaction(targetType, targetId) {
    if (hasReacted(targetType, targetId)) return true;
    try {
      const { error } = await sb.from('reactions').insert({
        target_type: targetType,
        target_id: targetId
      });
      if (error) throw error;
      
      setReactedLocal(targetType, targetId);
      return true;
    } catch (err) {
      console.error('添加反应失败:', err);
      return false;
    }
  }

  async function fetchQuestions() {
    try {
      const { data, error } = await sb
        .from('questions')
        .select('id, content, nickname, created_at, user_id, answers(count)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const questionIds = data.map(q => q.id);
      const reactionCounts = await getReactionCounts('question', questionIds);
      
      return { success: true, data, reactionCounts };
    } catch (err) {
      console.error('获取心事列表失败:', err);
      return { success: false, error: '网络好像有点问题，请稍后再试' };
    }
  }

  async function submitQuestionAPI(content, nickname, userId = null) {
    try {
      const finalNickname = nickname.trim() || DEFAULT_NICKNAME;
      const payload = { content, nickname: finalNickname };
      if (userId) payload.user_id = userId;

      const { error } = await sb.from('questions').insert(payload);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('提交心事失败:', err);
      return { success: false, error: '倾诉失败，请再试一次' };
    }
  }

  async function fetchQuestionDetail(id) {
    try {
      const { data: question, error: qError } = await sb
        .from('questions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (qError || !question) throw new Error('问题不存在');

      const [qCounts, answersRes] = await Promise.all([
        getReactionCounts('question', [id]),
        sb.from('answers').select('*').eq('question_id', id).order('created_at', { ascending: true })
      ]);

      if (answersRes.error) throw answersRes.error;

      const answerIds = answersRes.data.map(a => a.id);
      const aCounts = await getReactionCounts('answer', answerIds);

      return { 
        success: true, 
        question: { ...question, heartCount: qCounts[id] || 0 }, 
        answers: answersRes.data, 
        answerCounts: aCounts 
      };
    } catch (err) {
      console.error('加载详情失败:', err);
      return { success: false, error: err.message || '加载失败' };
    }
  }

  async function submitAnswerAPI(questionId, content, nickname) {
    try {
      const finalNickname = nickname.trim() || DEFAULT_NICKNAME;
      const { error } = await sb.from('answers').insert({
        question_id: questionId,
        content: content,
        nickname: finalNickname
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('提交回答失败:', err);
      return { success: false, error: '回应失败，请重试' };
    }
  }

  async function signUp(email, password, nickname) {
    try {
      const finalNickname = nickname.trim() || email.split('@')[0];
      const { data, error } = await sb.auth.signUp({ email, password });
      if (error) throw error;
      
      if (data.user) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const { error: updateError } = await sb
          .from('profiles')
          .update({ nickname: finalNickname })
          .eq('user_id', data.user.id);
          
        if (updateError) {
          await sb.from('profiles').insert({ user_id: data.user.id, nickname: finalNickname });
        }
        window.location.href = 'index.html';
      }
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async function signIn(email, password) {
    try {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async function signOut() {
    try {
      await sb.auth.signOut();
    } catch (err) {
      console.warn('登出出现异常，强制清理本地状态', err);
    } finally {
      localStorage.removeItem(NICKNAME_KEY);
      window.location.href = 'welcome.html';
    }
  }

  async function getCurrentUser() {
    const { data: { user } } = await sb.auth.getUser();
    return user || null;
  }

  async function getUserProfile() {
    const user = await getCurrentUser();
    if (!user) return null;
    try {
      const { data, error } = await sb.from('profiles').select('*').eq('user_id', user.id).single();
      if (error) throw error;
      return data;
    } catch (err) {
      return null;
    }
  }

  // =====================
  // UI 渲染逻辑层
  // =====================
  function renderQuestions(questions) {
    const container = document.getElementById('questions-list');
    if (!container) return;

    if (questions.length === 0) {
      const searchInput = document.getElementById('searchInput');
      const hasSearchKeyword = searchInput && searchInput.value.trim();
      
      container.innerHTML = hasSearchKeyword 
        ? `<div class="empty-state"><div class="empty-state-icon">🔍</div><p class="empty-state-text">没有找到相关心事</p><p class="empty-state-sub">换一个词试试吧</p></div>`
        : `<div class="empty-state"><div class="empty-state-icon">🌳</div><p class="empty-state-text">这里还没有人倾诉心事</p><p class="empty-state-sub">你是第一个来到树洞的人，写下你的故事，会有人听见的。</p></div>`;
      initEmptyStateCursors();
      return;
    }

    const currentUserId = window.currentUserId;
    container.innerHTML = questions.map(q => {
      const preview = q.content.length > 50 ? q.content.substring(0, 50) + '...' : q.content;
      const answerCount = q.answers[0]?.count || 0;
      const heartCount = window.reactionCounts?.[q.id] || 0;
      const isMine = currentUserId && q.user_id === currentUserId;
      return `
        <a href="detail.html?id=${q.id}" class="question-card">
          ${isMine ? '<span class="my-tag">我的</span>' : ''}
          <div class="content-preview">${escapeHtml(preview)}</div>
          <div class="meta">
            <span>🧑 ${escapeHtml(q.nickname)}</span>
            <span>${formatDate(q.created_at)}</span>
            <span class="heart-count">♥ ${heartCount}</span>
            <span class="answer-count">${answerCount} 回答</span>
          </div>
        </a>
      `;
    }).join('');
  }

  async function initQuestionsBoard() {
    const res = await fetchQuestions();
    if (res.success) {
      window.allQuestions = res.data;
      window.reactionCounts = res.reactionCounts;
      renderQuestions(res.data);
    } else {
      const container = document.getElementById('questions-list');
      if (container) container.innerHTML = `<p class="error-message">${res.error}</p>`;
    }
  }

  function filterQuestions(keyword) {
    if (!window.allQuestions) return [];
    const k = keyword.toLowerCase().trim();
    if (!k) return window.allQuestions;
    return window.allQuestions.filter(q =>
      q.content.toLowerCase().includes(k) ||
      q.nickname.toLowerCase().includes(k)
    );
  }

  async function initQuestionDetailPage(id) {
    const res = await fetchQuestionDetail(id);
    if (!res.success) {
      document.getElementById('question-detail').innerHTML = `<p>${escapeHtml(res.error)}</p>`;
      return;
    }

    const { question, answers, answerCounts } = res;
    const questionReacted = hasReacted('question', id);
    const currentUserId = window.currentUserId;

    let favoriteCount = 0;
    let isFavorited = false;
    let friendStatus = null;

    if (currentUserId) {
      const { count } = await sb
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('question_id', id);
      favoriteCount = count || 0;

      const { data: favData } = await sb
        .from('favorites')
        .select('id')
        .eq('user_id', currentUserId)
        .eq('question_id', id)
        .maybeSingle();
      isFavorited = !!favData;

      if (question.user_id && question.user_id !== currentUserId) {
        const { data: reqData } = await sb
          .from('friend_requests')
          .select('status')
          .eq('from_user', currentUserId)
          .eq('to_user', question.user_id)
          .maybeSingle();
        friendStatus = reqData?.status || null;
      }
    }

    const isOwner = currentUserId && question.user_id === currentUserId;

    let actionBtnsHtml = `
      <div class="action-btns-row">
        <button class="heart-btn ${questionReacted ? 'reacted' : ''}"
                data-type="question" data-id="${id}"
                ${questionReacted ? 'disabled' : ''}>
          ${questionReacted ? '♡' : '♥'} <span class="count">${question.heartCount}</span>
        </button>
    `;

    if (currentUserId) {
      actionBtnsHtml += `
        <button class="action-btn favorite-btn" id="favoriteBtn" data-favorited="${isFavorited}">
          ${isFavorited ? '★ 已收藏' : '☆ 收藏'}<span class="favorite-count">(${favoriteCount})</span>
        </button>
      `;
    }

    if (isOwner) {
      actionBtnsHtml += `
        <button class="action-btn delete-btn" id="deleteQuestionBtn">删除</button>
      `;
    }

    if (currentUserId && question.user_id && !isOwner) {
      let friendBtnHtml = '';
      if (!friendStatus) {
        friendBtnHtml = '<button class="action-btn friend-btn" id="friendRequestBtn">申请加为树友</button>';
      } else if (friendStatus === 'pending') {
        friendBtnHtml = '<button class="action-btn friend-btn" disabled>已申请</button>';
      } else if (friendStatus === 'accepted') {
        friendBtnHtml = '<button class="action-btn friend-btn" disabled>已是树友</button>';
      } else if (friendStatus === 'rejected') {
        friendBtnHtml = '<button class="action-btn friend-btn" disabled>已拒绝</button>';
      }
      actionBtnsHtml += friendBtnHtml;
    }

    actionBtnsHtml += '</div>';

    document.getElementById('question-detail').innerHTML = `
      <h2>${escapeHtml(question.content)}</h2>
      <div class="meta question-meta">
        <span>🧑 ${escapeHtml(question.nickname)}</span>
        <span>${formatDate(question.created_at)}</span>
      </div>
      ${actionBtnsHtml}
    `;

    const answersContainer = document.getElementById('answers-list');
    if (answers.length === 0) {
      answersContainer.innerHTML = '<p class="empty-state-text">还没有人回应这份心事，坐下来陪 ta 一会吧 ✨</p>';
      initEmptyStateCursors();
    } else {
      answersContainer.innerHTML = answers.map(a => {
        const reacted = hasReacted('answer', a.id);
        const count = answerCounts[a.id] || 0;
        const isAnswerOwner = currentUserId && a.user_id === currentUserId;
        return `
          <div class="answer-card" data-answer-id="${a.id}">
            <div class="answer-content">${escapeHtml(a.content)}</div>
            <div class="answer-meta">
              <span>🧑 ${escapeHtml(a.nickname)}</span>
              <span>${formatDate(a.created_at)}</span>
              <button class="heart-btn ${reacted ? 'reacted' : ''}"
                      data-type="answer" data-id="${a.id}"
                      ${reacted ? 'disabled' : ''}>
                ${reacted ? '♡' : '♥'} <span class="count">${count}</span>
              </button>
              ${isAnswerOwner ? `<span class="answer-actions"><button class="action-btn delete-btn delete-answer-btn" data-answer-id="${a.id}">删除</button></span>` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    document.querySelectorAll('.heart-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const type = btn.dataset.type;
        const targetId = btn.dataset.id;
        const ok = await addReaction(type, targetId);
        if (ok) {
          const countSpan = btn.querySelector('.count');
          countSpan.textContent = parseInt(countSpan.textContent) + 1;
          btn.innerHTML = `♡ <span class="count">${countSpan.textContent}</span>`;
          btn.classList.add('reacted');
          btn.disabled = true;
        }
      });
    });

    const favoriteBtn = document.getElementById('favoriteBtn');
    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', async () => {
        const btn = favoriteBtn;
        const favorited = btn.dataset.favorited === 'true';
        
        if (favorited) {
          const { error } = await sb
            .from('favorites')
            .delete()
            .eq('user_id', currentUserId)
            .eq('question_id', id);
          if (!error) {
            btn.dataset.favorited = 'false';
            btn.innerHTML = '☆ 收藏<span class="favorite-count">(0)</span>';
            const countSpan = btn.querySelector('.favorite-count');
            const { count } = await sb
              .from('favorites')
              .select('*', { count: 'exact', head: true })
              .eq('question_id', id);
            countSpan.textContent = `(${count || 0})`;
          }
        } else {
          const { error } = await sb
            .from('favorites')
            .insert({ user_id: currentUserId, question_id: id });
          if (!error) {
            btn.dataset.favorited = 'true';
            btn.innerHTML = '★ 已收藏<span class="favorite-count">(0)</span>';
            const countSpan = btn.querySelector('.favorite-count');
            const { count } = await sb
              .from('favorites')
              .select('*', { count: 'exact', head: true })
              .eq('question_id', id);
            countSpan.textContent = `(${count || 0})`;
          }
        }
      });
    }

    const deleteQuestionBtn = document.getElementById('deleteQuestionBtn');
    if (deleteQuestionBtn) {
      deleteQuestionBtn.addEventListener('click', async () => {
        if (!confirm('确定要删除这条心事吗？删除后无法恢复。')) return;
        const { error } = await sb
          .from('questions')
          .delete()
          .eq('id', id);
        if (!error) {
          window.location.href = 'index.html';
        } else {
          alert('删除失败，请稍后重试');
        }
      });
    }

    const friendRequestBtn = document.getElementById('friendRequestBtn');
    if (friendRequestBtn) {
      friendRequestBtn.addEventListener('click', async () => {
        const { error } = await sb
          .from('friend_requests')
          .insert({ from_user: currentUserId, to_user: question.user_id });
        if (!error) {
          friendRequestBtn.textContent = '已申请';
          friendRequestBtn.disabled = true;
        } else {
          alert('申请失败，请稍后重试');
        }
      });
    }

    document.querySelectorAll('.delete-answer-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const answerId = btn.dataset.answerId;
        if (!confirm('确定要删除这条回答吗？')) return;
        const { error } = await sb
          .from('answers')
          .delete()
          .eq('id', answerId);
        if (!error) {
          const card = btn.closest('.answer-card');
          if (card) card.remove();
          const remaining = answersContainer.querySelectorAll('.answer-card');
          if (remaining.length === 0) {
            answersContainer.innerHTML = '<p class="empty-state-text">还没有人回应这份心事，坐下来陪 ta 一会吧 ✨</p>';
            initEmptyStateCursors();
          }
        } else {
          alert('删除失败，请稍后重试');
        }
      });
    });
  }

  // =====================
  // 暴露 API
  // =====================
  Object.assign(window.TreeHole, {
    getNickname, saveNickname,
    fetchQuestions, submitQuestionAPI,
    fetchQuestionDetail, submitAnswerAPI,
    formatDate, escapeHtml, renderQuestions, filterQuestions,
    signUp, signIn, signOut, getCurrentUser, getUserProfile,
    initQuestionsBoard, initQuestionDetailPage,
    updateTextSmoothly, initEmptyStateCursors
  });

  // =====================
  // DOM 事件绑定 (页面入口)
  // =====================
  window.addEventListener('DOMContentLoaded', async () => {
    initEmptyStateCursors();

    const navGuest = document.getElementById('navGuest');
    const navLoggedIn = document.getElementById('navLoggedIn');
    const navNickname = document.getElementById('navNickname');
    const navLogout = document.getElementById('navLogout');
    
    const currentUser = await TreeHole.getCurrentUser();
    window.currentUserId = currentUser?.id || null;

    if (navGuest && navLoggedIn) {
      if (currentUser) {
        navGuest.style.display = 'none';
        navLoggedIn.style.display = 'inline';
        const profile = await TreeHole.getUserProfile();
        if (navNickname) navNickname.textContent = profile?.nickname || '树友';
      } else {
        navGuest.style.display = 'inline';
        navLoggedIn.style.display = 'none';
      }
    }
    
    if (navLogout) {
      navLogout.addEventListener('click', (e) => { e.preventDefault(); TreeHole.signOut(); });
    }
    
    const qNickInput = document.getElementById('question-nickname');
    const aNickInput = document.getElementById('answer-nickname');
    const profile = currentUser ? await TreeHole.getUserProfile() : null;

    [qNickInput, aNickInput].forEach(input => {
      if (!input) return;
      if (currentUser) {
        input.value = profile?.nickname || '匿名树友';
        input.readOnly = true;
        input.classList.add('input-readonly');
      } else {
        input.value = '';
        input.placeholder = '匿名树友';
      }
    });

    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    if (searchInput && clearSearch) {
      searchInput.addEventListener('input', () => {
        const keyword = searchInput.value.trim();
        clearSearch.classList.toggle('visible', keyword);
        TreeHole.renderQuestions(TreeHole.filterQuestions(keyword));
      });
      clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        clearSearch.classList.remove('visible');
        TreeHole.renderQuestions(window.allQuestions || []);
      });
    }

    const submitBtn = document.getElementById('submit-question-btn');
    if (submitBtn) {
      initQuestionsBoard(); 

      submitBtn.addEventListener('click', async () => {
        if (!window.currentUserId) {
          document.getElementById('loginModal').style.display = 'flex';
          return;
        }
        
        const contentInput = document.getElementById('question-content');
        const validation = validateContent(contentInput.value);
        
        if (!validation.valid) {
          showMessage('question-msg', validation.error, 'error');
          return;
        }
        
        hideMessage('question-msg');
        const nicknameInput = document.getElementById('question-nickname');
        saveNickname(nicknameInput.value);
        
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '正在发送...';
        submitBtn.disabled = true;
        
        const res = await TreeHole.submitQuestionAPI(validation.trimmed, nicknameInput.value, window.currentUserId);
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        if (res.success) {
          contentInput.value = '';
          showMessage('question-msg', '发送成功，已放进树洞 🌿', 'success');
          await initQuestionsBoard(); 
        } else {
          showMessage('question-msg', res.error, 'error', 3000);
        }
      });
    }

    const answerBtn = document.getElementById('submit-answer-btn');
    if (answerBtn) {
      const urlParams = new URLSearchParams(window.location.search);
      const questionId = urlParams.get('id');
      if (!questionId) {
        document.getElementById('question-detail').innerHTML = '<p>缺少问题ID</p>';
        return;
      }
      initQuestionDetailPage(questionId); 

      answerBtn.addEventListener('click', async () => {
        if (!window.currentUserId) {
          document.getElementById('loginModal').style.display = 'flex';
          return;
        }
        
        const contentInput = document.getElementById('answer-content');
        const validation = validateContent(contentInput.value);
        
        if (!validation.valid) {
          showMessage('answer-msg', validation.error, 'error');
          return;
        }
        
        hideMessage('answer-msg');
        const nicknameInput = document.getElementById('answer-nickname');
        saveNickname(nicknameInput.value);

        const originalText = answerBtn.textContent;
        answerBtn.textContent = '正在发送...';
        answerBtn.disabled = true;
        
        const res = await TreeHole.submitAnswerAPI(questionId, validation.trimmed, nicknameInput.value);
        
        answerBtn.textContent = originalText;
        answerBtn.disabled = false;
        
        if (res.success) {
          contentInput.value = '';
          showMessage('answer-msg', '发送成功，已放进树洞 🌿', 'success');
          await initQuestionDetailPage(questionId); 
          const answersContainer = document.getElementById('answers-list');
          if (answersContainer) {
            answersContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        } else {
          showMessage('answer-msg', res.error, 'error', 3000);
        }
      });
    }
  });
})();
