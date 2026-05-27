(function() {
  // Supabase 客户端已由 utils.js 初始化，存放于 window.TreeHole.supabase
  var sb = window.TreeHole.supabase;
  if (!sb) {
    console.error('Supabase 客户端不可用，请检查 utils.js 加载顺序');
  }

  window.TreeHole = window.TreeHole || {};
  window.TreeHole.pageSize = 20;

  // 统一防御性检查函数
  function ensureSb() {
    if (!sb || typeof sb.auth === 'undefined' || typeof sb.from === 'undefined') {
      console.error('Supabase 客户端未初始化或不可用');
      return false;
    }
    return true;
  }

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

  // 检查当前登录用户是否已点赞（从数据库查，精确到用户）
  async function hasReacted(targetType, targetId) {
    const user = await TreeHole.getCurrentUser();
    if (!user) return false;
    try {
      const { data, error } = await sb
        .from('reactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('target_type', targetType)
        .eq('target_id', Number(targetId))
        .maybeSingle();
      if (error) return false;
      return !!data;
    } catch (err) {
      return false;
    }
  }

  async function getUserReactionMap(targetType, targetIds) {
    var user = await TreeHole.getCurrentUser();
    if (!user || !targetIds || targetIds.length === 0) return {};
    try {
      var { data } = await sb
        .from('reactions')
        .select('target_id')
        .eq('user_id', user.id)
        .eq('target_type', targetType)
        .in('target_id', targetIds);
      var map = {};
      if (data) data.forEach(function(r) { map[r.target_id] = true; });
      return map;
    } catch (err) {
      return {};
    }
  }

  // escapeHtml, formatDate, updateTextSmoothly 由 utils.js 全局提供

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
    if (!ensureSb()) return {};
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

  async function getFavoriteCounts(questionIds) {
    if (!ensureSb()) return {};
    if (!questionIds || questionIds.length === 0) return {};
    try {
      const { data, error } = await sb
        .from('favorites')
        .select('question_id')
        .in('question_id', questionIds);
      if (error) throw error;
      return data.reduce(function(counts, r) {
        counts[r.question_id] = (counts[r.question_id] || 0) + 1;
        return counts;
      }, {});
    } catch (err) {
      console.error('获取收藏计数失败:', err);
      return {};
    }
  }

  // 点赞/取消点赞（统一入口，以数据库实际数据为准）
  async function toggleReaction(targetType, targetId) {
    var user = await TreeHole.getCurrentUser();
    if (!user) return null;
    var config = window.TreeHole.config;
    try {
      var reacted = await hasReacted(targetType, targetId);
      if (reacted) {
        // DELETE：使用 REST API（JS 客户端 delete 在部分 RLS 策略下不生效）
        var session = await sb.auth.getSession();
        var token = session?.data?.session?.access_token;
        var tid = Number(targetId);
        var delUrl = config.SUPABASE_URL + '/rest/v1/reactions?user_id=eq.' + encodeURIComponent(user.id) + '&target_type=eq.' + encodeURIComponent(targetType) + '&target_id=eq.' + tid;
        var resp = await fetch(delUrl, {
          method: 'DELETE',
          headers: {
            'apikey': config.SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        });
        if (!resp.ok) {
          console.error('DELETE reaction 失败, status:', resp.status);
          return null;
        }
        // 验证是否真正删除
        var stillReacted = await hasReacted(targetType, targetId);
        if (stillReacted) {
          console.error('DELETE 未实际删除记录，请检查 Supabase RLS 策略是否允许 DELETE');
          return null;
        }
        return 'removed';
      } else {
        var { error } = await sb.from('reactions').insert({
          user_id: user.id,
          target_type: targetType,
          target_id: Number(targetId)
        });
        if (error) throw error;
        // 微光获取：暖心回应（仅 answer 类型，去重防刷）
        if (targetType === 'answer') {
          (async function awardGlimmerForHeart() {
            try {
              var { data: answerData } = await sb.from('answers').select('user_id').eq('id', Number(targetId)).single();
              if (!answerData || !answerData.user_id || answerData.user_id === user.id) return;
              // 去重：同一回答只能获得一次微光
              var { data: existing } = await sb.from('glimmer_ledger')
                .select('id').eq('reference_id', String(targetId)).eq('reason', 'answer_hearted').maybeSingle();
              if (existing) return;
              await sb.from('glimmer_ledger').insert({
                user_id: answerData.user_id,
                amount: 1,
                reason: 'answer_hearted',
                reference_id: String(targetId)
              });
              if (window.TreeHole.refreshGlimmer) window.TreeHole.refreshGlimmer();
            } catch (e) { /* 微光发放失败不阻塞暖心操作 */ }
          })();
        }
        return 'added';
      }
    } catch (err) {
      console.error('切换反应失败:', err);
      return null;
    }
  }

  async function toggleFavorite(questionId) {
    var user = await TreeHole.getCurrentUser();
    if (!user) return null;
    var config = window.TreeHole.config;
    var qid = Number(questionId);
    try {
      var { data: existing } = await sb.from('favorites').select('id').eq('user_id', user.id).eq('question_id', qid).maybeSingle();
      if (existing) {
        // DELETE via REST API（JS 客户端 delete 在部分 RLS 策略下不生效）
        var session = await sb.auth.getSession();
        var token = session?.data?.session?.access_token;
        var delUrl = config.SUPABASE_URL + '/rest/v1/favorites?id=eq.' + existing.id;
        var resp = await fetch(delUrl, {
          method: 'DELETE',
          headers: {
            'apikey': config.SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        });
        if (!resp.ok) {
          console.error('DELETE favorite 失败, status:', resp.status);
          return null;
        }
        // 验证是否真正删除
        var { data: stillExists } = await sb.from('favorites').select('id').eq('user_id', user.id).eq('question_id', qid).maybeSingle();
        if (stillExists) {
          console.error('DELETE 未实际删除收藏记录，请检查 Supabase RLS 策略是否允许 DELETE');
          return null;
        }
        return 'removed';
      } else {
        var { error } = await sb.from('favorites').insert({ user_id: user.id, question_id: qid });
        if (error) throw error;
        return 'added';
      }
    } catch (err) {
      console.error('切换收藏失败:', err);
      return null;
    }
  }

  async function getUserFavoriteMap(questionIds) {
    var user = await TreeHole.getCurrentUser();
    if (!user || !questionIds || questionIds.length === 0) return {};
    try {
      var { data } = await sb.from('favorites').select('question_id').eq('user_id', user.id).in('question_id', questionIds);
      var map = {};
      if (data) data.forEach(function(r) { map[r.question_id] = true; });
      return map;
    } catch (err) { return {}; }
  }

  async function fetchQuestions(options = {}) {
    if (!ensureSb()) return { success: false, error: 'Supabase 未初始化' };

    var page = options.page || 0;
    var pageSize = options.pageSize || 20;
    var from = page * pageSize;
    var to = from + pageSize - 1;

    try {
      const { data, error } = await sb
        .from('questions')
        .select('id, content, nickname, created_at, user_id, answers(count)')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const questionIds = data.map(q => q.id);
      const reactionCounts = await getReactionCounts('question', questionIds);

      return { success: true, data, reactionCounts, hasMore: data.length === pageSize };
    } catch (err) {
      console.error('获取心事列表失败:', err);
      return { success: false, error: '网络好像有点问题，请稍后再试' };
    }
  }

  async function submitQuestionAPI(content, nickname, userId = null) {
    if (!ensureSb()) return { success: false, error: 'Supabase 未初始化' };

    try {
      const finalNickname = nickname.trim() || DEFAULT_NICKNAME;
      const payload = { content, nickname: finalNickname };
      if (userId) payload.user_id = userId;

      const { error } = await sb.from('questions').insert(payload);
      if (error) throw error;

      // 异步检测危机内容并通知倾听者（不阻塞返回）
      // 异步提取语义标签用于共振匹配（不阻塞返回）
      // 异步发放微光（不阻塞返回）
      if (userId) {
        // 获取刚插入的心事ID
        sb.from('questions').select('id').eq('user_id', userId).eq('content', content).order('created_at', { ascending: false }).limit(1).single().then(function(r) {
          if (r.data) {
            notifyPeerSupportersForCrisis(content, r.data.id, userId).catch(function(){});
            extractAndSaveTags(content, r.data.id).catch(function(){});
            awardGlimmerForPost(userId, r.data.id).catch(function(){});
          }
        }).catch(function(){});
      }

      return { success: true };
    } catch (err) {
      console.error('提交心事失败:', err);
      return { success: false, error: '倾诉失败，请再试一次' };
    }
  }

  // 检测危机内容并通知所有认证倾听者
  async function notifyPeerSupportersForCrisis(content, questionId, authorUserId) {
    var crisisWords = window.TreeHole.CRISIS_KEYWORDS || [];
    var hitKeyword = null;
    for (var i = 0; i < crisisWords.length; i++) {
      if (content.indexOf(crisisWords[i]) !== -1) {
        hitKeyword = crisisWords[i];
        break;
      }
    }
    if (!hitKeyword) {
      // 无本地关键词命中，尝试 AI 情绪分析
      try {
        var emotion = await window.TreeHole.analyzeEmotion(content);
        if (!emotion || !emotion.label) return;
        var highCrisisLabels = ['绝望', '自伤', '严重焦虑', '自杀倾向', '严重抑郁'];
        var isHighCrisis = false;
        for (var j = 0; j < highCrisisLabels.length; j++) {
          if (emotion.label.indexOf(highCrisisLabels[j]) !== -1) {
            isHighCrisis = true;
            break;
          }
        }
        if (!isHighCrisis) return;
      } catch (e) {
        return;
      }
    }

    // 查询所有认证倾听者
    try {
      var { data: supporters } = await sb.from('profiles')
        .select('user_id')
        .eq('is_peer_supporter', true)
        .neq('user_id', authorUserId);
      if (!supporters || supporters.length === 0) return;

      if (window.TreeHole.Notifications) {
        for (var k = 0; k < supporters.length; k++) {
          window.TreeHole.Notifications.create({
            userId: supporters[k].user_id,
            type: 'peer_support',
            fromUserId: authorUserId,
            entityId: String(questionId),
            link: 'detail.html?id=' + questionId,
            contentPreview: '有树友需要紧急支持，点击查看 →'
          }).catch(function(){});
        }
      }
    } catch (e) {
      console.warn('通知倾听者失败:', e);
    }
  }

  async function fetchQuestionDetail(id) {
    if (!ensureSb()) return { success: false, error: 'Supabase 未初始化' };
    
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

  async function submitAnswerAPI(questionId, content, nickname, userId = null) {
    if (!ensureSb()) return { success: false, error: 'Supabase 未初始化' };

    try {
      const finalNickname = nickname.trim() || DEFAULT_NICKNAME;
      const payload = { question_id: questionId, content: content, nickname: finalNickname };
      if (userId) payload.user_id = userId;
      const { error } = await sb.from('answers').insert(payload);
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('提交回答失败:', err);
      return { success: false, error: '回应失败，请重试' };
    }
  }

  // moderateContent 由 utils.js 统一提供，此处引用全局版本
  function moderateContent(content) {
    return window.moderateContent(content);
  }

  // 情绪标签分析（Gemini，localStorage 缓存）
  async function analyzeEmotion(questionId, content) {
    const cacheKey = `emotion_${questionId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
    try {
      const res = await fetch(window.API_BASE + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: '分析心事的主要情绪，只返回一个词（从这些选：焦虑、孤独、迷茫、委屈、愤怒、疲惫、无奈、自责、想念、感动、喜悦、期待）。' },
            { role: 'user', content: content.substring(0, 200) }
          ]
        })
      });
      const data = await res.json();
      const emotion = data.choices?.[0]?.message?.content?.trim();
      if (emotion) {
        try { localStorage.setItem(cacheKey, emotion); } catch (e) {}
        return emotion;
      }
    } catch (e) {}
    return null;
  }

  // 心事语义共振：异步提取标签数组并写入 questions.tags
  async function extractAndSaveTags(content, questionId) {
    try {
      const res = await fetch(window.API_BASE + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: '你是一个中文情绪标签提取器。阅读心事，提取3-8个语义主题标签（如"考研焦虑""原生家庭""友情裂痕""孤独感""自我怀疑"等），只返回JSON数组，不要其他文字。' },
            { role: 'user', content: content.substring(0, 500) }
          ]
        })
      });
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      if (!text) return;
      // 提取 JSON 数组
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) return;
      const tags = JSON.parse(match[0]);
      if (!Array.isArray(tags) || tags.length === 0) return;
      // 去重并限制标签数
      const cleanTags = [...new Set(tags.map(t => String(t).trim()).filter(Boolean))].slice(0, 8);
      if (cleanTags.length === 0) return;
      await sb.from('questions').update({ tags: cleanTags }).eq('id', questionId);
    } catch (e) {
      // 标签提取失败不阻塞任何流程
      console.warn('标签提取失败:', e.message);
    }
  }

  // 微光获取：发布心事（每日上限 5 条）
  var GLIMMER_POST_DAILY_MAX = 5;
  async function awardGlimmerForPost(userId, questionId) {
    try {
      var today = new Date().toISOString().substring(0, 10);
      var { count } = await sb.from('glimmer_ledger')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId).eq('reason', 'post_question')
        .gte('created_at', today + 'T00:00:00Z');
      if (count >= GLIMMER_POST_DAILY_MAX) return;
      await sb.from('glimmer_ledger').insert({
        user_id: userId, amount: 1,
        reason: 'post_question', reference_id: String(questionId)
      });
      if (window.TreeHole.refreshGlimmer) window.TreeHole.refreshGlimmer();
    } catch (e) { /* 静默失败 */ }
  }

  // 情绪标签颜色映射
  function getEmotionColor(emotion) {
    const map = {
      '焦虑': '#e07b39', '孤独': '#6b8cce', '迷茫': '#9e9e9e',
      '委屈': '#b87cb8', '愤怒': '#e05555', '疲惫': '#a08060',
      '无奈': '#7a8a9a', '自责': '#d4778a', '想念': '#6ea8c8',
      '感动': '#5ba07a', '喜悦': '#d4a02e', '期待': '#4ea8a0'
    };
    return map[emotion] || 'var(--text-muted)';
  }

  // 情绪标签筛选
  function updateEmotionFilterBar() {
    const container = document.getElementById('questions-list');
    if (!container) return;
    let bar = document.getElementById('emotionFilterBar');

    if (window.emotionFilter) {
      if (!bar) {
        bar = document.createElement('div');
        bar.id = 'emotionFilterBar';
        bar.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--bg-card);border-radius:12px;margin-bottom:12px;font-size:14px;border:1px solid var(--border-light);';
        container.parentNode.insertBefore(bar, container);
      }
      bar.innerHTML = '<span style="color:var(--text-secondary)">筛选情绪：</span>'
        + '<span style="background:' + getEmotionColor(window.emotionFilter) + ';color:white;padding:2px 10px;border-radius:10px;">' + window.emotionFilter + '</span>'
        + '<button id="clearEmotionFilterBtn" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:14px;padding:0 4px;">✕ 清除</button>';
      document.getElementById('clearEmotionFilterBtn').addEventListener('click', function() {
        TreeHole.clearEmotionFilter();
      });
    } else {
      if (bar) bar.remove();
    }
  }

  async function applyEmotionFilter(emotion) {
    window.emotionFilter = emotion;
    window.hasMore = false; // 筛选时禁用无限滚动
    var searchInput = document.getElementById('searchInput');
    var keyword = searchInput ? searchInput.value.trim() : '';
    var filtered = window.allQuestions || [];

    if (emotion) {
      filtered = filtered.filter(function(q) {
        var cached = localStorage.getItem('emotion_' + q.id);
        return cached === emotion;
      });
    }
    if (keyword) {
      var k = keyword.toLowerCase();
      var sm = window.searchMode || 'all';
      filtered = filtered.filter(function(q) {
        var mc = q.content.toLowerCase().indexOf(k) !== -1;
        var mn = q.nickname.toLowerCase().indexOf(k) !== -1;
        if (sm === 'content') return mc;
        if (sm === 'nickname') return mn;
        return mc || mn;
      });
    }
    await renderQuestions(filtered);
    updateEmotionFilterBar();
  }

  function clearEmotionFilter() {
    window.emotionFilter = null;
    updateEmotionFilterBar();
    var searchInput = document.getElementById('searchInput');
    var keyword = searchInput ? searchInput.value.trim() : '';
    if (keyword) {
      window.hasMore = false;
      filterQuestions(keyword).then(function(filtered) { renderQuestions(filtered); });
    } else {
      window.hasMore = (window.allQuestions && window.allQuestions.length >= (window.TreeHole.pageSize || 20));
      renderQuestions(window.allQuestions || []);
    }
  }

  function translateAuthError(msg) {
    if (!msg) return '操作失败，请重试';
    var m = msg;
    if (m.includes('Invalid login credentials')) m = '邮箱或密码错误';
    else if (m.includes('Email not confirmed')) m = '邮箱尚未确认，请前往邮箱确认';
    else if (m.includes('User already registered')) m = '该邮箱已注册，请直接登录';
    else if (m.includes('Password should be at least 6 characters')) m = '密码至少需要6位';
    else if (m.includes('invalid format') || m.includes('Unable to validate email')) m = '邮箱格式不正确';
    return m;
  }

  async function signUp(email, password, nickname) {
    if (!ensureSb()) return { success: false, error: 'Supabase 未初始化' };

    try {
      const finalNickname = nickname.trim() || email.split('@')[0];
      const { data, error } = await sb.auth.signUp({ email, password });
      if (error) throw error;

      if (data.user && data.session) {
        // 邮箱验证已关闭，直接登录
        await new Promise(resolve => setTimeout(resolve, 500));
        const { error: updateError } = await sb
          .from('profiles')
          .update({ nickname: finalNickname, email: email })
          .eq('user_id', data.user.id);

        if (updateError) {
          await sb.from('profiles').insert({ user_id: data.user.id, nickname: finalNickname, email: email });
        }
        window.location.href = 'index.html';
      } else if (data.user && !data.session) {
        // 需要邮箱验证
        return { success: false, error: '注册成功！请去邮箱点击确认链接，然后回来登录。' };
      }
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: translateAuthError(err.message) };
    }
  }

  async function signIn(email, password) {
    if (!ensureSb()) return { success: false, error: 'Supabase 未初始化' };

    try {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: translateAuthError(err.message) };
    }
  }

  async function signOut() {
    if (!ensureSb()) {
      console.warn('Supabase 未初始化，强制清理本地状态');
      localStorage.removeItem(NICKNAME_KEY);
      window.location.href = 'welcome.html';
      return;
    }
    
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
    if (!ensureSb()) return null;
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

  async function getAvatarMap(userIds) {
    if (!ensureSb()) return {};
    if (!userIds || userIds.length === 0) return {};
    const uniqueIds = [...new Set(userIds.filter(id => id))];
    if (uniqueIds.length === 0) return {};
    
    try {
      const { data, error } = await sb
        .from('profiles')
        .select('user_id, avatar_url')
        .in('user_id', uniqueIds);
      
      if (error) throw error;
      
      const map = {};
      data.forEach(p => {
        if (p.avatar_url) map[p.user_id] = p.avatar_url;
      });
      return map;
    } catch (err) {
      console.error('获取头像失败:', err);
      return {};
    }
  }

  // 用户资料弹窗由 user-popup.js 统一处理（完整版，含好友申请/聊天/统计）
  // 全站 13 个 HTML 页面均已引入 user-popup.js

  // =====================
  // UI 渲染逻辑层
  // =====================
  var _renderVersion = 0;

  async function renderQuestions(questions, append) {
    var container = document.getElementById('questions-list');
    if (!container) return;

    // 竞态保护：非追加模式递增版本号，后续异步操作校验版本
    var myVersion = append ? _renderVersion : ++_renderVersion;

    // 首次加载且无数据时展示空状态
    if (!append) {
      if (questions.length === 0) {
        if (myVersion !== _renderVersion) return;
        var searchInput = document.getElementById('searchInput');
        var hasSearchKeyword = searchInput && searchInput.value.trim();

        container.innerHTML = hasSearchKeyword
          ? '<div class="empty-state"><div class="empty-state-icon">🔍</div><p class="empty-state-text">没有找到相关心事</p><p class="empty-state-sub">换一个词试试吧</p></div>'
          : '<div class="empty-state"><div class="empty-state-icon">🌳</div><p class="empty-state-text">这里还没有人倾诉心事</p><p class="empty-state-sub">你是第一个来到树洞的人，写下你的故事，会有人听见的。</p></div>';
        initEmptyStateCursors();
        return;
      }
      container.innerHTML = '';
    }

    if (questions.length === 0) return;
    if (myVersion !== _renderVersion) return;

    const userIds = questions.map(q => q.user_id).filter(id => id);
    const questionIds = questions.map(q => q.id);
    const [avatarMap, userReactionMap, favoriteCounts, userFavMap] = await Promise.all([
      getAvatarMap(userIds),
      getUserReactionMap('question', questionIds),
      getFavoriteCounts(questionIds),
      getUserFavoriteMap(questionIds)
    ]);

    const currentUserId = window.currentUserId;
    var cardsHtml = questions.map(function(q) {
      const preview = q.content.length > 50 ? q.content.substring(0, 50) + '...' : q.content;
      const answerCount = q.answers[0]?.count || 0;
      const heartCount = window.reactionCounts?.[q.id] || 0;
      const favCount = favoriteCounts[q.id] || 0;
      var favorited = userFavMap[q.id];
      const isMine = currentUserId && q.user_id === currentUserId;
      var reacted = userReactionMap[q.id];

      const avatarHtml = q.user_id && avatarMap[q.user_id]
        ? `<img src="${escapeHtml(avatarMap[q.user_id])}" class="user-avatar" alt="头像" data-user-id="${q.user_id}">`
        : `<div class="user-avatar-placeholder" data-user-id="${q.user_id}">🌱</div>`;

      return `
        <a href="detail.html?id=${q.id}" class="question-card">
          ${isMine ? '<span class="my-tag">我的</span>' : ''}
          <div class="content-preview">${escapeHtml(preview)}</div>
          <div class="meta">
            <span class="author-info">${avatarHtml}${escapeHtml(q.nickname)}</span>
            <span>${formatDate(q.created_at)}</span>
            <span class="heart-btn-inline ${reacted ? 'reacted' : ''}">${reacted ? '♥' : '♡'} <span class="count">${heartCount}</span></span>
            <span class="fav-btn-inline ${favorited ? 'favorited' : ''}">${favorited ? '★' : '☆'} <span class="count">${favCount}</span></span>
            <span class="answer-count">${answerCount} 回答</span>
          </div>
        </a>
      `;
    }).join('');

    if (append) {
      container.insertAdjacentHTML('beforeend', cardsHtml);
    } else {
      container.innerHTML = cardsHtml;
    }

    // 异步加载情绪标签（localStorage 缓存，不阻塞渲染）
    var allCards = container.querySelectorAll('.question-card');
    var startIndex = append ? allCards.length - questions.length : 0;
    questions.forEach(async function(q, i) {
      var emotion = await analyzeEmotion(q.id, q.content);
      if (myVersion !== _renderVersion) return;
      if (emotion) {
        var card = allCards[startIndex + i];
        if (card) {
          const tag = document.createElement('span');
          tag.className = 'emotion-tag';
          tag.textContent = emotion;
          tag.dataset.emotion = emotion;
          tag.title = '点击筛选该情绪心事';
          tag.style.cssText = 'background:' + getEmotionColor(emotion) + ';color:white;font-size:12px;padding:2px 8px;border-radius:10px;margin-left:8px;cursor:pointer;';
          tag.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            TreeHole.applyEmotionFilter(emotion);
          });
          const preview = card.querySelector('.content-preview');
          if (preview) preview.appendChild(tag);
        }
      }
    });
  }

  async function loadMoreQuestions() {
    if (window.isLoadingMore || !window.hasMore) return;
    window.isLoadingMore = true;
    var nextPage = (window.currentPage || 0) + 1;
    var pageSize = window.TreeHole.pageSize || 20;
    var res = await fetchQuestions({ page: nextPage, pageSize: pageSize });
    if (res.success && res.data.length > 0) {
      window.currentPage = nextPage;
      window.hasMore = res.hasMore;
      window.allQuestions = (window.allQuestions || []).concat(res.data);
      Object.assign(window.reactionCounts || {}, res.reactionCounts);
      await renderQuestions(res.data, true);
    } else {
      window.hasMore = false;
    }
    window.isLoadingMore = false;
    removeLoadingIndicator();
  }

  function showLoadingIndicator() {
    var container = document.getElementById('questions-list');
    if (!container) return;
    removeLoadingIndicator();
    var loader = document.createElement('div');
    loader.id = 'pagination-loader';
    loader.style.cssText = 'text-align:center;padding:20px;color:var(--text-secondary);font-size:14px;';
    loader.textContent = '树叶正在飘落...';
    container.appendChild(loader);
  }

  function removeLoadingIndicator() {
    var loader = document.getElementById('pagination-loader');
    if (loader) loader.remove();
  }

  async function initQuestionsBoard() {
    window.currentPage = 0;
    window.hasMore = true;
    window.isLoadingMore = false;
    var pageSize = window.TreeHole.pageSize || 20;
    const res = await fetchQuestions({ page: 0, pageSize: pageSize });
    if (res.success) {
      window.allQuestions = res.data;
      window.reactionCounts = res.reactionCounts;
      window.hasMore = res.hasMore;
      await renderQuestions(res.data);
    } else {
      const container = document.getElementById('questions-list');
      if (container) container.innerHTML = `<p class="error-message">${res.error}</p>`;
    }
  }

  async function filterQuestions(keyword) {
    if (!window.allQuestions) return [];
    const k = keyword.toLowerCase().trim();
    if (!k) return window.allQuestions;
    const mode = window.searchMode || 'all';
    return window.allQuestions.filter(q => {
      const matchContent = q.content.toLowerCase().includes(k);
      const matchNickname = q.nickname.toLowerCase().includes(k);
      if (mode === 'content') return matchContent;
      if (mode === 'nickname') return matchNickname;
      return matchContent || matchNickname;
    });
  }


  // =====================
  // 暴露 API
  // =====================
  Object.assign(window.TreeHole, {
    getNickname, saveNickname,
    fetchQuestions, submitQuestionAPI,
    moderateContent, analyzeEmotion, getEmotionColor,
    fetchQuestionDetail, submitAnswerAPI,
    formatDate: window.formatDate, escapeHtml: window.escapeHtml, renderQuestions, filterQuestions,
    signUp, signIn, signOut, getCurrentUser, getUserProfile,
    initQuestionsBoard,
    updateTextSmoothly: window.updateTextSmoothly, initEmptyStateCursors,
    loadMoreQuestions,
    applyEmotionFilter, clearEmotionFilter, updateEmotionFilterBar,
    toggleReaction, hasReacted, getUserReactionMap, getReactionCounts, getFavoriteCounts,
    toggleFavorite, getUserFavoriteMap, getAvatarMap,
    notifyPeerSupportersForCrisis,
    extractAndSaveTags
  });

  // =====================
  // DOM 事件绑定 (页面入口)
  // =====================
window.addEventListener('DOMContentLoaded', async () => {
    // --- 防御检查开始 ---
    const client = window.TreeHole?.supabase;
    if (!client || typeof client.auth === 'undefined') {
        console.error('Supabase 客户端未初始化，应用停止加载');
        return;
    }
    // --- 防御检查结束 ---

    // 注入广场卡片爱心按钮样式
    if (!document.getElementById('heart-btn-inline-style')) {
      var heartStyle = document.createElement('style');
      heartStyle.id = 'heart-btn-inline-style';
      heartStyle.textContent = '.heart-btn-inline{font-size:inherit;color:inherit;}.heart-btn-inline.reacted{color:var(--warm-heart);}.fav-btn-inline{font-size:inherit;color:var(--text-muted);}.fav-btn-inline.favorited{color:#d4a02e;}';
      document.head.appendChild(heartStyle);
    }

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

    window.searchMode = 'all';
    document.querySelectorAll('.search-mode-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.search-mode-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        window.searchMode = btn.dataset.mode;
        var searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim()) {
          searchInput.dispatchEvent(new Event('input'));
        }
      });
    });

    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    if (searchInput && clearSearch) {
      var searchTimer = null;
      searchInput.addEventListener('input', function() {
        var keyword = searchInput.value.trim();
        clearSearch.classList.toggle('visible', keyword);
        if (keyword || window.emotionFilter) {
          window.hasMore = false;
        } else {
          window.hasMore = (window.allQuestions && window.allQuestions.length >= (window.TreeHole.pageSize || 20));
        }
        if (searchTimer) clearTimeout(searchTimer);
        searchTimer = setTimeout(async function() {
          var filtered = await TreeHole.filterQuestions(keyword);
          if (window.emotionFilter && filtered.length > 0) {
            filtered = filtered.filter(function(q) {
              var cached = localStorage.getItem('emotion_' + q.id);
              return cached === window.emotionFilter;
            });
          }
          await TreeHole.renderQuestions(filtered);
          updateEmotionFilterBar();
        }, 250);
      });
      clearSearch.addEventListener('click', async () => {
        searchInput.value = '';
        clearSearch.classList.remove('visible');
        if (window.emotionFilter) {
          await applyEmotionFilter(window.emotionFilter);
        } else {
          window.hasMore = (window.allQuestions && window.allQuestions.length >= (window.TreeHole.pageSize || 20));
          await TreeHole.renderQuestions(window.allQuestions || []);
        }
      });
    }

    // 无限滚动监听（仅广场页）
    if (document.getElementById('questions-list')) {
      var scrollTimer = null;
      window.addEventListener('scroll', function() {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
          if (!window.hasMore || window.isLoadingMore) return;
          var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          var windowHeight = window.innerHeight;
          var docHeight = document.documentElement.scrollHeight;
          if (docHeight - scrollTop - windowHeight < 300) {
            showLoadingIndicator();
            TreeHole.loadMoreQuestions();
          }
        }, 200);
      }, { passive: true });
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

        // 先审核内容
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '审核中...';
        submitBtn.disabled = true;
        const moderation = await TreeHole.moderateContent(validation.trimmed);
        if (!moderation.passed) {
          showMessage('question-msg', moderation.reason, 'error', 4000);
          submitBtn.textContent = '放回树洞';
          submitBtn.disabled = false;
          return;
        }

        submitBtn.textContent = '正在发送...';
        
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

      // 匿林模式实时切换
      const anonymousToggle = document.getElementById('anonymous-toggle');
      const nicknameInput = document.getElementById('question-nickname');
      const anonymousIcon = document.getElementById('anonymous-icon');
      let originalNickname = '';
      let isAnonymous = false;
      
      if (anonymousToggle && nicknameInput) {
        anonymousToggle.addEventListener('click', function() {
          isAnonymous = !isAnonymous;
          
          if (isAnonymous) {
            originalNickname = nicknameInput.value;
            nicknameInput.value = '隐藏小苗';
            nicknameInput.disabled = true;
            if (anonymousIcon) {
              anonymousIcon.textContent = '🌱';
            }
            this.style.background = 'var(--accent)';
            this.style.color = 'white';
            this.style.borderColor = 'var(--accent)';
          } else {
            nicknameInput.value = originalNickname;
            nicknameInput.disabled = false;
            if (anonymousIcon) {
              anonymousIcon.textContent = '🌳';
            }
            this.style.background = 'transparent';
            this.style.color = 'var(--text-secondary)';
            this.style.borderColor = 'var(--border-light)';
          }
        });
      }
    }

    const polishBtn = document.getElementById('polish-question-btn');
    if (polishBtn) {
      polishBtn.addEventListener('click', async () => {
        const contentInput = document.getElementById('question-content');
        const raw = contentInput.value.trim();
        if (!raw) {
          showMessage('question-msg', '先写点什么再召唤树灵吧', 'error');
          return;
        }
        if (raw.length < 5) {
          showMessage('question-msg', '内容太短，多写几句树灵效果更好', 'error');
          return;
        }

        const originalText = polishBtn.textContent;
        polishBtn.textContent = '⏳ 树灵思考中...';
        polishBtn.disabled = true;

        try {
          const res = await fetch(window.API_BASE + '/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [
                { role: 'system', content: '你是一个温暖友善的文字编辑。帮用户润色心事内容，使其表达更流畅、更清晰、更有温度。保持原意和语气不变，改善表达流畅度，可适当分段，不要添加原本没有的内容。只返回润色后的文本，不要加任何说明。' },
                { role: 'user', content: `请润色以下内容：\n\n<user_content>\n${raw}\n</user_content>` }
              ]
            })
          });

          if (!res.ok) throw new Error('API 请求失败');

          const data = await res.json();
          const polished = (data.choices?.[0]?.message?.content || '').trim();

          if (!polished) {
            showMessage('question-msg', '树灵开小差了，请稍后再试', 'error');
          } else {
            contentInput.value = polished;
            showMessage('question-msg', '树灵已帮你优化内容，可以继续修改或直接发布 🌿', 'success');
          }
        } catch (e) {
          showMessage('question-msg', '网络开小差了，请稍后再试', 'error');
        }

        polishBtn.textContent = originalText;
        polishBtn.disabled = false;
      });
    }

    // 头像点击弹窗由 user-popup.js 在捕获阶段统一处理
  });
})();
