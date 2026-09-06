import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://127.0.0.1:4321';
const SCREENSHOT_DIR = '/opt/cursor/artifacts/screenshots';

mkdirSync(SCREENSHOT_DIR, { recursive: true });

const failures = [];

async function checkOverflow(page, label) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  if (overflow.scrollWidth > overflow.clientWidth + 1) {
    failures.push(`${label}: horizontal overflow (${overflow.scrollWidth}px > ${overflow.clientWidth}px)`);
  }
}

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const mobileViewports = [
    { name: '320x568', width: 320, height: 568 },
    { name: '360x800', width: 360, height: 800 },
    { name: '375x812', width: 375, height: 812 },
    { name: '390x844', width: 390, height: 844 },
    { name: '412x915', width: 412, height: 915 },
  ];

  const pages = [
    '/index.html',
    '/apps.html',
    '/apps/panchang.html',
    '/about.html',
    '/articles.html',
  ];

  for (const vp of mobileViewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const path of pages) {
      const response = await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      if (!response || response.status() >= 400) {
        failures.push(`${vp.name} ${path}: HTTP ${response?.status()}`);
        continue;
      }

      await checkOverflow(page, `${vp.name} ${path}`);

      if (path === '/index.html') {
        const hamburger = page.locator('#mobile-menu-button');
        if (!(await hamburger.isVisible())) {
          failures.push(`${vp.name}: hamburger not visible on index`);
        }
      }

      if (path === '/apps.html') {
        const cards = page.locator('.app-card-header');
        const count = await cards.count();
        if (count === 0) failures.push(`${vp.name}: no app cards found`);

        for (let i = 0; i < count; i++) {
          const card = cards.nth(i);
          const iconBox = await card.locator('.app-card-icon').boundingBox();
          const titleBox = await card.locator('.app-card-title').boundingBox();
          if (!iconBox || !titleBox) {
            failures.push(`${vp.name}: card ${i} missing icon/title boxes`);
            continue;
          }
          if (iconBox.x >= titleBox.x) {
            failures.push(`${vp.name}: card ${i} icon not left of title`);
          }
        }
      }

      if (path === '/apps/panchang.html') {
        const heroIcon = page.locator('main img[alt*="Android app icon"]').first();
        const h1 = page.locator('main h1').first();
        const iconBox = await heroIcon.boundingBox();
        const h1Box = await h1.boundingBox();
        if (!iconBox || !h1Box) {
          failures.push(`${vp.name}: app detail hero missing icon/h1`);
        } else if (iconBox.x >= h1Box.x) {
          failures.push(`${vp.name}: app detail icon not left of h1`);
        }
      }
    }
  }

  // Desktop regression check at 1280px
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${BASE}/apps.html`, { waitUntil: 'networkidle' });

  if (await page.locator('#mobile-menu-button').isVisible()) {
    failures.push('1280x800: hamburger visible on desktop');
  }

  const desktopNav = page.locator('nav .hidden.md\\:flex');
  if (!(await desktopNav.isVisible())) {
    failures.push('1280x800: desktop nav not visible');
  }

  // Desktop app card: category badge should be on same row as icon (top area)
  const firstCard = page.locator('.app-card-header').first();
  const iconBox = await firstCard.locator('.app-card-icon').boundingBox();
  const categoryBox = await firstCard.locator('.app-card-category-desktop').boundingBox();
  const titleBox = await firstCard.locator('.app-card-title').boundingBox();

  if (iconBox && categoryBox && titleBox) {
    if (categoryBox.y > iconBox.y + iconBox.height) {
      failures.push(`desktop: category badge below icon row (cat y=${categoryBox.y}, icon bottom=${iconBox.y + iconBox.height})`);
    }
    if (titleBox.y < iconBox.y + iconBox.height - 5) {
      failures.push(`desktop: title overlaps icon row incorrectly`);
    }
  }

  // Test nav links resolve (important for mobile menu)
  await page.setViewportSize({ width: 375, height: 812 });
  for (const href of ['/apps', '/about', '/articles']) {
    const response = await page.goto(`${BASE}${href}`, { waitUntil: 'domcontentloaded' });
    if (!response || response.status() >= 400) {
      failures.push(`375x812 clean URL ${href}: HTTP ${response?.status() ?? 'failed'}`);
    }
  }

  await browser.close();

  if (failures.length) {
    console.error('TEST FAILURES:');
    failures.forEach((f) => console.error(' -', f));
    process.exit(1);
  }

  console.log('All comprehensive mobile/desktop tests passed.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
