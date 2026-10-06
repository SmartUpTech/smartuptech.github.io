import {el,button,setFeedback} from '../ui.mjs';
import {mazeChallenge,mazeMove,directions} from './puzzles.mjs';
const NS='http://www.w3.org/2000/svg';
function svgNode(tag,attributes){const node=document.createElementNS(NS,tag);for(const [key,value]of Object.entries(attributes))node.setAttribute(key,String(value));return node;}
export function mount(root,{date,t,progress,complete,canPlay}) {
  const maze=mazeChallenge(date);let at=maze.start,moves=0,disposed=false;
  const events=new AbortController();root.append(el('p',t('maze_help')));
  const status=el('p','','progress'),feedback=el('p','','feedback'),board=el('div',undefined,'maze-board'),controls=el('div',undefined,'maze-controls');
  board.tabIndex=0;board.setAttribute('role','group');board.setAttribute('aria-label',t('maze_help'));feedback.setAttribute('role','status');
  const svg=svgNode('svg',{viewBox:'-3 -3 294 294','aria-hidden':'true'}),step=288/maze.size;
  for(let i=0;i<maze.walls.length;i++){
    const x=i%maze.size*step,y=Math.floor(i/maze.size)*step;
    const edges=[[x,y,x+step,y],[x+step,y,x+step,y+step],[x,y+step,x+step,y+step],[x,y,x,y+step]];
    maze.walls[i].forEach((closed,d)=>{if(closed)svg.append(svgNode('line',{x1:edges[d][0],y1:edges[d][1],x2:edges[d][2],y2:edges[d][3],class:'maze-wall'}));});
  }
  const gx=(maze.goal%maze.size+.5)*step,gy=(Math.floor(maze.goal/maze.size)+.5)*step;
  svg.append(svgNode('path',{d:`M ${gx-6} ${gy+12} v -24 h 17 l -5 7 5 7 h -15 v 10 Z`,class:'maze-goal'}));
  const player=svgNode('circle',{r:10,class:'maze-player'});svg.append(player);board.append(svg);root.append(status,board,controls,feedback);
  const buttons=directions.map((direction,d)=>{const b=button(direction.symbol,()=>move(d));b.setAttribute('aria-label',t(direction.key));b.className=`move-${direction.key}`;controls.append(b);return b;});
  function render(){
    player.setAttribute('cx',(at%maze.size+.5)*step);player.setAttribute('cy',(Math.floor(at/maze.size)+.5)*step);
    status.textContent=t('maze_position',{row:Math.floor(at/maze.size)+1,col:at%maze.size+1});
    buttons.forEach((b,d)=>{b.setAttribute('aria-disabled',String(mazeMove(maze,at,d)===at));});
  }
  function move(direction){
    if(disposed||!canPlay())return;
    const next=mazeMove(maze,at,direction);if(next===at){setFeedback(feedback,t('maze_wall'),'error');return;}
    at=next;moves++;setFeedback(feedback,'');render();progress({moves,position:at});if(at===maze.goal)complete({moves});
  }
  root.addEventListener('keydown',event=>{const d={ArrowUp:0,ArrowRight:1,ArrowDown:2,ArrowLeft:3}[event.key];if(d!==undefined){event.preventDefault();move(d);}},{signal:events.signal});
  svg.addEventListener('click',event=>{
    const rect=svg.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width*294-3,y=(event.clientY-rect.top)/rect.height*294-3;
    if(x<0||y<0||x>=288||y>=288)return;
    const target=Math.floor(y/step)*maze.size+Math.floor(x/step),d=directions.findIndex((_,i)=>mazeMove(maze,at,i)===target&&target!==at);
    if(d>=0)move(d);
  },{signal:events.signal});render();
  return ()=>{disposed=true;events.abort();};
}
