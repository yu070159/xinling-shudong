// api/admin.js — 管理员面板数据查询（service_role 绕过 RLS）
const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request) {
  try {
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '070929';
    const authHeader = request.headers.get('authorization') || '';
    if (authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
      return new Response(JSON.stringify({ error: '密码错误' }), {
        status: 401, headers: CORS_HEADERS
      });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://icbqxsiwktvsiwqygams.supabase.co';
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

    if (!SUPABASE_SERVICE_KEY) {
      return new Response(JSON.stringify({ error: 'Service key not configured' }), {
        status: 500, headers: CORS_HEADERS
      });
    }

    const authHeaders = {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
    };

    // 并行查询反馈和用户提交的推荐资源
    const [fbRes, resRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/feedbacks?select=*&order=created_at.desc&limit=200`, { headers: authHeaders }),
      fetch(`${SUPABASE_URL}/rest/v1/resources?select=*&submitted_by=not.is.null&order=created_at.desc&limit=200`, { headers: authHeaders })
    ]);

    const [feedbacks, resources] = await Promise.all([
      fbRes.ok ? fbRes.json() : null,
      resRes.ok ? resRes.json() : null
    ]);

    return new Response(JSON.stringify({
      feedbacks: feedbacks || [],
      feedbacksError: fbRes.ok ? null : `HTTP ${fbRes.status}`,
      resources: resources || [],
      resourcesError: resRes.ok ? null : `HTTP ${resRes.status}`
    }), {
      status: 200, headers: CORS_HEADERS
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: CORS_HEADERS
    });
  }
}
