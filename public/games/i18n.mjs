import {baseMessages,baseGuides} from './base-resources.mjs';
import {translations} from './translations.mjs';
import {localeOf,languages} from './locale.mjs';
export const messages={...baseMessages,...translations};
const helpKeys={word_match:'match_help',word_scramble:'scramble_help',mini_sudoku:'sudoku_help',sequence:'sequence_help',maze:'maze_help',number_grid:'grid_help',shape_fit:'shape_help',pipe_connect:'pipe_help',code_breaker:'code_help'};
export const instructions=Object.fromEntries(languages.map(language=>[language,baseGuides[language]||Object.fromEntries(Object.entries(helpKeys).map(([id,key])=>[id,[[messages[language][key]],'']]))]));
const descriptions=new Map();
export function describeMessage(text){return descriptions.get(text)||null;}
export function translator(language='en') {
 const {language:lang,locale}=localeOf(language),number=new Intl.NumberFormat(locale);
 return (key,params={})=>{
  const template=messages[lang]?.[key]||messages.en[key]||'Game';
  const text=template.replace(/\{(\w+)\}/g,(_,k)=>typeof params[k]==='number'?number.format(params[k]):String(params[k]??''));
  descriptions.set(text,{key,params});if(descriptions.size>512)descriptions.delete(descriptions.keys().next().value);
  return text;
 };
}
