import {el,button} from '../ui.mjs';
import {pipeChallenge,rotatePipe,pipeConnected} from './new-puzzles.mjs';
export function mount(root,{date,t,progress,complete,canPlay}) {
  const {puzzle}=pipeChallenge(date);let disposed=false,moves=0;
  root.append(el('p',t('pipe_help')));
  const status=el('p',t('pipe_route'),'progress'),board=el('div',undefined,'pipe-board');root.append(status,board);
  const buttons=puzzle.map((_,i)=>{
    const b=button('',()=>{if(disposed||!canPlay())return;puzzle[i]=rotatePipe(puzzle[i]);moves++;render();progress({moves});if(pipeConnected(puzzle).has(15))complete({moves});},'pipe-cell');
    b.dataset.cell=i;board.append(b);return b;
  });
  function render(){const connected=pipeConnected(puzzle);buttons.forEach((b,i)=>{
    b.replaceChildren();b.classList.toggle('connected',connected.has(i));
    for(let d=0;d<4;d++)if(puzzle[i]&(1<<d))b.append(el('span',undefined,`pipe-arm pipe-${d}`));
    b.append(el('span',i===0?'S':i===15?'E':'','pipe-center'));
    b.setAttribute('aria-label',t('pipe_cell',{row:Math.floor(i/4)+1,col:i%4+1,ports:[0,1,2,3].filter(d=>puzzle[i]&(1<<d)).map(d=>t(['north','east','south','west'][d])).join(', ')}));
  });}render();return()=>{disposed=true;};
}
