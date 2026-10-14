import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile,mkdtemp} from 'node:fs/promises';
import {resolve,relative,isAbsolute,extname} from 'node:path';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
import {languages} from '../public/games/locale.mjs';
import {translator} from '../public/games/i18n.mjs';
import {mazeMove} from '../public/games/games/puzzles.mjs';
import {shapeReference,rotatePipe} from '../public/games/games/new-puzzles.mjs';
const fixtures=JSON.parse(await readFile(new URL('./fixtures/games-hosts.json',import.meta.url)));
const catalog=JSON.parse(await readFile(new URL('../public/games/games.json',import.meta.url)));
const publicDir=resolve('public'),baseline=new Map(),output='test-results/games';
const server=createServer(async(req,res)=>{
 try {
  let path=decodeURIComponent(new URL(req.url,'http://localhost').pathname),old=path.startsWith('/baseline/');
  if(old)path=path.slice('/baseline'.length);if(path.endsWith('/'))path+='index.html';
  const file=resolve(publicDir,'.'+path),within=relative(publicDir,file);if(within.startsWith('..')||isAbsolute(within)||!path.startsWith('/games/'))throw Error('PATH');
  let data;if(old){if(!baseline.has(path))baseline.set(path,execFileSync('git',['show',`${fixtures.oldSiteRevision}:public${path}`],{maxBuffer:1024*1024}));data=baseline.get(path);}else data=await readFile(file);
  res.setHeader('Content-Type',({'.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.html':'text/html'})[extname(file)]||'text/plain');res.end(data);
 }catch{res.writeHead(404);res.end('Not found');}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=`http://127.0.0.1:${server.address().port}`,base=origin+'/games/index.html';
const browser=await chromium.launch({headless:true});
const evidence={browser:browser.version(),siteBaseRevision:fixtures.oldSiteRevision,hostProvenance:fixtures.provenance,deviceTested:false,checks:[],screenshots:[]};
const errors=[];let context;
async function fresh(){await context?.close();context=await browser.newContext({viewport:{width:390,height:560},timezoneId:'Asia/Kolkata'});await context.addInitScript(()=>{window.nativeEvents=[];window.AndroidGames={postMessage(raw){window.nativeEvents.push(JSON.parse(raw));}};});const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));return page;}
async function configure(page,config=fixtures.oldHost){await page.waitForFunction(()=>Boolean(window.SmartUpGames));assert.equal(await page.evaluate(c=>window.SmartUpGames.configure(JSON.stringify(c)),config),true);}
async function open(page,id,config=fixtures.oldHost){await page.goto(base+'?embedded=1'+(id?'#'+id:''));await configure(page,config);await page.waitForSelector(id?'.reset-game:not(:disabled)':'.game-card');}
const key=id=>`smartup.games.progress.v1:embedded:net.test.host:2026-10-11:${id}`;
async function snapshot(page,id){return page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key(id));}
async function counts(page){return page.evaluate(()=>({starts:window.nativeEvents.filter(e=>e.type==='onGameStarted').length,completes:window.nativeEvents.filter(e=>e.type==='onGameCompleted').length}));}
function check(name){evidence.checks.push(name);console.log('PASS',name);}
async function move(page,id){
 const saved=await snapshot(page,id);
 switch(id){
  case 'word_match':await page.locator('[data-side="left"][data-pair="0"]').click();break;
  case 'word_scramble':await page.locator('.tiles button').first().click();break;
  case 'mini_sudoku':{const at=saved.puzzle.puzzle.indexOf(0);await page.locator(`[data-cell="${at}"]`).click();await page.locator('.digit-key').nth(saved.puzzle.solution[at]-1).click();break;}
  case 'sequence':{const wrong=saved.puzzle[0].options.findIndex(n=>n!==saved.puzzle[0].answer);await page.locator('.sequence-options button').nth(wrong).click();break;}
  case 'maze':{const d=[0,1,2,3].find(d=>mazeMove(saved.puzzle,saved.state.at,d)!==saved.state.at);await page.locator('.maze-board').focus();await page.keyboard.press(['ArrowUp','ArrowRight','ArrowDown','ArrowLeft'][d]);break;}
  case 'number_grid':await page.locator('[data-number="1"]').click();break;
  case 'shape_fit':{const piece=saved.puzzle[0],[r,c]=shapeReference(piece);await page.locator('[data-piece="0"]').click();await page.locator(`[data-cell="${piece.anchor+r*4+c}"]`).click();break;}
  case 'pipe_connect':await page.locator('[data-cell="5"]').click();break;
  case 'code_breaker':await page.locator('.code-pad button').first().click();break;
 }
}
async function finish(page,id){
 const {puzzle:p}=await snapshot(page,id);
 switch(id){
  case 'word_match':for(let i=0;i<4;i++){await page.locator(`[data-side="left"][data-pair="${i}"]`).click();await page.locator(`[data-side="right"][data-pair="${i}"]`).click();}break;
  case 'word_scramble':for(const round of p.rounds){const used=new Set();for(const letter of round.graphemes){const index=round.tiles.findIndex((tile,i)=>tile===letter&&!used.has(i));used.add(index);await page.locator('.tiles button').nth(index).click();}await page.locator('.game-content .primary').click();}break;
  case 'mini_sudoku':for(let i=0;i<16;i++)if(!p.puzzle[i]){await page.locator(`[data-cell="${i}"]`).click();await page.locator('.digit-key').nth(p.solution[i]-1).click();}break;
  case 'sequence':for(const round of p)await page.locator('.sequence-options button').nth(round.options.indexOf(round.answer)).click();break;
  case 'maze':{const queue=[p.start],previous=new Map([[p.start,null]]);for(const at of queue)for(let d=0;d<4;d++){const next=mazeMove(p,at,d);if(!previous.has(next)){previous.set(next,{at,d});queue.push(next);}}let at=p.goal;const path=[];while(at!==p.start){const step=previous.get(at);path.unshift(step.d);at=step.at;}for(const d of path)await page.locator('.maze-controls button').nth(d).click();break;}
  case 'number_grid':for(let n=1;n<=16;n++)await page.locator(`[data-number="${n}"]`).click();break;
  case 'shape_fit':for(let i=0;i<p.length;i++){const [r,c]=shapeReference(p[i]);await page.locator(`[data-piece="${i}"]`).click();await page.locator(`[data-cell="${p[i].anchor+r*4+c}"]`).click();}break;
  case 'pipe_connect':for(const i of [...Array.from({length:15},(_,i)=>i+1),0]){let mask=p.puzzle[i];while(mask!==p.solution[i]&&await page.locator('.pipe-board').count()){await page.locator(`[data-cell="${i}"]`).click();mask=rotatePipe(mask);}}break;
  case 'code_breaker':{
   const wrong=[...p.slice(1),p[0]];for(let i=0;i<4;i++){for(const n of wrong)await page.locator('.code-pad button').nth(n-1).click();await page.locator('.game-content .primary').click();}
   await page.reload();await configure(page,{...fixtures.oldHost,language:'fr'});await page.waitForSelector('.code-pad');assert.equal(await page.locator('.code-history li').count(),3);
   for(const n of p)await page.locator('.code-pad button').nth(n-1).click();await page.locator('.game-content .primary').click();break;
  }
 }
 await page.waitForSelector('.screen-result');
}
try {
 await mkdir(output,{recursive:true});
 for(const game of catalog){
  let page=await fresh();await open(page,game.id);const initial=await snapshot(page,game.id);await move(page,game.id);const saved=await snapshot(page,game.id);
  assert.notDeepEqual(saved.state,initial.state,game.id+' move persisted');assert.equal(saved.status,'playing');const before=await counts(page);
  for(const language of ['en','hi','fr','en','hi','fr']){await configure(page,{...fixtures.oldHost,language,theme:{mode:language==='hi'?'dark':'light'}});assert.equal(await page.evaluate(()=>location.hash),'#'+game.id);assert.deepEqual((await snapshot(page,game.id)).state,saved.state);assert.equal(await page.locator('h1').textContent(),translator(language)(game.id));}
  assert.deepEqual(await counts(page),before);assert.deepEqual((await snapshot(page,game.id)).puzzle,saved.puzzle);
  await page.reload();await configure(page,fixtures.newHost);await page.waitForSelector('.reset-game:not(:disabled)');assert.deepEqual((await snapshot(page,game.id)).state,saved.state);assert.deepEqual(await counts(page),{starts:0,completes:0});
  // New WebView-like document with no hash restores the route and state.
  await page.close();page=await context.newPage();await page.goto(base+'?embedded=1');await configure(page,fixtures.newHost);await page.waitForSelector('.reset-game:not(:disabled)');assert.equal(await page.evaluate(()=>location.hash),'#'+game.id);assert.deepEqual((await snapshot(page,game.id)).state,saved.state);assert.deepEqual(await counts(page),{starts:0,completes:0});
  await page.evaluate(()=>{window.dispatchEvent(new PageTransitionEvent('pagehide'));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));document.dispatchEvent(new Event('visibilitychange'));});assert.deepEqual((await snapshot(page,game.id)).state,saved.state);assert.deepEqual(await counts(page),{starts:0,completes:0});
  await page.locator('.reset-game').click();assert.deepEqual((await snapshot(page,game.id)).state,initial.state);assert.deepEqual((await snapshot(page,game.id)).puzzle,initial.puzzle);assert.deepEqual(await counts(page),{starts:0,completes:0});
  await finish(page,game.id);assert.equal((await counts(page)).completes,1);assert.equal((await snapshot(page,game.id)).status,'finished');await page.reload();await configure(page,{...fixtures.oldHost,language:'hi'});await page.waitForSelector('.screen-result');assert.deepEqual(await counts(page),{starts:0,completes:0});
  check(game.id+': move / six locale changes / reload / new document / lifecycle / reset');
 }
 let page=await fresh();await open(page,'number_grid');for(let n=1;n<=16;n++)await page.locator(`[data-number="${n}"]`).click();await page.waitForSelector('.screen-result');assert.deepEqual(await counts(page),{starts:1,completes:1});
 await page.reload();await configure(page);await page.waitForSelector('.screen-result');assert.deepEqual(await counts(page),{starts:0,completes:0});assert.equal(await page.locator('.screen-result .notice').count(),0);
 for(const language of languages){await configure(page,{...fixtures.oldHost,language,completions:{number_grid:'2026-10-11'}});await page.waitForSelector('.screen-result');assert.equal(await page.locator('.reset-game').count(),0);assert.deepEqual(await counts(page),{starts:0,completes:0});}
 // An incomplete completion map during same-day language refresh cannot remove a confirmed game.
 await configure(page,{...fixtures.oldHost,language:'fr'});assert.ok((await page.locator('.screen-result').textContent()).includes(translator('fr')('completed')));
 check('result restoration, authoritative completion, no duplicate event or language unlock');

 for(const timezone of ['Europe/Paris','America/New_York','Pacific/Kiritimati','Pacific/Honolulu']){
  page=await fresh();await open(page,'number_grid');await move(page,'number_grid');const saved=await snapshot(page,'number_grid');await configure(page,{...fixtures.oldHost,timezone});assert.deepEqual((await snapshot(page,'number_grid')).state,saved.state);
  for(const date of ['2026-10-12','2026-10-10']){await configure(page,{...fixtures.oldHost,timezone,date});await page.waitForSelector('.reset-game:not(:disabled)');const current=await page.evaluate(({date})=>JSON.parse(localStorage.getItem(`smartup.games.progress.v1:embedded:net.test.host:${date}:number_grid`)),{date});assert.equal(current.date,date);assert.equal(current.state.next,1);}
 }
 check('host-local date forwards/backwards and timezone changes');

 for(const corrupt of ['json','oversized','schema','revision','game','state','app']){
  page=await fresh();await open(page,'number_grid');await move(page,'number_grid');await page.evaluate(()=>window.SmartUpGames.back());await page.waitForSelector('.game-card');await page.evaluate(({key,corrupt})=>{const value=JSON.parse(localStorage.getItem(key));if(corrupt==='schema')value.schema=99;if(corrupt==='revision')value.puzzleRevision='old';if(corrupt==='game')value.gameId='maze';if(corrupt==='state')value.state.next=99;if(corrupt==='app')value.appId='other';localStorage.setItem(key,corrupt==='json'?'{':corrupt==='oversized'?'x'.repeat(70000):JSON.stringify(value));},{key:key('number_grid'),corrupt});
  await page.goto('about:blank');await page.goto(base+'?embedded=1#number_grid');await configure(page);await page.waitForSelector('.reset-game:not(:disabled)');assert.equal((await snapshot(page,'number_grid')).state.next,1,corrupt);assert.equal((await counts(page)).completes,0);
 }
 check('corrupt, oversized, incompatible, wrong-identity and invalid-value snapshots');
 page=await fresh();await context.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Quota','QuotaExceededError');};});await open(page,'number_grid');await page.locator('[data-number="1"]').click();await configure(page,{...fixtures.oldHost,language:'hi'});assert.equal(await page.locator('[data-number="1"]').isDisabled(),true);assert.equal(await page.locator('.storage-notice').count(),1);assert.equal((await counts(page)).completes,0);
 await page.evaluate(()=>window.SmartUpGames.back());await page.waitForSelector('.screen-landing');assert.equal(await page.locator('.screen-landing .notice').count(),0);
 await configure(page,{...fixtures.oldHost,language:'en'});assert.equal(await page.locator('.screen-landing .notice').count(),0);
 check('quota failure keeps current progress usable without home screen storage notices');

 // Chromium renderer crash + browser-profile relaunch, not an Android claim.
 await context.close();const profile=await mkdtemp(resolve(output,'profile-'));
 context=await chromium.launchPersistentContext(profile,{headless:true,viewport:{width:390,height:560}});
 await context.addInitScript(()=>{window.nativeEvents=[];window.AndroidGames={postMessage:raw=>window.nativeEvents.push(JSON.parse(raw))};});
 page=await context.newPage();await open(page,'number_grid');await move(page,'number_grid');
 const crashState=await snapshot(page,'number_grid'),cdp=await context.newCDPSession(page);
 await Promise.race([cdp.send('Page.crash').catch(()=>{}),new Promise(resolve=>setTimeout(resolve,1000))]);
 await context.close();context=await chromium.launchPersistentContext(profile,{headless:true,viewport:{width:390,height:560}});
 await context.addInitScript(()=>{window.nativeEvents=[];window.AndroidGames={postMessage:raw=>window.nativeEvents.push(JSON.parse(raw))};});
 page=await context.newPage();await page.goto(base+'?embedded=1');await configure(page);await page.waitForSelector('.reset-game:not(:disabled)');assert.deepEqual((await snapshot(page,'number_grid')).state,crashState.state);assert.deepEqual(await counts(page),{starts:0,completes:0});
 check('abrupt Chromium renderer crash and persistent-profile relaunch');

 page=await fresh();await open(page,'word_scramble');await move(page,'word_scramble');const original=await snapshot(page,'word_scramble');
 for(const language of [undefined,null,{},'','<script>','zz','mr','fr-CA','pt-PT','en-IN','en-GB']){await configure(page,{...fixtures.oldHost,language});assert.deepEqual((await snapshot(page,'word_scramble')).state,original.state);}
 await page.evaluate(config=>{for(const language of ['hi','fr','de','el','ro'])window.SmartUpGames.configure(JSON.stringify({...config,language}));},fixtures.oldHost);assert.equal(await page.locator('h1').textContent(),translator('ro')('word_scramble'));assert.deepEqual(await counts(page),{starts:1,completes:0});
 check('missing/malformed/unsupported/regional locales and rapid configure');

 for(const status of [404,500]){page=await fresh();await page.route('**/games.json',route=>route.fulfill({status,body:'failure'}));await page.goto(base+'?embedded=1');await configure(page);await page.getByRole('button',{name:'Try again',exact:true}).waitFor();await page.unroute('**/games.json');await page.getByRole('button',{name:'Try again',exact:true}).click();await page.waitForSelector('.game-card');}
 page=await fresh();await page.route('**/games/maze.mjs',route=>route.abort());await open(page);await page.getByRole('button',{name:'Maze',exact:true}).click();await page.getByRole('button',{name:'Try again',exact:true}).waitFor();await page.unroute('**/games/maze.mjs');await page.reload();await configure(page);await page.waitForSelector('.reset-game:not(:disabled)');
 check('catalog 404/500 retry and offline module failure/reconnect');

 page=await fresh();let releaseImport;const intercepted=new Promise(resolve=>releaseImport=resolve);let held;
 await page.route('**/games/maze.mjs',async route=>{held=route;releaseImport();});await open(page);await page.getByRole('button',{name:'Maze',exact:true}).click();await intercepted;
 await configure(page,{...fixtures.oldHost,language:'hi'});await page.evaluate(()=>window.SmartUpGames.back());await page.waitForSelector('.game-card');await held.continue();await page.waitForLoadState('networkidle');assert.equal(await page.locator('.maze-board').count(),0);assert.equal((await counts(page)).starts,0);
 check('stale module response cannot overwrite newer route');

 // Old site serves the pinned Git artifact, never a mutable deployment.
 page=await fresh();await page.goto(origin+'/baseline/games/index.html?embedded=1');await configure(page,fixtures.newHost);await page.waitForSelector('.game-card');assert.equal(await page.locator('.game-card').count(),9);await page.evaluate(()=>window.SmartUpGames.back());
 check('new-host fixture / pinned old-site JSON-string contract');

 page=await fresh();await page.addInitScript(()=>{delete window.AndroidGames;});await page.goto(base+'?lang=fr');await page.waitForSelector('.game-card');await page.getByRole('button',{name:translator('fr')('number_grid'),exact:true}).click();await page.locator('[data-number="1"]').click();await page.reload();await page.waitForSelector('.number-grid');assert.equal(await page.locator('[data-number="1"]').isDisabled(),true);
 check('standalone browser preference and unfinished-state reload');

 // UI and screenshot coverage: all locales, all games, both themes, 200% text.
 page=await fresh();await open(page);
 for(const language of languages)for(const mode of ['light','dark']){
  await configure(page,{...fixtures.oldHost,language,theme:{mode}});
  for(const size of [{width:320,height:440},{width:1024,height:900}]){
   await page.setViewportSize(size);await page.evaluate(()=>document.documentElement.style.fontSize='200%');
   for(const game of catalog){await page.evaluate(path=>{location.hash=path;},game.path);await page.waitForSelector('.reset-game:not(:disabled)');assert.ok(await page.locator('h1').textContent());assert.equal(await page.locator('.reset-game').isVisible(),true);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`${language}/${game.id}/${size.width}`);}
  }
  await page.evaluate(()=>document.documentElement.style.fontSize='');await page.setViewportSize({width:390,height:560});await page.evaluate(()=>window.SmartUpGames.back());await page.waitForSelector('.game-card');const path=`${output}/localization-${language}-${mode}.png`;await page.screenshot({path,fullPage:true});evidence.screenshots.push(path);
 }
 check('ten languages × nine games × light/dark × small/large at 200% text');
 assert.deepEqual(errors,[]);await writeFile(`${output}/restoration-evidence.json`,JSON.stringify(evidence,null,2));
} finally {await context?.close();await browser.close();await new Promise(r=>server.close(r));}
