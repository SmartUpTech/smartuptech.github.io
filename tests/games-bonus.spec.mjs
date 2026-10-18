import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,relative,isAbsolute,extname} from 'node:path';
import {chromium} from 'playwright';
import {newPuzzle} from '../public/games/games/state.mjs';

const publicDir=resolve('public');
const server=createServer(async(req,res)=>{
  try {
    const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=resolve(publicDir,'.'+path),within=relative(publicDir,file);
    if(within.startsWith('..')||isAbsolute(within)||!path.startsWith('/games/'))throw Error('PATH');
    const data=await readFile(file);
    res.setHeader('Content-Type',({'.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.html':'text/html'})[extname(file)]||'text/plain');res.end(data);
  } catch {res.writeHead(404);res.end('Not found');}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE_PATH?{executablePath:process.env.BROWSER_EXECUTABLE_PATH}:{})});
const catalog=JSON.parse(await readFile('public/games/games.json','utf8'));
const date='2026-10-18',completed=Object.fromEntries(catalog.map(g=>[g.id,date]));
const offer={enabled:true,eligible:true,busy:false,title:'Ready for another round?',
  message:'Watch an ad to unlock one fresh set of today’s games. One bonus set is available today.',
  watch:'Watch ad & unlock',finished:'You’ve completed both sets. Come back tomorrow for new challenges.'};
const base={bridgeVersion:1,appId:'net.test.today',date,timezone:'Asia/Kolkata',language:'en',theme:{mode:'light'},completions:completed};
const errors=[];
let context;
try {
  context=await browser.newContext({viewport:{width:390,height:700}});
  await context.addInitScript(()=>{window.events=[];window.AndroidGames={postMessage:raw=>window.events.push(JSON.parse(raw))};});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/games/index.html?embedded=1#number_grid`);
  await page.waitForFunction(()=>Boolean(window.SmartUpGames));
  const configure=async config=>{
    assert.equal(await page.evaluate(c=>window.SmartUpGames.configure(c),config),true);
    await page.waitForSelector('.screen-result,.screen-landing,.screen-game');
  };
  await configure(base);assert.equal(await page.locator('.bonus-card').count(),0,'old hosts');
  await configure({...base,bonus:{...offer,enabled:false}});assert.equal(await page.locator('.bonus-card').count(),0,'Pro users');
  await configure({...base,bonus:{...offer,eligible:false}});assert.equal(await page.locator('.bonus-card').count(),0,'unconfirmed completion');
  await configure({...base,bonus:offer});await page.locator('.bonus-card').waitFor();
  await page.evaluate(()=>{const b=document.querySelector('.bonus-card button');b.click();b.click();});
  assert.equal(await page.evaluate(()=>events.filter(e=>e.type==='onBonusRequested').length),1);
  await configure({...base,bonus:{...offer,busy:true}});assert.equal(await page.locator('.bonus-card button').isDisabled(),true);
  await configure({...base,bonus:{...offer,message:'The ad couldn’t be completed. Your progress is saved, and you can try again.'}});
  assert.equal(await page.locator('.bonus-card button').isEnabled(),true);
  assert.ok(await page.locator('.screen-result').count(),'failure preserves results');

  await mkdir('test-results/games',{recursive:true});
  for(const theme of ['light','dark'])for(const size of [{width:390,height:700},{width:320,height:440},{width:740,height:360}]){
    await page.setViewportSize(size);await configure({...base,theme:{mode:theme},bonus:offer});
    const bounds=await page.locator('.bonus-card').boundingBox();assert.ok(bounds.x>=0&&bounds.x+bounds.width<=size.width+1);
    assert.ok(bounds.y+bounds.height<=size.height+1,'completion reward fits the viewport');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
    await page.screenshot({path:`test-results/games/bonus-${theme}-${size.width}.png`,fullPage:true});
    await page.evaluate(()=>window.SmartUpGames.back());await page.waitForSelector('.game-card');
    const landing=await page.locator('.bonus-card').boundingBox();
    assert.ok(landing.y+landing.height<=size.height+1,`landing reward fits ${size.width}x${size.height}: ${landing.y+landing.height}`);
    await page.getByRole('button',{name:/^Number Grid/}).click();await page.waitForSelector('.screen-result');
  }
  await page.setViewportSize({width:390,height:700});
  const bonusHost={...base,bonusRound:1,completions:{},bonus:{...offer,eligible:false}};
  await configure(bonusHost);await page.waitForSelector('.game-card');
  assert.equal(await page.locator('.bonus-card').count(),0);
  await page.getByRole('button',{name:'Number Grid',exact:true}).click();await page.waitForSelector('.number-grid');
  const key=`smartup.games.progress.v1:embedded:net.test.today:bonus:${date}:number_grid`;
  const saved=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  assert.notDeepEqual(saved.puzzle,newPuzzle('number_grid',date,'en').puzzle);
  for(let n=1;n<=16;n++)await page.locator(`[data-number="${n}"]`).click();
  await page.waitForSelector('.screen-result');
  assert.equal(await page.locator('.bonus-card').count(),0);
  assert.equal(await page.evaluate(()=>events.filter(e=>e.type==='onGameCompleted'&&e.round===1).length),1);
  await page.reload();await page.waitForFunction(()=>Boolean(window.SmartUpGames));await configure(bonusHost);
  await page.waitForSelector('.screen-result');assert.equal(await page.locator('.bonus-card').count(),0);
  assert.equal(await page.evaluate(()=>events.filter(e=>e.type==='onGameCompleted').length),0,'reload never repeats completion');
  await configure({...bonusHost,completions:completed});
  assert.equal(await page.locator('.bonus-card').count(),0,'no third set');
  assert.ok((await page.locator('.screen-result').textContent()).includes('both sets'));
  assert.equal(await page.evaluate(c=>window.SmartUpGames.configure({...c,bonusRound:2}),base),false);
  assert.deepEqual(errors,[]);
  console.log('PASS: Pro/legacy suppression, opt-in deduplication, failure retry, responsive cards, fresh bonus set, restoration and no third set');
} finally {await context?.close();await browser.close();await new Promise(r=>server.close(r));}
