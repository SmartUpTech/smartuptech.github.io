export const themes = {
  light: {mode:'light', background:'#faf9f6',surface:'#ffffff',primaryText:'#252b2b',secondaryText:'#626b68',accent:'#276653',divider:'#d8dfda',error:'#873a2c',
    wordsAccent:'#28735c',wordsSurface:'#e5f2eb',lettersAccent:'#a35b2a',lettersSurface:'#fbecdc',numbersAccent:'#486aa5',numbersSurface:'#e9effb',
    patternsAccent:'#795398',patternsSurface:'#f1eafb',pathsAccent:'#a34c60',pathsSurface:'#fbe9ee',focusAccent:'#477575',focusSurface:'#e3f1f0'},
  dark: {mode:'dark',background:'#181d1b',surface:'#242b27',primaryText:'#f0f3ef',secondaryText:'#b5c0b8',accent:'#9fd9bf',divider:'#46524a',error:'#ffb4a4',
    wordsAccent:'#98dbb8',wordsSurface:'#253d32',lettersAccent:'#f0b780',lettersSurface:'#403226',numbersAccent:'#a5c2f5',numbersSurface:'#2a3548',
    patternsAccent:'#d2b4ef',patternsSurface:'#3b3049',pathsAccent:'#efa6b7',pathsSurface:'#472d36',focusAccent:'#9dd2d0',focusSurface:'#293d3f'}
};
export function applyTheme(input = {}, embedded = false) {
  const mode = input.mode === 'dark' ? 'dark' : 'light';
  const tokens = {...themes[mode]};
  // Native hosts may provide individual category tokens. Otherwise derive all
  // decorative colors from their semantic palette, never a standalone app color.
  if(embedded)for(const category of ['words','letters','numbers','patterns','paths','focus']) {
    tokens[`${category}Accent`]=/^#[\da-f]{6}$/i.test(input.accent || '')?input.accent:tokens.accent;
    tokens[`${category}Surface`]=/^#[\da-f]{6}$/i.test(input.surface || '')?input.surface:tokens.surface;
  }
  for (const key of Object.keys(tokens)) if (key !== 'mode' && typeof input[key] === 'string' && /^#[\da-f]{6}$/i.test(input[key])) tokens[key] = input[key];
  for (const [key,value] of Object.entries(tokens)) document.documentElement.style.setProperty(`--${key}`,value);
  document.documentElement.style.colorScheme = mode;
}
