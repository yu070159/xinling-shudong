// netlify/functions/cron.js — 离线通知摘要邮件（Netlify 版本）
const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

const CRON_SECRET = process.env.CRON_SECRET || 'soul-tree-cron-secret';

exports.handler = async (event) => {
  try {
    const authHeader = event.headers['authorization'] || event.headers['Authorization'] || '';
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return { statusCode: 401, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@soultree.fun';
    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://oazntpskcghfxzcylnef.supabase.co';
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    const SITE_URL = process.env.SITE_URL || 'https://soultree.fun';
    const INACTIVE_DAYS = parseInt(process.env.INACTIVE_DAYS || '3', 10);

    if (!RESEND_API_KEY || !SUPABASE_SERVICE_KEY) {
      console.error('Missing RESEND_API_KEY or SUPABASE_SERVICE_KEY');
      return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Service not configured' }) };
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - INACTIVE_DAYS);
    const cutoffISO = cutoffDate.toISOString();

    const profilesUrl = `${SUPABASE_URL}/rest/v1/profiles`
      + `?select=id,user_id,nickname,email,last_active_at,last_email_digest_at`
      + `&last_active_at=lt.${encodeURIComponent(cutoffISO)}`
      + `&email=not.is.null`
      + `&order=last_active_at.asc`
      + `&limit=50`;

    const profilesRes = await fetch(profilesUrl, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      }
    });

    if (!profilesRes.ok) {
      console.error('Failed to fetch profiles:', profilesRes.status);
      return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Failed to query profiles' }) };
    }

    const profiles = await profilesRes.json();

    if (!profiles || profiles.length === 0) {
      return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ sent: 0, message: 'No inactive users' }) };
    }

    const typeLabels = {
      reply: '回复', message: '私信', friend_request: '好友申请',
      friend_accept: '好友通过', peer_support: '危机倾听', match_letter: '匿名信'
    };

    let sentCount = 0;

    for (const profile of profiles) {
      try {
        if (profile.last_email_digest_at && profile.last_active_at
            && new Date(profile.last_email_digest_at) >= new Date(profile.last_active_at)) {
          continue;
        }

        const notifUrl = `${SUPABASE_URL}/rest/v1/notifications`
          + `?select=id,type,content_preview,created_at`
          + `&user_id=eq.${profile.user_id}`
          + `&is_read=eq.false`
          + `&order=created_at.desc`
          + `&limit=20`;

        const notifRes = await fetch(notifUrl, {
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
          }
        });

        if (!notifRes.ok) continue;

        const notifications = await notifRes.json();
        if (!notifications || notifications.length === 0) continue;

        const counts = {};
        notifications.forEach(n => {
          counts[n.type] = (counts[n.type] || 0) + 1;
        });

        const summaryLines = Object.entries(counts).map(([type, count]) =>
          `${typeLabels[type] || type}：${count} 条`
        );

        const nickname = profile.nickname || '树友';
        const htmlBody = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f5f0eb">
<div style="max-width:600px;margin:0 auto;background:#fdf6ed;border-radius:12px;padding:32px;font-family:'PingFang SC','Microsoft YaHei',sans-serif">
  <h1 style="color:#8B7355;margin:0 0 8px;font-size:22px">心灵树洞</h1>
  <p style="color:#6B5B4B;font-size:16px;margin:0 0 24px">${nickname}，你好</p>
  <p style="color:#6B5B4B;line-height:1.8;margin:0 0 20px">你已经有 <b>${INACTIVE_DAYS}</b> 天没回树洞了，这段时间你收到了：</p>
  <div style="background:#fff;border-radius:8px;padding:16px 20px;margin:0 0 20px">
    ${summaryLines.map(line => `<p style="color:#5A4A3B;font-size:15px;margin:8px 0">· ${line}</p>`).join('')}
  </div>
  <p style="color:#6B5B4B;line-height:1.8;margin:0 0 24px">共 <b>${notifications.length}</b> 条未读消息，树洞里的树友们在等着你。</p>
  <a href="${SITE_URL}" style="display:inline-block;background:#8B7355;color:#fff;padding:12px 32px;border-radius:24px;text-decoration:none;font-size:15px">回来看看</a>
  <p style="color:#B0A090;font-size:12px;margin:32px 0 0;line-height:1.6">心灵树洞 · 匿名情感互助社区<br>如不想再收到此类邮件，请登录后在个人中心关闭通知。</p>
</div></body></html>`;

        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: `心灵树洞 <${EMAIL_FROM}>`,
            to: profile.email,
            subject: `树洞里有人想你了 — ${notifications.length} 条未读消息`,
            html: htmlBody
          })
        });

        if (emailRes.ok) {
          const patchUrl = `${SUPABASE_URL}/rest/v1/profiles?user_id=eq.${profile.user_id}`;
          await fetch(patchUrl, {
            method: 'PATCH',
            headers: {
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ last_email_digest_at: new Date().toISOString() })
          });
          sentCount++;
          console.log(`Sent digest to ${profile.email}: ${notifications.length} unread`);
        } else {
          const errBody = await emailRes.text();
          console.error(`Resend error for ${profile.email}:`, errBody);
        }
      } catch (err) {
        console.error(`Error processing ${profile.user_id}:`, err);
      }
    }

    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ sent: sentCount, total: profiles.length }) };

  } catch (err) {
    console.error('Cron job error:', err);
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
