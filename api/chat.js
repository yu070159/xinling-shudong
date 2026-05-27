// api/chat.js
const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request) {
  try {
    const { messages } = await request.json();
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      console.error("【后端错误】: API Key 未配置");
      return new Response(JSON.stringify({ error: '树洞管理员还未配置钥匙' }), {
        status: 500,
        headers: CORS_HEADERS
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
        headers: CORS_HEADERS
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: CORS_HEADERS
    });
  } catch (error) {
    console.error("【后端错误】: 捕获到异常:", error);
    return new Response(JSON.stringify({ error: '树灵正在打盹，请稍后再试...' }), {
      status: 500,
      headers: CORS_HEADERS
    });
  }
}
