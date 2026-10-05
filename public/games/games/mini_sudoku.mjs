import {el,button} from '../ui.mjs';
import {sudokuChallenge,sudokuCandidates,sudokuComplete} from './puzzles.mjs';
export function mount(root,{date,t,progress,complete,canPlay}) {
  const {puzzle}=sudokuChallenge(date),board=[...puzzle];let selected=board.indexOf(0),disposed=false;
  root.append(el('p',t('sudoku_help')));
  const count=el('p','','progress'),grid=el('div',undefined,'sudoku-board'),pad=el('div',undefined,'number-pad'),feedback=el('p','','feedback');
  grid.setAttribute('role','group');grid.setAttribute('aria-label',t('mini_sudoku'));feedback.setAttribute('role','status');
  root.append(count,grid,pad,feedback);
  const cells=board.map((value,i)=>{
    const cell=button('',()=>{if(disposed||!canPlay())return;selected=i;render();},'sudoku-cell');
    cell.dataset.cell=String(i);cell.disabled=Boolean(puzzle[i]);cell.classList.toggle('given',Boolean(puzzle[i]));
    cell.addEventListener('keydown',event=>{if(/^[1-4]$/.test(event.key)){event.preventDefault();enter(Number(event.key));}else if(['Backspace','Delete'].includes(event.key)){event.preventDefault();enter(0);}});
    grid.append(cell);return cell;
  });
  function render() {
    cells.forEach((cell,i)=>{cell.textContent=board[i]||'·';cell.setAttribute('aria-pressed',String(i===selected));cell.setAttribute('aria-label',t('cell_value',{row:Math.floor(i/4)+1,col:i%4+1,value:board[i]||t('empty_cell')}));});
    count.textContent=t('progress',{done:board.filter(Boolean).length-puzzle.filter(Boolean).length,total:puzzle.filter(v=>!v).length});
  }
  function enter(value) {
    if(disposed||!canPlay()||selected<0||puzzle[selected])return;
    if(value&&!sudokuCandidates(board,selected).includes(value)){feedback.textContent=t('sudoku_conflict');return;}
    board[selected]=value;feedback.textContent='';render();
    progress({done:board.filter(Boolean).length,total:16});
    if(sudokuComplete(board,puzzle)){complete({filled:16,total:16});return;}
    if(board.every(Boolean))feedback.textContent=t('try_again');
  }
  for(const n of [1,2,3,4])pad.append(button(String(n),()=>enter(n),'digit-key'));
  const clear=button(t('clear'),()=>enter(0),'erase-key');pad.append(clear);render();
  return ()=>{disposed=true;};
}
