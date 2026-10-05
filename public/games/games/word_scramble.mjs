import {el,button} from '../ui.mjs';
import {scrambleChallenge,isAnswer} from './words.mjs';
import {languageOf} from '../core.mjs';
export function mount(root,{date,language,t,progress,complete,canPlay}) {
  const challenge=scrambleChallenge(date,language);let round=0,chosen=[],disposed=false;
  root.append(el('p',t('scramble_help')));
  if(challenge.language!==languageOf(language))root.append(el('p',t('english_content'),'notice'));
  const panel=el('div',undefined,'game-panel');root.append(panel);
  function render() {
    const puzzle=challenge.rounds[round];panel.replaceChildren();
    panel.append(el('p',t('progress',{done:round,total:challenge.rounds.length}),'progress'),el('p',`${t('hint')}: ${puzzle.clue}`));
    const answer=el('output','','answer');answer.setAttribute('aria-label',t('answer'));answer.setAttribute('aria-live','polite');
    const tiles=el('div',undefined,'tiles'),feedback=el('p','','feedback');feedback.setAttribute('role','status');
    const check=button(t('check'),()=>{
      if(disposed || !canPlay())return;
      if(!isAnswer(chosen.map(i=>puzzle.tiles[i]).join(''),puzzle.word)){feedback.textContent=t('try_again');return;}
      round++;progress({done:round,total:challenge.rounds.length});chosen=[];
      if(round===challenge.rounds.length)complete({solved:round,total:round});else {render();panel.querySelector('button')?.focus();}
    },'primary');
    const clear=button(t('clear'),()=>{if(!canPlay())return;chosen=[];feedback.textContent='';update();tiles.querySelector('button')?.focus();});
    function update() {
      answer.textContent=chosen.map(i=>puzzle.tiles[i]).join('') || '—';
      [...tiles.children].forEach((b,i)=>{b.disabled=chosen.includes(i);});check.disabled=chosen.length!==puzzle.tiles.length;clear.disabled=!chosen.length;
    }
    puzzle.tiles.forEach((letter,i)=>{
      const b=button(letter,()=>{if(disposed || !canPlay())return;chosen.push(i);feedback.textContent='';update();(tiles.querySelector('button:not(:disabled)') || check).focus();});
      b.setAttribute('aria-label',t('letter',{letter}));tiles.append(b);
    });
    const actions=el('div',undefined,'actions');actions.append(clear,check);panel.append(answer,tiles,actions,feedback);update();
  }
  render();return ()=>{disposed=true;};
}
