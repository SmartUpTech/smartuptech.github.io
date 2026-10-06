import {el,button,setFeedback} from '../ui.mjs';
import {matchChallenge,isMatch} from './words.mjs';
import {languageOf} from '../core.mjs';
export function mount(root,{date,language,t,progress,complete,canPlay}) {
  const challenge=matchChallenge(date,language), matched=new Set();let left=null,right=null,disposed=false;
  root.append(el('p',t('match_help')));
  if(challenge.language!==languageOf(language))root.append(el('p',t('english_content'),'notice'));
  const count=el('p','','progress'),board=el('div',undefined,'pairs'),feedback=el('p','','feedback');
  feedback.setAttribute('role','status');root.append(count,board,feedback);
  function render() {
    count.textContent=t('progress',{done:matched.size,total:challenge.pairs.length});board.replaceChildren();
    for(const side of ['left','right']) {
      const col=el('div',undefined,'pair-column');
      for(const pair of challenge[side]) {
        const text=side==='left' ? pair.word : pair.meaning;
        const b=button((matched.has(pair.id)?'✓ ':'')+text,()=>select(side,pair.id));
        b.disabled=matched.has(pair.id);b.dataset.pair=String(pair.id);b.dataset.side=side;
        if(b.disabled)b.classList.add('matched');
        b.setAttribute('aria-pressed',String((side==='left'?left:right)===pair.id));col.append(b);
      }
      board.append(col);
    }
  }
  function select(side,id) {
    if(disposed || !canPlay())return;
    if(side==='left')left=id;else right=id;
    if(left!==null && right!==null) {
      if(isMatch(left,right)){matched.add(left);setFeedback(feedback,t('matched'),'success');progress({done:matched.size,total:4});}
      else setFeedback(feedback,t('try_again'),'error');
      left=null;right=null;
    }
    render();
    if(matched.size===4){complete({matched:4,total:4});return;}
    const next=left!==null?'right':right!==null?'left':side;
    board.querySelector(`[data-side="${next}"]:not(:disabled)`)?.focus({preventScroll:true});
  }
  render();return ()=>{disposed=true;};
}
