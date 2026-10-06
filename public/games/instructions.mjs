// Numbered steps and game-specific caveats live together so every game uses
// the same accessible help presentation. Unsupported languages fall back to en.
const guides={
  en:{
    word_match:[['Choose a word in the left column.','Choose its meaning in the right column.','Match all four pairs to finish.'],'Wrong pairs can be tried again. Matched pairs stay locked.'],
    word_scramble:[['Read the clue above the letters.','Tap letters in order, then choose Check word.','Solve all three words to finish.'],'Clear answer removes only the current word. Reset restarts all three rounds.'],
    mini_sudoku:[['Select an empty square.','Choose a number from 1–4.','Fill every row, column and 2 × 2 box without repeating a number.'],'Given numbers cannot change. Clear cell erases only the selected answer.'],
    sequence:[['Look at the numbers and the pattern hint.','Choose the next number from the four answers.','Solve three patterns to finish.'],'A wrong answer is disabled for that round. You can keep trying.'],
    maze:[['Find the dot and the flag.','Use the arrows or tap an adjacent open square.','Move the dot to the flag to finish.'],'You cannot cross walls or jump to distant squares. Keyboard arrow keys also work.'],
    number_grid:[['Find the number shown above the board.','Tap 1, then 2, and continue in order.','Reach 16 to finish.'],'There is no timer. Tapping a different number does not advance your progress.'],
    shape_fit:[['Select a piece below the board, or drag it.','Tap or drop where the dotted square in the piece should go.','Fit all four pieces into the square.'],'Pieces keep their orientation and cannot overlap or extend outside the board. Select a placed piece to move it. Reset clears all pieces.'],
    pipe_connect:[['Find S (start) and E (end).','Tap any tile to rotate its pipe clockwise.','Make one continuous pipe from S to E.'],'You do NOT need to use every tile. Unused pipes may stay disconnected. Highlighted pipes are connected to S.'],
    code_breaker:[['Choose four different digits from 1–6, then tap Check code.','Use the clues: “exact” means the right digit in the right place; “elsewhere” means the right digit in a different place.','Keep guessing until all four digits are exact.'],'Digits never repeat. Guesses are unlimited; only the last three are shown. Clear answer removes the current entry; Reset also clears guess history.']
  },
  hi:{
    word_match:[['बाएँ स्तंभ से एक शब्द चुनें।','दाएँ स्तंभ से उसका अर्थ चुनें।','चारों जोड़ियाँ मिलाकर पूरा करें।'],'गलत जोड़ी पर फिर कोशिश करें। सही जोड़ियाँ बदल नहीं सकतीं।'],
    word_scramble:[['अक्षरों के ऊपर संकेत पढ़ें।','क्रम से अक्षर दबाएँ, फिर शब्द जाँचें दबाएँ।','तीनों शब्द सुलझाएँ।'],'जवाब मिटाएँ केवल वर्तमान शब्द हटाता है। रीसेट तीनों दौर फिर शुरू करता है।'],
    mini_sudoku:[['खाली खाना चुनें।','1–4 में से अंक चुनें।','हर पंक्ति, स्तंभ और 2 × 2 खाने में बिना दोहराए अंक भरें।'],'दिए हुए अंक बदल नहीं सकते। खाना मिटाएँ केवल चुना जवाब हटाता है।'],
    sequence:[['अंक और क्रम का संकेत देखें।','चार विकल्पों से अगला अंक चुनें।','तीन क्रम हल करें।'],'गलत विकल्प उस दौर में बंद हो जाता है। बाकी विकल्प चुन सकते हैं।'],
    maze:[['बिंदु और झंडा खोजें।','तीर दबाएँ या पास के खुले खाने पर टैप करें।','बिंदु को झंडे तक पहुँचाएँ।'],'दीवार पार या दूर के खाने पर छलाँग नहीं लगा सकते। कीबोर्ड के तीर भी काम करते हैं।'],
    number_grid:[['बोर्ड के ऊपर दिया अंक खोजें।','1, फिर 2, इसी क्रम से दबाएँ।','16 तक पहुँचकर पूरा करें।'],'समय सीमा नहीं है। गलत अंक दबाने से प्रगति नहीं बढ़ती।'],
    shape_fit:[['नीचे से टुकड़ा चुनें या खींचें।','टुकड़े के बिंदु वाले खाने की जगह पर टॅप करें या छोड़ें।','चारों टुकड़ों से चौकोर भरें।'],'टुकड़े घुमा नहीं सकते, एक-दूसरे पर या बोर्ड से बाहर नहीं रख सकते। रखे टुकड़े को चुनकर खिसकाएँ। रीसेट सभी टुकड़े हटाता है।'],
    pipe_connect:[['S (शुरू) और E (अंत) खोजें।','पाइप को घड़ी की दिशा में घुमाने के लिए खाना दबाएँ।','S से E तक लगातार पाइप जोड़ें।'],'हर खाना इस्तेमाल करना ज़रूरी नहीं। बाकी पाइप अलग रह सकते हैं। उभरे हुए पाइप S से जुड़े हैं।'],
    code_breaker:[['1–6 से चार अलग अंक चुनकर कोड जाँचें दबाएँ।','संकेत में सही जगह का अर्थ सही अंक सही स्थान पर है; दूसरी जगह का अर्थ सही अंक गलत स्थान पर है।','चारों अंक सही जगह आने तक कोशिश करें।'],'अंक दोहराते नहीं हैं। कोशिशों की सीमा नहीं; पिछली तीन दिखती हैं। जवाब मिटाएँ वर्तमान जवाब हटाता है; रीसेट पिछली कोशिशें भी हटाता है।']
  },
  mr:{
    word_match:[['डाव्या स्तंभातून शब्द निवडा.','उजव्या स्तंभातून त्याचा अर्थ निवडा.','चारही जोड्या जुळवा.'],'चुकीच्या जोडीनंतर पुन्हा प्रयत्न करा. जुळलेल्या जोड्या बदलता येत नाहीत.'],
    word_scramble:[['अक्षरांवरील संकेत वाचा.','अक्षरे क्रमाने निवडून शब्द तपासा दाबा.','तीनही शब्द सोडवा.'],'उत्तर पुसा फक्त सध्याचा शब्द काढते. रीसेट सर्व फेऱ्या पुन्हा सुरू करते.'],
    mini_sudoku:[['रिकामी चौकट निवडा.','1–4 मधील अंक निवडा.','प्रत्येक ओळ, स्तंभ आणि 2 × 2 चौकटीत अंक न पुनरावृत्त करता भरा.'],'दिलेले अंक बदलता येत नाहीत. चौकट पुसा फक्त निवडलेले उत्तर काढते.'],
    sequence:[['अंक आणि क्रमाचा संकेत पाहा.','चार पर्यायांतून पुढचा अंक निवडा.','तीन क्रम सोडवा.'],'चुकीचा पर्याय त्या फेरीत बंद होतो. इतर पर्याय निवडता येतात.'],
    maze:[['बिंदू आणि झेंडा शोधा.','बाण दाबा किंवा शेजारच्या मोकळ्या चौकटीवर टॅप करा.','बिंदूला झेंड्यापर्यंत न्या.'],'भिंत ओलांडता येत नाही किंवा दूरच्या चौकटीवर उडी मारता येत नाही. कीबोर्डचे बाणही वापरता येतात.'],
    number_grid:[['बोर्डच्या वर दाखवलेला अंक शोधा.','1, मग 2, अशा क्रमाने टॅप करा.','16 पर्यंत पोहोचा.'],'वेळेची मर्यादा नाही. चुकीचा अंक दाबल्यास प्रगती होत नाही.'],
    shape_fit:[['खालील तुकडा निवडा किंवा ओढा.','तुकड्यातील ठिपका असलेली चौकट हवी त्या जागेवर टॅप करा किंवा सोडा.','चारही तुकड्यांनी चौकोन भरा.'],'तुकडे फिरवता येत नाहीत, एकमेकांवर किंवा बोर्डबाहेर ठेवता येत नाहीत. ठेवलेला तुकडा निवडून हलवा. रीसेट सर्व तुकडे काढते.'],
    pipe_connect:[['S (सुरुवात) आणि E (शेवट) शोधा.','पाइप घड्याळाच्या दिशेने फिरवण्यासाठी चौकट दाबा.','S ते E सलग पाइप जोडा.'],'प्रत्येक चौकट वापरणे आवश्यक नाही. उरलेले पाइप वेगळे राहू शकतात. ठळक पाइप S शी जोडलेले आहेत.'],
    code_breaker:[['1–6 मधून चार वेगळे अंक निवडून कोड तपासा दाबा.','योग्य जागी म्हणजे योग्य अंक योग्य ठिकाणी; दुसरीकडे म्हणजे योग्य अंक वेगळ्या ठिकाणी.','चारही अंक योग्य जागी येईपर्यंत प्रयत्न करा.'],'अंक पुन्हा येत नाहीत. प्रयत्न अमर्याद; शेवटचे तीन दिसतात. उत्तर पुसा सध्याचे उत्तर काढते; रीसेट आधीचे प्रयत्नही काढते.']
  }
};
export function gameInstructions(id,language='en') {
  return guides[language.toLowerCase().split(/[-_]/)[0]]?.[id] || guides.en[id];
}
