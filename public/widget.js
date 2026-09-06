"use strict";(()=>{function _(t,e){if(t.match(/^[a-z]+:\/\//i))return t;if(t.match(/^\/\//))return window.location.protocol+t;if(t.match(/^[a-z]+:/i))return t;let n=document.implementation.createHTMLDocument(),i=n.createElement("base"),o=n.createElement("a");return n.head.appendChild(i),n.body.appendChild(o),e&&(i.href=e),o.href=t,o.href}var X=(()=>{let t=0,e=()=>`0000${(Math.random()*36**4<<0).toString(36)}`.slice(-4);return()=>(t+=1,`u${e()}${t}`)})();function m(t){let e=[];for(let n=0,i=t.length;n<i;n++)e.push(t[n]);return e}var v=null;function B(t={}){return v||(t.includeStyleProperties?(v=t.includeStyleProperties,v):(v=m(window.getComputedStyle(document.documentElement)),v))}function I(t,e){let i=(t.ownerDocument.defaultView||window).getComputedStyle(t).getPropertyValue(e);return i?parseFloat(i.replace("px","")):0}function yt(t){let e=I(t,"border-left-width"),n=I(t,"border-right-width");return t.clientWidth+e+n}function vt(t){let e=I(t,"border-top-width"),n=I(t,"border-bottom-width");return t.clientHeight+e+n}function F(t,e={}){let n=e.width||yt(t),i=e.height||vt(t);return{width:n,height:i}}function Y(){let t,e;try{e=process}catch{}let n=e&&e.env?e.env.devicePixelRatio:null;return n&&(t=parseInt(n,10),Number.isNaN(t)&&(t=1)),t||window.devicePixelRatio||1}var p=16384;function J(t){(t.width>p||t.height>p)&&(t.width>p&&t.height>p?t.width>t.height?(t.height*=p/t.width,t.width=p):(t.width*=p/t.height,t.height=p):t.width>p?(t.height*=p/t.width,t.width=p):(t.width*=p/t.height,t.height=p))}function E(t){return new Promise((e,n)=>{let i=new Image;i.onload=()=>{i.decode().then(()=>{requestAnimationFrame(()=>e(i))})},i.onerror=n,i.crossOrigin="anonymous",i.decoding="async",i.src=t})}async function Et(t){return Promise.resolve().then(()=>new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then(e=>`data:image/svg+xml;charset=utf-8,${e}`)}async function K(t,e,n){let i="http://www.w3.org/2000/svg",o=document.createElementNS(i,"svg"),r=document.createElementNS(i,"foreignObject");return o.setAttribute("width",`${e}`),o.setAttribute("height",`${n}`),o.setAttribute("viewBox",`0 0 ${e} ${n}`),r.setAttribute("width","100%"),r.setAttribute("height","100%"),r.setAttribute("x","0"),r.setAttribute("y","0"),r.setAttribute("externalResourcesRequired","true"),o.appendChild(r),r.appendChild(t),Et(o)}var f=(t,e)=>{if(t instanceof e)return!0;let n=Object.getPrototypeOf(t);return n===null?!1:n.constructor.name===e.name||f(n,e)};function St(t){let e=t.getPropertyValue("content");return`${t.cssText} content: '${e.replace(/'|"/g,"")}';`}function kt(t,e){return B(e).map(n=>{let i=t.getPropertyValue(n),o=t.getPropertyPriority(n);return`${n}: ${i}${o?" !important":""};`}).join(" ")}function At(t,e,n,i){let o=`.${t}:${e}`,r=n.cssText?St(n):kt(n,i);return document.createTextNode(`${o}{${r}}`)}function Q(t,e,n,i){let o=window.getComputedStyle(t,n),r=o.getPropertyValue("content");if(r===""||r==="none")return;let a=X();try{e.className=`${e.className} ${a}`}catch{return}let s=document.createElement("style");s.appendChild(At(a,n,o,i)),e.appendChild(s)}function Z(t,e,n){Q(t,e,":before",n),Q(t,e,":after",n)}var N="application/font-woff",tt="image/jpeg",Ct={woff:N,woff2:N,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:tt,jpeg:tt,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml",webp:"image/webp"};function Lt(t){let e=/\.([^./]*?)$/g.exec(t);return e?e[1]:""}function S(t){let e=Lt(t).toLowerCase();return Ct[e]||""}function Mt(t){return t.split(/,/)[1]}function M(t){return t.search(/^(data:)/)!==-1}function z(t,e){return`data:${e};base64,${t}`}async function O(t,e,n){let i=await fetch(t,e);if(i.status===404)throw new Error(`Resource "${i.url}" not found`);let o=await i.blob();return new Promise((r,a)=>{let s=new FileReader;s.onerror=a,s.onloadend=()=>{try{r(n({res:i,result:s.result}))}catch(l){a(l)}},s.readAsDataURL(o)})}var V={};function Pt(t,e,n){let i=t.replace(/\?.*/,"");return n&&(i=t),/ttf|otf|eot|woff2?/i.test(i)&&(i=i.replace(/.*\//,"")),e?`[${e}]${i}`:i}async function k(t,e,n){let i=Pt(t,e,n.includeQueryParams);if(V[i]!=null)return V[i];n.cacheBust&&(t+=(/\?/.test(t)?"&":"?")+new Date().getTime());let o;try{let r=await O(t,n.fetchRequestInit,({res:a,result:s})=>(e||(e=a.headers.get("Content-Type")||""),Mt(s)));o=z(r,e)}catch(r){o=n.imagePlaceholder||"";let a=`Failed to fetch resource: ${t}`;r&&(a=typeof r=="string"?r:r.message),a&&console.warn(a)}return V[i]=o,o}async function Rt(t){let e=t.toDataURL();return e==="data:,"?t.cloneNode(!1):E(e)}async function Tt(t,e){if(t.currentSrc){let r=document.createElement("canvas"),a=r.getContext("2d");r.width=t.clientWidth,r.height=t.clientHeight,a?.drawImage(t,0,0,r.width,r.height);let s=r.toDataURL();return E(s)}let n=t.poster,i=S(n),o=await k(n,i,e);return E(o)}async function $t(t,e){var n;try{if(!((n=t?.contentDocument)===null||n===void 0)&&n.body)return await P(t.contentDocument.body,e,!0)}catch{}return t.cloneNode(!1)}async function It(t,e){return f(t,HTMLCanvasElement)?Rt(t):f(t,HTMLVideoElement)?Tt(t,e):f(t,HTMLIFrameElement)?$t(t,e):t.cloneNode(et(t))}var Bt=t=>t.tagName!=null&&t.tagName.toUpperCase()==="SLOT",et=t=>t.tagName!=null&&t.tagName.toUpperCase()==="SVG";async function Dt(t,e,n){var i,o;if(et(e))return e;let r=[];return Bt(t)&&t.assignedNodes?r=m(t.assignedNodes()):f(t,HTMLIFrameElement)&&(!((i=t.contentDocument)===null||i===void 0)&&i.body)?r=m(t.contentDocument.body.childNodes):r=m(((o=t.shadowRoot)!==null&&o!==void 0?o:t).childNodes),r.length===0||f(t,HTMLVideoElement)||await r.reduce((a,s)=>a.then(()=>P(s,n)).then(l=>{l&&e.appendChild(l)}),Promise.resolve()),e}function Ut(t,e,n){let i=e.style;if(!i)return;let o=window.getComputedStyle(t);o.cssText?(i.cssText=o.cssText,i.transformOrigin=o.transformOrigin):B(n).forEach(r=>{let a=o.getPropertyValue(r);r==="font-size"&&a.endsWith("px")&&(a=`${Math.floor(parseFloat(a.substring(0,a.length-2)))-.1}px`),f(t,HTMLIFrameElement)&&r==="display"&&a==="inline"&&(a="block"),r==="d"&&e.getAttribute("d")&&(a=`path(${e.getAttribute("d")})`),i.setProperty(r,a,o.getPropertyPriority(r))})}function Ht(t,e){f(t,HTMLTextAreaElement)&&(e.innerHTML=t.value),f(t,HTMLInputElement)&&e.setAttribute("value",t.value)}function Ft(t,e){if(f(t,HTMLSelectElement)){let i=Array.from(e.children).find(o=>t.value===o.getAttribute("value"));i&&i.setAttribute("selected","")}}function Vt(t,e,n){return f(e,Element)&&(Ut(t,e,n),Z(t,e,n),Ht(t,e),Ft(t,e)),e}async function zt(t,e){let n=t.querySelectorAll?t.querySelectorAll("use"):[];if(n.length===0)return t;let i={};for(let r=0;r<n.length;r++){let s=n[r].getAttribute("xlink:href");if(s){let l=t.querySelector(s),u=document.querySelector(s);!l&&u&&!i[s]&&(i[s]=await P(u,e,!0))}}let o=Object.values(i);if(o.length){let r="http://www.w3.org/1999/xhtml",a=document.createElementNS(r,"svg");a.setAttribute("xmlns",r),a.style.position="absolute",a.style.width="0",a.style.height="0",a.style.overflow="hidden",a.style.display="none";let s=document.createElementNS(r,"defs");a.appendChild(s);for(let l=0;l<o.length;l++)s.appendChild(o[l]);t.appendChild(a)}return t}async function P(t,e,n){return!n&&e.filter&&!e.filter(t)?null:Promise.resolve(t).then(i=>It(i,e)).then(i=>Dt(t,i,e)).then(i=>Vt(t,i,e)).then(i=>zt(i,e))}var nt=/url\((['"]?)([^'"]+?)\1\)/g,Ot=/url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,Wt=/src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;function jt(t){let e=t.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1");return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`,"g")}function qt(t){let e=[];return t.replace(nt,(n,i,o)=>(e.push(o),n)),e.filter(n=>!M(n))}async function Gt(t,e,n,i,o){try{let r=n?_(e,n):e,a=S(e),s;if(o){let l=await o(r);s=z(l,a)}else s=await k(r,a,i);return t.replace(jt(e),`$1${s}$3`)}catch{}return t}function _t(t,{preferredFontFormat:e}){return e?t.replace(Wt,n=>{for(;;){let[i,,o]=Ot.exec(n)||[];if(!o)return"";if(o===e)return`src: ${i};`}}):t}function W(t){return t.search(nt)!==-1}async function D(t,e,n){if(!W(t))return t;let i=_t(t,n);return qt(i).reduce((r,a)=>r.then(s=>Gt(s,a,e,n)),Promise.resolve(i))}async function A(t,e,n){var i;let o=(i=e.style)===null||i===void 0?void 0:i.getPropertyValue(t);if(o){let r=await D(o,null,n);return e.style.setProperty(t,r,e.style.getPropertyPriority(t)),!0}return!1}async function Xt(t,e){await A("background",t,e)||await A("background-image",t,e),await A("mask",t,e)||await A("-webkit-mask",t,e)||await A("mask-image",t,e)||await A("-webkit-mask-image",t,e)}async function Yt(t,e){let n=f(t,HTMLImageElement);if(!(n&&!M(t.src))&&!(f(t,SVGImageElement)&&!M(t.href.baseVal)))return;let i=n?t.src:t.href.baseVal,o=await k(i,S(i),e);await new Promise((r,a)=>{t.onload=r,t.onerror=e.onImageErrorHandler?(...l)=>{try{r(e.onImageErrorHandler(...l))}catch(u){a(u)}}:a;let s=t;s.decode&&(s.decode=r),s.loading==="lazy"&&(s.loading="eager"),n?(t.srcset="",t.src=o):t.href.baseVal=o})}async function Jt(t,e){let i=m(t.childNodes).map(o=>j(o,e));await Promise.all(i).then(()=>t)}async function j(t,e){f(t,Element)&&(await Xt(t,e),await Yt(t,e),await Jt(t,e))}function it(t,e){let{style:n}=t;e.backgroundColor&&(n.backgroundColor=e.backgroundColor),e.width&&(n.width=`${e.width}px`),e.height&&(n.height=`${e.height}px`);let i=e.style;return i!=null&&Object.keys(i).forEach(o=>{n[o]=i[o]}),t}var rt={};async function ot(t){let e=rt[t];if(e!=null)return e;let i=await(await fetch(t)).text();return e={url:t,cssText:i},rt[t]=e,e}async function at(t,e){let n=t.cssText,i=/url\(["']?([^"')]+)["']?\)/g,r=(n.match(/url\([^)]+\)/g)||[]).map(async a=>{let s=a.replace(i,"$1");return s.startsWith("https://")||(s=new URL(s,t.url).href),O(s,e.fetchRequestInit,({result:l})=>(n=n.replace(a,`url(${l})`),[a,l]))});return Promise.all(r).then(()=>n)}function st(t){if(t==null)return[];let e=[],n=/(\/\*[\s\S]*?\*\/)/gi,i=t.replace(n,""),o=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi");for(;;){let l=o.exec(i);if(l===null)break;e.push(l[0])}i=i.replace(o,"");let r=/@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,a="((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",s=new RegExp(a,"gi");for(;;){let l=r.exec(i);if(l===null){if(l=s.exec(i),l===null)break;r.lastIndex=s.lastIndex}else s.lastIndex=r.lastIndex;e.push(l[0])}return e}async function Kt(t,e){let n=[],i=[];return t.forEach(o=>{if("cssRules"in o)try{m(o.cssRules||[]).forEach((r,a)=>{if(r.type===CSSRule.IMPORT_RULE){let s=a+1,l=r.href,u=ot(l).then(d=>at(d,e)).then(d=>st(d).forEach(c=>{try{o.insertRule(c,c.startsWith("@import")?s+=1:o.cssRules.length)}catch(h){console.error("Error inserting rule from remote css",{rule:c,error:h})}})).catch(d=>{console.error("Error loading remote css",d.toString())});i.push(u)}})}catch(r){let a=t.find(s=>s.href==null)||document.styleSheets[0];o.href!=null&&i.push(ot(o.href).then(s=>at(s,e)).then(s=>st(s).forEach(l=>{a.insertRule(l,a.cssRules.length)})).catch(s=>{console.error("Error loading remote stylesheet",s)})),console.error("Error inlining remote css file",r)}}),Promise.all(i).then(()=>(t.forEach(o=>{if("cssRules"in o)try{m(o.cssRules||[]).forEach(r=>{n.push(r)})}catch(r){console.error(`Error while reading CSS rules from ${o.href}`,r)}}),n))}function Qt(t){return t.filter(e=>e.type===CSSRule.FONT_FACE_RULE).filter(e=>W(e.style.getPropertyValue("src")))}async function Zt(t,e){if(t.ownerDocument==null)throw new Error("Provided element is not within a Document");let n=m(t.ownerDocument.styleSheets),i=await Kt(n,e);return Qt(i)}function lt(t){return t.trim().replace(/["']/g,"")}function Nt(t){let e=new Set;function n(i){(i.style.fontFamily||getComputedStyle(i).fontFamily).split(",").forEach(r=>{e.add(lt(r))}),Array.from(i.children).forEach(r=>{r instanceof HTMLElement&&n(r)})}return n(t),e}async function ct(t,e){let n=await Zt(t,e),i=Nt(t);return(await Promise.all(n.filter(r=>i.has(lt(r.style.fontFamily))).map(r=>{let a=r.parentStyleSheet?r.parentStyleSheet.href:null;return D(r.cssText,a,e)}))).join(`
`)}async function dt(t,e){let n=e.fontEmbedCSS!=null?e.fontEmbedCSS:e.skipFonts?null:await ct(t,e);if(n){let i=document.createElement("style"),o=document.createTextNode(n);i.appendChild(o),t.firstChild?t.insertBefore(i,t.firstChild):t.appendChild(i)}}async function te(t,e={}){let{width:n,height:i}=F(t,e),o=await P(t,e,!0);return await dt(o,e),await j(o,e),it(o,e),await K(o,n,i)}async function ee(t,e={}){let{width:n,height:i}=F(t,e),o=await te(t,e),r=await E(o),a=document.createElement("canvas"),s=a.getContext("2d"),l=e.pixelRatio||Y(),u=e.canvasWidth||n,d=e.canvasHeight||i;return a.width=u*l,a.height=d*l,e.skipAutoScale||J(a),a.style.width=`${u}`,a.style.height=`${d}`,e.backgroundColor&&(s.fillStyle=e.backgroundColor,s.fillRect(0,0,a.width,a.height)),s.drawImage(r,0,0,a.width,a.height),a}async function ut(t,e={}){return(await ee(t,e)).toDataURL()}function ft(t){if(!t)return"";let e=[],n=t,i=0;for(;n&&n!==document.body&&n!==document.documentElement&&i<6;){let o=n;if(o.id){e.unshift(`#${o.id}`);break}let r=o.tagName.toLowerCase(),a=o.parentElement;if(a){let s=Array.from(a.children).filter(l=>l.tagName===o.tagName);if(s.length>1){let l=s.indexOf(o)+1;r+=`:nth-of-type(${l})`}}e.unshift(r),n=a,i++}return e.length===0?t.tagName.toLowerCase():e.join(" > ")}function ht(t){let e=t.id?`#${t.id}`:"",n="";return typeof t.className=="string"&&t.className.trim()&&(n="."+t.className.trim().split(/\s+/).slice(0,2).join(".")),(t.tagName.toLowerCase()+e+n).slice(0,80)}function pt(t,e=120){let n=(t.textContent||"").replace(/\s+/g," ").trim();return n.length<=e?n:n.slice(0,e-1).trimEnd()+"..."}async function q(t){try{document.querySelectorAll("[data-maw-hover]").forEach(s=>s.removeAttribute("data-maw-hover"));let e=document.documentElement,n=await ut(e,{backgroundColor:"#ffffff",width:e.scrollWidth,height:e.scrollHeight,filter:s=>!((s instanceof HTMLElement||s instanceof SVGElement)&&(s.hasAttribute("data-maw-chrome")||s.tagName.toLowerCase()==="make-a-wish-widget"||s.closest&&(s.closest("[data-maw-chrome]")||s.closest("make-a-wish-widget"))))});if(t.length===0)return n;let i=new Image;i.src=n,await new Promise((s,l)=>{i.onload=()=>s(),i.onerror=()=>l(new Error("failed to load screenshot image"))});let o=document.createElement("canvas");o.width=i.naturalWidth,o.height=i.naturalHeight;let r=o.getContext("2d");if(!r)return n;r.drawImage(i,0,0);let a=o.width/e.scrollWidth;return t.forEach((s,l)=>{let u=(s.rect.x+window.scrollX)*a,d=(s.rect.y+window.scrollY)*a,c=13*a;r.beginPath(),r.arc(u,d,c,0,Math.PI*2),r.fillStyle="#fc3165",r.fill(),r.strokeStyle="#ffffff",r.lineWidth=2*a,r.stroke(),r.fillStyle="#ffffff",r.font=`bold ${14*a}px "Inter", -apple-system, sans-serif`,r.textAlign="center",r.textBaseline="middle",r.fillText(String(l+1),u,d)}),o.toDataURL("image/png")}catch(e){return console.error("[make-a-wish] screenshot capture failed:",e),null}}function H(t,e){let n=[],i=o=>{if(!o)return;let r=o.trim();if(r){if(r.startsWith("[")&&r.endsWith("]"))try{let a=JSON.parse(r);if(Array.isArray(a)){for(let s of a)typeof s=="string"&&s.trim()&&n.push(s.trim());return}}catch{}for(let a of r.split(",")){let s=a.trim();s&&!n.includes(s)&&n.push(s)}}};return i(t),i(e),Array.from(new Set(n))}var ne=[{label:"Bug",emoji:"\u{1F41B}"},{label:"Idea",emoji:"\u{1F4A1}"},{label:"Question",emoji:"\u2753"},{label:"Praise",emoji:"\u2764\uFE0F"}],U=class{constructor(e,n){this.isOpen=!1;this.isAnnotating=!1;this.isSubmitting=!1;this.isDone=!1;this.selectedCategory="Bug";this.selectedAgentMode="adk";this.textValue="";this.annotations=[];this.screenshotDataUrl=null;this.errorMessage=null;this.modalPos=null;this.shouldFocusTextarea=!1;this.annotationOverlay=null;this.annotationPill=null;this.hoveredElement=null;this.pinElements=[];this.root=e,this.config=n,n.agentMode&&(this.selectedAgentMode=n.agentMode),window.addEventListener("resize",()=>{if(this.modalPos&&this.isOpen){let i=this.root.querySelector(".maw-modal");if(i){let o=i.getBoundingClientRect(),r=8,a=Math.max(r,window.innerWidth-o.width-r),s=Math.max(r,window.innerHeight-o.height-r);this.modalPos.x=Math.max(r,Math.min(a,this.modalPos.x)),this.modalPos.y=Math.max(r,Math.min(s,this.modalPos.y)),i.style.left=`${this.modalPos.x}px`,i.style.top=`${this.modalPos.y}px`}}}),this.render()}updateConfig(e){this.config={...this.config,...e},e.agentMode&&(this.selectedAgentMode=e.agentMode),this.render()}hasMeaningfulText(){return this.textValue.replace(/\(\d+\)\s*/g,"").trim().length>0}render(){this.root.innerHTML=`
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,300;8..60,400&display=swap');

        :host {
          all: initial;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #1a1a2e;
          line-height: 1.5;
          font-size: 14px;
          -webkit-font-smoothing: antialiased;
        }
        * {
          box-sizing: border-box;
        }
        .maw-launcher {
          position: fixed;
          ${this.config.position==="bottom-left"?"left: 24px;":"right: 24px;"}
          bottom: 24px;
          z-index: 2147483640;
          display: flex;
          align-items: center;
          gap: 8px;
          height: 46px;
          padding: 0 18px;
          border-radius: 20px;
          background: #d42955;
          color: #ffffff;
          border: none;
          box-shadow: 0 8px 20px -4px rgba(212, 41, 85, 0.35), 0 4px 6px -2px rgba(212, 41, 85, 0.2);
          cursor: pointer;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 500;
          font-size: 14px;
          letter-spacing: -0.2px;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
        }
        .maw-launcher:hover {
          transform: translateY(-2px);
          background: #fc3165;
          box-shadow: 0 12px 24px -4px rgba(252, 49, 101, 0.45);
        }
        .maw-launcher svg {
          width: 18px;
          height: 18px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
        }
        .maw-modal {
          position: fixed;
          ${this.config.position==="bottom-left"?"left: 24px;":"right: 24px;"}
          bottom: 84px;
          z-index: 2147483641;
          width: min(92vw, 388px);
          max-height: calc(100vh - 100px);
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(15, 23, 42, 0.08) 0px 20px 40px, rgba(0, 0, 0, 0.04) 0px 4px 6px -4px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: maw-pop 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          touch-action: none;
        }
        .maw-modal.is-dragging {
          user-select: none;
          -webkit-user-select: none;
          box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(15, 23, 42, 0.16) 0px 25px 50px, rgba(0, 0, 0, 0.08) 0px 8px 12px -4px;
        }
        @keyframes maw-pop {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .maw-top-accent {
          height: 3px;
          width: 100%;
          background: linear-gradient(to right, rgba(252, 49, 101, 0.35), rgba(255, 125, 154, 0.15) 70%, rgba(252, 49, 101, 0.05));
          flex-shrink: 0;
        }
        .maw-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 16px;
          border-bottom: 1px solid #e5e7eb;
          background: rgba(255, 255, 255, 0.95);
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
        }
        .maw-header:active,
        .maw-modal.is-dragging .maw-header {
          cursor: grabbing;
        }
        .maw-drag-handle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          margin-right: 4px;
          cursor: grab;
          transition: color 0.15s ease;
        }
        .maw-header:hover .maw-drag-handle {
          color: #fc3165;
        }
        .maw-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Source Serif 4', 'moderatSerif', Georgia, 'Times New Roman', serif;
          font-weight: 400;
          font-size: 18px;
          letter-spacing: -0.5px;
          color: #1a1a2e;
        }
        .maw-title-icon {
          width: 18px;
          height: 18px;
          color: #fc3165;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          flex-shrink: 0;
        }
        .maw-badge {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.35px;
          color: #fc3165;
          background: rgba(252, 49, 101, 0.08);
          border: 1px solid rgba(252, 49, 101, 0.18);
          padding: 2px 8px;
          border-radius: 9999px;
        }
        .maw-close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 5px;
          border-radius: 6.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .maw-close-btn:hover {
          color: #1a1a2e;
          background: #f8f9fa;
        }
        .maw-body {
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .maw-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .maw-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .maw-chip:hover {
          border-color: rgba(252, 49, 101, 0.4);
          color: #1a1a2e;
          background: #f8f9fa;
        }
        .maw-chip.active {
          background: rgba(252, 49, 101, 0.09);
          color: #fc3165;
          border-color: #fc3165;
          font-weight: 500;
        }
        .maw-textarea {
          width: 100%;
          min-height: 96px;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 13px;
          line-height: 1.5;
          color: #1a1a2e;
          resize: vertical;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          box-sizing: border-box;
        }
        .maw-textarea::placeholder {
          color: #9ca3af;
        }
        .maw-textarea:focus {
          border-color: #fc3165;
          box-shadow: 0 0 0 3px rgba(252, 49, 101, 0.12);
        }
        .maw-annotate-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: #f8f9fa;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
        }
        .maw-annotate-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          padding: 6px 12px;
          border-radius: 6.5px;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #1a1a2e;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .maw-annotate-btn svg {
          color: #fc3165;
        }
        .maw-annotate-btn:hover {
          border-color: #fc3165;
          color: #fc3165;
          background: #ffffff;
        }
        .maw-screenshot-preview {
          position: relative;
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          max-height: 140px;
        }
        .maw-screenshot-preview img {
          width: 100%;
          height: auto;
          display: block;
        }
        .maw-remove-shot {
          position: absolute;
          top: 6px;
          right: 6px;
          background: rgba(26, 26, 46, 0.8);
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          width: 22px;
          height: 22px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: background-color 0.15s ease;
        }
        .maw-remove-shot:hover {
          background: #fc3165;
        }
        .maw-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 4px;
        }
        .maw-submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #d42955;
          color: #ffffff;
          border: none;
          padding: 12px 18px;
          border-radius: 20px;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
        }
        .maw-submit-btn:hover:not(:disabled) {
          background: #fc3165;
        }
        .maw-submit-btn:disabled {
          background: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
        }
        .maw-error {
          padding: 8px 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          color: #dc2626;
          font-size: 12px;
        }
        .maw-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 24px 8px;
          gap: 12px;
        }
        .maw-success-icon {
          width: 52px;
          height: 52px;
          border-radius: 9999px;
          background: rgba(252, 49, 101, 0.10);
          color: #fc3165;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .maw-success-icon svg {
          width: 28px;
          height: 28px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2.5;
        }
        .maw-success-title {
          font-family: 'Source Serif 4', 'moderatSerif', Georgia, serif;
          font-weight: 400;
          font-size: 20px;
          letter-spacing: -0.5px;
          color: #1a1a2e;
        }
        .maw-success-desc {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
        }
        .maw-secondary-btn {
          margin-top: 8px;
          background: #f8f9fa;
          color: #1a1a2e;
          border: 1px solid #e5e7eb;
          padding: 8px 18px;
          border-radius: 20px;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .maw-secondary-btn:hover {
          border-color: #fc3165;
          color: #fc3165;
          background: #ffffff;
        }
      </style>

      ${this.isOpen?"":`
        <button type="button" class="maw-launcher" id="mawLauncherBtn" data-maw-chrome>
          <svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>
          Make a wish
        </button>
      `}

      ${this.isOpen&&!this.isAnnotating?`
        <div class="maw-modal" data-maw-chrome ${this.modalPos?`style="left:${this.modalPos.x}px;top:${this.modalPos.y}px;right:auto;bottom:auto;animation:none;"`:""}>
          <div class="maw-top-accent"></div>
          <div class="maw-header" id="mawHeader" title="Drag to move">
            <div class="maw-title">
              <span class="maw-drag-handle" aria-hidden="true" title="Drag to move">
                <svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor;">
                  <circle cx="8" cy="6" r="1.5" />
                  <circle cx="16" cy="6" r="1.5" />
                  <circle cx="8" cy="12" r="1.5" />
                  <circle cx="16" cy="12" r="1.5" />
                  <circle cx="8" cy="18" r="1.5" />
                  <circle cx="16" cy="18" r="1.5" />
                </svg>
              </span>
              <svg class="maw-title-icon" viewBox="0 0 24 24"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>
              Make a wish
              ${this.config.appId?`<span class="maw-badge">${this.escapeHtml(this.config.appId)}</span>`:""}
            </div>
            <button type="button" class="maw-close-btn" id="mawCloseBtn" aria-label="Close">
              <svg style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div class="maw-body">
            ${this.isDone?`
              <div class="maw-success">
                <div class="maw-success-icon">
                  <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div class="maw-success-title">Wish received!</div>
                <div class="maw-success-desc">
                  ${this.selectedAgentMode==="both"?"Both triage engines (Google ADK & Vertex Managed Agent) are concurrently inspecting the codebase to test the fix and open pull requests on GitHub.":this.selectedAgentMode==="adk"?"Google ADK Agent is inspecting the codebase to test the fix and open a pull request on GitHub.":"Vertex Managed Agent is inspecting the codebase to test the fix and open a pull request on GitHub."}
                </div>
                <button type="button" class="maw-secondary-btn" id="mawResetBtn">Send another wish</button>
              </div>
            `:`
              <div class="maw-categories">
                ${ne.map(e=>`
                  <button type="button" class="maw-chip ${this.selectedCategory===e.label?"active":""}" data-category="${e.label}">
                    <span>${e.emoji}</span>
                    ${e.label}
                  </button>
                `).join("")}
              </div>

              <textarea
                class="maw-textarea"
                id="mawTextInput"
                placeholder="What would make this tool better? Describe what you want or report a bug..."
              >${this.escapeHtml(this.textValue)}</textarea>

              ${this.screenshotDataUrl?`
                <div class="maw-screenshot-preview">
                  <img src="${this.screenshotDataUrl}" alt="Annotated screenshot" />
                  <button type="button" class="maw-remove-shot" id="mawRemoveShotBtn" title="Remove screenshot">\u2715</button>
                </div>
              `:`
                <div class="maw-annotate-row">
                  <span style="font-size:12px;color:#64748b;">Highlight visual elements</span>
                  <button type="button" class="maw-annotate-btn" id="mawStartAnnotateBtn">
                    <svg style="width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;" viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>
                    Annotate page
                  </button>
                </div>
              `}

              ${this.errorMessage?`<div class="maw-error">${this.escapeHtml(this.errorMessage)}</div>`:""}

              <div class="maw-footer">
                <button
                  type="button"
                  class="maw-submit-btn"
                  id="mawSubmitBtn"
                  ${this.isSubmitting||!this.hasMeaningfulText()?"disabled":""}
                >
                  ${this.isSubmitting?"Submitting wish...":"Send wish \u2728"}
                </button>
              </div>
            `}
          </div>
        </div>
      `:""}
    `,this.bindEvents()}bindEvents(){let e=this.root.getElementById("mawLauncherBtn");e&&e.addEventListener("click",()=>{this.isOpen=!0,this.render()});let n=this.root.getElementById("mawCloseBtn");n&&n.addEventListener("click",()=>{this.isOpen=!1,this.render()});let i=this.root.getElementById("mawHeader"),o=this.root.querySelector(".maw-modal");i&&o&&i.addEventListener("pointerdown",c=>{if(c.target.closest("button")||c.button!==0)return;c.preventDefault();let h=o.getBoundingClientRect(),g=c.clientX,R=c.clientY,C=h.left,L=h.top;o.classList.add("is-dragging"),o.style.left=`${C}px`,o.style.top=`${L}px`,o.style.right="auto",o.style.bottom="auto",o.style.animation="none",this.modalPos={x:C,y:L};let b=w=>{let gt=w.clientX-g,xt=w.clientY-R,T=C+gt,$=L+xt,y=8,wt=Math.max(y,window.innerWidth-h.width-y),bt=Math.max(y,window.innerHeight-h.height-y);T=Math.max(y,Math.min(wt,T)),$=Math.max(y,Math.min(bt,$)),o.style.left=`${T}px`,o.style.top=`${$}px`,this.modalPos={x:T,y:$}},x=()=>{o.classList.remove("is-dragging"),window.removeEventListener("pointermove",b),window.removeEventListener("pointerup",x),window.removeEventListener("pointercancel",x)};window.addEventListener("pointermove",b),window.addEventListener("pointerup",x),window.addEventListener("pointercancel",x)}),this.root.querySelectorAll(".maw-chip").forEach(c=>{c.addEventListener("click",h=>{let g=h.currentTarget.getAttribute("data-category");this.selectedCategory=g,this.render()})});let a=this.root.getElementById("mawTextInput");a&&(this.shouldFocusTextarea&&(this.shouldFocusTextarea=!1,setTimeout(()=>{a.focus();let c=a.value.length;a.setSelectionRange(c,c)},50)),a.addEventListener("input",c=>{this.textValue=c.target.value;let h=this.root.getElementById("mawSubmitBtn");h&&(h.disabled=this.isSubmitting||!this.hasMeaningfulText())}));let s=this.root.getElementById("mawStartAnnotateBtn");s&&s.addEventListener("click",()=>{this.startAnnotationMode()});let l=this.root.getElementById("mawRemoveShotBtn");l&&l.addEventListener("click",()=>{this.screenshotDataUrl=null,this.annotations=[],this.textValue==="(1) "&&(this.textValue=""),this.render()});let u=this.root.getElementById("mawSubmitBtn");u&&u.addEventListener("click",()=>{this.submitFeedback()});let d=this.root.getElementById("mawResetBtn");d&&d.addEventListener("click",()=>{this.isDone=!1,this.textValue="",this.selectedCategory="Bug",this.selectedAgentMode=this.config.agentMode||"adk",this.annotations=[],this.screenshotDataUrl=null,this.errorMessage=null,this.render()})}startAnnotationMode(){this.isAnnotating=!0,this.textValue.trim()||(this.textValue="(1) "),this.render();let e=document.createElement("div");e.setAttribute("data-maw-chrome",""),e.style.position="fixed",e.style.inset="0",e.style.zIndex="2147483642",e.style.cursor="crosshair",e.style.background="rgba(15, 23, 42, 0.02)",document.body.appendChild(e),this.annotationOverlay=e;let n=document.createElement("div");if(n.setAttribute("data-maw-chrome",""),n.style.position="fixed",n.style.top="20px",n.style.right="20px",n.style.zIndex="2147483645",n.style.background="#1a1a2e",n.style.color="#ffffff",n.style.padding="8px 16px",n.style.borderRadius="9999px",n.style.border="1px solid rgba(229, 231, 235, 0.2)",n.style.display="flex",n.style.alignItems="center",n.style.gap="10px",n.style.boxShadow="0 10px 25px -3px rgba(0, 0, 0, 0.35)",n.style.fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif",n.style.fontSize="13px",n.style.cursor="grab",n.style.userSelect="none",n.style.touchAction="none",n.title="Drag to move",n.innerHTML=`
      <span style="display:inline-flex;align-items:center;color:#9ca3af;cursor:grab;" title="Drag to move">
        <svg viewBox="0 0 24 24" style="width:12px;height:12px;fill:currentColor;">
          <circle cx="8" cy="6" r="1.5" />
          <circle cx="16" cy="6" r="1.5" />
          <circle cx="8" cy="12" r="1.5" />
          <circle cx="16" cy="12" r="1.5" />
          <circle cx="8" cy="18" r="1.5" />
          <circle cx="16" cy="18" r="1.5" />
        </svg>
      </span>
      <span id="mawPillText">Click elements to pin (${this.annotations.length})</span>
      <button type="button" id="mawDoneAnnotateBtn" style="background:#d42955;color:#ffffff;border:none;padding:5px 14px;border-radius:9999px;font-family:'Inter',sans-serif;font-size:12px;font-weight:500;cursor:pointer;">Done</button>
      <button type="button" id="mawCancelAnnotateBtn" style="background:transparent;color:#9ca3af;border:none;padding:5px 8px;font-family:'Inter',sans-serif;font-size:12px;cursor:pointer;">Cancel</button>
    `,document.body.appendChild(n),this.annotationPill=n,n.addEventListener("pointerdown",a=>{if(a.target.closest("button")||a.button!==0)return;a.preventDefault(),n.style.cursor="grabbing";let s=n.getBoundingClientRect(),l=a.clientX,u=a.clientY,d=s.left,c=s.top;n.style.left=`${d}px`,n.style.top=`${c}px`,n.style.right="auto",n.style.bottom="auto";let h=R=>{let C=R.clientX-l,L=R.clientY-u,b=d+C,x=c+L,w=8;b=Math.max(w,Math.min(window.innerWidth-s.width-w,b)),x=Math.max(w,Math.min(window.innerHeight-s.height-w,x)),n.style.left=`${b}px`,n.style.top=`${x}px`},g=()=>{n.style.cursor="grab",window.removeEventListener("pointermove",h),window.removeEventListener("pointerup",g),window.removeEventListener("pointercancel",g)};window.addEventListener("pointermove",h),window.addEventListener("pointerup",g),window.addEventListener("pointercancel",g)}),!document.getElementById("maw-hover-style")){let a=document.createElement("style");a.id="maw-hover-style",a.innerHTML="[data-maw-hover] { outline: 2px solid #fc3165 !important; outline-offset: 2px !important; cursor: crosshair !important; }",document.head.appendChild(a)}let i=(a,s)=>{e.style.pointerEvents="none";let l=document.elementFromPoint(a,s);return e.style.pointerEvents="auto",!l||l.closest("[data-maw-chrome]")||l.closest("make-a-wish-widget")?null:l};e.onmousemove=a=>{let s=i(a.clientX,a.clientY);s!==this.hoveredElement&&(this.hoveredElement&&this.hoveredElement.removeAttribute("data-maw-hover"),s&&s.setAttribute("data-maw-hover",""),this.hoveredElement=s)},e.onclick=a=>{a.preventDefault(),a.stopPropagation();let s=i(a.clientX,a.clientY);if(!s)return;let l=s.getBoundingClientRect(),u={selector:ft(s),tag:s.tagName.toLowerCase(),hint:ht(s),text:pt(s),rect:{x:l.x,y:l.y,width:l.width,height:l.height}};this.annotations.push(u),this.renderPin(u,this.annotations.length);let d=n.querySelector("#mawPillText");d&&(d.textContent=`Click elements to pin (${this.annotations.length})`);let c=this.annotations.length;c===1?this.textValue.trim()?this.textValue.includes("(1)")||(this.textValue=this.textValue.trimEnd()+`
(1) `):this.textValue="(1) ":c>1&&(this.textValue.includes(`(${c})`)||(this.textValue=this.textValue.trimEnd()+`
(${c}) `))};let o=n.querySelector("#mawDoneAnnotateBtn");o&&o.addEventListener("click",async()=>{await this.finishAnnotation(!0)});let r=n.querySelector("#mawCancelAnnotateBtn");r&&r.addEventListener("click",async()=>{await this.finishAnnotation(!1)})}renderPin(e,n){let i=document.createElement("div");i.setAttribute("data-maw-chrome",""),i.style.position="fixed",i.style.left=`${e.rect.x}px`,i.style.top=`${e.rect.y}px`,i.style.width="24px",i.style.height="24px",i.style.borderRadius="9999px",i.style.background="#fc3165",i.style.color="#ffffff",i.style.fontFamily="'Inter', -apple-system, sans-serif",i.style.fontSize="12px",i.style.fontWeight="700",i.style.display="flex",i.style.alignItems="center",i.style.justifyContent="center",i.style.boxShadow="0 0 0 2px #ffffff, 0 4px 10px rgba(252, 49, 101, 0.4)",i.style.zIndex="2147483644",i.style.pointerEvents="none",i.textContent=String(n),document.body.appendChild(i),this.pinElements.push(i)}async finishAnnotation(e){if(this.hoveredElement&&(this.hoveredElement.removeAttribute("data-maw-hover"),this.hoveredElement=null),this.annotationOverlay&&(this.annotationOverlay.remove(),this.annotationOverlay=null),this.annotationPill&&(this.annotationPill.remove(),this.annotationPill=null),this.pinElements.forEach(n=>n.remove()),this.pinElements=[],e){let n=await q(this.annotations);if(this.screenshotDataUrl=n,this.annotations.length>0){this.textValue.trim()?this.textValue.includes("(1)")||(this.textValue=this.textValue.trimEnd()+`
(1) `):this.textValue="(1) ";for(let i=2;i<=this.annotations.length;i++)this.textValue.includes(`(${i})`)||(this.textValue=this.textValue.trimEnd()+`
(${i}) `)}this.shouldFocusTextarea=!0}else this.textValue==="(1) "&&(this.textValue=""),this.annotations=[];this.isAnnotating=!1,this.render()}async submitFeedback(){if(!this.hasMeaningfulText()||this.isSubmitting)return;this.isSubmitting=!0,this.errorMessage=null,this.render();let e=this.screenshotDataUrl;e||(e=await q(this.annotations),this.screenshotDataUrl=e);let n=this.config.repos&&this.config.repos.length>0?this.config.repos:this.config.repo?[this.config.repo]:[],i=n[0]||this.config.repo||"",o={appId:this.config.appId||"default-app",repo:i,repos:n,agentMode:this.selectedAgentMode,category:this.selectedCategory,text:this.textValue.trim(),annotations:this.annotations,screenshot:e,url:window.location.href,userAgent:navigator.userAgent,userEmail:this.config.userEmail||"",timestamp:new Date().toISOString()};try{let r=(this.config.apiUrl||window.location.origin).replace(/\/$/,""),a=await fetch(`${r}/api/feedback`,{method:"POST",headers:{"Content-Type":"application/json","X-Make-A-Wish-App":this.config.appId||"generic"},body:JSON.stringify(o)});if(!a.ok){let s=await a.text();throw new Error(`Submission failed (${a.status}): ${s.slice(0,150)}`)}this.isDone=!0,this.isSubmitting=!1,this.render()}catch(r){this.isSubmitting=!1,this.errorMessage=r instanceof Error?r.message:"Submission failed",this.render()}}escapeHtml(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}};var G=class extends HTMLElement{constructor(){super();this.ui=null;this.shadow=this.attachShadow({mode:"open"})}static get observedAttributes(){return["data-app","data-repo","data-repos","data-api","data-user","data-position","data-engine"]}connectedCallback(){let n=this.resolveConfig();this.ui=new U(this.shadow,n)}attributeChangedCallback(n,i,o){if(!this.ui)return;let r={};if(n==="data-app"&&(r.appId=o),n==="data-repo"||n==="data-repos"){let a=H(this.getAttribute("data-repos"),this.getAttribute("data-repo"));r.repos=a,r.repo=a[0]||""}n==="data-api"&&(r.apiUrl=o),n==="data-user"&&(r.userEmail=o),n==="data-position"&&(r.position=o),n==="data-engine"&&(r.agentMode=o),this.ui.updateConfig(r)}resolveConfig(){let n=H(this.getAttribute("data-repos"),this.getAttribute("data-repo"));return{appId:this.getAttribute("data-app")||"",repo:n[0]||"",repos:n,apiUrl:this.getAttribute("data-api")||window.location.origin,userEmail:this.getAttribute("data-user")||void 0,position:this.getAttribute("data-position")||"bottom-right",agentMode:this.getAttribute("data-engine")||"adk"}}};typeof window<"u"&&!customElements.get("make-a-wish-widget")&&customElements.define("make-a-wish-widget",G);function mt(){if(typeof document>"u")return;let t=document.currentScript||document.querySelector('script[src*="widget.js"]'),e=window.location.origin,n="",i="",o="",r="bottom-right";if(t){try{e=new URL(t.src,window.location.href).origin}catch{e=window.location.origin}n=t.getAttribute("data-app")||"";let a=t.getAttribute("data-repos"),s=t.getAttribute("data-repo"),l=H(a,s);i=t.getAttribute("data-api")||e,o=t.getAttribute("data-user")||"";let u=t.getAttribute("data-engine"),d=t.getAttribute("data-position");if((d==="bottom-left"||d==="bottom-right")&&(r=d),document.querySelector("make-a-wish-widget"))return;let c=document.createElement("make-a-wish-widget");n&&c.setAttribute("data-app",n),l.length>0&&(c.setAttribute("data-repos",l.join(", ")),c.setAttribute("data-repo",l[0])),i&&c.setAttribute("data-api",i),o&&c.setAttribute("data-user",o),u&&c.setAttribute("data-engine",u),c.setAttribute("data-position",r),document.body.appendChild(c)}else if(!document.querySelector("make-a-wish-widget")){let a=document.createElement("make-a-wish-widget");document.body.appendChild(a)}}typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",mt):mt());})();
//# sourceMappingURL=widget.js.map
