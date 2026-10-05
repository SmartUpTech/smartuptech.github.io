export function el(tag, text, className) {
  const node=document.createElement(tag);if(text!==undefined)node.textContent=text;
  if(className)node.className=className;return node;
}
export function button(text, action, className) {
  const node=el('button',text,className);node.type='button';node.addEventListener('click',action);return node;
}
