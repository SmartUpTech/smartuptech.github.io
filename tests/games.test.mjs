import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateCatalog,validDate,localDate,dailyIndex,validateHost,completionStore} from '../public/games/v0.0.8/core.mjs';
import {translator} from '../public/games/v0.0.8/i18n.mjs';
import {matchChallenge,scrambleChallenge,isMatch,isAnswer,graphemes} from '../public/games/v0.0.8/games/words.mjs';
const catalog=JSON.parse(await readFile(new URL('../public/games/v0.0.8/games.json',import.meta.url)));
test('catalog validates, sorts, filters capabilities and rejects unsafe paths',()=>{
  const first=catalog[0];
  const raw=[catalog[1],first,{...first},null,{...first,id:'bad',icon:'https://bad/a.svg'},
    {...first,id:'badpath',path:'../evil'},{...first,id:'badorder',sortOrder:'10'},
    {...first,id:'newer',minBridgeVersion:2},{...first,id:'private',apps:['other']},
    {...first,id:'restricted',languages:['hi']},...catalog.slice(2)];
  assert.deepEqual(validateCatalog(raw).map(g=>g.id),['word_match','word_scramble']);
  assert.equal(validateCatalog(raw,{language:'hi-IN'}).some(g=>g.id==='restricted'),true);
  assert.throws(()=>validateCatalog({}));
});
test('dates reject impossible days and handle leap/year boundaries',()=>{
  for(const date of ['2026-02-29','2026-04-31','invalid','2026-1-1'])assert.equal(validDate(date),false);
  assert.equal(validDate('2028-02-29'),true);
  assert.equal(localDate(new Date(2026,0,1,0,1)),'2026-01-01');
  assert.throws(()=>dailyIndex('x','bad','v1',3));
  assert.throws(()=>dailyIndex('x','2026-01-01','v1',1));
});
test('daily puzzles are deterministic, valid, and never repeat consecutively over 800 days',()=>{
  for(const language of ['en','hi','mr','gu']) {
    let previousMatch,previousScramble;
    for(let i=0;i<800;i++) {
      const date=new Date(Date.UTC(2025,11,25+i)).toISOString().slice(0,10);
      const m=matchChallenge(date,language),s=scrambleChallenge(date,language);
      assert.deepEqual(m,matchChallenge(date,language));assert.deepEqual(s,scrambleChallenge(date,language));
      const words=m.pairs.map(x=>x.word).sort().join('|'),rounds=s.rounds.map(x=>x.word).sort().join('|');
      assert.notEqual(words,previousMatch);assert.notEqual(rounds,previousScramble);
      assert.equal(new Set(m.pairs.map(x=>x.meaning)).size,4);
      for(const p of s.rounds){assert.notEqual(p.tiles.join(''),p.word);assert.deepEqual([...p.tiles].sort(),graphemes(p.word,s.language).sort());}
      previousMatch=words;previousScramble=rounds;
    }
  }
});
test('answer validation handles wrong answers, duplicate letters and Unicode',()=>{
  assert.equal(isMatch(0,0),true);assert.equal(isMatch(0,1),false);assert.equal(isMatch(null,null),false);
  assert.equal(isAnswer(' rabbit ','RABBIT'),true);assert.equal(isAnswer('RABIT','RABBIT'),false);
  assert.equal(isAnswer('कमल','कलम'),false);assert.equal(isAnswer('कमल','कमल'),true);
});
test('translations and word datasets fall back without exposing raw keys',()=>{
  assert.equal(translator('gu-IN')('games'),'Games');assert.equal(translator('hi-IN')('word_match'),'शब्द मिलान');
  assert.equal(translator('mr')('load_error'),translator('en')('load_error'));
  assert.equal(translator('en')('missing_key'),'Game');assert.equal(matchChallenge('2026-10-05','gu').language,'en');
});
test('host validation accepts generic future game IDs and filters invalid records',()=>{
  const config={bridgeVersion:1,appId:'net.example.app',language:'hi-IN',date:'2026-10-05',timezone:'Asia/Kolkata',completions:{future_game:'2026-10-05','../bad':'2026-10-05',wrong:'bad'}};
  assert.deepEqual({...validateHost(config).completions},{future_game:'2026-10-05'});
  for(const change of [{date:'2026-02-30'},{timezone:'invalid'},{bridgeVersion:0},{language:'<script>'}])assert.throws(()=>validateHost({...config,...change}));
});
test('completion storage survives reload, rejects corrupt records and handles blocked storage',()=>{
  let saved='invalid';const store=completionStore({getItem:()=>saved,setItem:(_,value)=>{saved=value;}});
  assert.deepEqual(store.read(),{});assert.equal(store.write({word_match:'2026-10-05'}),true);assert.equal(store.read().word_match,'2026-10-05');
  saved='{"word_match":"bad","../x":"2026-10-05"}';assert.deepEqual(store.read(),{});
  assert.deepEqual(completionStore(null).read(),{});assert.equal(completionStore(null).write({}),false);
});
test('all catalog icons and enabled game modules exist',async()=>{
  for(const game of catalog){await readFile(new URL(`../public/games/v0.0.8/${game.icon}`,import.meta.url));if(game.enabled)await readFile(new URL(`../public/games/v0.0.8/games/${game.path}.mjs`,import.meta.url));}
});
