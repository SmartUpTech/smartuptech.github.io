import test from 'node:test';
import assert from 'node:assert/strict';
import {languages,localeOf} from '../public/games/locale.mjs';
import {messages,instructions,translator} from '../public/games/i18n.mjs';
import {datasets} from '../public/games/games/word-data.mjs';
import {matchChallenge,scrambleChallenge,graphemes,isAnswer} from '../public/games/games/words.mjs';
import {snapshotStore} from '../public/games/snapshots.mjs';
import {newPuzzle,validSnapshot} from '../public/games/games/state.mjs';
import {validateHost} from '../public/games/core.mjs';

test('exact languages, regional formatting and tolerant locale fallback',()=>{
 assert.deepEqual(languages,['en','hi','fr','de','it','nl','pt','el','ro','es']);
 for(const tag of ['fr-CA','pt-PT','en-IN','en-GB'])assert.deepEqual(localeOf(tag),{language:tag.split('-')[0],locale:tag});
 for(const tag of [undefined,null,{},23,'','<script>','mr','xx','a'.repeat(200)])assert.equal(localeOf(tag).language,'en');
 const config={bridgeVersion:1,appId:'net.test.host',date:'2026-10-11',timezone:'Asia/Kolkata',completions:{}};
 for(const language of [undefined,'<script>','xx'])assert.equal(validateHost({...config,language}).language,'en');
 assert.match(translator('en-IN')('progress',{done:123456,total:999999}),/1,23,456/);
});

test('every locale has all messages, placeholders and nine instructions',()=>{
 const keys=Object.keys(messages.en).sort(),slots=text=>[...text.matchAll(/\{(\w+)\}/g)].map(x=>x[1]).sort();
 for(const lang of languages){assert.deepEqual(Object.keys(messages[lang]).sort(),keys,lang);assert.equal(Object.keys(instructions[lang]).length,9);
  for(const key of keys){assert.ok(messages[lang][key].trim(),`${lang}:${key}`);assert.deepEqual(slots(messages[lang][key]),slots(messages.en[key]),`${lang}:${key}`);}
 }
});

test('ten content packs have stable identities, canonical answers and explicit graphemes',()=>{
 for(const lang of languages){const data=datasets[lang];assert.equal(data.matching.length,24);assert.equal(data.scrambling.length,18);
  assert.equal(new Set([...data.matching,...data.scrambling].map(p=>p.id)).size,42);
  for(const p of data.scrambling){assert.equal(p.graphemes.join(''),p.word);assert.ok(p.graphemes.length>=2);assert.deepEqual(p.graphemes,[...new Intl.Segmenter(lang,{granularity:'grapheme'}).segment(p.word)].map(x=>x.segment));assert.ok(isAnswer(p.word.normalize('NFD'),p.answers,lang));}
  let previous;
  for(let day=0;day<800;day++){const date=new Date(Date.UTC(2025,0,1+day)).toISOString().slice(0,10),m=matchChallenge(date,lang),s=scrambleChallenge(date,lang);
   assert.equal(m.language,lang);assert.equal(s.language,lang);assert.deepEqual(s,scrambleChallenge(date,lang));assert.equal(new Set(m.pairs.map(p=>p.meaning)).size,4);
   const identity=m.pairs.map(p=>p.contentId).join();assert.notEqual(identity,previous);previous=identity;
   for(const p of s.rounds){assert.notEqual(p.tiles.join(''),p.word);assert.deepEqual([...p.tiles].sort(),[...p.graphemes].sort());}
  }
 }
 const segmenter=Intl.Segmenter;try{Intl.Segmenter=undefined;for(const lang of languages)for(const p of datasets[lang].scrambling)assert.deepEqual(graphemes(p.word,lang),p.graphemes);}finally{Intl.Segmenter=segmenter;}
 assert.equal(isAnswer('s','ș','ro'),false);assert.equal(isAnswer('e','é','fr'),false);assert.equal(isAnswer('καφε','καφέ','el'),false);
});

const memory=()=>{const map=new Map();return {get length(){return map.size;},key:i=>[...map.keys()][i],getItem:key=>map.get(key)||null,setItem:(key,value)=>map.set(key,value),removeItem:key=>map.delete(key)};};
test('snapshot namespaces, pruning, size limits and unavailable storage',()=>{
 const storage=memory(),day='2026-10-11';let failures=0;const store=snapshotStore(storage,'embedded','net.host',day,()=>failures++);
 assert.equal(store.write('maze',{value:1}),true);assert.equal(store.read('maze').value,1);store.saveRoute('maze');assert.equal(store.route(),'maze');
 assert.equal(snapshotStore(storage,'embedded','net.other',day).read('maze'),null);
 assert.equal(snapshotStore(storage,'standalone','net.host',day).read('maze'),null);
 assert.equal(store.write('maze',{value:'x'.repeat(65536)}),false);
 const next=snapshotStore(storage,'embedded','net.host','2026-10-12');next.prune();assert.equal(snapshotStore(storage,'embedded','net.host',day).read('maze'),null);
 storage.setItem(`smartup.games.progress.v1:embedded:net.host:${day}:maze`,'{');assert.equal(snapshotStore(storage,'embedded','net.host',day,()=>failures++).read('maze'),null);
 const blocked=snapshotStore(null,'embedded','net.host',day,()=>failures++);assert.equal(blocked.write('maze',{value:7}),false);assert.equal(blocked.read('maze').value,7);assert.ok(failures>=3);
});
test('reject incompatible, forged and impossible game states',()=>{
 const date='2026-10-11',record={...newPuzzle('number_grid',date,'hi'),schema:1,started:true,status:'playing',completionDispatched:false,result:null,state:{next:4},feedback:null};
 assert.ok(validSnapshot(record,'number_grid',date));
 for(const patch of [{gameId:'maze'},{puzzleRevision:'old'},{contentLanguage:'fr'},{state:{next:99}},{status:'finished',completionDispatched:true,result:{found:16,total:16}}])assert.equal(validSnapshot({...record,...patch},'number_grid',date),false);
 const finished={...record,state:{next:17},status:'finished',completionDispatched:true,result:{found:16,total:16}};assert.ok(validSnapshot(finished,'number_grid',date));
 assert.equal(validSnapshot({...finished,result:{found:15,total:16}},'number_grid',date),false);
});
