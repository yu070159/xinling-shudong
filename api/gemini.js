// api/gemini.js — 已改用 DeepSeek API 代理（内容审核、情绪分析、AI建议等）
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
    const { prompt } = await request.json();
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      console.error("【DeepSeek】API Key 未配置");
      return new Response(JSON.stringify({ error: 'DeepSeek 服务未配置' }), {
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
        model: 'deepseek-v4-flash',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("【DeepSeek】API 返回错误:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: 'DeepSeek 请求失败', detail: data }), {
        status: 500,
        headers: CORS_HEADERS
      });
    }

    const text = data.choices?.[0]?.message?.content || '';

    const geminiFormat = {
      candidates: [{ content: { parts: [{ text }] }, finishReason: 'STOP' }],
      usageMetadata: data.usage || {}
    };

    return new Response(JSON.stringify(geminiFormat), {
      status: 200,
      headers: CORS_HEADERS
    });
  } catch (error) {
    console.error("【DeepSeek】异常:", error);
    return new Response(JSON.stringify({ error: '服务异常' }), {
      status: 500,
      headers: CORS_HEADERS
    });
  }
}
