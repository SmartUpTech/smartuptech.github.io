import {setFeedback} from '../ui.mjs';
import {describeMessage} from '../i18n.mjs';
// State belongs to each game. Events checkpoint synchronously after its handler,
// including selections and wrong answers which do not emit games:progress.
export function session(root,options,getState,draw,resetState) {
  let disposeView,events,disposed=false,feedback=options.snapshot?.feedback||null;
  function snapshot(){
    const node=root.querySelector('.feedback');
    if(node)feedback=node.dataset.message?JSON.parse(node.dataset.message):describeMessage(node.textContent);
    return {state:getState(),feedback};
  }
  function save(){if(!disposed)options.changed(snapshot());}
  function render(){
    events?.abort();disposeView?.();root.replaceChildren();disposeView=draw();
    const node=root.querySelector('.feedback');
    if(node&&feedback?.key)setFeedback(node,options.t(feedback.key,feedback.params),feedback.kind);
    events=new AbortController();
    for(const type of ['click','keydown','pointerdown','pointerup','pointercancel'])root.addEventListener(type,save,{signal:events.signal});
  }
  render();
  return {
    snapshot,
    updateLocale(t){
      const controls=[...root.querySelectorAll('button,[tabindex]')],focus=controls.indexOf(document.activeElement),scroll=window.scrollY;
      feedback=snapshot().feedback;options.t=t;render();
      if(focus>=0)root.querySelectorAll('button,[tabindex]')[focus]?.focus({preventScroll:true});
      window.scrollTo(0,scroll);
    },
    reset(){feedback=null;resetState();render();save();},
    dispose(){disposed=true;events.abort();disposeView?.();}
  };
}
