import {el,button} from '../ui.mjs';
import {shapeChallenge,shapeCells,shapePlacement} from './new-puzzles.mjs';
export function mount(root,{date,t,progress,complete,canPlay}) {
  const pieces=shapeChallenge(date),placements=pieces.map(()=>null);let selected=0,disposed=false,drag=null,suppressClick=false;
  root.append(el('p',t('shape_help')));
  const board=el('div',undefined,'shape-board'),tray=el('div',undefined,'shape-tray'),feedback=el('p',t('shape_selected',{number:1}),'feedback');feedback.setAttribute('role','status');
  const cells=Array.from({length:16},(_,i)=>{const b=button('',()=>{if(disposed||!canPlay())return;place(i);},'shape-cell');b.dataset.cell=i;b.setAttribute('aria-label',t('maze_position',{row:Math.floor(i/4)+1,col:i%4+1}));board.append(b);return b;});
  function place(at){if(selected===null)return;
    if(!shapePlacement(pieces,placements,selected,at)){feedback.textContent=t('shape_invalid');return;}
    placements[selected]=at;const done=placements.filter(at=>at!==null).length;progress({done,total:pieces.length});
    selected=placements.findIndex(at=>at===null);if(selected<0)selected=null;render();if(done===pieces.length)complete({pieces:done});
  }
  const buttons=pieces.map((piece,id)=>{
    const b=button('',()=>{if(suppressClick){suppressClick=false;return;}if(disposed||!canPlay())return;selected=id;render();},'shape-piece');b.dataset.piece=id;
    b.setAttribute('aria-label',t('shape_piece',{number:id+1}));
    const mini=el('span',undefined,'shape-mini');mini.setAttribute('aria-hidden','true');
    for(const [r,c]of piece.cells){const square=el('span',String(id+1));square.style.gridRow=r+1;square.style.gridColumn=c+1;mini.append(square);}b.append(mini);tray.append(b);
    b.addEventListener('pointerdown',e=>{if(disposed||!canPlay()||!e.isPrimary||e.button!==0)return;suppressClick=false;selected=id;render();drag={id,x:e.clientX,y:e.clientY,moved:false};b.setPointerCapture(e.pointerId);});
    b.addEventListener('pointermove',e=>{if(!drag)return;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8)drag.moved=true;const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.shape-cell');cells.forEach(c=>c.classList.toggle('drop-target',c===target));});
    b.addEventListener('pointerup',e=>{if(!drag)return;const moved=drag.moved;drag=null;suppressClick=moved;cells.forEach(c=>c.classList.remove('drop-target'));if(moved&&!disposed&&canPlay()){const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.shape-cell');if(target)place(Number(target.dataset.cell));}});
    b.addEventListener('pointercancel',()=>{drag=null;cells.forEach(c=>c.classList.remove('drop-target'));});return b;
  });
  const reset=button(t('clear'),()=>{if(disposed||!canPlay())return;placements.fill(null);selected=0;render();progress({done:0,total:pieces.length});});root.append(board,tray,reset,feedback);
  function render(){cells.forEach(c=>{c.textContent='';c.classList.remove('filled');});placements.forEach((at,id)=>{if(at!==null)for(const cell of shapeCells(pieces[id],at)){cells[cell].textContent=String(id+1);cells[cell].classList.add('filled');}});buttons.forEach((b,id)=>b.setAttribute('aria-pressed',String(id===selected)));feedback.textContent=selected===null?'':t('shape_selected',{number:selected+1});}
  render();return()=>{disposed=true;drag=null;};
}
