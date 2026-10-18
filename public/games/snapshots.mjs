import {safeId,validDate} from './core.mjs';
export const SNAPSHOT_VERSION=1;
const bytes=value=>new TextEncoder().encode(value).length;
export function snapshotStore(storage,mode,appId,date,onFailure=()=>{},round=0) {
  if(!['embedded','standalone'].includes(mode)||! /^[\w.-]{1,100}$/.test(appId)||!validDate(date))throw new Error('INVALID_SCOPE');
  if(round!==0&&round!==1)throw new Error('INVALID_ROUND');
  const prefix=`smartup.games.progress.v1:${mode}:${appId}${round===1?':bonus':''}:`,scope=`${prefix}${date}:`;
  const memory=new Map();
  function read(id,limit) {
    try {
      const raw=memory.get(id) ?? storage?.getItem(scope+id);
      if(!raw)return null;
      if(raw.length>limit||bytes(raw)>limit)throw new Error('OVERSIZED');
      const value=JSON.parse(raw);
      if(!value||value.schema!==1||value.appId!==appId||value.mode!==mode||value.date!==date)throw new Error('INVALID_SNAPSHOT');
      return value;
    } catch {onFailure();return null;}
  }
  function write(id,value,limit) {
    try {
      const raw=JSON.stringify({...value,schema:1,appId,mode,date});
      if(bytes(raw)>limit)throw new Error('OVERSIZED');
      memory.set(id,raw);
      if(!storage)throw new Error('NO_STORAGE');
      storage.setItem(scope+id,raw);return true;
    } catch {onFailure();return false;}
  }
  return {
    read(id){return safeId(id)?read(id,65536):null;},
    write(id,value){return safeId(id)&&write(id,value,65536);},
    route(){const record=read('_route',2048);return record && (record.route===''||safeId(record.route))?record.route:null;},
    saveRoute(route){if(route===''||safeId(route))write('_route',{route},2048);},
    prune(){try {if(!storage)return;const keys=[];for(let i=0;i<storage.length;i++)keys.push(storage.key(i));for(const key of keys)if(key?.startsWith(prefix)&&!key.startsWith(scope)&&!key.startsWith(`${prefix}bonus:`))storage.removeItem(key);}catch{onFailure();}}
  };
}

