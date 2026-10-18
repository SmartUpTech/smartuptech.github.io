import {VERSION, localDate, safeId, validateHost, validateCatalog, completionStore} from './core.mjs';
import {translator} from './i18n.mjs';
import {applyTheme} from './theme.mjs';
import {gameInstructions} from './instructions.mjs';
import {languages,localeOf} from './locale.mjs';
import {snapshotStore} from './snapshots.mjs';
import {newPuzzle,validSnapshot} from './games/state.mjs';

const root = document.querySelector('#app');
const params = new URLSearchParams(location.search);
const embedded = params.get('embedded') === '1' || Boolean(window.AndroidGames);
document.documentElement.dataset.embedded=String(embedded);
let storage; try { storage = window.localStorage; } catch { storage = null; }
const persistence = completionStore(storage);
let host = embedded ? null : {bridgeVersion:1, appId:'standalone', language:params.get('lang') || 'en', date:localDate()};
let t = translator(host?.language), catalog = [], rawCatalog, active, cleanup, generation = 0;
let completions = embedded ? {} : persistence.read(), pending = {}, storageFailed = false, staleDay = false;
let snapshots,record,controller,refreshLabels,bootGeneration=0;
function storageFailure(){storageFailed=true;showStorageNotice();}
function showStorageNotice(){if(storageFailed&&root.classList.contains('screen-game')&&!root.querySelector('.storage-notice'))root.append(el('p',t('storage_error'),'notice storage-notice'));}
function openStore(){snapshots=snapshotStore(storage,embedded?'embedded':'standalone',host.appId,host.date,storageFailure,host.bonusRound||0);snapshots.prune();}
function save(){if(record&&controller){Object.assign(record,controller.snapshot());snapshots.write(record.gameId,record);showStorageNotice();}}
function applyLocale(){document.documentElement.lang=localeOf(host?.language).locale;document.title=t('games')+' · SmartUp Tech';}
let standaloneTheme = params.get('theme') === 'dark' ? 'dark' : 'light';
applyTheme({mode:standaloneTheme});

