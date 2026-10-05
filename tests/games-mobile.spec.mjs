import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {scrambleChallenge,graphemes} from '../public/games/games/words.mjs';
import {sudokuChallenge,sequenceChallenge,mazeChallenge,mazeMove} from '../public/games/games/puzzles.mjs';
import {shapeChallenge,pipeChallenge,rotatePipe,codeChallenge} from '../public/games/games/new-puzzles.mjs';
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
    assert.equal(await page.locator('.game-card').count(),9);
    assert.equal(await page.locator('.footer').count(),0);
    assert.equal(await page.getByRole('progressbar').getAttribute('aria-valuenow'),'0');
    assert.equal(await page.locator('.catalog').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),3);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    if(width===390)await page.screenshot({path:`test-results/games/landing-${theme}.png`,fullPage:true});
  }
  await page.goto(base);await page.waitForSelector('.game-card');
  await page.evaluate(()=>{window.events=[];window.addEventListener('games:event',e=>window.events.push(e.detail));});
  await page.getByRole('button',{name:'Word Match',exact:true}).click();await page.waitForSelector('[data-pair]');
  assert.equal(await page.locator('h1').evaluate(h=>getComputedStyle(h).outlineStyle),'none');
  await page.getByRole('button',{name:'← Back to games',exact:true}).focus();
  await page.keyboard.press('Tab');
  assert.notEqual(await page.locator('button:focus').evaluate(b=>getComputedStyle(b).outlineStyle),'none');
  // Wrong pairs cannot complete the game.
  await page.locator('[data-side="left"][data-pair="0"]').click();await page.locator('[data-side="right"][data-pair="1"]').click();
  assert.equal(await page.locator('.matched').count(),0);
  for(let i=0;i<4;i++){await page.locator(`[data-side="left"][data-pair="${i}"]`).click();await page.locator(`[data-side="right"][data-pair="${i}"]`).click();}
  await page.getByRole('heading',{name:'Well done!'}).waitFor();
  assert.equal(await page.evaluate(()=>window.events.filter(e=>e.type==='onGameCompleted').length),1);
  await page.screenshot({path:'test-results/games/result.png'});
  await page.getByRole('button',{name:'Back to games'}).click();await page.waitForSelector('.badge');await page.reload();await page.waitForSelector('.badge');
  assert.equal(await page.locator('.game-card .status').count(),0);
  assert.equal(await page.locator('.footer').count(),0);
  assert.equal(await page.getByRole('progressbar').getAttribute('aria-valuenow'),'1');
  await page.getByRole('button',{name:'Word Match: Completed today'}).click();assert.equal(await page.locator('[data-pair]').count(),0);
  await page.getByRole('button',{name:'Back to games'}).click();
  await page.getByRole('button',{name:'Word Scramble',exact:true}).click();await page.waitForSelector('.tiles');
  const date=await page.evaluate(()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;});
  for(const round of scrambleChallenge(date,'en').rounds){for(const letter of graphemes(round.word,'en'))await page.locator('.tiles button:not(:disabled)').filter({hasText:new RegExp(`^${letter}$`)}).first().click();await page.getByRole('button',{name:'Check word',exact:true}).click();}
  await page.getByRole('heading',{name:'Well done!'}).waitFor();await page.getByRole('button',{name:'Back to games'}).click();await page.waitForSelector('.badge');assert.equal(await page.locator('.badge').count(),2);
  // Complete each new game through real controls. Completion must survive reload.
  await page.evaluate(()=>{window.events=[];window.addEventListener('games:event',e=>window.events.push(e.detail));});
  await page.getByRole('button',{name:'Mini Sudoku',exact:true}).click();await page.waitForSelector('.sudoku-board');
  const sudoku=sudokuChallenge(date);
  const editable=sudoku.puzzle.findIndex(v=>!v);
  await page.locator(`[data-cell="${editable}"]`).click();
  const conflict=sudoku.puzzle.find((v,i)=>v&&Math.floor(i/4)===Math.floor(editable/4));
  if(conflict){await page.locator('.digit-key').filter({hasText:String(conflict)}).click();assert.equal(await page.locator(`[data-cell="${editable}"]`).textContent(),'·');}
  for(let i=0;i<16;i++)if(!sudoku.puzzle[i]){await page.locator(`[data-cell="${i}"]`).click();await page.locator('.digit-key').filter({hasText:String(sudoku.solution[i])}).click();}
  await page.getByRole('heading',{name:'Well done!'}).waitFor();await page.getByRole('button',{name:'Back to games'}).click();await page.waitForSelector('.catalog');
  await page.getByRole('button',{name:'Sequence',exact:true}).click();await page.waitForSelector('.sequence-options');
  for(const round of sequenceChallenge(date)){
    const wrong=round.options.find(v=>v!==round.answer);
    await page.locator('.sequence-options button').filter({hasText:new RegExp(`^${wrong}$`)}).click();
    assert.equal(await page.locator('.sequence-options button:disabled').count(),1);
    await page.locator('.sequence-options button').filter({hasText:new RegExp(`^${round.answer}$`)}).click();
  }
  await page.getByRole('heading',{name:'Well done!'}).waitFor();await page.getByRole('button',{name:'Back to games'}).click();await page.waitForSelector('.catalog');
  await page.getByRole('button',{name:'Maze',exact:true}).click();await page.waitForSelector('.maze-board');
  const maze=mazeChallenge(date),queue=[0],previous=new Map([[0,null]]);
  for(const at of queue)for(let d=0;d<4;d++){const n=mazeMove(maze,at,d);if(!previous.has(n)){previous.set(n,{at,d});queue.push(n);}}
  let at=maze.goal;const path=[];while(at!==0){const step=previous.get(at);path.unshift(step.d);at=step.at;}
  await page.locator('.maze-board').focus();await page.keyboard.press('ArrowUp');
  assert.match(await page.locator('.progress').textContent(),/wall/);
  for(const d of path)await page.getByRole('button',{name:['Move up','Move right','Move down','Move left'][d],exact:true}).click();
  await page.getByRole('heading',{name:'Well done!'}).waitFor();await page.getByRole('button',{name:'Back to games'}).click();await page.waitForSelector('.catalog');
  await page.getByRole('button',{name:'Number Grid',exact:true}).click();await page.waitForSelector('.number-grid');
  await page.locator('[data-number="2"]').click();assert.equal(await page.locator('.found').count(),0);
  await page.emulateMedia({reducedMotion:'reduce'});
  for(let n=1;n<=16;n++)await page.locator(`[data-number="${n}"]`).click();
  await page.getByRole('heading',{name:'Well done!'}).waitFor();
  assert.equal(await page.locator('.result-mark').evaluate(el=>getComputedStyle(el).animationName),'none');
  await page.getByRole('button',{name:'Back to games'}).click();await page.waitForSelector('.catalog');
  await page.getByRole('button',{name:'Shape Fit',exact:true}).click();await page.waitForSelector('.shape-board');
  const shapes=shapeChallenge(date);
  for(let i=0;i<shapes.length;i++){
    if(i===0){
      const source=await page.locator(`[data-piece="${i}"]`).boundingBox(),target=await page.locator(`.shape-cell[data-cell="${shapes[i].anchor}"]`).boundingBox();
      await page.mouse.move(source.x+source.width/2,source.y+source.height/2);await page.mouse.down();await page.mouse.move(target.x+target.width/2,target.y+target.height/2,{steps:8});await page.mouse.up();
      assert.equal(await page.locator('.shape-cell.filled').count(),shapes[i].cells.length);
    }else{await page.locator(`[data-piece="${i}"]`).click();await page.locator(`.shape-cell[data-cell="${shapes[i].anchor}"]`).click();}
  }
  await page.getByRole('heading',{name:'Well done!'}).waitFor();await page.getByRole('button',{name:'Back to games'}).click();await page.waitForSelector('.catalog');
  await page.getByRole('button',{name:'Pipe Connect',exact:true}).click();await page.waitForSelector('.pipe-board');
  const pipes=pipeChallenge(date);
  // Solve endpoint last so incidental earlier connections cannot end the test mid-loop.
  for(const i of [...Array.from({length:15},(_,i)=>i+1),0]){
    let mask=pipes.puzzle[i];while(mask!==pipes.solution[i]){
      if(await page.locator('.pipe-board').count()===0)break;
      await page.locator(`.pipe-cell[data-cell="${i}"]`).click();mask=rotatePipe(mask);
    }
  }
  await page.getByRole('heading',{name:'Well done!'}).waitFor();await page.getByRole('button',{name:'Back to games'}).click();await page.waitForSelector('.catalog');
  await page.getByRole('button',{name:'Code Breaker',exact:true}).click();await page.waitForSelector('.code-pad');
  const secret=codeChallenge(date),wrong=[...secret.slice(1),secret[0]];
  for(let attempt=0;attempt<4;attempt++){for(const n of wrong)await page.locator('.code-pad button').filter({hasText:String(n)}).click();await page.getByRole('button',{name:'Check code',exact:true}).click();}
  assert.equal(await page.locator('.code-history li').count(),3);assert.match(await page.locator('.feedback').textContent(),/0 exact · 4 elsewhere/);
  for(const n of secret)await page.locator('.code-pad button').filter({hasText:String(n)}).click();
  await page.getByRole('button',{name:'Check code',exact:true}).click();await page.getByRole('heading',{name:'Well done!'}).waitFor();
  const events=await page.evaluate(()=>window.events.filter(e=>e.type==='onGameCompleted').map(e=>e.gameId));
  assert.deepEqual(events,['mini_sudoku','sequence','maze','number_grid','shape_fit','pipe_connect','code_breaker']);
  await page.getByRole('button',{name:'Back to games'}).click();await page.waitForSelector('.catalog');await page.reload();await page.waitForSelector('.catalog');assert.equal(await page.locator('.badge').count(),9);
  assert.equal(await page.locator('.footer').textContent(),'Come back tomorrow to play again');
  assert.equal(await page.getByRole('progressbar').getAttribute('aria-valuenow'),'9');
  await page.getByRole('button',{name:'Number Grid: Completed today',exact:true}).click();assert.equal(await page.locator('.number-grid').count(),0);
  // Localized content, narrow-screen gameplay and reduced motion.
  await context.clearCookies();await page.evaluate(()=>localStorage.clear());
  for(const lang of ['hi','mr','gu']) {
    await page.goto(base+`?lang=${lang}`);await page.waitForSelector('.game-card');await page.locator('.game-card').first().click();await page.waitForSelector('.pairs');
    await page.setViewportSize({width:320,height:740});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.screenshot({path:`test-results/games/match-${lang}.png`,fullPage:true});
  }
  // Check every game surface, long translations and both themes on small phones.
  for(const width of [320,412])for(const theme of ['light','dark'])for(const lang of ['en','hi','mr'])for(const [id,selector]of [['mini_sudoku','.sudoku-board'],['sequence','.sequence-options'],['maze','.maze-board'],['number_grid','.number-grid'],['shape_fit','.shape-board'],['pipe_connect','.pipe-board'],['code_breaker','.code-pad']]){
    await page.setViewportSize({width,height:844});await page.goto(base+`?lang=${lang}&theme=${theme}#${id}`);await page.waitForSelector(selector);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    assert.equal(await page.locator('h1').evaluate(h=>getComputedStyle(h).outlineStyle),'none');
    if(width===320&&lang==='en')await page.screenshot({path:`test-results/games/${id}-${theme}.png`,fullPage:true});
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  // Embedded mode waits for native state, hides test controls and uses host date.
  await page.goto(base+'?embedded=1&test=1');
  await page.waitForFunction(()=>Boolean(window.SmartUpGames));
  const config={bridgeVersion:1,appId:'net.test.host',language:'en',date:'2026-12-31',timezone:'Asia/Kolkata',theme:{mode:'dark',accent:'#f4c577'},completions:{word_match:'2026-12-31'}};
  assert.equal(await page.evaluate(c=>window.SmartUpGames.configure(c),config),true);await page.waitForSelector('.game-card');
  assert.equal(await page.locator('.badge').count(),1);assert.equal(await page.locator('.test-settings').count(),0);
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--accent')),'#f4c577');
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--wordsAccent')),'#f4c577');
  await page.evaluate(c=>window.SmartUpGames.configure({...c,date:'2027-01-01'}),config);await page.waitForSelector('.game-card');assert.equal(await page.locator('.badge').count(),0);
  assert.equal(await page.evaluate(c=>window.SmartUpGames.configure({...c,date:'broken'}),config),false);
  // Failed catalog fetch has a working retry path.
  await page.route('**/games.json',route=>route.abort());await page.goto(base);await page.getByRole('button',{name:'Try again'}).waitFor();
  await page.unroute('**/games.json');await page.getByRole('button',{name:'Try again'}).click();await page.waitForSelector('.game-card');
  // These are the remaining WebView sizes AFTER native bars take their space.
  // Assert real content bounds, not just hidden page overflow.
  const screens=[['','.catalog'],['word_match','.pairs'],['word_scramble','.tiles'],['mini_sudoku','.sudoku-board'],['sequence','.sequence-options'],['maze','.maze-board'],['number_grid','.number-grid'],['shape_fit','.shape-board'],['pipe_connect','.pipe-board'],['code_breaker','.code-pad']];
  for(const [width,height]of [[320,440],[360,480],[390,560],[412,620]])for(const language of ['en','hi','mr','gu'])for(const [id,selector]of screens){
    await page.setViewportSize({width,height});await page.goto(base+`?embedded=1${id?'#'+id:''}`);
    await page.waitForFunction(()=>Boolean(window.SmartUpGames));
    await page.evaluate(c=>window.SmartUpGames.configure(c),{...config,language,date:'2026-10-05',completions:{}});
    await page.waitForSelector(selector);
    const bounds=await page.evaluate(()=>({
      width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,
      clipped:[...document.querySelectorAll('main button')].filter(b=>{const r=b.getBoundingClientRect();return r.width>0&&r.height>0&&(r.top<0||r.bottom>innerHeight+1||r.left<0||r.right>innerWidth+1||r.height<43);}).map(b=>b.textContent)
    }));
    assert.ok(bounds.height<=height+1,`${id||'landing'} ${language} ${width}×${height}: page height ${bounds.height}`);
    assert.ok(bounds.width<=width,`${id} horizontal overflow`);assert.deepEqual(bounds.clipped,[],`${id} ${language}: controls must stay visible and at least 44px tall`);
    if(!id)assert.equal(await page.locator('.landing-header,.eyebrow').count(),0);
    else {
      assert.equal(await page.locator('.reset-game').count(),1);
      await page.locator('.how-to-play summary').click();await page.locator('.how-to-play[open]').waitFor();
      assert.equal(await page.locator('.how-to-body li').count(),3);
      assert.ok((await page.locator('.game-caveat').textContent()).length>10);
      assert.ok((await page.locator('.daily-caveat').textContent()).length>10);
      await page.locator('.how-to-play summary').click();assert.equal(await page.locator('.how-to-play[open]').count(),0);
    }
    if(width===320&&language==='en')await page.screenshot({path:`test-results/games/compact-${id||'landing'}.png`,fullPage:true});
  }
  // Resizing an active WebView does not regenerate the puzzle or discard input.
  // All nine real games fit with zero, partial and full completion.
  const catalog=JSON.parse(await readFile(resolve(publicDir,'games/games.json'),'utf8'));
  const nine=catalog;
  await page.route('**/games.json',route=>route.fulfill({json:nine}));
  await page.setViewportSize({width:320,height:440});
  for(const language of ['en','hi','mr'])for(const count of [0,5,9]){
    await page.goto(base+'?embedded=1');await page.waitForFunction(()=>Boolean(window.SmartUpGames));
    await page.evaluate(c=>window.SmartUpGames.configure(c),{...config,language,date:'2026-10-05',completions:Object.fromEntries(nine.slice(0,count).map(g=>[g.id,'2026-10-05']))});
    await page.waitForSelector('.catalog');assert.equal(await page.locator('.game-card').count(),9);
    assert.equal(await page.getByRole('progressbar').getAttribute('aria-valuenow'),String(count));
    assert.equal(await page.getByRole('progressbar').getAttribute('aria-valuemax'),'9');
    assert.equal(await page.locator('.footer').count(),count===9?1:0);
    assert.equal(await page.locator('.game-card .status').count(),0);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1),`nine games ${language} ${count} must fit`);
  }
  await page.unroute('**/games.json');
  await page.goto(base+'#word_scramble');await page.waitForSelector('.tiles');
  await page.locator('.tiles button').first().click();const partial=await page.locator('.answer').textContent();
  await page.setViewportSize({width:320,height:440});assert.equal(await page.locator('.answer').textContent(),partial);
  // Reset remounts the same puzzle without new session events or removing badges.
  for(const [id,selector]of screens.filter(([id])=>id)){
    await page.goto(base+`?embedded=1#${id}`);await page.waitForFunction(()=>Boolean(window.SmartUpGames));
    await page.evaluate(c=>{window.events=[];window.addEventListener('games:event',e=>window.events.push(e.detail));window.SmartUpGames.configure(c);},{...config,date:'2026-10-05',completions:{}});
    await page.waitForSelector(selector);
    const initial=await page.locator('.game-content').innerHTML();
    if(id==='maze')await page.locator('.move-up').click();
    else await page.locator('.game-content button:not(:disabled)').first().click();
    await page.locator('.reset-game').click();
    assert.equal(await page.locator('.game-content').innerHTML(),initial,`${id} resets original daily board`);
    assert.equal(await page.evaluate(()=>window.events.filter(e=>e.type==='onGameStarted').length),1);
    assert.equal(await page.evaluate(()=>window.events.filter(e=>e.type==='onGameCompleted').length),0);
  }
  await page.goto(base+'?embedded=1#pipe_connect');await page.waitForFunction(()=>Boolean(window.SmartUpGames));
  await page.evaluate(c=>window.SmartUpGames.configure(c),{...config,date:'2026-10-05',completions:{word_match:'2026-10-05'}});await page.waitForSelector('.pipe-board');
  await page.locator('.reset-game').click();await page.locator('.back').click();await page.waitForSelector('.catalog');assert.equal(await page.locator('.badge').count(),1);
  assert.deepEqual(errors,[]);console.log('PASS: nine games, mobile gameplay, compact WebViews without page scrolling or clipped controls, collapsible instructions, consistent reset, resize state, themes, locales, focus, persistence and bridge configuration; no page errors.');
} finally {await browser.close();await new Promise(r=>server.close(r));}
