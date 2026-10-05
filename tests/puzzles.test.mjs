import test from 'node:test';
import assert from 'node:assert/strict';
import {shapeChallenge,shapeCells,shapePlacement,pipeChallenge,pipeConnected,rotatePipe,codeChallenge,codeClue} from '../public/games/games/new-puzzles.mjs';

test('new daily games are deterministic, solvable and reject invalid moves over 800 dates',()=>{
  for(let i=0;i<800;i++){
    const date=new Date(Date.UTC(2026,0,1+i)).toISOString().slice(0,10);
    const pieces=shapeChallenge(date),placements=pieces.map(()=>null);
    assert.deepEqual(pieces,shapeChallenge(date));
    for(let id=0;id<pieces.length;id++){
      assert.ok(shapePlacement(pieces,placements,id,pieces[id].anchor));placements[id]=pieces[id].anchor;
      const cells=shapeCells(pieces[id],placements[id]),seen=new Set([cells[0]]),queue=[cells[0]];
      for(const at of queue)for(let d=0;d<4;d++){const n=neighbor(at,d,4);if(cells.includes(n)&&!seen.has(n)){seen.add(n);queue.push(n);}}
      assert.equal(seen.size,cells.length);
    }
    assert.equal(new Set(pieces.flatMap((p,id)=>shapeCells(p,placements[id]))).size,16);
    assert.equal(shapePlacement(pieces,placements,0,16),false);
    const pipe=pipeChallenge(date);assert.deepEqual(pipe,pipeChallenge(date));assert.ok(pipeConnected(pipe.solution).has(15));assert.ok(!pipeConnected(pipe.puzzle).has(15));
    pipe.puzzle.forEach((mask,id)=>{const turns=[mask];for(let n=0;n<3;n++)turns.push(rotatePipe(turns.at(-1)));assert.ok(turns.includes(pipe.solution[id]));});
    const code=codeChallenge(date);assert.deepEqual(code,codeChallenge(date));assert.equal(new Set(code).size,4);assert.deepEqual(codeClue(code,code),{exact:4,misplaced:0});
    assert.deepEqual(codeClue(code,[...code.slice(1),code[0]]),{exact:0,misplaced:4});
  }
  assert.equal(codeClue([1,2,3,4],[1,1,2,3]),null);
  assert.equal(codeClue([1,2,3,4],[0,2,3,4]),null);
  assert.deepEqual(codeClue([1,2,3,4],[1,3,5,6]),{exact:1,misplaced:1});
});
import {sudokuChallenge,sudokuSolutions,sudokuComplete,sudokuCandidates,sequenceChallenge,sequenceCorrect,mazeChallenge,mazeMove,neighbor,numberGridChallenge,numberGridCorrect} from '../public/games/games/puzzles.mjs';

export function mazePath(maze) {
  const queue=[maze.start],previous=new Map([[maze.start,null]]);
  for(const at of queue)for(let d=0;d<4;d++){
    const next=mazeMove(maze,at,d);if(!previous.has(next)){previous.set(next,{at,d});queue.push(next);}
  }
  if(!previous.has(maze.goal))return null;
  const path=[];let at=maze.goal;while(at!==maze.start){const step=previous.get(at);path.unshift(step.d);at=step.at;}
  return {path,reached:previous.size};
}
test('800 daily generated puzzles are valid, deterministic and differ on adjacent days',()=>{
  let previous={};
  for(let i=0;i<800;i++) {
    const date=new Date(Date.UTC(2025,11,24+i)).toISOString().slice(0,10);
    const sudoku=sudokuChallenge(date),sequence=sequenceChallenge(date),maze=mazeChallenge(date),grid=numberGridChallenge(date);
    assert.deepEqual(sudoku,sudokuChallenge(date));assert.deepEqual(sequence,sequenceChallenge(date));assert.deepEqual(maze,mazeChallenge(date));assert.deepEqual(grid,numberGridChallenge(date));
    assert.equal(sudokuSolutions(sudoku.puzzle),1);assert.equal(sudokuComplete(sudoku.solution,sudoku.puzzle),true);
    assert.ok(sudoku.puzzle.filter(v=>!v).length>=6);assert.equal(sudokuComplete(sudoku.puzzle,sudoku.puzzle),false);
    for(const round of sequence){assert.equal(new Set(round.options).size,4);assert.equal(round.options.filter(v=>sequenceCorrect(round,v)).length,1);assert.ok(round.options.every(Number.isInteger));}
    const path=mazePath(maze);assert.ok(path);assert.equal(path.reached,36);
    let connections=0;
    for(let at=0;at<36;at++)for(let d=0;d<4;d++){
      const n=neighbor(at,d,maze.size);
      if(n<0)assert.equal(maze.walls[at][d],true);
      else assert.equal(maze.walls[at][d],maze.walls[n][(d+2)%4]);
      if(!maze.walls[at][d])connections++;
    }
    assert.equal(connections/2,35);assert.deepEqual([...grid].sort((a,b)=>a-b),Array.from({length:16},(_,i)=>i+1));
    for(const [name,value]of Object.entries({sudoku:sudoku.puzzle,sequence,maze:maze.walls,grid})) {
      const signature=JSON.stringify(value);assert.notEqual(signature,previous[name]);previous[name]=signature;
    }
  }
});
test('validators reject wrong values, changed clues, invalid boards and wall crossings',()=>{
  const date='2026-10-05',{puzzle,solution}=sudokuChallenge(date);
  const wrong=[...solution];wrong[0]=wrong[1];assert.equal(sudokuComplete(wrong,puzzle),false);
  assert.equal(sudokuSolutions(Array(16).fill(1)),0);assert.equal(sudokuSolutions([]),0);
  assert.equal(sudokuCandidates(solution,0).includes(solution[0]),true);
  assert.equal(sequenceCorrect(sequenceChallenge(date)[0],-1),false);
  assert.equal(numberGridCorrect(1,2),false);assert.equal(numberGridCorrect(17,17),false);assert.equal(numberGridCorrect(1,1),true);
  const maze=mazeChallenge(date);assert.equal(mazeMove(maze,0,0),0);assert.equal(mazeMove(maze,0,3),0);assert.equal(mazeMove(maze,0,99),0);
});
