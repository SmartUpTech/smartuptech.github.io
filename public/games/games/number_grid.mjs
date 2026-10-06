import {el,button,setFeedback} from '../ui.mjs';
import {numberGridChallenge,numberGridCorrect} from './puzzles.mjs';
export function mount(root,{date,t,progress,complete,canPlay}) {
  const values=numberGridChallenge(date);let next=1,disposed=false;
  root.append(el('p',t('grid_help')));
  const prompt=el('p','','progress game-hint'),grid=el('div',undefined,'number-grid'),feedback=el('p','','feedback');
  grid.setAttribute('role','group');grid.setAttribute('aria-label',t('number_grid'));feedback.setAttribute('role','status');root.append(prompt,grid,feedback);
  function render(){prompt.textContent=t('find_number',{number:next});}
  for(const n of values){const cell=button(String(n),()=>{
    if(disposed||!canPlay())return;
    if(!numberGridCorrect(next,n)){setFeedback(feedback,t('find_number',{number:next}),'error');return;}
    cell.disabled=true;cell.classList.add('found');cell.textContent='✓';cell.setAttribute('aria-label',`${n}, ${t('found')}`);
    next++;setFeedback(feedback,'');progress({done:next-1,total:16});
    if(next===17){complete({found:16,total:16});return;}render();grid.querySelector('button:not(:disabled)')?.focus({preventScroll:true});
  });cell.dataset.number=String(n);grid.append(cell);}
  render();return ()=>{disposed=true;};
}
