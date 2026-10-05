import {el,button} from '../ui.mjs';
import {codeChallenge,codeClue} from './new-puzzles.mjs';
export function mount(root,{date,t,progress,complete,canPlay}) {
  const secret=codeChallenge(date);let guess=[],attempts=0,disposed=false;
  root.append(el('p',t('code_help')));
  const history=el('ol',undefined,'code-history'),answer=el('output','','code-answer'),feedback=el('p',t('code_legend'),'feedback');
  answer.setAttribute('aria-label',t('answer'));answer.setAttribute('aria-live','polite');feedback.setAttribute('role','status');
  const pad=el('div',undefined,'code-pad'),keys=[];
  for(let n=1;n<=6;n++){const key=button(String(n),()=>{if(disposed||!canPlay()||guess.length>=4||guess.includes(n))return;guess.push(n);render();});pad.append(key);keys.push(key);}
  const actions=el('div',undefined,'actions');
  const erase=button(t('clear'),()=>{if(disposed||!canPlay())return;guess=[];render();});
  const check=button(t('check_code'),()=>{
    if(disposed||!canPlay())return;const clue=codeClue(secret,guess);if(!clue)return;
    attempts++;if(clue.exact===4){complete({attempts});return;}
    const row=el('li');row.append(el('span',`${attempts}. ${guess.join(' ')}`),el('span',t('code_feedback',clue)));history.append(row);
    if(history.children.length>3)history.firstElementChild.remove();
    feedback.textContent=t('code_feedback',clue);progress({attempts,...clue});guess=[];render();
  },'primary');actions.append(erase,check);root.append(history,answer,pad,actions,feedback);
  function render(){answer.textContent=Array.from({length:4},(_,i)=>guess[i]??'·').join(' ');keys.forEach((k,i)=>{k.disabled=guess.includes(i+1)||guess.length===4;});check.disabled=guess.length!==4;erase.disabled=!guess.length;}
  render();return()=>{disposed=true;};
}
