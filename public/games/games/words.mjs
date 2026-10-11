import {dailyIndex,hash,shuffle,languageOf} from '../core.mjs';
import {datasets} from './word-data.mjs';
export const DATA_VERSION='words-2';
export const matching=Object.fromEntries(Object.entries(datasets).map(([lang,data])=>[lang,data.matching.map(p=>[p.word,p.meaning])]));
export const scrambling=Object.fromEntries(Object.entries(datasets).map(([lang,data])=>[lang,data.scrambling.map(p=>[p.word,p.clue])]));
export function matchChallenge(date,language) {
 const lang=languageOf(language),all=datasets[lang].matching,index=dailyIndex('word_match',date,DATA_VERSION,all.length/4);
 const pairs=all.slice(index*4,index*4+4).map((p,id)=>({...p,contentId:p.id,id}));
 const seed=hash(`word_match:${date}:${DATA_VERSION}:${lang}`);
 return {language:lang,seed,pairs,left:shuffle(pairs,seed),right:shuffle(pairs,seed^0xa5a5a5a5)};
}
export const isMatch=(left,right)=>Number.isInteger(left)&&left===right;
export function graphemes(word,language) {
 const lang=languageOf(language),entry=datasets[lang].scrambling.find(p=>p.word===word.normalize('NFC'));
 if(entry)return [...entry.graphemes];
 if(typeof Intl.Segmenter==='function')return [...new Intl.Segmenter(lang,{granularity:'grapheme'}).segment(word.normalize('NFC'))].map(x=>x.segment);
 throw new Error('UNKNOWN_GRAPHEME_BOUNDARIES');
}
export function normalizeAnswer(value,language='en'){return String(value).normalize('NFC').trim().toLocaleLowerCase(languageOf(language));}
export const isAnswer=(value,word,language='en')=>(Array.isArray(word)?word:[word]).some(answer=>normalizeAnswer(value,language)===normalizeAnswer(answer,language));
export function scrambleChallenge(date,language) {
 const lang=languageOf(language),all=datasets[lang].scrambling,index=dailyIndex('word_scramble',date,DATA_VERSION,all.length/3);
 const rounds=all.slice(index*3,index*3+3).map((entry,round)=>{
  const seed=hash(`word_scramble:${date}:${DATA_VERSION}:${lang}:${round}`),letters=entry.graphemes;
  let tiles=shuffle(letters,seed);if(tiles.join('')===entry.word)tiles=[...letters.slice(1),letters[0]];
  return {...entry,seed,tiles};
 });return {language:lang,rounds};
}
