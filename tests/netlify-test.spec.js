// @ts-check
const { test, expect } = require('@playwright/test');

const NETLIFY_URL = 'https://frolicking-hotteok-ed521d.netlify.app';
const USER_A = { email: '2697626402@qq.com', password: '666666' };

const ALL_PAGES = [
  '/welcome.html', '/index.html', '/login.html', '/register.html',
  '/detail.html', '/chat.html', '/chat-detail.html', '/shuling.html',
  '/books.html', '/mbti-test.html', '/mental-test.html', '/peer-cert.html',
  '/match.html', '/mood-ring.html', '/profile.html', '/feedback.html'
];

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

test.describe('Netlify 线上冒烟测试', () => {
  for (const path of ALL_PAGES) {
    test(`${path} — 200`, async ({ page }) => {
      const response = await page.goto(NETLIFY_URL + path, { timeout: 20000 });
      expect(response.status()).toBe(200);
    });
  }

  test('Supabase SDK 从 CDN 加载', async ({ page }) => {
    await page.goto(NETLIFY_URL + '/index.html');
    await wait(3000);
    const loaded = await page.evaluate(() =>
      typeof window.TreeHole !== 'undefined' && !!window.TreeHole.supabase
    );
    expect(loaded).toBe(true);
  });

  test('登录流程正常', async ({ page }) => {
    await page.goto(NETLIFY_URL + '/login.html');
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.fill('input[type="email"]', USER_A.email);
    await page.fill('input[type="password"]', USER_A.password);
    await page.click('#loginBtn');
    await wait(5000);
    const url = page.url();
    expect(url).toContain('index.html');
  });

  test('API 代理可达 — /api/chat', async ({ page }) => {
    const response = await page.request.post(NETLIFY_URL + '/.netlify/functions/chat', {
      data: { messages: [{ role: 'user', content: '你好' }] },
      timeout: 15000
    });
    expect(response.status()).toBeLessThan(500);
  });

  test('API 代理可达 — /api/gemini', async ({ page }) => {
    const response = await page.request.post(NETLIFY_URL + '/.netlify/functions/gemini', {
      data: { prompt: 'hello' },
      timeout: 15000
    });
    expect(response.status()).toBeLessThan(500);
  });
});
