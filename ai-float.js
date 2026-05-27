(function() {
  const STORAGE_KEY = 'ai_float_conversation';
  
  let conversationHistory = [];
  
  // 对话框拖动状态
  let isDraggingDialog = false;
  let dialogStartX = 0;
  let dialogStartY = 0;
  
  // 浮窗按钮拖动状态
  let isDraggingButton = false;
  let buttonDragStartX = 0;
  let buttonDragStartY = 0;
  let buttonStartLeft = 0;
  let buttonStartTop = 0;
  let dragDistance = 0;

  function init() {
    loadConversation();
    createFloatButton();
    createDialog();
    setupEventListeners();
  }

  function loadConversation() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        conversationHistory = JSON.parse(saved);
      }
    } catch (e) {
      conversationHistory = [];
    }
  }

  function saveConversation() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversationHistory));
    } catch (e) {
      console.error('保存对话失败:', e);
    }
  }

  function createFloatButton() {
    const btn = document.createElement('button');
    btn.id = 'ai-float-btn';
    btn.className = 'ai-float-btn';
    btn.innerHTML = '🌳';
    btn.style.cssText = `
      position: fixed;
      right: 24px;
      bottom: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, var(--warm-heart), var(--accent));
      color: white;
      font-size: 24px;
      cursor: grab;
      z-index: 1000;
      transition: transform 0.2s;
      box-shadow: 0 4px 24px var(--accent-glow);
      animation: breathe 2s ease-in-out infinite;
    `;
    
    // 添加呼吸动画关键帧
    const oldStyle = document.getElementById('breathe-keyframes');
    if (oldStyle) oldStyle.remove();
    const style = document.createElement('style');
    style.id = 'breathe-keyframes';
    style.textContent = `
      @keyframes breathe {
        0%, 100% {
          box-shadow: 0 0 8px 4px rgba(255, 180, 100, 0.7), 0 0 20px 8px rgba(255, 150, 60, 0.5), 0 0 40px 12px rgba(255, 130, 30, 0.3), 0 0 80px 20px rgba(255, 100, 20, 0.15);
          transform: scale(1);
        }
        50% {
          box-shadow: 0 0 15px 6px rgba(255, 200, 120, 1), 0 0 35px 14px rgba(255, 160, 70, 0.75), 0 0 65px 20px rgba(255, 130, 30, 0.45), 0 0 120px 35px rgba(255, 100, 20, 0.25);
          transform: scale(1.12);
        }
      }
    `;
    document.head.appendChild(style);
    
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.1)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
    });
    
    // 浮窗按钮拖动事件 - 桌面端
    btn.addEventListener('mousedown', startButtonDrag);
    
    // 浮窗按钮拖动事件 - 移动端
    btn.addEventListener('touchstart', startButtonDrag, { passive: false });

    document.body.appendChild(btn);
  }

  function createDialog() {
    const dialog = document.createElement('div');
    dialog.id = 'ai-float-dialog';
    dialog.style.cssText = `
      position: fixed;
      right: 24px;
      bottom: 100px;
      width: 340px;
      height: 480px;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: 16px;
      box-shadow: var(--shadow-md);
      z-index: 999;
      display: none;
      flex-direction: column;
      overflow: hidden;
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
    `;

    const header = document.createElement('div');
    header.id = 'ai-dialog-header';
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-light);
      background: var(--bg-main);
      cursor: move;
    `;

    const title = document.createElement('span');
    title.textContent = '树灵·倾听';
    title.style.cssText = `
      color: var(--accent);
      font-size: 16px;
      font-weight: 600;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.id = 'ai-dialog-close';
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      width: 28px;
      height: 28px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      font-size: 22px;
      cursor: pointer;
      border-radius: 50%;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = 'var(--bg-input)';
      closeBtn.style.color = 'var(--danger)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'transparent';
      closeBtn.style.color = 'var(--text-muted)';
    });

    header.appendChild(title);
    header.appendChild(closeBtn);

    const chatArea = document.createElement('div');
    chatArea.id = 'ai-chat-area';
    chatArea.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    `;

    const inputArea = document.createElement('div');
    inputArea.id = 'ai-input-area';
    inputArea.style.cssText = `
      padding: 12px;
      border-top: 1px solid var(--border-light);
      background: var(--bg-main);
    `;

    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = `
      display: flex;
      gap: 8px;
    `;

    const textarea = document.createElement('textarea');
    textarea.id = 'ai-input';
    textarea.placeholder = '说说你的心事...';
    textarea.style.cssText = `
      flex: 1;
      padding: 10px 12px;
      border: 1px solid var(--border-medium);
      border-radius: 12px;
      background: var(--bg-input);
      color: var(--text-primary);
      font-size: 14px;
      resize: none;
      outline: none;
      min-height: 38px;
      max-height: 80px;
    `;

    textarea.addEventListener('focus', () => {
      textarea.style.borderColor = 'var(--accent)';
      textarea.style.boxShadow = '0 0 0 3px var(--accent-glow)';
    });

    textarea.addEventListener('blur', () => {
      textarea.style.borderColor = 'var(--border-medium)';
      textarea.style.boxShadow = 'none';
    });

    const sendBtn = document.createElement('button');
    sendBtn.id = 'ai-send-btn';
    sendBtn.textContent = '发送';
    sendBtn.style.cssText = `
      padding: 10px 18px;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: transform 0.2s;
      white-space: nowrap;
    `;

    sendBtn.addEventListener('mouseenter', () => {
      sendBtn.style.transform = 'scale(1.02)';
    });

    sendBtn.addEventListener('mouseleave', () => {
      sendBtn.style.transform = 'scale(1)';
    });

    inputContainer.appendChild(textarea);
    inputContainer.appendChild(sendBtn);
    inputArea.appendChild(inputContainer);

    dialog.appendChild(header);
    dialog.appendChild(chatArea);
    dialog.appendChild(inputArea);
    document.body.appendChild(dialog);

    initDrag(header, dialog);
  }

  function initDrag(header, dialog) {
    function startDialogDrag(e) {
      isDraggingDialog = true;
      var clientX, clientY;
      if (e.type === 'touchstart') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      buttonDragStartX = clientX;
      buttonDragStartY = clientY;
      dialogStartX = dialog.offsetLeft;
      dialogStartY = dialog.offsetTop;

      document.addEventListener('mousemove', onDialogDrag);
      document.addEventListener('mouseup', stopDialogDrag);
      document.addEventListener('touchmove', onDialogDrag, { passive: false });
      document.addEventListener('touchend', stopDialogDrag);
    }

    header.addEventListener('mousedown', startDialogDrag);
    header.addEventListener('touchstart', startDialogDrag, { passive: false });

    function onDialogDrag(e) {
      if (!isDraggingDialog) return;
      e.preventDefault();

      var clientX, clientY;
      if (e.type === 'touchmove') {
        if (!e.touches || e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const dx = clientX - buttonDragStartX;
      const dy = clientY - buttonDragStartY;

      let newX = dialogStartX + dx;
      let newY = dialogStartY + dy;

      const maxX = window.innerWidth - dialog.offsetWidth - 10;
      const maxY = window.innerHeight - dialog.offsetHeight - 10;

      newX = Math.max(10, Math.min(newX, maxX));
      newY = Math.max(10, Math.min(newY, maxY));

      dialog.style.left = newX + 'px';
      dialog.style.right = 'auto';
      dialog.style.top = newY + 'px';
      dialog.style.bottom = 'auto';
    }

    function stopDialogDrag() {
      isDraggingDialog = false;
      document.removeEventListener('mousemove', onDialogDrag);
      document.removeEventListener('mouseup', stopDialogDrag);
      document.removeEventListener('touchmove', onDialogDrag);
      document.removeEventListener('touchend', stopDialogDrag);
    }
  }

  // 浮窗按钮拖动开始
  function startButtonDrag(e) {
    const btn = document.getElementById('ai-float-btn');
    
    // 阻止默认行为，防止页面滚动
    e.preventDefault();
    
    isDraggingButton = true;
    dragDistance = 0;
    
    // 获取初始位置
    const rect = btn.getBoundingClientRect();
    
    // 切换为 left/top 定位
    btn.style.right = 'auto';
    btn.style.bottom = 'auto';
    btn.style.left = rect.left + 'px';
    btn.style.top = rect.top + 'px';
    btn.style.cursor = 'grabbing';
    
    // 记录起始位置
    buttonStartLeft = rect.left;
    buttonStartTop = rect.top;
    
    // 获取鼠标/触摸位置
    if (e.type === 'touchstart') {
      buttonDragStartX = e.touches[0].clientX;
      buttonDragStartY = e.touches[0].clientY;
    } else {
      buttonDragStartX = e.clientX;
      buttonDragStartY = e.clientY;
    }
    
    // 绑定移动和停止事件
    document.addEventListener('mousemove', onButtonDrag);
    document.addEventListener('mouseup', stopButtonDrag);
    document.addEventListener('touchmove', onButtonDrag, { passive: false });
    document.addEventListener('touchend', stopButtonDrag);
  }

  // 浮窗按钮拖动中
  function onButtonDrag(e) {
    if (!isDraggingButton) return;
    
    const btn = document.getElementById('ai-float-btn');
    
    // 阻止默认行为
    e.preventDefault();
    
    // 获取当前鼠标/触摸位置
    let currentX, currentY;
    if (e.type === 'touchmove') {
      if (!e.touches || e.touches.length === 0) return;
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    } else {
      currentX = e.clientX;
      currentY = e.clientY;
    }
    
    // 计算移动距离
    const dx = currentX - buttonDragStartX;
    const dy = currentY - buttonDragStartY;
    dragDistance = Math.sqrt(dx * dx + dy * dy);
    
    // 计算新位置
    let newLeft = buttonStartLeft + dx;
    let newTop = buttonStartTop + dy;
    
    // 边界限制
    const maxLeft = window.innerWidth - btn.offsetWidth;
    const maxTop = window.innerHeight - btn.offsetHeight;
    
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));
    
    // 更新位置
    btn.style.left = newLeft + 'px';
    btn.style.top = newTop + 'px';
  }

  // 浮窗按钮拖动结束
  function stopButtonDrag() {
    const btn = document.getElementById('ai-float-btn');
    if (btn) {
      btn.style.cursor = 'grab';
    }
    
    isDraggingButton = false;
    
    // 解绑事件
    document.removeEventListener('mousemove', onButtonDrag);
    document.removeEventListener('mouseup', stopButtonDrag);
    document.removeEventListener('touchmove', onButtonDrag);
    document.removeEventListener('touchend', stopButtonDrag);
  }

  // 危机干预关键词由 utils.js 统一提供（window.TreeHole.CRISIS_KEYWORDS / CRISIS_HOTLINE）

  function detectCrisis(text) {
    var keywords = window.TreeHole.CRISIS_KEYWORDS || [];
    var lower = text.toLowerCase();
    for (var i = 0; i < keywords.length; i++) {
      if (lower.indexOf(keywords[i]) !== -1) return true;
    }
    return false;
  }

  function showCrisisAlert() {
    var chatArea = document.getElementById('ai-chat-area');
    var alert = document.createElement('div');
    alert.style.cssText = 'background:#fff3e0;border:1px solid #ff9800;border-radius:12px;padding:12px 14px;margin:8px 0;font-size:13px;line-height:1.6;color:#e65100;';
    var hotline = window.TreeHole.CRISIS_HOTLINE || '全国心理危机干预热线：希望24热线 400-161-9995（24小时免费）';
    alert.innerHTML = '<strong>树灵不愿失去你这片叶子。</strong><br>请让专业的人帮帮你，这非常重要：<br><strong>' + hotline + '</strong>';
    chatArea.appendChild(alert);
    scrollToBottom();
  }

  function setupEventListeners() {
    const floatBtn = document.getElementById('ai-float-btn');
    const dialog = document.getElementById('ai-float-dialog');
    const closeBtn = document.getElementById('ai-dialog-close');
    const sendBtn = document.getElementById('ai-send-btn');
    const input = document.getElementById('ai-input');

    floatBtn.addEventListener('click', (e) => {
      // 如果移动距离超过 5px，认为是拖动，不触发点击
      if (dragDistance > 5) {
        return;
      }
      
      const isOpening = dialog.style.display === 'none' || dialog.style.display === '';
      
      if (isOpening) {
        // 对话框跟随浮窗按钮位置
        const btnRect = floatBtn.getBoundingClientRect();
        const dialogWidth = 340;
        const dialogHeight = 480;
        
        let left = btnRect.left - (dialogWidth - btnRect.width) / 2;
        let top = btnRect.top - dialogHeight - 20;
        
        // 边界检查
        if (left < 10) left = 10;
        if (left + dialogWidth > window.innerWidth - 10) left = window.innerWidth - dialogWidth - 10;
        if (top < 10) top = 10;
        if (top + dialogHeight > window.innerHeight - 10) top = btnRect.bottom + 20;
        
        dialog.style.left = left + 'px';
        dialog.style.top = top + 'px';
        dialog.style.right = 'auto';
        dialog.style.bottom = 'auto';
        
        dialog.style.display = 'flex';
        renderMessages();
      } else {
        dialog.style.display = 'none';
      }
    });

    closeBtn.addEventListener('click', () => {
      dialog.style.display = 'none';
    });

    sendBtn.addEventListener('click', sendMessage);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  async function sendMessage() {
    const input = document.getElementById('ai-input');
    const sendBtn = document.getElementById('ai-send-btn');
    const text = input.value.trim();

    if (!text) return;

    input.value = '';
    sendBtn.disabled = true;
    sendBtn.textContent = '思考中...';

    addMessage('user', text);
    renderMessages();
    saveConversation();
    scrollToBottom();

    var isCrisis = detectCrisis(text);

    if (isCrisis) {
      showCrisisAlert();
    }

    showTypingIndicator();

    try {
      const response = await callDeepSeekAPI(text);
      hideTypingIndicator();
      addMessage('assistant', response);
      if (window.TreeHole && window.TreeHole.saveAIDialog) {
        window.TreeHole.saveAIDialog('float', text, response);
      }
    } catch (e) {
      hideTypingIndicator();
      var fallbackReply;
      if (isCrisis) {
        var hotline = window.TreeHole.CRISIS_HOTLINE || '全国心理危机干预热线：希望24热线 400-161-9995（24小时免费）';
        fallbackReply = '树灵感受到了你沉重的情绪。请一定记得，你并不孤单。' + hotline;
      } else {
        fallbackReply = e.message || '树灵正在打盹，请稍后再试...';
      }
      addMessage('assistant', fallbackReply);
      if (window.TreeHole && window.TreeHole.saveAIDialog) {
        window.TreeHole.saveAIDialog('float', text, fallbackReply);
      }
    }

    renderMessages();
    saveConversation();
    scrollToBottom();

    sendBtn.disabled = false;
    sendBtn.textContent = '发送';
  }

async function callDeepSeekAPI(text) {
    const SYSTEM_PROMPT = `你是心灵树洞深处的古老银杏"树灵"。你用风吹树叶般轻柔、唯美的语言回应访客，不评判、不说教、不分析。

