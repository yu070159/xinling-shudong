// netlify/functions/chat.js — DeepSeek 聊天代理（Netlify 版本）
const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS };
  }

  try {
    const { messages } = JSON.parse(event.body);
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      console.error("【后端错误】: API Key 未配置");
      return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: '树洞管理员还未配置钥匙' }) };
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
      return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'API 请求失败' }) };
    }

    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(data) };
  } catch (error) {
    console.error("【后端错误】: 捕获到异常:", error);
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: '树灵正在打盹，请稍后再试...' }) };
  }
};
