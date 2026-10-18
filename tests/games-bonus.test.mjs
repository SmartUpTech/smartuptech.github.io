import test from 'node:test';
import assert from 'node:assert/strict';
import {newPuzzle,definitions,validSnapshot} from '../public/games/games/state.mjs';
import {validateHost} from '../public/games/core.mjs';
import {snapshotStore} from '../public/games/snapshots.mjs';

test('bonus puzzles are fresh and deterministic for every game, date and language',()=>{
  for(const id of Object.keys(definitions))for(const language of ['en','hi','de','fr','es','pt','it','nl','el','ro'])for(let day=0;day<40;day++){
    const date=new Date(Date.UTC(2026,9,1+day)).toISOString().slice(0,10);
    const first=newPuzzle(id,date,language),bonus=newPuzzle(id,date,language,1);
    assert.notDeepEqual(bonus.puzzle,first.puzzle,`${id}/${language}/${date}`);
    assert.deepEqual(bonus,newPuzzle(id,date,language,1));
    assert.equal(bonus.seedInputs.date,date);
    assert.equal(bonus.round,1);
    assert.throws(()=>newPuzzle(id,date,language,2));
  }
});

test('round progress is isolated, reloadable and cannot authorize another round',()=>{
  const memory=new Map();
  const storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k),key:i=>[...memory.keys()][i],get length(){return memory.size;}};
  const date='2026-10-18',first=snapshotStore(storage,'embedded','net.test.host',date);
  first.write('number_grid',{...newPuzzle('number_grid',date,'en'),started:true,status:'playing',completionDispatched:false,result:null,state:{next:2}});
  const bonus=snapshotStore(storage,'embedded','net.test.host',date,()=>{},1);bonus.prune();
  assert.equal(bonus.read('number_grid'),null);
  bonus.write('number_grid',{...newPuzzle('number_grid',date,'en',1),started:true,status:'playing',completionDispatched:false,result:null,state:{next:1}});
  const restored=snapshotStore(storage,'embedded','net.test.host',date,()=>{},1).read('number_grid');
  assert.equal(restored.state.next,1);
  assert.equal(first.read('number_grid').state.next,2);
  first.prune();assert.ok(bonus.read('number_grid'));
  assert.equal(validSnapshot(restored,'number_grid',date,1),true);
  assert.equal(validSnapshot(restored,'number_grid',date,0),false);
  assert.throws(()=>snapshotStore(storage,'embedded','net.test.host',date,()=>{},2));
});

test('old hosts have no bonus capability and unsupported round values are rejected',()=>{
  const old={bridgeVersion:1,appId:'net.test.host',language:'en',date:'2026-10-18',timezone:'Asia/Kolkata'};
  assert.equal(validateHost(old).bonusRound,0);
  assert.equal(validateHost(old).bonus,undefined);
  for(const bonusRound of [-1,2,'1',null])assert.throws(()=>validateHost({...old,bonusRound}));
  const bonus={enabled:true,eligible:true,busy:false,title:'Bonus',message:'Watch an ad',watch:'Watch ad'};
  assert.equal(validateHost({...old,bonus}).bonus.enabled,true);
  assert.equal(validateHost({...old,bonus:{...bonus,enabled:'true'}}).bonus.enabled,false);
});