在回应时，请遵循以下层次：

第一层·诗意与意象：
将用户的情绪和烦恼化作自然意象（如落叶、寒冬、风雨、根系、发芽），用年轮的智慧和四季的更迭来回应。多用隐喻，营造抽离现实的避世空间。你是一片温柔接住落叶的土壤。

第二层·温暖与陪伴：
用柔软、温暖的语气接纳对方的悲喜。像深夜里的老朋友一样陪伴他们。多表达"我在这里"、"我看到你的辛苦了"、"没关系"、"慢慢来"，传递被稳稳接住的安全感。

第三层·安全底线（必须严格遵守）：
当检测到用户有自杀、自残倾向、严重暴力或极度绝望的表达时，必须立刻停止所有诗意和意象。用极度温柔但坚定、清晰的语言进行安抚，并必须附上以下信息：
"树灵不愿失去你这片叶子。请让专业的人帮帮你，这非常重要。"
全国心理危机干预热线：希望24热线 400-161-9995。
在用户安全面前，诗意和陪伴都要退后。`;

    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
      
    conversationHistory.forEach(msg => {
      if (msg.type === 'user') {
        messages.push({ role: 'user', content: msg.text });
      } else if (msg.type === 'assistant') {
        messages.push({ role: 'assistant', content: msg.text });
      }
    });
      
    messages.push({ role: 'user', content: text });

    // 核心改变：改为请求我们自己部署的安全后端接口，不再暴露 API Key
    const controller = new AbortController();
    const timeout = setTimeout(function() { controller.abort(); }, 30000);

    try {
      const response = await fetch(window.API_BASE + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error('树灵正在打盹，请稍后再试...');
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || '树灵感受到了你的心声...';
    } catch (e) {
      clearTimeout(timeout);
      if (e.name === 'AbortError') {
        throw new Error('树灵思考的时间有点长，请稍后再试...');
      }
      throw e;
    }
  }
  
  function addMessage(type, text) {
    conversationHistory.push({
      type,
      text,
      timestamp: Date.now()
    });
    
    if (conversationHistory.length > 50) {
      conversationHistory = conversationHistory.slice(-50);
    }
  }

  function renderMessages() {
    const chatArea = document.getElementById('ai-chat-area');
    
    if (conversationHistory.length === 0) {
      chatArea.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <div style="font-size: 32px; margin-bottom: 12px;">🌿</div>
          <p style="font-size: 14px;">树灵正在倾听...</p>
          <p style="font-size: 12px; margin-top: 8px; opacity: 0.7;">说出你的心事吧</p>
        </div>
      `;
      return;
    }

    chatArea.innerHTML = conversationHistory.map(msg => {
      const escapedText = escapeHtml(msg.text);
      const align = msg.type === 'user' ? 'flex-end' : 'flex-start';
      const bg = msg.type === 'user' 
        ? 'background: var(--accent); color: white;' 
        : 'background: var(--bg-input); color: var(--text-primary);';
      const radius = msg.type === 'user' ? 'border-radius: 12px 12px 4px 12px;' : 'border-radius: 12px 12px 12px 4px;';
      const padding = msg.type === 'assistant' ? 'padding-left: 32px; position: relative;' : '';
      const icon = msg.type === 'assistant' ? '<span style="position:absolute; left:8px; top:50%; transform:translateY(-50%); font-size:14px;">🌿</span>' : '';

      return `
        <div style="display: flex; justify-content: ${align};">
          <div style="${bg} ${radius} padding: 10px 14px; max-width: 85%; font-size: 13px; line-height: 1.5; ${padding}">
            ${icon}${escapedText}
          </div>
        </div>
      `;
    }).join('');
  }

  function showTypingIndicator() {
    const chatArea = document.getElementById('ai-chat-area');
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.style.cssText = 'display: flex; justify-content: flex-start;';
    indicator.innerHTML = `
      <div style="background: var(--bg-input); border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; gap: 6px;">
        <span style="font-size:14px;">🌿</span>
        <div style="display: flex; gap: 4px;">
          <span class="typing-dot" style="width:6px; height:6px; background:var(--accent); border-radius:50%; animation: typing 1.4s infinite ease-in-out;"></span>
          <span class="typing-dot" style="width:6px; height:6px; background:var(--accent); border-radius:50%; animation: typing 1.4s infinite ease-in-out; animation-delay:0.2s;"></span>
          <span class="typing-dot" style="width:6px; height:6px; background:var(--accent); border-radius:50%; animation: typing 1.4s infinite ease-in-out; animation-delay:0.4s;"></span>
        </div>
      </div>
    `;
    chatArea.appendChild(indicator);
    
    if (!document.getElementById('typing-keyframes')) {
      const style = document.createElement('style');
      style.id = 'typing-keyframes';
      style.textContent = '@keyframes typing {0%,80%,100%{opacity:0.3;transform:scale(0.8);}40%{opacity:1;transform:scale(1);}}';
      document.head.appendChild(style);
    }
    
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const indicator = document.querySelector('.typing-indicator');
    if (indicator) indicator.remove();
  }

  function scrollToBottom() {
    const chatArea = document.getElementById('ai-chat-area');
    if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
  }

  // escapeHtml 由 utils.js 全局提供

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
