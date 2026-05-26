// 本地 API 开发服务器 — 替代 vercel dev
// 用法：node dev-server.cjs
const http = require('http');
const https = require('https');
const { readFileSync } = require('fs');
const { resolve } = require('path');

const PORT = 3000;

// 读 .env.local
let env = {};
try {
  readFileSync(resolve(__dirname, '.env.local'), 'utf-8')
    .split('\n').forEach(line => {
      const m = line.match(/^([^=]+)=(.*)$/);
      if (m) env[m[1].trim()] = m[2].trim();
    });
} catch(e) {}

function getEnv(k, fb) { return process.env[k] || env[k] || fb || null; }

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'Content-Type, Authorization'
};

function send(res, code, data) {
  res.writeHead(code, { 'content-type': 'application/json', ...CORS });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise(ok => {
    let b = ''; req.on('data', c => b += c);
    req.on('end', () => { try { ok(JSON.parse(b)); } catch(e) { ok(null); } });
  });
}

function deepSeekCall(body) {
  return new Promise(ok => {
    const key = getEnv('DEEPSEEK_API_KEY');
    if (!key) return ok({ code: 500, data: { error: 'DEEPSEEK_API_KEY 未配置' } });
    const payload = JSON.stringify(body);
    const r = https.request({
      hostname: 'api.deepseek.com', path: '/chat/completions', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key, 'Content-Length': Buffer.byteLength(payload) }
    }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try { ok({ code: res.statusCode, data: JSON.parse(d) }); } catch(e) { ok({ code: 500, data: { error: '解析失败' } }); } }); });
    r.on('error', e => ok({ code: 500, data: { error: e.message } }));
    r.write(payload); r.end();
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const method = req.method.toUpperCase();

  if (method === 'OPTIONS') { res.writeHead(204, CORS); res.end(); return; }

  // /api/chat
  if (url.pathname === '/api/chat' && method === 'POST') {
    const body = await readBody(req);
    if (!body || !body.messages) return send(res, 400, { error: '缺少 messages' });
    const r = await deepSeekCall({ model: 'deepseek-chat', messages: body.messages, temperature: 0.8, max_tokens: body.max_tokens || 500 });
    return send(res, r.code, r.data);
  }

  // /api/gemini（兼容旧版）
  if (url.pathname === '/api/gemini' && method === 'POST') {
    const body = await readBody(req);
    if (!body || !body.prompt) return send(res, 400, { error: '缺少 prompt' });
    const r = await deepSeekCall({ model: 'deepseek-v4-flash', messages: [{ role: 'user', content: body.prompt }], max_tokens: 600 });
    if (r.code !== 200) return send(res, r.code, { error: 'DeepSeek 请求失败' });
    const text = r.data.choices?.[0]?.message?.content || '';
    return send(res, 200, { candidates: [{ content: { parts: [{ text }] }, finishReason: 'STOP' }], usageMetadata: r.data.usage || {} });
  }

  // /api/admin
  if (url.pathname === '/api/admin' && method === 'GET') {
    const auth = req.headers['authorization'] || '';
    if (auth !== 'Bearer ' + getEnv('ADMIN_PASSWORD', '070929')) return send(res, 401, { error: '密码错误' });
    const key = getEnv('SUPABASE_SERVICE_KEY');
    if (!key) return send(res, 500, { error: 'SUPABASE_SERVICE_KEY 未配置' });
    const dbUrl = getEnv('SUPABASE_URL', 'https://oazntpskcghfxzcylnef.supabase.co');
    const h = { 'apikey': key, 'Authorization': 'Bearer ' + key };
    try {
      const [fb, rs] = await Promise.all([
        fetch(dbUrl + '/rest/v1/feedbacks?select=*&order=created_at.desc&limit=200', { headers: h }),
        fetch(dbUrl + '/rest/v1/resources?select=*&submitted_by=not.is.null&order=created_at.desc&limit=200', { headers: h })
      ]);
      const [fbs, rss] = await Promise.all([fb.ok ? fb.json() : null, rs.ok ? rs.json() : null]);
      return send(res, 200, { feedbacks: fbs || [], feedbacksError: fb.ok ? null : 'HTTP ' + fb.status, resources: rss || [], resourcesError: rs.ok ? null : 'HTTP ' + rs.status });
    } catch(e) { return send(res, 500, { error: e.message }); }
  }

  send(res, 404, { error: 'Not Found' });
});

server.listen(PORT, () => {
  console.log('API 服务器已启动: http://localhost:' + PORT);
  console.log('  POST /api/chat   — DeepSeek 聊天');
  console.log('  POST /api/gemini — DeepSeek (兼容)');
  console.log('  GET  /api/admin  — 管理员数据');
});
