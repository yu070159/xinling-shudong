// api/chat.js
export async function POST(request) {
  try {
    const { messages } = await request.json();
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      console.error("【后端错误】: DEEPSEEK_API_KEY 未找到，请检查 .env.local 文件！");
      return new Response(JSON.stringify({ error: '树洞管理员还未配置钥匙' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.8,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("【后端错误】: DeepSeek API 返回错误:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: 'API 请求失败' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("【后端错误】: 捕获到异常:", error);
    return new Response(JSON.stringify({ error: '树灵正在打盹，请稍后再试...' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
