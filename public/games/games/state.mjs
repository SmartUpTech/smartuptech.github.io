import {matchChallenge,scrambleChallenge} from './words.mjs';
import {sudokuChallenge,sudokuCandidates,sudokuComplete,sequenceChallenge,mazeChallenge,mazeMove,numberGridChallenge} from './puzzles.mjs';
import {shapeChallenge,shapePlacement,pipeChallenge,pipeConnected,rotatePipe,codeChallenge,codeClue} from './new-puzzles.mjs';
import {languageOf,hash} from '../core.mjs';
import {messages} from '../i18n.mjs';
const integer=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
const list=(a,size,check)=>Array.isArray(a)&&a.length===size&&a.every(check);
const unique=a=>new Set(a).size===a.length;
const stateKeys={word_match:['matched','left','right'],word_scramble:['round','chosen'],mini_sudoku:['board','selected'],sequence:['index','rejected'],maze:['at','moves'],number_grid:['next'],shape_fit:['placements','selected'],pipe_connect:['puzzle','moves'],code_breaker:['guess','attempts','history']};
const recordKeys=new Set(['schema','mode','appId','date','gameId','puzzleRevision','puzzleId','seedInputs','seed','contentLanguage','puzzle','timer','started','status','completionDispatched','result','state','feedback','helpOpen','round']);
export const definitions={
  word_match:{revision:'words-2',create:matchChallenge,valid:(s,p)=>Array.isArray(s.matched)&&s.matched.length<=4&&unique(s.matched)&&s.matched.every(n=>integer(n,0,3))&&[s.left,s.right].every(n=>n===null||integer(n,0,3)&&!s.matched.includes(n))},
  word_scramble:{revision:'words-2',create:scrambleChallenge,valid:(s,p)=>integer(s.round,0,3)&&Array.isArray(s.chosen)&&unique(s.chosen)&&s.chosen.length<=(p.rounds[Math.min(s.round,2)].tiles.length)&&s.chosen.every(n=>integer(n,0,p.rounds[Math.min(s.round,2)].tiles.length-1))},
  mini_sudoku:{revision:'puzzles-1',create:sudokuChallenge,valid:(s,p)=>integer(s.selected,-1,15)&&list(s.board,16,(v,i)=>integer(v,0,4)&&(!p.puzzle[i]||p.puzzle[i]===v)&&(!v||sudokuCandidates(s.board,i).includes(v)))},
  sequence:{revision:'puzzles-1-sequence-v2',create:sequenceChallenge,valid:(s,p)=>integer(s.index,0,3)&&Array.isArray(s.rejected)&&s.rejected.length<=3&&unique(s.rejected)&&s.rejected.every(n=>p[Math.min(s.index,2)].options.includes(n)&&n!==p[Math.min(s.index,2)].answer)},
  maze:{revision:'puzzles-1',create:mazeChallenge,valid:(s,p)=>{
    if(!integer(s.at,0,35)||!integer(s.moves,0,Number.MAX_SAFE_INTEGER))return false;
    const distance=new Map([[p.start,0]]),queue=[p.start];for(const at of queue)for(let d=0;d<4;d++){const next=mazeMove(p,at,d);if(!distance.has(next)){distance.set(next,distance.get(at)+1);queue.push(next);}}
    return s.moves>=distance.get(s.at)&&(s.moves-distance.get(s.at))%2===0;
  }},
  number_grid:{revision:'puzzles-1',create:numberGridChallenge,valid:s=>integer(s.next,1,17)},
  shape_fit:{revision:'shape-1',create:shapeChallenge,valid:(s,p)=>list(s.placements,4,(at,i)=>at===null||integer(at,0,15)&&shapePlacement(p,s.placements,i,at))&&(s.selected===null||integer(s.selected,0,3))},
  pipe_connect:{revision:'pipe-1',create:pipeChallenge,valid:(s,p)=>integer(s.moves,0,Number.MAX_SAFE_INTEGER)&&list(s.puzzle,16,(mask,i)=>{let v=p.puzzle[i];for(let n=0;n<4;n++,v=rotatePipe(v))if(mask===v)return true;return false;})},
  code_breaker:{revision:'code-1',create:codeChallenge,valid:(s,p)=>integer(s.attempts,0,Number.MAX_SAFE_INTEGER)&&Array.isArray(s.guess)&&s.guess.length<=4&&unique(s.guess)&&s.guess.every(n=>integer(n,1,6))&&Array.isArray(s.history)&&s.history.length<=3&&s.history.every((row,i)=>integer(row.attempt,1,s.attempts)&&(!i||row.attempt>s.history[i-1].attempt)&&codeClue(p,row.guess)?.exact<4)}
};
export function newPuzzle(id,date,language,round=0) {
  if(round!==0&&round!==1)throw new Error('INVALID_ROUND');
  if(round===1){
    const original=newPuzzle(id,date,language);
    // A separate deterministic seed date keeps the real local date and completion scope intact.
    for(let offset=1;offset<=366;offset++){
      const seedDate=new Date(Date.parse(date)+offset*86400000).toISOString().slice(0,10);
      const next=newPuzzle(id,seedDate,language);
      if(JSON.stringify(next.puzzle)!==JSON.stringify(original.puzzle))return {...next,round:1,
        puzzleId:`${id}:${date}:bonus:${next.puzzleRevision}:${next.contentLanguage}`,
        seedInputs:{...next.seedInputs,date,seedDate,round:1}};
    }
    throw new Error('BONUS_PUZZLE_UNAVAILABLE');
  }
  const definition=definitions[id],contentLanguage=id.startsWith('word_')?languageOf(language):'en';
  const puzzle=definition.create(date,contentLanguage);
  const seed=id==='word_match'?puzzle.seed:id==='word_scramble'?puzzle.rounds.map(p=>p.seed):hash(`${id==='sequence'?'sequence:v2':id}:${date}:${['shape_fit','pipe_connect','code_breaker'].includes(id)?'1':'puzzles-1'}`);
  return {gameId:id,puzzleRevision:definition.revision,puzzleId:`${id}:${date}:${definition.revision}:${contentLanguage}`,seedInputs:{gameId:id,date,revision:definition.revision,language:contentLanguage},seed,contentLanguage,puzzle,timer:{mode:'none'}};
}
export function validSnapshot(record,id,date,round=0) {
  try {
    if(!record||record.schema!==1||record.gameId!==id||!definitions[id]||record.timer?.mode!=='none'||typeof record.started!=='boolean'||!['playing','finished'].includes(record.status)||typeof record.completionDispatched!=='boolean')return false;
    if(Object.keys(record).some(key=>!recordKeys.has(key))||!record.state||Object.keys(record.state).length!==stateKeys[id].length||Object.keys(record.state).some(key=>!stateKeys[id].includes(key)))return false;
    if((record.round??0)!==round)return false;
    const expected=newPuzzle(id,date,record.contentLanguage,round);
    for(const key of ['puzzleRevision','puzzleId','seedInputs','seed','contentLanguage','puzzle'])if(JSON.stringify(record[key])!==JSON.stringify(expected[key]))return false;
    if(!definitions[id].valid(record.state,record.puzzle))return false;
    if(id==='code_breaker'){
      const attempts=record.state.attempts-(record.status==='finished'?1:0),history=record.state.history;
      if(attempts<0||history.length!==Math.min(attempts,3)||history.some((row,i)=>row.attempt!==attempts-history.length+i+1))return false;
    }
    if(record.helpOpen!==undefined&&typeof record.helpOpen!=='boolean')return false;
    const feedback=record.feedback;
    if(feedback!==null&&feedback!==undefined&&(!Object.hasOwn(messages.en,feedback.key)||!feedback.params||typeof feedback.params!=='object'||Object.keys(feedback.params).length>5||Object.values(feedback.params).some(v=>typeof v!=='number'&&typeof v!=='string'||String(v).length>128)||feedback.kind!==undefined&&!['info','error','success'].includes(feedback.kind)))return false;
    const result=finishedResult(id,record.state,record.puzzle);
    if(record.status==='finished')return record.started&&record.completionDispatched&&result!==null&&JSON.stringify(record.result)===JSON.stringify(result);
    return (!result||id==='code_breaker')&&!record.completionDispatched&&record.result===null;
  } catch {return false;}
}
export function finishedResult(id,s,p) {
  switch(id){
    case 'word_match':return s.matched.length===4?{matched:4,total:4}:null;
    case 'word_scramble':return s.round===3?{solved:3,total:3}:null;
    case 'mini_sudoku':return sudokuComplete(s.board,p.puzzle)?{filled:16,total:16}:null;
    case 'sequence':return s.index===3?{solved:3,total:3}:null;
    case 'maze':return s.at===p.goal?{moves:s.moves}:null;
    case 'number_grid':return s.next===17?{found:16,total:16}:null;
    case 'shape_fit':return s.placements.every(at=>at!==null)?{pieces:4}:null;
    case 'pipe_connect':return pipeConnected(s.puzzle).has(15)?{moves:s.moves}:null;
    case 'code_breaker':return codeClue(p,s.guess)?.exact===4&&s.attempts>0?{attempts:s.attempts}:null;
    default:return null;
  }
}

