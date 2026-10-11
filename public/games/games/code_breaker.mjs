import {el,button,setFeedback} from '../ui.mjs';
import {codeClue} from './new-puzzles.mjs';
import {session} from './session.mjs';
export function mount(root,options) {
  const secret=options.puzzle;let guess=options.snapshot?.state.guess||[],attempts=options.snapshot?.state.attempts||0,historyRows=options.snapshot?.state.history||[];
  return session(root,options,()=>({guess,attempts,history:historyRows}),()=>{
    const {t,progress,complete,canPlay}=options;let disposed=false;
  root.append(el('p',t('code_help')));
  const history=el('ol',undefined,'code-history'),answer=el('output','','code-answer'),feedback=el('p',t('code_legend'),'feedback');
  answer.setAttribute('aria-label',t('answer'));answer.setAttribute('aria-live','polite');feedback.setAttribute('role','status');
  const pad=el('div',undefined,'code-pad'),keys=[];
  for(let n=1;n<=6;n++){const key=button(String(n),()=>{if(disposed||!canPlay()||guess.length>=4||guess.includes(n))return;guess.push(n);render();});pad.append(key);keys.push(key);}
  const actions=el('div',undefined,'actions');
  const erase=button(t('clear_answer'),()=>{if(disposed||!canPlay())return;guess=[];render();});
  const check=button(t('check_code'),()=>{
    if(disposed||!canPlay())return;const clue=codeClue(secret,guess);if(!clue)return;
    attempts++;if(clue.exact===4){complete({attempts});return;}
    historyRows.push({attempt:attempts,guess:[...guess]});historyRows=historyRows.slice(-3);renderHistory();
    setFeedback(feedback,t('code_feedback',clue));progress({attempts,...clue});guess=[];render();
  },'primary');actions.append(erase,check);root.append(history,answer,pad,actions,feedback);
  function renderHistory(){history.replaceChildren();for(const entry of historyRows){const row=el('li');row.append(el('span',`${entry.attempt}. ${entry.guess.join(' ')}`),el('span',t('code_feedback',codeClue(secret,entry.guess))));history.append(row);}}
  renderHistory();
  function render(){answer.textContent=Array.from({length:4},(_,i)=>guess[i]??'·').join(' ');keys.forEach((k,i)=>{k.disabled=guess.includes(i+1)||guess.length===4;});check.disabled=guess.length!==4;erase.disabled=!guess.length;}
  render();return()=>{disposed=true;};

  },()=>{guess=[];attempts=0;historyRows=[];});
}
