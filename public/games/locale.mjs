export const languages = Object.freeze(['en','hi','fr','de','it','nl','pt','el','ro','es']);
export function localeOf(value) {
  try {
    if(typeof value !== 'string' || value.length > 64) return {language:'en',locale:'en'};
    const locale=Intl.getCanonicalLocales(value.replaceAll('_','-'))[0];
    const language=locale?.split('-')[0];
    return languages.includes(language) ? {language,locale} : {language:'en',locale:'en'};
  } catch {return {language:'en',locale:'en'};}
}
