import {hash,shuffle} from '../core.mjs';
import {neighbor} from './puzzles.mjs';
const seed=(id,date)=>hash(`${id}:${date}:1`);

// Grow four connected pieces over a 4×4 outline. Every generated puzzle has
// the original partition as a solution; alternative valid tilings also count.
export function shapeChallenge(date) {
  const s=seed('shape_fit',date),groups=[[0],[3],[12],[15]],used=new Set(groups.flat());
  while(used.size<16)for(const group of shuffle(groups,s+used.size)) {
    const choices=[...new Set(group.flatMap(at=>[0,1,2,3].map(d=>neighbor(at,d,4))).filter(n=>n>=0&&!used.has(n)))];
    if(choices.length){const n=shuffle(choices,s+used.size)[0];group.push(n);used.add(n);}
  }
  return shuffle(groups,s^31).map(cells=>{
    const row=Math.min(...cells.map(i=>Math.floor(i/4))),col=Math.min(...cells.map(i=>i%4));
    return {anchor:row*4+col,cells:cells.map(i=>[Math.floor(i/4)-row,i%4-col])};
  });
}
export function shapeCells(piece,anchor) {
  if(!Number.isInteger(anchor)||anchor<0||anchor>=16)return null;
  const row=Math.floor(anchor/4),col=anchor%4;
  if(piece.cells.some(([r,c])=>row+r>=4||col+c>=4))return null;
  return piece.cells.map(([r,c])=>(row+r)*4+col+c);
}
export function shapePlacement(pieces,placements,id,anchor) {
  const cells=shapeCells(pieces[id],anchor);if(!cells)return false;
  const occupied=new Set(placements.flatMap((at,i)=>at===null||i===id?[]:shapeCells(pieces[i],at)||[]));
  return cells.every(i=>!occupied.has(i));
}
export const rotatePipe=mask=>((mask<<1)&15)|(mask>>3);
export function pipeConnected(masks) {
  const seen=new Set([0]),queue=[0];
  for(const at of queue)for(let d=0;d<4;d++) {
    const n=neighbor(at,d,4);
    if(n>=0&&(masks[at]&(1<<d))&&(masks[n]&(1<<((d+2)%4)))&&!seen.has(n)){seen.add(n);queue.push(n);}
  }
  return seen;
}
export function pipeChallenge(date) {
  const s=seed('pipe_connect',date),path=[0],seen=new Set([0]);
  function walk(at){if(at===15)return true;for(const d of shuffle([0,1,2,3],s+at*73)){
    const n=neighbor(at,d,4);if(n<0||seen.has(n))continue;
    seen.add(n);path.push(n);if(walk(n))return true;path.pop();seen.delete(n);
  }return false;}walk(0);
  const solution=Array.from({length:16},(_,i)=>shuffle([3,6,12,9,5,10],s+i)[0]);
  for(let i=0;i<path.length;i++){
    const at=path[i];solution[at]=0;
    for(const next of [path[i-1],path[i+1]])if(next!==undefined)for(let d=0;d<4;d++)if(neighbor(at,d,4)===next)solution[at]|=1<<d;
  }
  const puzzle=solution.map((mask,i)=>{for(let n=0;n<(s+i*7)%4;n++)mask=rotatePipe(mask);return mask;});
  if(pipeConnected(puzzle).has(15))puzzle[0]=rotatePipe(puzzle[0]);
  return {puzzle,solution};
}
export const codeChallenge=date=>shuffle([1,2,3,4,5,6],seed('code_breaker',date)).slice(0,4);
export function codeClue(secret,guess) {
  if(guess.length!==4||new Set(guess).size!==4||guess.some(n=>!Number.isInteger(n)||n<1||n>6))return null;
  const exact=guess.filter((n,i)=>n===secret[i]).length;
  return {exact,misplaced:guess.filter(n=>secret.includes(n)).length-exact};
}
