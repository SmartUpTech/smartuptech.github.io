import {el,button,setFeedback} from '../ui.mjs';
import {sequenceCorrect} from './puzzles.mjs';
import {session} from './session.mjs';
export function mount(root,options) {
  const rounds=options.puzzle;let index=options.snapshot?.state.index||0,rejected=options.snapshot?.state.rejected||[];
  return session(root,options,()=>({index,rejected}),()=>{
    const {t,progress,complete,canPlay}=options;let disposed=false;
  root.append(el('p',t('sequence_help')));const panel=el('div',undefined,'game-panel');root.append(panel);
  function render(){
    const round=rounds[index];panel.replaceChildren(el('p',t('progress',{done:index,total:rounds.length}),'progress'),el('p',t(round.rule),'game-hint'));
    const sequence=el('div',undefined,'sequence-values');
    for(const n of [...round.values,'?'])sequence.append(el('span',String(n),'sequence-value'));
    const options=el('div',undefined,'sequence-options'),feedback=el('p','','feedback');feedback.setAttribute('role','status');
    for(const value of round.options)options.append(button(String(value),event=>{
      if(disposed||!canPlay())return;
      if(!sequenceCorrect(round,value)){setFeedback(feedback,t('try_again'),'error');rejected.push(value);event.currentTarget.disabled=true;return;}
      index++;rejected=[];progress({done:index,total:rounds.length});
      if(index===rounds.length)complete({solved:index,total:rounds.length});else{render();panel.querySelector('button')?.focus();}
    }));
    [...options.children].forEach((b,i)=>b.disabled=rejected.includes(round.options[i]));panel.append(sequence,options,feedback);
  }
  render();return ()=>{disposed=true;};

  },()=>{index=0;rejected=[];});
}
