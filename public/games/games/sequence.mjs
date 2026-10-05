import {el,button} from '../ui.mjs';
import {sequenceChallenge,sequenceCorrect} from './puzzles.mjs';
export function mount(root,{date,t,progress,complete,canPlay}) {
  const rounds=sequenceChallenge(date);let index=0,disposed=false;
  root.append(el('p',t('sequence_help')));const panel=el('div');root.append(panel);
  function render(){
    const round=rounds[index];panel.replaceChildren(el('p',t('progress',{done:index,total:rounds.length}),'progress'),el('p',t(round.rule),'rule'));
    const sequence=el('div',undefined,'sequence-values');
    for(const n of [...round.values,'?'])sequence.append(el('span',String(n),'sequence-value'));
    const options=el('div',undefined,'sequence-options'),feedback=el('p','','feedback');feedback.setAttribute('role','status');
    for(const value of round.options)options.append(button(String(value),event=>{
      if(disposed||!canPlay())return;
      if(!sequenceCorrect(round,value)){feedback.textContent=t('try_again');event.currentTarget.disabled=true;return;}
      index++;progress({done:index,total:rounds.length});
      if(index===rounds.length)complete({solved:index,total:rounds.length});else{render();panel.querySelector('button')?.focus();}
    }));
    panel.append(sequence,options,feedback);
  }
  render();return ()=>{disposed=true;};
}
