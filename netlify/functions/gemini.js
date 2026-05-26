// netlify/functions/gemini.js — DeepSeek 代理（内容审核、情绪分析、AI建议等，Netlify 版本）
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
    const { prompt } = JSON.parse(event.body);
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      console.error("【DeepSeek】DEEPSEEK_API_KEY 未配置");
      return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'DeepSeek 服务未配置' }) };
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("【DeepSeek】API 返回错误:", JSON.stringify(data));
      return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'DeepSeek 请求失败', detail: data }) };
    }

    const text = data.choices?.[0]?.message?.content || '';

    const geminiFormat = {
      candidates: [{ content: { parts: [{ text }] }, finishReason: 'STOP' }],
      usageMetadata: data.usage || {}
    };

    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(geminiFormat) };
  } catch (error) {
    console.error("【DeepSeek】异常:", error);
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: '服务异常' }) };
  }
};
