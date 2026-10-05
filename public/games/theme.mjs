export const themes = {
  light: {mode:'light', background:'#faf9f6',surface:'#ffffff',primaryText:'#252b2b',secondaryText:'#626b68',accent:'#276653',divider:'#d8dfda'},
  dark: {mode:'dark',background:'#181d1b',surface:'#242b27',primaryText:'#f0f3ef',secondaryText:'#b5c0b8',accent:'#9fd9bf',divider:'#46524a'}
};
export function applyTheme(input = {}) {
  const mode = input.mode === 'dark' ? 'dark' : 'light';
  const tokens = {...themes[mode]};
  for (const key of Object.keys(tokens)) if (key !== 'mode' && typeof input[key] === 'string' && /^#[\da-f]{6}$/i.test(input[key])) tokens[key] = input[key];
  for (const [key,value] of Object.entries(tokens)) document.documentElement.style.setProperty(`--${key}`,value);
  document.documentElement.style.colorScheme = mode;
}
