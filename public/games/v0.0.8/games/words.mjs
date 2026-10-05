import {dailyIndex, hash, shuffle, languageOf} from '../core.mjs';
export const DATA_VERSION='words-1';
// Each group of four is a distinct daily matching puzzle. Words and definitions
// are paired by identity, never by their shuffled screen position.
export const matching = {
  en:[['Ocean','A vast body of salt water'],['Lantern','A portable light'],['Garden','A place to grow plants'],['Compass','A tool that shows direction'],
    ['Bridge','A way across a river'],['Feather','A bird’s light covering'],['Harbor','A safe place for ships'],['Mountain','A very high landform'],
    ['Library','A place to borrow books'],['Desert','Very dry land'],['Whisper','Speak very softly'],['Journey','Travel from place to place'],
    ['Planet','A world orbiting a star'],['Meadow','A field of grass'],['Anchor','Keeps a ship in place'],['Puzzle','A problem to solve'],
    ['Shadow','A dark shape cast by light'],['Forest','A large area of trees'],['Mirror','Shows your reflection'],['Rhythm','A repeating pattern of beats'],
    ['Island','Land surrounded by water'],['Shelter','Protection from weather'],['Breeze','A gentle wind'],['Harvest','Gathering ripe crops']],
  hi:[['सूरज','दिन में प्रकाश देता है'],['चाँद','रात में आकाश में दिखता है'],['नदी','बहती हुई जलधारा'],['किताब','पढ़ने की वस्तु'],
    ['बगीचा','पौधे उगाने की जगह'],['पक्षी','पंखों वाला जीव'],['पहाड़','ऊँची भू-आकृति'],['समुद्र','खारे पानी का विशाल भंडार'],
    ['बारिश','बादलों से गिरता पानी'],['दीपक','रोशनी देने की वस्तु'],['घड़ी','समय बताती है'],['दर्पण','प्रतिबिंब दिखाता है'],
    ['नाव','पानी पर चलने का साधन'],['पेड़','तने और शाखाओं वाला पौधा'],['फूल','पौधे का रंगीन हिस्सा'],['सड़क','वाहनों के चलने का रास्ता'],
    ['चाबी','ताला खोलती है'],['छाता','बारिश से बचाता है'],['कलम','लिखने का साधन'],['तकिया','सिर के नीचे रखते हैं'],
    ['जूता','पैर में पहनते हैं'],['कुर्सी','बैठने की वस्तु'],['सीढ़ी','ऊपर चढ़ने का साधन'],['रसोई','भोजन बनाने की जगह']],
  mr:[['सूर्य','दिवसा प्रकाश देतो'],['चंद्र','रात्री आकाशात दिसतो'],['नदी','वाहणारा पाण्याचा प्रवाह'],['पुस्तक','वाचण्याची वस्तू'],
    ['बाग','झाडे लावण्याची जागा'],['पक्षी','पंख असलेला जीव'],['डोंगर','उंच भूभाग'],['समुद्र','खाऱ्या पाण्याचा विशाल साठा'],
    ['पाऊस','ढगांतून पडणारे पाणी'],['दिवा','उजेड देणारी वस्तू'],['घड्याळ','वेळ दाखवते'],['आरसा','प्रतिबिंब दाखवतो'],
    ['होडी','पाण्यावर चालणारे वाहन'],['झाड','खोड आणि फांद्या असलेली वनस्पती'],['फूल','वनस्पतीचा रंगीत भाग'],['रस्ता','वाहने चालण्याचा मार्ग'],
    ['किल्ली','कुलूप उघडते'],['छत्री','पावसापासून वाचवते'],['पेन','लिहिण्याचे साधन'],['उशी','डोक्याखाली ठेवतात'],
    ['बूट','पायात घालतात'],['खुर्ची','बसण्याची वस्तू'],['शिडी','वर चढण्याचे साधन'],['स्वयंपाकघर','अन्न शिजवण्याची जागा']]
};
// Clues distinguish anagrams. Non-Latin tiles use grapheme clusters so vowel
// signs and conjuncts remain attached; unsupported engines use English content.
export const scrambling = {
  en:[['GARDEN','A place where flowers grow'],['PLANET','Earth is one'],['BRIDGE','A way across a river'],['SILVER','A precious metal'],['BASKET','A container woven from strips'],['FOREST','A large area filled with trees'],['ORANGE','A citrus fruit named for its color'],['WINDOW','An opening with glass'],['ROCKET','A vehicle launched into space'],['PENCIL','A writing tool with graphite'],['MARKET','A place where goods are sold'],['ISLAND','Land surrounded by water'],['CANDLE','A wax source of light'],['POCKET','A small compartment in clothing'],['CASTLE','A large fortified building'],['RABBIT','A long-eared hopping animal'],['BUTTON','A small clothing fastener'],['PARROT','A bird that can mimic speech']],
  hi:[['कमल','पानी में खिलने वाला फूल'],['कलम','लिखने का साधन'],['नमक','भोजन में नमकीन स्वाद देता है'],['मटर','हरी फलियों में मिलने वाले दाने'],['सड़क','वाहनों का रास्ता'],['शहर','बड़ी आबादी वाला स्थान'],['गरम','ठंडा का उल्टा'],['नरम','कठोर का उल्टा'],['अगर','शर्त बताने वाला शब्द'],['महल','राजा का विशाल घर'],['मगर','लेकिन का समानार्थी'],['नगर','शहर का समानार्थी'],['कागज','इस पर लिखते हैं'],['चावल','धान से मिलता है'],['बादल','बारिश लाने वाला'],['मकान','रहने की इमारत'],['गाजर','नारंगी रंग की जड़ वाली सब्जी'],['तरबूज','बड़ा फल जिसका गूदा लाल होता है']],
  mr:[['कमळ','पाण्यात उमलणारे फूल'],['मगर','पाण्यात राहणारा मोठा सरपटणारा प्राणी'],['वजन','किलोग्रॅममध्ये मोजतात'],['गरम','थंडच्या विरुद्ध'],['नरम','कठीणच्या विरुद्ध'],['शहर','मोठी लोकवस्ती'],['बदक','पाण्यात पोहणारा पक्षी'],['महाल','राजाचे मोठे घर'],['नगर','शहराचा समानार्थी शब्द'],['कागद','यावर लिहितात'],['भाकर','ज्वारीपासून बनवतात'],['गाजर','नारिंगी रंगाची कंदभाजी'],['माकड','झाडांवर उड्या मारणारा प्राणी'],['आकाश','डोक्यावर दिसणारा निळा विस्तार'],['दगड','खडकाचा तुकडा'],['साखर','गोड चव देते'],['बाजार','वस्तू खरेदी करण्याची जागा'],['चमचा','जेवण्यासाठी वापरतात']]
};
function contentLanguage(language, words) {
  const lang=languageOf(language);
  return words[lang] && (lang==='en' || typeof Intl.Segmenter==='function') ? lang : 'en';
}
export function matchChallenge(date, language) {
  const lang=contentLanguage(language,matching), all=matching[lang];
  const index=dailyIndex('word_match',date,DATA_VERSION,all.length/4);
  const pairs=all.slice(index*4,index*4+4).map(([word,meaning],id)=>({id,word,meaning}));
  const seed=hash(`word_match:${date}:${DATA_VERSION}:${lang}`);
  return {language:lang,pairs,left:shuffle(pairs,seed),right:shuffle(pairs,seed^0xa5a5a5a5)};
}
export const isMatch=(left,right)=>Number.isInteger(left) && left===right;
export function graphemes(word,language) {
  return typeof Intl.Segmenter==='function' ? [...new Intl.Segmenter(language,{granularity:'grapheme'}).segment(word)].map(x=>x.segment) : Array.from(word);
}
export function normalizeAnswer(value) {return String(value).normalize('NFC').trim().toLocaleUpperCase();}
export const isAnswer=(value,word)=>normalizeAnswer(value)===normalizeAnswer(word);
export function scrambleChallenge(date,language) {
  const lang=contentLanguage(language,scrambling),all=scrambling[lang];
  const index=dailyIndex('word_scramble',date,DATA_VERSION,all.length/3);
  const rounds=all.slice(index*3,index*3+3).map(([word,clue],round)=>{
    const letters=graphemes(word,lang);let tiles=shuffle(letters,hash(`word_scramble:${date}:${DATA_VERSION}:${lang}:${round}`));
    if(tiles.join('')===word)tiles=[...letters.slice(1),letters[0]];
    return {word,clue,tiles};
  });
  return {language:lang,rounds};
}