export function el(tag, text, className) {
  const node = document.createElement(tag); if (text !== undefined) node.textContent = text;
  if (className) node.className = className; return node;
}
export function button(text, action, className) {
  const node = el('button',text,className); node.type = 'button'; node.addEventListener('click',action); return node;
}
function emit(type, gameId, result) {
  if (gameId !== undefined && !safeId(gameId)) return;
  const event = {type, bridgeVersion:1, ...(gameId ? {gameId} : {}), date:host?.date, round:host?.bonusRound||0,
    ...(result ? (type === 'onError' ? {errorCode:result.code} : {result}) : {})};
  window.dispatchEvent(new CustomEvent('games:event',{detail:event}));
  if (embedded && window.AndroidGames?.postMessage) {
    try { window.AndroidGames.postMessage(JSON.stringify(event)); } catch { storageFailed = true; }
  }
}
function completed(id) { return completions[id] === host?.date || pending[id] === host?.date; }
function leave() {
  save();controller?.dispose();controller=null;refreshLabels=null;record=null;cleanup?.(); cleanup = null;
  if (active) emit('onGameExited',active.id);
  active = null;
}
function heading(title, subtitle) {
  root.className='screen-message';delete root.dataset.game;
  root.replaceChildren(el('h1',title)); if (subtitle) root.append(el('p',subtitle));
}
function focusHeading() { const h = root.querySelector('h1'); h?.setAttribute('tabindex','-1'); h?.focus({preventScroll:true}); }
function home() { if (location.hash) location.hash = ''; else route(); }
function showError(key = 'load_error', retry = boot) {
  heading(t('games'),t(key)); root.append(button(t('retry'),retry,'primary'));
}
function resultScreen(title,message) {
  root.className='screen-result';delete root.dataset.game;root.replaceChildren();
  const panel=el('section',undefined,'result');
  const mark=el('div','✓','result-mark');mark.setAttribute('aria-hidden','true');
  panel.append(mark,el('h1',title),el('p',message),button(t('back'),home,'primary'));
  root.append(panel);focusHeading();return panel;
}
function checkDay() {
  if (!embedded && host && host.date !== localDate()) {
    staleDay = true; generation++; leave();
    heading(t('games'),t('day_changed'));
    root.append(button(t('refresh'),()=>{host.date=localDate(); snapshots=null;staleDay=false; pending={}; home();},'primary'));
    return false;
  }
  return !staleDay;
}
function showFinished(game,justCompleted=false) {
  const confirmed=completions[game.id]===host.date;
  const allBonusDone=host.bonusRound===1&&catalog.every(g=>completed(g.id));
  resultScreen(confirmed&&!justCompleted?t(game.nameKey):t('well_done'),allBonusDone&&host.bonus?.finished?host.bonus.finished:confirmed&&!justCompleted?t('completed'):t('result'));
  rewardCard();
}
function rewardCard() {
  const offer=host?.bonus;
  if(!embedded||host.bonusRound!==0||!offer?.enabled||!offer.eligible||!catalog.length||!catalog.every(g=>completed(g.id)))return;
  const card=el('section',undefined,'bonus-card');
  card.setAttribute('aria-label',offer.title);
  const text=el('div',undefined,'bonus-copy');text.append(el('h2',offer.title),el('p',offer.message));
  const watch=button(offer.watch,()=>{
    if(watch.disabled)return;watch.disabled=true;card.setAttribute('aria-busy','true');emit('onBonusRequested');
  },'primary');
  watch.disabled=offer.busy;card.setAttribute('aria-busy',String(offer.busy));card.append(text,watch);root.append(card);
}
function complete(game, result) {
  if (!checkDay() || !active || active.id !== game.id || completed(game.id)) return;
  save();record.status='finished';record.result=result;record.completionDispatched=true;
  snapshots.write(game.id,record);pending[game.id]=host.date;
  if(!embedded){completions={...persistence.read(),...completions,[game.id]:host.date};if(!persistence.write(completions))storageFailure();}
  const finishingRecord=record;
  emit('onGameCompleted',game.id,result);
  if(record!==finishingRecord||active?.id!==game.id)return;
  controller?.dispose();controller=null;showFinished(game,true);
}
function settings() {
  if (embedded || params.get('test') !== '1') return;
  const details = el('details',undefined,'test-settings'); details.append(el('summary',t('preview')));
  for (const [key,values,current,onChange] of [
    ['theme',[['light',t('light')],['dark',t('dark')]],standaloneTheme,value=>{standaloneTheme=value;applyTheme({mode:value});}],
    ['language',languages.map(code=>[code,new Intl.DisplayNames([code],{type:'language'}).of(code)]),host.language,value=>{host.language=value;t=translator(value);applyLocale();if(controller){controller.updateLocale(t);refreshLabels?.();}else if(active)showFinished(active);else landing();}]
  ]) {
    const label = el('label',t(key)); const select = el('select');
    for (const [value,title] of values) {const option=el('option',title);option.value=value;select.append(option);}
    select.value=current; select.addEventListener('change',()=>onChange(select.value)); label.append(select);details.append(label);
  }
  details.append(button(t('mock'),()=>{pending=Object.fromEntries(catalog.slice(0,1).map(g=>[g.id,host.date]));route();}),
    button(t('reset'),()=>{pending={};completions={};persistence.write({});route();}));
  root.append(details);
}
function landing() {
  document.documentElement.lang = host.language;
  const doneCount=catalog.filter(g=>completed(g.id)).length;
  root.className='screen-landing';delete root.dataset.game;
  root.replaceChildren(el('h1',t('games'),'sr-only'));
  const summary=t('summary',{done:doneCount,total:catalog.length});
  const status=el('section',undefined,'daily-status'),ring=el('div',undefined,'daily-ring');
  ring.setAttribute('role','progressbar');ring.setAttribute('aria-label',t('daily_progress'));
  ring.setAttribute('aria-valuemin','0');ring.setAttribute('aria-valuemax',String(catalog.length || 1));
  ring.setAttribute('aria-valuenow',String(doneCount));ring.setAttribute('aria-valuetext',summary);
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 64 64');svg.setAttribute('aria-hidden','true');
  for(const className of ['ring-track','ring-fill']) {
    const circle=document.createElementNS(svg.namespaceURI,'circle');
    for(const [key,value]of Object.entries({cx:32,cy:32,r:27,pathLength:100,class:className}))circle.setAttribute(key,String(value));
    if(className==='ring-fill')circle.setAttribute('stroke-dasharray',`${catalog.length?doneCount/catalog.length*100:0} 100`);
    svg.append(circle);
  }
  const count=el('span',`${doneCount}/${catalog.length}`,'ring-count');count.setAttribute('aria-hidden','true');ring.append(svg,count);
  const text=el('div',undefined,'daily-status-text');text.append(el('p',t('daily_progress'),'daily-status-title'),el('p',summary,'daily-summary'));
  status.append(ring,text);root.append(status);
  const grid = el('div',undefined,'catalog');
  for (const game of catalog) {
    const done = completed(game.id);
    const card = button('',()=>{location.hash=game.path;},'game-card');
    card.style.setProperty('--cardAccent',game.tone?`var(--${game.tone}Accent)`:'var(--accent)');
    card.style.setProperty('--cardSurface',game.tone?`var(--${game.tone}Surface)`:'var(--surface)');
    card.setAttribute('aria-label',`${t(game.nameKey)}${done ? ': '+t('completed') : ''}`);
    const wrap = el('span',undefined,'icon-wrap'), icon=el('span',undefined,'game-icon');
    icon.style.setProperty('--icon',`url("${new URL(game.icon,import.meta.url).href}")`); icon.setAttribute('aria-hidden','true');
    const probe=new Image(); probe.onerror=()=>{icon.className='';icon.textContent='◇';};probe.src=new URL(game.icon,import.meta.url).href;
    wrap.append(icon);if(done){const badge=el('span','✓','badge');badge.setAttribute('aria-hidden','true');wrap.append(badge);}
    card.append(wrap,el('span',t(game.nameKey),'game-name'));
    grid.append(card);
  }
  root.append(grid);
  if(!catalog.length) root.append(el('p',t('empty')));
  if(catalog.length>0 && doneCount===catalog.length&&!(host.bonusRound===0&&host.bonus?.enabled&&host.bonus.eligible))
    root.append(el('p',host.bonusRound===1&&host.bonus?.finished?host.bonus.finished:t('play_again_tomorrow'),'footer'));
  rewardCard();
  settings();
}
async function route({restore=false}={}) {
  const ticket=++generation;leave();
  if(!host){heading(t('games'),t('waiting'));return;}
  if(!checkDay())return;
  applyLocale();catalog=validateCatalog(rawCatalog||[],host);
  if(embedded)emit('onCatalogReady',undefined,{gameIds:catalog.map(g=>g.id)});
  if(!snapshots)openStore();
  let path=location.hash.slice(1);
  if(restore&&!path){path=snapshots.route()||'';if(path&&catalog.some(g=>g.path===path))history.replaceState(null,'','#'+path);}
  const game=catalog.find(g=>g.path===path);
  snapshots.saveRoute(game?.path||'');
  if(!game){landing();return;}
  const saved=snapshots.read(game.id);
  record=validSnapshot(saved,game.id,host.date,host.bonusRound||0)?saved:null;
  if(saved&&!record)storageFailure();
  if(completions[game.id]===host.date){active=game;record=null;showFinished(game);return;}
  if(record?.status==='finished'){active=game;pending[game.id]=host.date;showFinished(game);return;}
  root.className='screen-game';root.dataset.game=game.id;root.replaceChildren();
  const toolbar=el('header',undefined,'game-toolbar'),back=button('←',home,'back');
  const reset=button('',()=>{},'reset-game');reset.disabled=true;
  const title=el('h1'),resetIcon=el('span','↻','reset-icon'),resetLabel=el('span');resetIcon.setAttribute('aria-hidden','true');reset.append(resetIcon,resetLabel);
  toolbar.append(back,title,reset);
  const content=el('section',undefined,'game-content'),help=el('details',undefined,'how-to-play');
  const summary=el('summary'),instructions=el('div',undefined,'how-to-body'),policy=el('p',undefined,'notice');
  help.append(summary,instructions);root.append(toolbar,policy,content,help);
  refreshLabels=()=>{
    title.textContent=t(game.nameKey);back.setAttribute('aria-label','← '+t('back'));resetLabel.textContent=t('reset_game');summary.textContent=t('how_to_play');
    instructions.replaceChildren();const guide=gameInstructions(game.id,host.language);
    if(guide){const steps=el('ol');for(const step of guide[0])steps.append(el('li',step));instructions.append(steps,el('p',guide[1],'game-caveat'));}
    instructions.append(el('p',t('daily_caveat'),'daily-caveat'));
    policy.hidden=!game.id.startsWith('word_')||record?.contentLanguage===localeOf(host.language).language;
    policy.textContent=t('pinned_content');
    if(content.firstElementChild?.tagName==='P')content.firstElementChild.remove();
    const notice=root.querySelector('.storage-notice');if(notice)notice.textContent=t('storage_error');
  };
  refreshLabels();
  try {
    const module=await import(`./games/${game.path}.mjs`);
    if(ticket!==generation)return;
    active=game;
    record ||= {...newPuzzle(game.id,host.date,host.language,host.bonusRound||0),started:false,status:'playing',completionDispatched:false,result:null};
    const isCurrent=()=>ticket===generation&&active?.id===game.id&&checkDay();
    controller=module.mount(content,{date:host.date,language:record.contentLanguage,t,puzzle:record.puzzle,snapshot:record.state?record:null,
      changed:value=>{if(isCurrent()&&controller){Object.assign(record,value);snapshots.write(game.id,record);showStorageNotice();}},
      progress:result=>{if(isCurrent())window.dispatchEvent(new CustomEvent('games:progress',{detail:{gameId:game.id,date:host.date,...result}}));},
      complete:result=>{if(isCurrent())complete(game,result);},canPlay:()=>isCurrent()&&!completed(game.id)});
    help.open=Boolean(record.helpOpen);help.addEventListener('toggle',()=>{if(isCurrent()&&record){record.helpOpen=help.open;save();}});
    const started=record.started;record.started=true;save();if(!started)emit('onGameStarted',game.id);
    refreshLabels();reset.disabled=false;
    reset.addEventListener('click',()=>{if(!isCurrent()||completed(game.id))return;controller.reset();help.open=false;refreshLabels();window.dispatchEvent(new CustomEvent('games:progress',{detail:{gameId:game.id,date:host.date,reset:true,done:0}}));reset.focus({preventScroll:true});});
    focusHeading();
  } catch {
    if(ticket!==generation)return;
    leave();emit('onError',game.id,{code:'GAME_LOAD_FAILED'});showError('load_error',()=>route());
  }
}
async function boot() {
  const ticket=++bootGeneration;
  try {
    const response=await fetch(new URL('./games.json',import.meta.url),{cache:'no-cache'});
    if(!response.ok)throw new Error('CATALOG_LOAD_FAILED');
    const raw=await response.json();if(ticket!==bootGeneration)return;
    validateCatalog(raw,host||{});rawCatalog=raw;await route({restore:true});
  } catch {if(ticket!==bootGeneration)return;emit('onError',undefined,{code:'CATALOG_LOAD_FAILED'});showError();}
}
window.SmartUpGames=Object.freeze({
  version:VERSION,
  configure(input) {
    if(!embedded)return false;
    try {
      const next=validateHost(typeof input==='string' ? JSON.parse(input) : input);
      const same=host&&next.date===host.date&&next.appId===host.appId&&(next.bonusRound||0)===(host.bonusRound||0);
      const newRound=host&&next.date===host.date&&next.appId===host.appId&&(next.bonusRound||0)!==(host.bonusRound||0);
      if(!same){generation++;leave();pending={};snapshots=null;}
      const confirmed=same?{...next.completions,...Object.fromEntries(Object.entries(completions).filter(([,date])=>date===next.date))}:next.completions;
      host=next;completions=confirmed;t=translator(next.language);staleDay=false;applyLocale();
      applyTheme(next.theme,true);
      if(newRound)history.replaceState(null,'',location.pathname+location.search);
      if(same&&active){
        if(completions[active.id]===host.date){save();controller?.dispose();controller=null;showFinished(active);}
        else if(controller){controller.updateLocale(t);refreshLabels?.();}
        else showFinished(active);
      } else if(rawCatalog){if(same&&root.classList.contains('screen-game')){refreshLabels?.();}else route({restore:!same});}
      return true;
    } catch {generation++;leave();host=null;heading(t('games'),t('host_error'));emit('onError',undefined,{code:'INVALID_HOST'});return false;}
  },
  back(){home();}
});
window.addEventListener('hashchange',()=>route());
window.addEventListener('pagehide',save);
window.addEventListener('pageshow',event=>{if(event.persisted){checkDay();}});
window.addEventListener('storage',()=>{if(!embedded){completions=persistence.read();if(!active || completed(active.id))route();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)save();else checkDay();});
if(!embedded)setInterval(checkDay,30000);
emit('onReady');boot();

