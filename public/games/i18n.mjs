export const messages = {
  en: {
    games:'Games', summary:'{done} of {total} completed today', tomorrow:'Come back tomorrow for new games',
    word_match:'Word Match', word_scramble:'Word Scramble', mini_sudoku:'Mini Sudoku', sequence:'Sequence', maze:'Maze', number_grid:'Number Grid',
    daily:'A little play, every day.', play:'Play', completed:'Completed today', back:'Back to games', well_done:'Well done!', result:'Today’s challenge is complete.',
    match_help:'Match each word with its meaning. Choose one from each column.', scramble_help:'Tap the letters in order to find the word.',
    progress:'{done} of {total}', check:'Check word', clear:'Clear', next:'Next word', try_again:'Not quite. Try again.', matched:'Match found!', correct:'That’s right!',
    retry:'Try again', load_error:'Games could not load. Check your connection and try again.', empty:'New games are on the way.',
    theme:'Theme', light:'Light', dark:'Dark', language:'Language', english_content:'This puzzle uses English words.',
    day_changed:'A new day has begun. Refresh to play today’s games.', refresh:'Refresh games', waiting:'Waiting for your app to provide today’s games…',
    storage_error:'Progress is saved for this visit only. Your browser storage is unavailable.', preview:'Test settings', mock:'Preview completion badges', reset:'Clear test progress',
    selected:'Selected', letter:'Letter {letter}', answer:'Your answer', hint:'Clue', host_error:'Your app could not configure Games. Reopen Games from the app.'
  },
  hi: {
    games:'खेल', summary:'आज {total} में से {done} पूरे', tomorrow:'नए खेलों के लिए कल फिर आएँ', daily:'हर दिन थोड़ा खेलें।',
    word_match:'शब्द मिलान', word_scramble:'शब्द पहेली', mini_sudoku:'मिनी सुडोकू', sequence:'क्रम', maze:'भूलभुलैया', number_grid:'अंक ग्रिड',
    back:'खेलों पर लौटें', well_done:'बहुत बढ़िया!', result:'आज की चुनौती पूरी हुई।', completed:'आज पूरा किया',
    match_help:'हर शब्द को उसके अर्थ से मिलाएँ। दोनों स्तंभों से एक-एक चुनें।', scramble_help:'शब्द बनाने के लिए अक्षरों को सही क्रम में चुनें।',
    progress:'{total} में से {done}', check:'शब्द जाँचें', clear:'मिटाएँ', next:'अगला शब्द', try_again:'फिर से कोशिश करें।', matched:'सही जोड़ी!', correct:'सही जवाब!',
    retry:'फिर कोशिश करें', theme:'थीम', light:'हल्का', dark:'गहरा', language:'भाषा', english_content:'इस पहेली में अंग्रेज़ी शब्द हैं।',
    day_changed:'नया दिन शुरू हो गया है। आज के खेलों के लिए रीफ़्रेश करें।', refresh:'खेल रीफ़्रेश करें', hint:'संकेत', answer:'आपका जवाब'
  },
  mr: {
    games:'खेळ', summary:'आज {total} पैकी {done} पूर्ण', tomorrow:'नवीन खेळांसाठी उद्या पुन्हा या', daily:'दररोज थोडे खेळा.',
    word_match:'शब्द जुळवा', word_scramble:'शब्द कोडे', mini_sudoku:'मिनी सुडोकू', sequence:'क्रम', maze:'भूलभुलैया', number_grid:'अंक जाळी',
    back:'खेळांकडे परत', well_done:'छान केले!', result:'आजचे आव्हान पूर्ण झाले.', completed:'आज पूर्ण',
    match_help:'प्रत्येक शब्द त्याच्या अर्थाशी जुळवा. दोन्ही स्तंभांतून एक निवडा.', scramble_help:'शब्द तयार करण्यासाठी अक्षरे क्रमाने निवडा.',
    progress:'{total} पैकी {done}', check:'शब्द तपासा', clear:'पुसा', next:'पुढचा शब्द', try_again:'पुन्हा प्रयत्न करा.', matched:'योग्य जोडी!', correct:'बरोबर!',
    theme:'थीम', light:'फिकट', dark:'गडद', language:'भाषा', english_content:'या कोड्यात इंग्रजी शब्द आहेत.', hint:'संकेत', answer:'तुमचे उत्तर'
  }
};
export function translator(language = 'en') {
  const lang = language.toLowerCase().split(/[-_]/)[0];
  return (key, params = {}) => {
    const template = messages[lang]?.[key] || messages.en[key] || 'Game';
    return template.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ''));
  };
}
