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

    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://oazntpskcghfxzcylnef.supabase.co';
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

    // 并行查询反馈、用户推荐资源、AI 对话记录
    const [fbRes, resRes, dialogsRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/feedbacks?select=*&order=created_at.desc&limit=200`, { headers: authHeaders }),
      fetch(`${SUPABASE_URL}/rest/v1/resources?select=*&submitted_by=not.is.null&order=created_at.desc&limit=200`, { headers: authHeaders }),
      fetch(`${SUPABASE_URL}/rest/v1/ai_dialogs?select=id,user_id,session_type,user_message,ai_reply,created_at&order=created_at.desc&limit=2000`, { headers: authHeaders })
    ]);

    const [feedbacks, resources, aiDialogs] = await Promise.all([
      fbRes.ok ? fbRes.json() : null,
      resRes.ok ? resRes.json() : null,
      dialogsRes.ok ? dialogsRes.json() : null
    ]);

    // 查询所有 profiles 以便映射 user_id → nickname
    let profiles = [];
    if (aiDialogs && aiDialogs.length > 0) {
      const userIds = [...new Set(aiDialogs.map(d => d.user_id))];
      const idsParam = userIds.map(id => `user_id.eq.${id}`).join(',');
      try {
        const pRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=user_id,nickname&or=(${idsParam})`, { headers: authHeaders });
        if (pRes.ok) profiles = await pRes.json();
      } catch (e) {}
    }

    return new Response(JSON.stringify({
      feedbacks: feedbacks || [],
      feedbacksError: fbRes.ok ? null : `HTTP ${fbRes.status}`,
      resources: resources || [],
      resourcesError: resRes.ok ? null : `HTTP ${resRes.status}`,
      aiDialogs: aiDialogs || [],
      aiDialogsError: dialogsRes.ok ? null : `HTTP ${dialogsRes.status}`,
      profiles: profiles || []
    }), {
      status: 200, headers: CORS_HEADERS
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: CORS_HEADERS
    });
  }
}
