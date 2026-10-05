import {VERSION, localDate, safeId, validateHost, validateCatalog, completionStore} from './core.mjs';
import {translator} from './i18n.mjs';
import {applyTheme} from './theme.mjs';
import {gameInstructions} from './instructions.mjs';

const root = document.querySelector('#app');
const params = new URLSearchParams(location.search);
const embedded = params.get('embedded') === '1' || Boolean(window.AndroidGames);
document.documentElement.dataset.embedded=String(embedded);
let storage; try { storage = window.localStorage; } catch { storage = null; }
const persistence = completionStore(storage);
let host = embedded ? null : {bridgeVersion:1, appId:'standalone', language:params.get('lang') || 'en', date:localDate()};
let t = translator(host?.language), catalog = [], rawCatalog, active, cleanup, generation = 0;
let completions = embedded ? {} : persistence.read(), pending = {}, storageFailed = false, staleDay = false;
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
  const event = {type, bridgeVersion:1, ...(gameId ? {gameId} : {}), date:host?.date,
    ...(result ? (type === 'onError' ? {errorCode:result.code} : {result}) : {})};
  window.dispatchEvent(new CustomEvent('games:event',{detail:event}));
  if (embedded && window.AndroidGames?.postMessage) {
    try { window.AndroidGames.postMessage(JSON.stringify(event)); } catch { storageFailed = true; }
  }
}
function completed(id) { return completions[id] === host?.date || pending[id] === host?.date; }
function leave() {
  cleanup?.(); cleanup = null;
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
function checkDay() {
  if (!embedded && host && host.date !== localDate()) {
    staleDay = true; generation++; leave();
    heading(t('games'),t('day_changed'));
    root.append(button(t('refresh'),()=>{host.date=localDate(); staleDay=false; pending={}; home();},'primary'));
    return false;
  }
  return !staleDay;
}
function complete(game, result) {
  if (!checkDay() || !active || active.id !== game.id || completed(game.id)) return;
  pending[game.id] = host.date;
  if (!embedded) {
    // Merge latest records to preserve completions made by another open tab.
    completions = {...persistence.read(),...completions,[game.id]:host.date};
    storageFailed = !persistence.write(completions);
  }
  emit('onGameCompleted',game.id,result);
  cleanup?.(); cleanup=null;
  root.className='screen-result';delete root.dataset.game;
  root.replaceChildren();
  const panel = el('section',undefined,'result');
  const mark = el('div','✓','result-mark'); mark.setAttribute('aria-hidden','true');
  panel.append(mark,el('h1',t('well_done')),el('p',t('result')),button(t('back'),home,'primary'));
  if (storageFailed) panel.append(el('p',t('storage_error'),'notice'));
  root.append(panel); focusHeading();
}
function settings() {
  if (embedded || params.get('test') !== '1') return;
  const details = el('details',undefined,'test-settings'); details.append(el('summary',t('preview')));
  for (const [key,values,current,onChange] of [
    ['theme',[['light',t('light')],['dark',t('dark')]],standaloneTheme,value=>{standaloneTheme=value;applyTheme({mode:value});}],
    ['language',[['en','English'],['hi','हिन्दी'],['mr','मराठी']],host.language,value=>{host.language=value;t=translator(value);route();}]
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
  if(catalog.length>0 && doneCount===catalog.length)root.append(el('p',t('play_again_tomorrow'),'footer'));
  if(storageFailed)root.append(el('p',t('storage_error'),'notice'));
  settings();
}
async function route() {
  const ticket=++generation; leave();
  if(!host) {heading(t('games'),t('waiting'));return;}
  if(!checkDay())return;
  document.documentElement.lang=host.language.replace('_','-');
  catalog=validateCatalog(rawCatalog || [],host);
  const path=location.hash.slice(1);
  const game=catalog.find(g=>g.path===path);
  if(!game){landing();return;}
  if(completed(game.id)) {heading(t(game.nameKey),t('completed'));root.append(button(t('back'),home,'primary'));return;}
  root.className='screen-game';root.dataset.game=game.id;root.replaceChildren();
  const toolbar=el('header',undefined,'game-toolbar');
  const back=button('←',home,'back');back.setAttribute('aria-label','← '+t('back'));
  const reset=button(t('reset_game'),()=>{},'reset-game');reset.disabled=true;
  toolbar.append(back,el('h1',t(game.nameKey)),reset);
  const content=el('section',undefined,'game-content'),help=el('details',undefined,'how-to-play');
  const summary=el('summary',t('how_to_play')),instructions=el('div',undefined,'how-to-body');
  const guide=gameInstructions(game.id,host.language);
  if(guide){const steps=el('ol');for(const step of guide[0])steps.append(el('li',step));instructions.append(steps,el('p',guide[1],'game-caveat'));}
  instructions.append(el('p',t('daily_caveat'),'daily-caveat'));
  help.append(summary,instructions);root.append(toolbar,help,content);
  try {
    // The validated catalog route is a local module within the games directory.
    const module=await import(`./games/${game.path}.mjs`);
    if(ticket!==generation)return;
    active=game;
    emit('onGameStarted',game.id);
    function mountPuzzle(){
      cleanup?.();cleanup=null;content.replaceChildren();
      cleanup=module.mount(content,{date:host.date,language:host.language,t,
        progress:result=>{if(checkDay())window.dispatchEvent(new CustomEvent('games:progress',{detail:{gameId:game.id,date:host.date,...result}}));},
        complete:result=>complete(game,result),canPlay:checkDay});
      // Modules keep a plain instruction fallback; the shared panel replaces it.
      if(content.firstElementChild?.tagName==='P')content.firstElementChild.remove();
    }
    mountPuzzle();reset.disabled=false;
    reset.addEventListener('click',()=>{
      if(ticket!==generation||!checkDay()||completed(game.id))return;
      mountPuzzle();help.open=false;
      window.dispatchEvent(new CustomEvent('games:progress',{detail:{gameId:game.id,date:host.date,reset:true,done:0}}));
      reset.focus({preventScroll:true});
    });
    focusHeading();
  } catch(error) {
    if(ticket!==generation)return;
    leave();emit('onError',game.id,{code:'GAME_LOAD_FAILED'});showError('load_error',route);
  }
}
async function boot() {
  try {
    const response=await fetch(new URL('./games.json',import.meta.url),{cache:'no-cache'});
    if(!response.ok)throw new Error('CATALOG_LOAD_FAILED');
    const raw=await response.json();validateCatalog(raw,host || {});rawCatalog=raw;await route();
  } catch {emit('onError',undefined,{code:'CATALOG_LOAD_FAILED'});showError();}
}
window.SmartUpGames=Object.freeze({
  version:VERSION,
  configure(input) {
    if(!embedded)return false;
    try {
      const next=validateHost(typeof input==='string' ? JSON.parse(input) : input);
      // Exit the old session while its authoritative date still applies.
      generation++;leave();
      if(next.date!==host?.date || next.appId!==host?.appId)pending={};
      host=next;completions=next.completions;t=translator(next.language);staleDay=false;
      applyTheme(next.theme,true);if(rawCatalog)route();return true;
    } catch {generation++;leave();host=null;heading(t('games'),t('host_error'));emit('onError',undefined,{code:'INVALID_HOST'});return false;}
  },
  back(){home();}
});
window.addEventListener('hashchange',route);
window.addEventListener('pagehide',leave);
window.addEventListener('pageshow',event=>{if(event.persisted)route();});
window.addEventListener('storage',()=>{if(!embedded){completions=persistence.read();if(!active || completed(active.id))route();}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkDay();});
if(!embedded)setInterval(checkDay,30000);
emit('onReady');boot();
