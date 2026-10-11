import {instructions} from './i18n.mjs';
import {languageOf} from './core.mjs';
export function gameInstructions(id,language='en'){return instructions[languageOf(language)]?.[id];}
