var e,t=(e=require("jszip"))&&"object"==typeof e&&"default"in e?e.default:e;class r extends File{}const n={};module.exports=e=>({addFilter:o})=>(o("ADD_ITEMS",function(o){try{const i=(e=>((e=>{e.filter(e=>e._relativePath).forEach(e=>{const[,t]=e._relativePath.split("/");n[t]||(n[t]=[]),n[t].push(e)})})(e),Object.keys(n).map(e=>{const o=new t;return n[e].forEach(e=>{o.file(e._relativePath,e)}),delete n[e],function(t){try{return Promise.resolve(o.generateAsync({type:"blob"},t)).then(function(t){return new r([t],e+".zip")})}catch(e){return Promise.reject(e)}}})))(o),s=o.filter(e=>!e._relativePath);return e?(e(i),Promise.resolve(s)):Promise.resolve(Promise.all(i.map(e=>e()))).then(function(e){return s.concat(e)})}catch(e){return Promise.reject(e)}}),{options:{}});
//# sourceMappingURL=zipper.js.map
