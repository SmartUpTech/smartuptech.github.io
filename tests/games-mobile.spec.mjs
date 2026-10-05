import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {scrambleChallenge,graphemes} from '../public/games/games/words.mjs';
const {chromium}=await import(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? pathToFileURL(resolve(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright/index.mjs')).href : 'playwright');
const publicDir=resolve('public');
const server=createServer(async(req,res)=>{
  try {
    let path=decodeURIComponent(new URL(req.url,'http://local').pathname);if(path.endsWith('/'))path+='index.html';
    const file=resolve(publicDir,'.'+path);if(!file.startsWith(publicDir+'/')){res.writeHead(403);res.end();return;}
    const data=await readFile(file);res.setHeader('Content-Type',({'.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.html':'text/html'})[extname(file)] || 'text/plain');res.end(data);
  }catch{res.writeHead(404);res.end('Not found');}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}/games/`;
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const errors=[];
const context=await browser.newContext({viewport:{width:390,height:844},timezoneId:'Asia/Kolkata'});
const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
await mkdir('test-results/games',{recursive:true});
try {
  for(const width of [320,360,390,412,480])for(const theme of ['light','dark']) {
    await page.setViewportSize({width,height:844});await page.goto(base+`?test=1&theme=${theme}`);
    await page.waitForSelector('.game-card');
    assert.equal(await page.locator('.game-card').count(),2);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    if(width===390)await page.screenshot({path:`test-results/games/landing-${theme}.png`,fullPage:true});
  }
  await page.goto(base);await page.waitForSelector('.game-card');
  await page.evaluate(()=>{window.events=[];window.addEventListener('games:event',e=>window.events.push(e.detail));});
  await page.getByRole('button',{name:'Word Match',exact:true}).click();await page.waitForSelector('[data-pair]');
  // Wrong pairs cannot complete the game.
  await page.locator('[data-side="left"][data-pair="0"]').click();await page.locator('[data-side="right"][data-pair="1"]').click();
  assert.equal(await page.locator('.matched').count(),0);
  for(let i=0;i<4;i++){await page.locator(`[data-side="left"][data-pair="${i}"]`).click();await page.locator(`[data-side="right"][data-pair="${i}"]`).click();}
  await page.getByRole('heading',{name:'Well done!'}).waitFor();
  assert.equal(await page.evaluate(()=>window.events.filter(e=>e.type==='onGameCompleted').length),1);
  await page.screenshot({path:'test-results/games/result.png'});
  await page.getByRole('button',{name:'Back to games'}).click();await page.waitForSelector('.badge');await page.reload();await page.waitForSelector('.badge');
  await page.getByRole('button',{name:'Word Match: Completed today'}).click();assert.equal(await page.locator('[data-pair]').count(),0);
  await page.getByRole('button',{name:'Back to games'}).click();
  await page.getByRole('button',{name:'Word Scramble',exact:true}).click();await page.waitForSelector('.tiles');
  const date=await page.evaluate(()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;});
  for(const round of scrambleChallenge(date,'en').rounds){for(const letter of graphemes(round.word,'en'))await page.locator('.tiles button:not(:disabled)').filter({hasText:new RegExp(`^${letter}$`)}).first().click();await page.getByRole('button',{name:'Check word',exact:true}).click();}
  await page.getByRole('heading',{name:'Well done!'}).waitFor();await page.getByRole('button',{name:'Back to games'}).click();await page.waitForSelector('.badge');assert.equal(await page.locator('.badge').count(),2);
  // Localized content, narrow-screen gameplay and reduced motion.
  await context.clearCookies();await page.evaluate(()=>localStorage.clear());
  for(const lang of ['hi','mr','gu']) {
    await page.goto(base+`?lang=${lang}`);await page.waitForSelector('.game-card');await page.locator('.game-card').first().click();await page.waitForSelector('.pairs');
    await page.setViewportSize({width:320,height:740});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.screenshot({path:`test-results/games/match-${lang}.png`,fullPage:true});
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  // Embedded mode waits for native state, hides test controls and uses host date.
  await page.goto(base+'?embedded=1&test=1');
  await page.waitForFunction(()=>Boolean(window.SmartUpGames));
  const config={bridgeVersion:1,appId:'net.test.host',language:'en',date:'2026-12-31',timezone:'Asia/Kolkata',theme:{mode:'dark',accent:'#f4c577'},completions:{word_match:'2026-12-31'}};
  assert.equal(await page.evaluate(c=>window.SmartUpGames.configure(c),config),true);await page.waitForSelector('.game-card');
  assert.equal(await page.locator('.badge').count(),1);assert.equal(await page.locator('.test-settings').count(),0);
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--accent')),'#f4c577');
  await page.evaluate(c=>window.SmartUpGames.configure({...c,date:'2027-01-01'}),config);await page.waitForSelector('.game-card');assert.equal(await page.locator('.badge').count(),0);
  assert.equal(await page.evaluate(c=>window.SmartUpGames.configure({...c,date:'broken'}),config),false);
  // Failed catalog fetch has a working retry path.
  await page.route('**/games.json',route=>route.abort());await page.goto(base);await page.getByRole('button',{name:'Try again'}).waitFor();
  await page.unroute('**/games.json');await page.getByRole('button',{name:'Try again'}).click();await page.waitForSelector('.game-card');
  assert.deepEqual(errors,[]);console.log('PASS: mobile widths, themes, both games, persistence, locales, bridge configuration and retry; no page errors.');
} finally {await browser.close();await new Promise(r=>server.close(r));}
