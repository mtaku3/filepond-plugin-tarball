import e from"jszip";class t extends File{constructor(...e){super(...e),this._relativePath=void 0}}const r={},n=n=>({addFilter:o})=>(o("ADD_ITEMS",function(o){try{const i=(n=>((e=>{e.filter(e=>e._relativePath).forEach(e=>{const[,t]=e._relativePath.split("/");r[t]||(r[t]=[]),r[t].push(e)})})(n),Object.keys(r).map(n=>{const o=new e;return r[n].forEach(e=>{o.file(e._relativePath,e)}),delete r[n],function(e){try{return Promise.resolve(o.generateAsync({type:"blob"},e)).then(function(e){return new t([e],`${n}.zip`)})}catch(e){return Promise.reject(e)}}})))(o),s=o.filter(e=>!e._relativePath);return n?(n(i),Promise.resolve(s)):Promise.resolve(Promise.all(i.map(e=>e()))).then(function(e){return s.concat(e)})}catch(e){return Promise.reject(e)}}),{options:{}});export{n as default};
//# sourceMappingURL=zipper.esm.js.map
