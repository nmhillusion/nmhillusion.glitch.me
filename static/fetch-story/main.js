(()=>{const d=[];let l;const i={sheetId:"16eXWU6RjodEiflVi3-uaktnlUD7UrNw9oZJWXBZ5OE0",apiLink:"https://script.google.com/macros/s/AKfycbyWjumkVRYJtbjeDE9VL9i0ycmAM0HySWTpZ4_cTHYibqqPbiM/exec"};function a(e){const t=document.querySelector("#link-list");if(t&&e){for(;t.firstChild;)t.removeChild(t.firstChild);for(const n of e){const o=document.createElement("tr");o.className="link-item";{const c=document.createElement("td"),r=(c.textContent=n.title,document.createElement("td"));{const i=document.createElement("a");i.textContent=n.link,i.href="/fetch-story/?url="+n.link,r.appendChild(i)}const l=document.createElement("td");{const s=document.createElement("button");s.textContent="Delete",s.onclick=()=>{var e=d.findIndex(e=>e.link==n.link);-1<e&&(d.splice(e,1),a(d))},l.appendChild(s)}o.appendChild(c),o.appendChild(r),o.appendChild(l)}t.appendChild(o)}}else console.error("Not found linkList components")}{const e=document.querySelector("#btnGotoLink"),t=document.querySelector("#btnAddLink"),n=document.querySelector("#btnSyncToServer");e&&(e.onclick=function(){var e=document.querySelector("#url-to-go");e?(e=e.value)&&(location.href="/fetch-story/?url="+e):console.error("Not found element #url-to-go")}),t&&(t.onclick=()=>{var e=document.querySelector("#add-link--title"),t=document.querySelector("#add-link--link");e&&t&&e.value&&t.value?(d.push({title:String(e.value).trim(),link:String(t.value).trim()}),a(d)):alert("input must not be empty")}),n.onclick=()=>{const e=[];e.push(l);for(const o of d){const c=[];for(const r of l)c.push(o[r]);e.push(c)}var t={id:i.sheetId,index:0,values:e};const n=new FormData;n.append("type","setDataSpreadsheet"),n.append("data",JSON.stringify(t)),fetch(i.apiLink,{method:"POST",body:n}).then(e=>e.text()).then(e=>{console.log({resp:e}),alert("Successful: "+e)}).catch(e=>{console.error({error:e}),alert("Error when sync: "+e)})},function(){const n=new FormData;return n.append("type","getDataSpreadsheet"),n.append("data",JSON.stringify(i.sheetId)),new Promise((e,t)=>{fetch(i.apiLink,{method:"POST",body:n}).then(e=>e.json()).then(e).catch(t)})}().then(e=>{const t=e[0];if(t&&0<t.length){const n=[];l=t.shift();for(const o of t){const c={};for(const r in l)c[l[r]]=o[r];n.push(c)}console.log({tunedData:n}),d.push(...n),a(d)}})}})();