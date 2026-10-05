import {dayNumber,hash,shuffle} from '../core.mjs';
export const PUZZLE_VERSION='puzzles-1';
const seed=(id,date)=>hash(`${id}:${date}:${PUZZLE_VERSION}`);
const mod=(n,m)=>((n%m)+m)%m;
export function sudokuCandidates(board,index) {
  const row=Math.floor(index/4),col=index%4;
  return [1,2,3,4].filter(value=>!board.some((other,i)=>i!==index && other===value &&
    (Math.floor(i/4)===row || i%4===col || (Math.floor(i/8)===Math.floor(row/2) && Math.floor(i%4/2)===Math.floor(col/2)))));
}
export function sudokuSolutions(board,limit=2) {
  if(!Array.isArray(board)||board.length!==16||board.some((v,i)=>!Number.isInteger(v)||v<0||v>4||(v&&!sudokuCandidates(board,i).includes(v))))return 0;
  function solve(values) {
    let at=-1,choices=[];
    for(let i=0;i<16;i++)if(!values[i]){const c=sudokuCandidates(values,i);if(!c.length)return 0;if(at===-1||c.length<choices.length){at=i;choices=c;}}
    if(at===-1)return 1;
    let count=0;for(const v of choices){values[at]=v;count+=solve(values);if(count>=limit)break;}values[at]=0;return Math.min(count,limit);
  }
  return solve([...board]);
}
export function sudokuChallenge(date) {
  const s=seed('mini_sudoku',date);
  const rows=shuffle([0,1],s).flatMap(b=>shuffle([b*2,b*2+1],s^(b+31)));
  const cols=shuffle([0,1],s^73).flatMap(b=>shuffle([b*2,b*2+1],s^(b+97)));
  let solution=rows.flatMap(r=>cols.map(c=>(r*2+Math.floor(r/2)+c)%4+1));
  // Fix the first clue to a day cycle. Adjacent days have different solutions,
  // so uniquely solvable puzzles cannot be identical even after clue removal.
  const offset=mod(dayNumber(date),4)+1-solution[0];
  solution=solution.map(v=>mod(v-1+offset,4)+1);
  const puzzle=[...solution];let holes=0;
  for(const i of shuffle(Array.from({length:15},(_,i)=>i+1),s^193)) {
    const value=puzzle[i];puzzle[i]=0;
    if(sudokuSolutions(puzzle)===1)holes++;else puzzle[i]=value;
    if(holes===8)break;
  }
  return {puzzle,solution};
}
export const sudokuComplete=(board,puzzle)=>Array.isArray(board)&&board.length===16&&board.every((v,i)=>v>=1&&v<=4&&(!puzzle[i]||puzzle[i]===v))&&sudokuSolutions(board)===1;
export function sequenceChallenge(date) {
  const s=seed('sequence',date),start=2+mod(dayNumber(date),17),step=2+s%6;
  const specs=[{rule:'rule_add',values:Array.from({length:5},(_,i)=>start+i*step)},
    {rule:'rule_multiply',values:Array.from({length:5},(_,i)=>(2+s%3)*(2+s%2)**i)},
    {rule:'rule_square',values:Array.from({length:5},(_,i)=>(2+s%5+i)**2)}];
  return specs.map(({rule,values},i)=>{
    const answer=values[4],delta=values[4]-values[3];
    const options=shuffle([answer,answer+delta,answer+1,answer-1],s^(i+357));
    return {rule,values:values.slice(0,4),answer,options};
  });
}
export const sequenceCorrect=(round,value)=>Number.isInteger(value)&&value===round.answer;
export function numberGridChallenge(date) {
  const cells=shuffle(Array.from({length:16},(_,i)=>i+1),seed('number_grid',date));
  const target=mod(dayNumber(date),16),shift=mod(cells.indexOf(1)-target,16);
  return [...cells.slice(shift),...cells.slice(0,shift)];
}
export const numberGridCorrect=(next,value)=>Number.isInteger(next)&&next>=1&&next<=16&&next===value;
export const directions=[{dr:-1,dc:0,key:'up',symbol:'↑'},{dr:0,dc:1,key:'right',symbol:'→'},{dr:1,dc:0,key:'down',symbol:'↓'},{dr:0,dc:-1,key:'left',symbol:'←'}];
export function neighbor(index,direction,size) {
  if(!Number.isInteger(index)||index<0||index>=size*size||!directions[direction])return -1;
  const {dr,dc}=directions[direction],r=Math.floor(index/size)+dr,c=index%size+dc;
  return r<0||r>=size||c<0||c>=size?-1:r*size+c;
}
export function mazeChallenge(date) {
  const size=6,walls=Array.from({length:size*size},()=>[true,true,true,true]),seen=new Set([0]),stack=[0];
  const s=seed('maze',date),first=mod(dayNumber(date),2)?1:2;
  while(stack.length) {
    const at=stack[stack.length-1];
    const options=(at===0?[first]:shuffle([0,1,2,3],s^(at*131+seen.size))).filter(d=>{const n=neighbor(at,d,size);return n>=0&&!seen.has(n);});
    if(!options.length){stack.pop();continue;}
    const direction=options[0],next=neighbor(at,direction,size);
    walls[at][direction]=false;walls[next][(direction+2)%4]=false;seen.add(next);stack.push(next);
  }
  return {size,walls,start:0,goal:size*size-1};
}
export function mazeMove(maze,at,direction) {
  const next=neighbor(at,direction,maze.size);
  return next<0||maze.walls[at]?.[direction]!==false?at:next;
}
