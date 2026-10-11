import {el,button,setFeedback} from '../ui.mjs';
import {isAnswer} from './words.mjs';
import {session} from './session.mjs';
export function mount(root,options) {
  const challenge=options.puzzle;let round=options.snapshot?.state.round||0,chosen=options.snapshot?.state.chosen||[];
  return session(root,options,()=>({round,chosen}),()=>{
    const {t,progress,complete,canPlay}=options;let disposed=false;
  root.append(el('p',t('scramble_help')));
  const panel=el('div',undefined,'game-panel');root.append(panel);
  function render() {
    const puzzle=challenge.rounds[round];panel.replaceChildren();
    const hint=el('p',undefined,'game-hint'),clue=el('span',puzzle.clue);clue.lang=challenge.language;
    hint.append(el('span',t('hint')+': '),clue);
    panel.append(el('p',t('progress',{done:round,total:challenge.rounds.length}),'progress'),hint);
    const answer=el('output','','answer');answer.lang=challenge.language;answer.setAttribute('aria-label',t('answer'));answer.setAttribute('aria-live','polite');
    const tiles=el('div',undefined,'tiles'),feedback=el('p','','feedback');feedback.setAttribute('role','status');
    const check=button(t('check'),()=>{
      if(disposed || !canPlay())return;
      if(!isAnswer(chosen.map(i=>puzzle.tiles[i]).join(''),puzzle.answers,challenge.language)){setFeedback(feedback,t('try_again'),'error');return;}
      round++;progress({done:round,total:challenge.rounds.length});chosen=[];
      if(round===challenge.rounds.length)complete({solved:round,total:round});else {render();panel.querySelector('button')?.focus();}
    },'primary');
    const clear=button(t('clear_answer'),()=>{if(disposed||!canPlay())return;chosen=[];setFeedback(feedback,'');update();tiles.querySelector('button')?.focus();});
    function update() {
      answer.textContent=chosen.map(i=>puzzle.tiles[i]).join('') || '—';
      [...tiles.children].forEach((b,i)=>{b.disabled=chosen.includes(i);});check.disabled=chosen.length!==puzzle.tiles.length;clear.disabled=!chosen.length;
    }
    puzzle.tiles.forEach((letter,i)=>{
      const b=button(letter,()=>{if(disposed || !canPlay())return;chosen.push(i);setFeedback(feedback,'');update();(tiles.querySelector('button:not(:disabled)') || check).focus();});
      b.setAttribute('aria-label',t('letter',{letter}));tiles.append(b);
    });
    const actions=el('div',undefined,'actions');actions.append(clear,check);panel.append(answer,tiles,actions,feedback);update();
  }
  render();return ()=>{disposed=true;};

  },()=>{round=0;chosen=[];});
}
