// netlify/functions/admin.js — 管理员面板数据查询（Netlify 版本）
const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  try {
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '070929';
    const authHeader = event.headers['authorization'] || event.headers['Authorization'] || '';
    if (authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
      return { statusCode: 401, headers: CORS_HEADERS, body: JSON.stringify({ error: '密码错误' }) };
    }

    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://icbqxsiwktvsiwqygams.supabase.co';
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

    if (!SUPABASE_SERVICE_KEY) {
      return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Service key not configured' }) };
    }

    const authHeaders = {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
    };

    const [fbRes, resRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/feedbacks?select=*&order=created_at.desc&limit=200`, { headers: authHeaders }),
      fetch(`${SUPABASE_URL}/rest/v1/resources?select=*&submitted_by=not.is.null&order=created_at.desc&limit=200`, { headers: authHeaders })
    ]);

    const [feedbacks, resources] = await Promise.all([
      fbRes.ok ? fbRes.json() : null,
      resRes.ok ? resRes.json() : null
    ]);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        feedbacks: feedbacks || [],
        feedbacksError: fbRes.ok ? null : `HTTP ${fbRes.status}`,
        resources: resources || [],
        resourcesError: resRes.ok ? null : `HTTP ${resRes.status}`
      })
    };

  } catch (e) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: e.message })
    };
  }
};
