const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');

const routes = ['/', '/visualizer', '/blogs', '/login', '/signup', '/contact'];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, colorScheme: 'light' });

    for (const route of routes) {
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', (err) => consoleErrors.push(`PAGEERROR: ${err.message}`));

      const url = `http://localhost:3000${route}`;
      let status = 'ok';
      let httpStatus = null;
      try {
        const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        httpStatus = resp ? resp.status() : null;
      } catch (e) {
        status = `navigation_failed: ${e.message}`;
      }

      let overflow = null;
      let missingAlt = [];
      let iconOnlyButtonsNoName = [];
      let hoverNoChange = [];
      let darkLightMismatch = null;
      let axeViolations = [];
      let pageTitle = null;

      if (status === 'ok') {
        await page.waitForTimeout(1000);
        pageTitle = await page.title();

        overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          return {
            innerWidth: window.innerWidth,
            scrollWidth: doc.scrollWidth,
            hasOverflow: doc.scrollWidth > window.innerWidth + 1,
          };
        });

        missingAlt = await page.evaluate(() =>
          Array.from(document.querySelectorAll('img:not([alt])'))
            .slice(0, 20)
            .map((img) => ({ src: img.getAttribute('src'), outer: img.outerHTML.slice(0, 180) }))
        );

        iconOnlyButtonsNoName = await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns
            .filter((b) => {
              const name = (b.getAttribute('aria-label') || b.innerText || '').trim();
              const hasSvgOnly = b.querySelector('svg') && (b.innerText || '').trim() === '';
              return hasSvgOnly && !name;
            })
            .slice(0, 20)
            .map((b) => ({ outer: b.outerHTML.slice(0, 180) }));
        });

        hoverNoChange = await page.evaluate(() => {
          const items = Array.from(document.querySelectorAll('a, button')).slice(0, 40);
          const unchanged = [];
          const pick = (el) => {
            const cs = getComputedStyle(el);
            return [cs.backgroundColor, cs.color, cs.borderColor, cs.boxShadow, cs.transform, cs.opacity].join('|');
          };
          for (const el of items) {
            const before = pick(el);
            el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            const after = pick(el);
            if (before === after) {
              const txt = (el.innerText || el.getAttribute('aria-label') || '').trim();
              if (txt) unchanged.push(txt.slice(0, 80));
            }
          }
          return [...new Set(unchanged)].slice(0, 15);
        });

        const toggle = page.getByRole('button', { name: /theme|dark|light|mode|toggle/i }).first();
        if (await toggle.count()) {
          const beforeClass = await page.evaluate(() => document.documentElement.className);
          await toggle.click({ timeout: 2000 }).catch(() => {});
          await page.waitForTimeout(300);
          const afterClass = await page.evaluate(() => document.documentElement.className);
          darkLightMismatch = { toggled: beforeClass !== afterClass, beforeClass, afterClass };
        }

        try {
          const axe = await new AxeBuilder({ page }).analyze();
          axeViolations = axe.violations.map(v => ({ id: v.id, impact: v.impact, desc: v.description, nodes: v.nodes.length })).slice(0, 10);
        } catch (e) {
          axeViolations.push({ id: 'axe-failed', impact: 'unknown', desc: e.message, nodes: 0 });
        }
      }

      results.push({ route, viewport: viewport.name, url, status, httpStatus, pageTitle, overflow, missingAlt, iconOnlyButtonsNoName, hoverNoChange, darkLightMismatch, axeViolations, consoleErrors });
      await page.close();
    }

    await context.close();
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
