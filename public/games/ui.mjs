export function el(tag, text, className) {
  const node=document.createElement(tag);if(text!==undefined)node.textContent=text;
  if(className)node.className=className;return node;
}
export function button(text, action, className) {
  const node=el('button',text,className);node.type='button';node.addEventListener('click',action);return node;
}
export function setFeedback(node,text,kind='info') {
  node.textContent=text;
  node.classList.toggle('is-error',Boolean(text)&&kind==='error');
  node.classList.toggle('is-success',Boolean(text)&&kind==='success');
}
