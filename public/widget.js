"use strict";(()=>{function X(t,e){if(t.match(/^[a-z]+:\/\//i))return t;if(t.match(/^\/\//))return window.location.protocol+t;if(t.match(/^[a-z]+:/i))return t;let n=document.implementation.createHTMLDocument(),i=n.createElement("base"),o=n.createElement("a");return n.head.appendChild(i),n.body.appendChild(o),e&&(i.href=e),o.href=t,o.href}var Y=(()=>{let t=0,e=()=>`0000${(Math.random()*36**4<<0).toString(36)}`.slice(-4);return()=>(t+=1,`u${e()}${t}`)})();function g(t){let e=[];for(let n=0,i=t.length;n<i;n++)e.push(t[n]);return e}var E=null;function I(t={}){return E||(t.includeStyleProperties?(E=t.includeStyleProperties,E):(E=g(window.getComputedStyle(document.documentElement)),E))}function $(t,e){let i=(t.ownerDocument.defaultView||window).getComputedStyle(t).getPropertyValue(e);return i?parseFloat(i.replace("px","")):0}function vt(t){let e=$(t,"border-left-width"),n=$(t,"border-right-width");return t.clientWidth+e+n}function Et(t){let e=$(t,"border-top-width"),n=$(t,"border-bottom-width");return t.clientHeight+e+n}function F(t,e={}){let n=e.width||vt(t),i=e.height||Et(t);return{width:n,height:i}}function K(){let t,e;try{e=process}catch{}let n=e&&e.env?e.env.devicePixelRatio:null;return n&&(t=parseInt(n,10),Number.isNaN(t)&&(t=1)),t||window.devicePixelRatio||1}var m=16384;function J(t){(t.width>m||t.height>m)&&(t.width>m&&t.height>m?t.width>t.height?(t.height*=m/t.width,t.width=m):(t.width*=m/t.height,t.height=m):t.width>m?(t.height*=m/t.width,t.width=m):(t.width*=m/t.height,t.height=m))}function S(t){return new Promise((e,n)=>{let i=new Image;i.onload=()=>{i.decode().then(()=>{requestAnimationFrame(()=>e(i))})},i.onerror=n,i.crossOrigin="anonymous",i.decoding="async",i.src=t})}async function St(t){return Promise.resolve().then(()=>new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then(e=>`data:image/svg+xml;charset=utf-8,${e}`)}async function Q(t,e,n){let i="http://www.w3.org/2000/svg",o=document.createElementNS(i,"svg"),r=document.createElementNS(i,"foreignObject");return o.setAttribute("width",`${e}`),o.setAttribute("height",`${n}`),o.setAttribute("viewBox",`0 0 ${e} ${n}`),r.setAttribute("width","100%"),r.setAttribute("height","100%"),r.setAttribute("x","0"),r.setAttribute("y","0"),r.setAttribute("externalResourcesRequired","true"),o.appendChild(r),r.appendChild(t),St(o)}var h=(t,e)=>{if(t instanceof e)return!0;let n=Object.getPrototypeOf(t);return n===null?!1:n.constructor.name===e.name||h(n,e)};function Ct(t){let e=t.getPropertyValue("content");return`${t.cssText} content: '${e.replace(/'|"/g,"")}';`}function kt(t,e){return I(e).map(n=>{let i=t.getPropertyValue(n),o=t.getPropertyPriority(n);return`${n}: ${i}${o?" !important":""};`}).join(" ")}function At(t,e,n,i){let o=`.${t}:${e}`,r=n.cssText?Ct(n):kt(n,i);return document.createTextNode(`${o}{${r}}`)}function Z(t,e,n,i){let o=window.getComputedStyle(t,n),r=o.getPropertyValue("content");if(r===""||r==="none")return;let a=Y();try{e.className=`${e.className} ${a}`}catch{return}let s=document.createElement("style");s.appendChild(At(a,n,o,i)),e.appendChild(s)}function N(t,e,n){Z(t,e,":before",n),Z(t,e,":after",n)}var tt="application/font-woff",et="image/jpeg",Lt={woff:tt,woff2:tt,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:et,jpeg:et,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml",webp:"image/webp"};function Mt(t){let e=/\.([^./]*?)$/g.exec(t);return e?e[1]:""}function C(t){let e=Mt(t).toLowerCase();return Lt[e]||""}function Tt(t){return t.split(/,/)[1]}function M(t){return t.search(/^(data:)/)!==-1}function z(t,e){return`data:${e};base64,${t}`}async function O(t,e,n){let i=await fetch(t,e);if(i.status===404)throw new Error(`Resource "${i.url}" not found`);let o=await i.blob();return new Promise((r,a)=>{let s=new FileReader;s.onerror=a,s.onloadend=()=>{try{r(n({res:i,result:s.result}))}catch(l){a(l)}},s.readAsDataURL(o)})}var V={};function Pt(t,e,n){let i=t.replace(/\?.*/,"");return n&&(i=t),/ttf|otf|eot|woff2?/i.test(i)&&(i=i.replace(/.*\//,"")),e?`[${e}]${i}`:i}async function k(t,e,n){let i=Pt(t,e,n.includeQueryParams);if(V[i]!=null)return V[i];n.cacheBust&&(t+=(/\?/.test(t)?"&":"?")+new Date().getTime());let o;try{let r=await O(t,n.fetchRequestInit,({res:a,result:s})=>(e||(e=a.headers.get("Content-Type")||""),Tt(s)));o=z(r,e)}catch(r){o=n.imagePlaceholder||"";let a=`Failed to fetch resource: ${t}`;r&&(a=typeof r=="string"?r:r.message),a&&console.warn(a)}return V[i]=o,o}async function Rt(t){let e=t.toDataURL();return e==="data:,"?t.cloneNode(!1):S(e)}async function $t(t,e){if(t.currentSrc){let r=document.createElement("canvas"),a=r.getContext("2d");r.width=t.clientWidth,r.height=t.clientHeight,a?.drawImage(t,0,0,r.width,r.height);let s=r.toDataURL();return S(s)}let n=t.poster,i=C(n),o=await k(n,i,e);return S(o)}async function It(t,e){var n;try{if(!((n=t?.contentDocument)===null||n===void 0)&&n.body)return await T(t.contentDocument.body,e,!0)}catch{}return t.cloneNode(!1)}async function Bt(t,e){return h(t,HTMLCanvasElement)?Rt(t):h(t,HTMLVideoElement)?$t(t,e):h(t,HTMLIFrameElement)?It(t,e):t.cloneNode(nt(t))}var Dt=t=>t.tagName!=null&&t.tagName.toUpperCase()==="SLOT",nt=t=>t.tagName!=null&&t.tagName.toUpperCase()==="SVG";async function Ht(t,e,n){var i,o;if(nt(e))return e;let r=[];return Dt(t)&&t.assignedNodes?r=g(t.assignedNodes()):h(t,HTMLIFrameElement)&&(!((i=t.contentDocument)===null||i===void 0)&&i.body)?r=g(t.contentDocument.body.childNodes):r=g(((o=t.shadowRoot)!==null&&o!==void 0?o:t).childNodes),r.length===0||h(t,HTMLVideoElement)||await r.reduce((a,s)=>a.then(()=>T(s,n)).then(l=>{l&&e.appendChild(l)}),Promise.resolve()),e}function Ut(t,e,n){let i=e.style;if(!i)return;let o=window.getComputedStyle(t);o.cssText?(i.cssText=o.cssText,i.transformOrigin=o.transformOrigin):I(n).forEach(r=>{let a=o.getPropertyValue(r);r==="font-size"&&a.endsWith("px")&&(a=`${Math.floor(parseFloat(a.substring(0,a.length-2)))-.1}px`),h(t,HTMLIFrameElement)&&r==="display"&&a==="inline"&&(a="block"),r==="d"&&e.getAttribute("d")&&(a=`path(${e.getAttribute("d")})`),i.setProperty(r,a,o.getPropertyPriority(r))})}function Ft(t,e){h(t,HTMLTextAreaElement)&&(e.innerHTML=t.value),h(t,HTMLInputElement)&&e.setAttribute("value",t.value)}function Vt(t,e){if(h(t,HTMLSelectElement)){let i=Array.from(e.children).find(o=>t.value===o.getAttribute("value"));i&&i.setAttribute("selected","")}}function zt(t,e,n){return h(e,Element)&&(Ut(t,e,n),N(t,e,n),Ft(t,e),Vt(t,e)),e}async function Ot(t,e){let n=t.querySelectorAll?t.querySelectorAll("use"):[];if(n.length===0)return t;let i={};for(let r=0;r<n.length;r++){let s=n[r].getAttribute("xlink:href");if(s){let l=t.querySelector(s),c=document.querySelector(s);!l&&c&&!i[s]&&(i[s]=await T(c,e,!0))}}let o=Object.values(i);if(o.length){let r="http://www.w3.org/1999/xhtml",a=document.createElementNS(r,"svg");a.setAttribute("xmlns",r),a.style.position="absolute",a.style.width="0",a.style.height="0",a.style.overflow="hidden",a.style.display="none";let s=document.createElementNS(r,"defs");a.appendChild(s);for(let l=0;l<o.length;l++)s.appendChild(o[l]);t.appendChild(a)}return t}async function T(t,e,n){return!n&&e.filter&&!e.filter(t)?null:Promise.resolve(t).then(i=>Bt(i,e)).then(i=>Ht(t,i,e)).then(i=>zt(t,i,e)).then(i=>Ot(i,e))}var it=/url\((['"]?)([^'"]+?)\1\)/g,Wt=/url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,jt=/src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;function qt(t){let e=t.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1");return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`,"g")}function Gt(t){let e=[];return t.replace(it,(n,i,o)=>(e.push(o),n)),e.filter(n=>!M(n))}async function _t(t,e,n,i,o){try{let r=n?X(e,n):e,a=C(e),s;if(o){let l=await o(r);s=z(l,a)}else s=await k(r,a,i);return t.replace(qt(e),`$1${s}$3`)}catch{}return t}function Xt(t,{preferredFontFormat:e}){return e?t.replace(jt,n=>{for(;;){let[i,,o]=Wt.exec(n)||[];if(!o)return"";if(o===e)return`src: ${i};`}}):t}function W(t){return t.search(it)!==-1}async function B(t,e,n){if(!W(t))return t;let i=Xt(t,n);return Gt(i).reduce((r,a)=>r.then(s=>_t(s,a,e,n)),Promise.resolve(i))}async function A(t,e,n){var i;let o=(i=e.style)===null||i===void 0?void 0:i.getPropertyValue(t);if(o){let r=await B(o,null,n);return e.style.setProperty(t,r,e.style.getPropertyPriority(t)),!0}return!1}async function Yt(t,e){await A("background",t,e)||await A("background-image",t,e),await A("mask",t,e)||await A("-webkit-mask",t,e)||await A("mask-image",t,e)||await A("-webkit-mask-image",t,e)}async function Kt(t,e){let n=h(t,HTMLImageElement);if(!(n&&!M(t.src))&&!(h(t,SVGImageElement)&&!M(t.href.baseVal)))return;let i=n?t.src:t.href.baseVal,o=await k(i,C(i),e);await new Promise((r,a)=>{t.onload=r,t.onerror=e.onImageErrorHandler?(...l)=>{try{r(e.onImageErrorHandler(...l))}catch(c){a(c)}}:a;let s=t;s.decode&&(s.decode=r),s.loading==="lazy"&&(s.loading="eager"),n?(t.srcset="",t.src=o):t.href.baseVal=o})}async function Jt(t,e){let i=g(t.childNodes).map(o=>j(o,e));await Promise.all(i).then(()=>t)}async function j(t,e){h(t,Element)&&(await Yt(t,e),await Kt(t,e),await Jt(t,e))}function rt(t,e){let{style:n}=t;e.backgroundColor&&(n.backgroundColor=e.backgroundColor),e.width&&(n.width=`${e.width}px`),e.height&&(n.height=`${e.height}px`);let i=e.style;return i!=null&&Object.keys(i).forEach(o=>{n[o]=i[o]}),t}var ot={};async function at(t){let e=ot[t];if(e!=null)return e;let i=await(await fetch(t)).text();return e={url:t,cssText:i},ot[t]=e,e}async function st(t,e){let n=t.cssText,i=/url\(["']?([^"')]+)["']?\)/g,r=(n.match(/url\([^)]+\)/g)||[]).map(async a=>{let s=a.replace(i,"$1");return s.startsWith("https://")||(s=new URL(s,t.url).href),O(s,e.fetchRequestInit,({result:l})=>(n=n.replace(a,`url(${l})`),[a,l]))});return Promise.all(r).then(()=>n)}function lt(t){if(t==null)return[];let e=[],n=/(\/\*[\s\S]*?\*\/)/gi,i=t.replace(n,""),o=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi");for(;;){let l=o.exec(i);if(l===null)break;e.push(l[0])}i=i.replace(o,"");let r=/@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,a="((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",s=new RegExp(a,"gi");for(;;){let l=r.exec(i);if(l===null){if(l=s.exec(i),l===null)break;r.lastIndex=s.lastIndex}else s.lastIndex=r.lastIndex;e.push(l[0])}return e}async function Qt(t,e){let n=[],i=[];return t.forEach(o=>{if("cssRules"in o)try{g(o.cssRules||[]).forEach((r,a)=>{if(r.type===CSSRule.IMPORT_RULE){let s=a+1,l=r.href,c=at(l).then(d=>st(d,e)).then(d=>lt(d).forEach(u=>{try{o.insertRule(u,u.startsWith("@import")?s+=1:o.cssRules.length)}catch(f){console.error("Error inserting rule from remote css",{rule:u,error:f})}})).catch(d=>{console.error("Error loading remote css",d.toString())});i.push(c)}})}catch(r){let a=t.find(s=>s.href==null)||document.styleSheets[0];o.href!=null&&i.push(at(o.href).then(s=>st(s,e)).then(s=>lt(s).forEach(l=>{a.insertRule(l,a.cssRules.length)})).catch(s=>{console.error("Error loading remote stylesheet",s)})),console.error("Error inlining remote css file",r)}}),Promise.all(i).then(()=>(t.forEach(o=>{if("cssRules"in o)try{g(o.cssRules||[]).forEach(r=>{n.push(r)})}catch(r){console.error(`Error while reading CSS rules from ${o.href}`,r)}}),n))}function Zt(t){return t.filter(e=>e.type===CSSRule.FONT_FACE_RULE).filter(e=>W(e.style.getPropertyValue("src")))}async function Nt(t,e){if(t.ownerDocument==null)throw new Error("Provided element is not within a Document");let n=g(t.ownerDocument.styleSheets),i=await Qt(n,e);return Zt(i)}function ct(t){return t.trim().replace(/["']/g,"")}function te(t){let e=new Set;function n(i){(i.style.fontFamily||getComputedStyle(i).fontFamily).split(",").forEach(r=>{e.add(ct(r))}),Array.from(i.children).forEach(r=>{r instanceof HTMLElement&&n(r)})}return n(t),e}async function dt(t,e){let n=await Nt(t,e),i=te(t);return(await Promise.all(n.filter(r=>i.has(ct(r.style.fontFamily))).map(r=>{let a=r.parentStyleSheet?r.parentStyleSheet.href:null;return B(r.cssText,a,e)}))).join(`
`)}async function ut(t,e){let n=e.fontEmbedCSS!=null?e.fontEmbedCSS:e.skipFonts?null:await dt(t,e);if(n){let i=document.createElement("style"),o=document.createTextNode(n);i.appendChild(o),t.firstChild?t.insertBefore(i,t.firstChild):t.appendChild(i)}}async function ee(t,e={}){let{width:n,height:i}=F(t,e),o=await T(t,e,!0);return await ut(o,e),await j(o,e),rt(o,e),await Q(o,n,i)}async function ne(t,e={}){let{width:n,height:i}=F(t,e),o=await ee(t,e),r=await S(o),a=document.createElement("canvas"),s=a.getContext("2d"),l=e.pixelRatio||K(),c=e.canvasWidth||n,d=e.canvasHeight||i;return a.width=c*l,a.height=d*l,e.skipAutoScale||J(a),a.style.width=`${c}`,a.style.height=`${d}`,e.backgroundColor&&(s.fillStyle=e.backgroundColor,s.fillRect(0,0,a.width,a.height)),s.drawImage(r,0,0,a.width,a.height),a}async function ft(t,e={}){return(await ne(t,e)).toDataURL()}function pt(t){if(!t)return"";let e=[],n=t,i=0;for(;n&&n!==document.body&&n!==document.documentElement&&i<6;){let o=n;if(o.id){e.unshift(`#${o.id}`);break}let r=o.tagName.toLowerCase(),a=o.parentElement;if(a){let s=Array.from(a.children).filter(l=>l.tagName===o.tagName);if(s.length>1){let l=s.indexOf(o)+1;r+=`:nth-of-type(${l})`}}e.unshift(r),n=a,i++}return e.length===0?t.tagName.toLowerCase():e.join(" > ")}function ht(t){let e=t.id?`#${t.id}`:"",n="";return typeof t.className=="string"&&t.className.trim()&&(n="."+t.className.trim().split(/\s+/).slice(0,2).join(".")),(t.tagName.toLowerCase()+e+n).slice(0,80)}function mt(t,e=120){let n=(t.textContent||"").replace(/\s+/g," ").trim();return n.length<=e?n:n.slice(0,e-1).trimEnd()+"..."}async function q(t){try{document.querySelectorAll("[data-maw-hover]").forEach(s=>s.removeAttribute("data-maw-hover"));let e=document.documentElement,n=await ft(e,{backgroundColor:"#ffffff",width:e.scrollWidth,height:e.scrollHeight,filter:s=>!((s instanceof HTMLElement||s instanceof SVGElement)&&(s.hasAttribute("data-maw-chrome")||s.tagName.toLowerCase()==="make-a-wish-widget"||s.closest&&(s.closest("[data-maw-chrome]")||s.closest("make-a-wish-widget"))))});if(t.length===0)return n;let i=new Image;i.src=n,await new Promise((s,l)=>{i.onload=()=>s(),i.onerror=()=>l(new Error("failed to load screenshot image"))});let o=document.createElement("canvas");o.width=i.naturalWidth,o.height=i.naturalHeight;let r=o.getContext("2d");if(!r)return n;r.drawImage(i,0,0);let a=o.width/e.scrollWidth;return t.forEach((s,l)=>{let c=(s.rect.x+window.scrollX)*a,d=(s.rect.y+window.scrollY)*a,u=13*a;r.beginPath(),r.arc(c,d,u,0,Math.PI*2),r.fillStyle="#fc3165",r.fill(),r.strokeStyle="#ffffff",r.lineWidth=2*a,r.stroke(),r.fillStyle="#ffffff",r.font=`bold ${14*a}px "Inter", -apple-system, sans-serif`,r.textAlign="center",r.textBaseline="middle",r.fillText(String(l+1),c,d)}),o.toDataURL("image/png")}catch(e){return console.error("[make-a-wish] screenshot capture failed:",e),null}}function H(t,e){let n=[],i=o=>{if(!o)return;let r=o.trim();if(r){if(r.startsWith("[")&&r.endsWith("]"))try{let a=JSON.parse(r);if(Array.isArray(a)){for(let s of a)typeof s=="string"&&s.trim()&&n.push(s.trim());return}}catch{}for(let a of r.split(",")){let s=a.trim();s&&!n.includes(s)&&n.push(s)}}};return i(t),i(e),Array.from(new Set(n))}var ie=[{label:"Bug",emoji:"\u{1F41B}"},{label:"Idea",emoji:"\u{1F4A1}"},{label:"Question",emoji:"\u2753"},{label:"Praise",emoji:"\u2764\uFE0F"}],D=class{constructor(e,n){this.isOpen=!1;this.isAnnotating=!1;this.isSubmitting=!1;this.isDone=!1;this.selectedCategory="Bug";this.selectedAgentMode="both";this.textValue="";this.annotations=[];this.screenshotDataUrl=null;this.errorMessage=null;this.modalPos=null;this.shouldFocusTextarea=!1;this.annotationOverlay=null;this.annotationPill=null;this.hoveredElement=null;this.pinElements=[];this.root=e,this.config=n,window.addEventListener("resize",()=>{if(this.modalPos&&this.isOpen){let i=this.root.querySelector(".maw-modal");if(i){let o=i.getBoundingClientRect(),r=8,a=Math.max(r,window.innerWidth-o.width-r),s=Math.max(r,window.innerHeight-o.height-r);this.modalPos.x=Math.max(r,Math.min(a,this.modalPos.x)),this.modalPos.y=Math.max(r,Math.min(s,this.modalPos.y)),i.style.left=`${this.modalPos.x}px`,i.style.top=`${this.modalPos.y}px`}}}),this.render()}updateConfig(e){this.config={...this.config,...e},this.render()}hasMeaningfulText(){return this.textValue.replace(/\(\d+\)\s*/g,"").trim().length>0}render(){this.root.innerHTML=`
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
        .maw-engine-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 4px 8px;
        }
        .maw-engine-label {
          font-weight: 600;
          color: #64748b;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .maw-engine-chips {
          display: flex;
          gap: 4px;
        }
        .maw-engine-chip {
          display: inline-flex;
          align-items: center;
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 500;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .maw-engine-chip:hover {
          border-color: #94a3b8;
          color: #1e293b;
        }
        .maw-engine-chip.active {
          background: #4f46e5;
          color: #ffffff;
          border-color: #4f46e5;
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
                ${ie.map(e=>`
                  <button type="button" class="maw-chip ${this.selectedCategory===e.label?"active":""}" data-category="${e.label}">
                    <span>${e.emoji}</span>
                    ${e.label}
                  </button>
                `).join("")}
              </div>

              <div class="maw-engine-bar">
                <span class="maw-engine-label">Engine</span>
                <div class="maw-engine-chips">
                  <button type="button" class="maw-engine-chip ${this.selectedAgentMode==="both"?"active":""}" data-engine="both">
                    Dual (Both)
                  </button>
                  <button type="button" class="maw-engine-chip ${this.selectedAgentMode==="adk"?"active":""}" data-engine="adk">
                    ADK Only
                  </button>
                  <button type="button" class="maw-engine-chip ${this.selectedAgentMode==="managed-agent"?"active":""}" data-engine="managed-agent">
                    Managed Only
                  </button>
                </div>
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
    `,this.bindEvents()}bindEvents(){let e=this.root.getElementById("mawLauncherBtn");e&&e.addEventListener("click",()=>{this.isOpen=!0,this.render()});let n=this.root.getElementById("mawCloseBtn");n&&n.addEventListener("click",()=>{this.isOpen=!1,this.render()});let i=this.root.getElementById("mawHeader"),o=this.root.querySelector(".maw-modal");i&&o&&i.addEventListener("pointerdown",f=>{if(f.target.closest("button")||f.button!==0)return;f.preventDefault();let p=o.getBoundingClientRect(),x=f.clientX,U=f.clientY,L=p.left,b=p.top;o.classList.add("is-dragging"),o.style.left=`${L}px`,o.style.top=`${b}px`,o.style.right="auto",o.style.bottom="auto",o.style.animation="none",this.modalPos={x:L,y:b};let y=_=>{let xt=_.clientX-x,wt=_.clientY-U,P=L+xt,R=b+wt,v=8,bt=Math.max(v,window.innerWidth-p.width-v),yt=Math.max(v,window.innerHeight-p.height-v);P=Math.max(v,Math.min(bt,P)),R=Math.max(v,Math.min(yt,R)),o.style.left=`${P}px`,o.style.top=`${R}px`,this.modalPos={x:P,y:R}},w=()=>{o.classList.remove("is-dragging"),window.removeEventListener("pointermove",y),window.removeEventListener("pointerup",w),window.removeEventListener("pointercancel",w)};window.addEventListener("pointermove",y),window.addEventListener("pointerup",w),window.addEventListener("pointercancel",w)}),this.root.querySelectorAll(".maw-chip").forEach(f=>{f.addEventListener("click",p=>{let x=p.currentTarget.getAttribute("data-category");this.selectedCategory=x,this.render()})}),this.root.querySelectorAll(".maw-engine-chip").forEach(f=>{f.addEventListener("click",p=>{let x=p.currentTarget.getAttribute("data-engine");x&&(this.selectedAgentMode=x,this.render())})});let s=this.root.getElementById("mawTextInput");s&&(this.shouldFocusTextarea&&(this.shouldFocusTextarea=!1,setTimeout(()=>{s.focus();let f=s.value.length;s.setSelectionRange(f,f)},50)),s.addEventListener("input",f=>{this.textValue=f.target.value;let p=this.root.getElementById("mawSubmitBtn");p&&(p.disabled=this.isSubmitting||!this.hasMeaningfulText())}));let l=this.root.getElementById("mawStartAnnotateBtn");l&&l.addEventListener("click",()=>{this.startAnnotationMode()});let c=this.root.getElementById("mawRemoveShotBtn");c&&c.addEventListener("click",()=>{this.screenshotDataUrl=null,this.annotations=[],this.textValue==="(1) "&&(this.textValue=""),this.render()});let d=this.root.getElementById("mawSubmitBtn");d&&d.addEventListener("click",()=>{this.submitFeedback()});let u=this.root.getElementById("mawResetBtn");u&&u.addEventListener("click",()=>{this.isDone=!1,this.textValue="",this.selectedCategory="Bug",this.selectedAgentMode="both",this.annotations=[],this.screenshotDataUrl=null,this.errorMessage=null,this.render()})}startAnnotationMode(){this.isAnnotating=!0,this.textValue.trim()||(this.textValue="(1) "),this.render();let e=document.createElement("div");e.setAttribute("data-maw-chrome",""),e.style.position="fixed",e.style.inset="0",e.style.zIndex="2147483642",e.style.cursor="crosshair",e.style.background="rgba(15, 23, 42, 0.02)",document.body.appendChild(e),this.annotationOverlay=e;let n=document.createElement("div");if(n.setAttribute("data-maw-chrome",""),n.style.position="fixed",n.style.top="20px",n.style.right="20px",n.style.zIndex="2147483645",n.style.background="#1a1a2e",n.style.color="#ffffff",n.style.padding="8px 16px",n.style.borderRadius="9999px",n.style.border="1px solid rgba(229, 231, 235, 0.2)",n.style.display="flex",n.style.alignItems="center",n.style.gap="10px",n.style.boxShadow="0 10px 25px -3px rgba(0, 0, 0, 0.35)",n.style.fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif",n.style.fontSize="13px",n.style.cursor="grab",n.style.userSelect="none",n.style.touchAction="none",n.title="Drag to move",n.innerHTML=`
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
    `,document.body.appendChild(n),this.annotationPill=n,n.addEventListener("pointerdown",a=>{if(a.target.closest("button")||a.button!==0)return;a.preventDefault(),n.style.cursor="grabbing";let s=n.getBoundingClientRect(),l=a.clientX,c=a.clientY,d=s.left,u=s.top;n.style.left=`${d}px`,n.style.top=`${u}px`,n.style.right="auto",n.style.bottom="auto";let f=x=>{let U=x.clientX-l,L=x.clientY-c,b=d+U,y=u+L,w=8;b=Math.max(w,Math.min(window.innerWidth-s.width-w,b)),y=Math.max(w,Math.min(window.innerHeight-s.height-w,y)),n.style.left=`${b}px`,n.style.top=`${y}px`},p=()=>{n.style.cursor="grab",window.removeEventListener("pointermove",f),window.removeEventListener("pointerup",p),window.removeEventListener("pointercancel",p)};window.addEventListener("pointermove",f),window.addEventListener("pointerup",p),window.addEventListener("pointercancel",p)}),!document.getElementById("maw-hover-style")){let a=document.createElement("style");a.id="maw-hover-style",a.innerHTML="[data-maw-hover] { outline: 2px solid #fc3165 !important; outline-offset: 2px !important; cursor: crosshair !important; }",document.head.appendChild(a)}let i=(a,s)=>{e.style.pointerEvents="none";let l=document.elementFromPoint(a,s);return e.style.pointerEvents="auto",!l||l.closest("[data-maw-chrome]")||l.closest("make-a-wish-widget")?null:l};e.onmousemove=a=>{let s=i(a.clientX,a.clientY);s!==this.hoveredElement&&(this.hoveredElement&&this.hoveredElement.removeAttribute("data-maw-hover"),s&&s.setAttribute("data-maw-hover",""),this.hoveredElement=s)},e.onclick=a=>{a.preventDefault(),a.stopPropagation();let s=i(a.clientX,a.clientY);if(!s)return;let l=s.getBoundingClientRect(),c={selector:pt(s),tag:s.tagName.toLowerCase(),hint:ht(s),text:mt(s),rect:{x:l.x,y:l.y,width:l.width,height:l.height}};this.annotations.push(c),this.renderPin(c,this.annotations.length);let d=n.querySelector("#mawPillText");d&&(d.textContent=`Click elements to pin (${this.annotations.length})`);let u=this.annotations.length;u===1?this.textValue.trim()?this.textValue.includes("(1)")||(this.textValue=this.textValue.trimEnd()+`
(1) `):this.textValue="(1) ":u>1&&(this.textValue.includes(`(${u})`)||(this.textValue=this.textValue.trimEnd()+`
(${u}) `))};let o=n.querySelector("#mawDoneAnnotateBtn");o&&o.addEventListener("click",async()=>{await this.finishAnnotation(!0)});let r=n.querySelector("#mawCancelAnnotateBtn");r&&r.addEventListener("click",async()=>{await this.finishAnnotation(!1)})}renderPin(e,n){let i=document.createElement("div");i.setAttribute("data-maw-chrome",""),i.style.position="fixed",i.style.left=`${e.rect.x}px`,i.style.top=`${e.rect.y}px`,i.style.width="24px",i.style.height="24px",i.style.borderRadius="9999px",i.style.background="#fc3165",i.style.color="#ffffff",i.style.fontFamily="'Inter', -apple-system, sans-serif",i.style.fontSize="12px",i.style.fontWeight="700",i.style.display="flex",i.style.alignItems="center",i.style.justifyContent="center",i.style.boxShadow="0 0 0 2px #ffffff, 0 4px 10px rgba(252, 49, 101, 0.4)",i.style.zIndex="2147483644",i.style.pointerEvents="none",i.textContent=String(n),document.body.appendChild(i),this.pinElements.push(i)}async finishAnnotation(e){if(this.hoveredElement&&(this.hoveredElement.removeAttribute("data-maw-hover"),this.hoveredElement=null),this.annotationOverlay&&(this.annotationOverlay.remove(),this.annotationOverlay=null),this.annotationPill&&(this.annotationPill.remove(),this.annotationPill=null),this.pinElements.forEach(n=>n.remove()),this.pinElements=[],e){let n=await q(this.annotations);if(this.screenshotDataUrl=n,this.annotations.length>0){this.textValue.trim()?this.textValue.includes("(1)")||(this.textValue=this.textValue.trimEnd()+`
(1) `):this.textValue="(1) ";for(let i=2;i<=this.annotations.length;i++)this.textValue.includes(`(${i})`)||(this.textValue=this.textValue.trimEnd()+`
(${i}) `)}this.shouldFocusTextarea=!0}else this.textValue==="(1) "&&(this.textValue=""),this.annotations=[];this.isAnnotating=!1,this.render()}async submitFeedback(){if(!this.hasMeaningfulText()||this.isSubmitting)return;this.isSubmitting=!0,this.errorMessage=null,this.render();let e=this.screenshotDataUrl;e||(e=await q(this.annotations),this.screenshotDataUrl=e);let n=this.config.repos&&this.config.repos.length>0?this.config.repos:this.config.repo?[this.config.repo]:[],i=n[0]||this.config.repo||"",o={appId:this.config.appId||"default-app",repo:i,repos:n,agentMode:this.selectedAgentMode,category:this.selectedCategory,text:this.textValue.trim(),annotations:this.annotations,screenshot:e,url:window.location.href,userAgent:navigator.userAgent,userEmail:this.config.userEmail||"",timestamp:new Date().toISOString()};try{let r=(this.config.apiUrl||window.location.origin).replace(/\/$/,""),a=await fetch(`${r}/api/feedback`,{method:"POST",headers:{"Content-Type":"application/json","X-Make-A-Wish-App":this.config.appId||"generic"},body:JSON.stringify(o)});if(!a.ok){let s=await a.text();throw new Error(`Submission failed (${a.status}): ${s.slice(0,150)}`)}this.isDone=!0,this.isSubmitting=!1,this.render()}catch(r){this.isSubmitting=!1,this.errorMessage=r instanceof Error?r.message:"Submission failed",this.render()}}escapeHtml(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}};var G=class extends HTMLElement{constructor(){super();this.ui=null;this.shadow=this.attachShadow({mode:"open"})}static get observedAttributes(){return["data-app","data-repo","data-repos","data-api","data-user","data-position"]}connectedCallback(){let n=this.resolveConfig();this.ui=new D(this.shadow,n)}attributeChangedCallback(n,i,o){if(!this.ui)return;let r={};if(n==="data-app"&&(r.appId=o),n==="data-repo"||n==="data-repos"){let a=H(this.getAttribute("data-repos"),this.getAttribute("data-repo"));r.repos=a,r.repo=a[0]||""}n==="data-api"&&(r.apiUrl=o),n==="data-user"&&(r.userEmail=o),n==="data-position"&&(r.position=o),this.ui.updateConfig(r)}resolveConfig(){let n=H(this.getAttribute("data-repos"),this.getAttribute("data-repo"));return{appId:this.getAttribute("data-app")||"",repo:n[0]||"",repos:n,apiUrl:this.getAttribute("data-api")||window.location.origin,userEmail:this.getAttribute("data-user")||void 0,position:this.getAttribute("data-position")||"bottom-right"}}};typeof window<"u"&&!customElements.get("make-a-wish-widget")&&customElements.define("make-a-wish-widget",G);function gt(){if(typeof document>"u")return;let t=document.currentScript||document.querySelector('script[src*="widget.js"]'),e=window.location.origin,n="",i="",o="",r="",a="bottom-right";if(t){try{e=new URL(t.src,window.location.href).origin}catch{e=window.location.origin}n=t.getAttribute("data-app")||"";let s=t.getAttribute("data-repos"),l=t.getAttribute("data-repo"),c=H(s,l);o=t.getAttribute("data-api")||e,r=t.getAttribute("data-user")||"";let d=t.getAttribute("data-position");if((d==="bottom-left"||d==="bottom-right")&&(a=d),document.querySelector("make-a-wish-widget"))return;let u=document.createElement("make-a-wish-widget");n&&u.setAttribute("data-app",n),c.length>0&&(u.setAttribute("data-repos",c.join(", ")),u.setAttribute("data-repo",c[0])),o&&u.setAttribute("data-api",o),r&&u.setAttribute("data-user",r),u.setAttribute("data-position",a),document.body.appendChild(u)}else if(!document.querySelector("make-a-wish-widget")){let s=document.createElement("make-a-wish-widget");document.body.appendChild(s)}}typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",gt):gt());})();
//# sourceMappingURL=widget.js.map
