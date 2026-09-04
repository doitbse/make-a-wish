"use strict";(()=>{function X(t,e){if(t.match(/^[a-z]+:\/\//i))return t;if(t.match(/^\/\//))return window.location.protocol+t;if(t.match(/^[a-z]+:/i))return t;let n=document.implementation.createHTMLDocument(),r=n.createElement("base"),o=n.createElement("a");return n.head.appendChild(r),n.body.appendChild(o),e&&(r.href=e),o.href=t,o.href}var G=(()=>{let t=0,e=()=>`0000${(Math.random()*36**4<<0).toString(36)}`.slice(-4);return()=>(t+=1,`u${e()}${t}`)})();function h(t){let e=[];for(let n=0,r=t.length;n<r;n++)e.push(t[n]);return e}var v=null;function B(t={}){return v||(t.includeStyleProperties?(v=t.includeStyleProperties,v):(v=h(window.getComputedStyle(document.documentElement)),v))}function M(t,e){let r=(t.ownerDocument.defaultView||window).getComputedStyle(t).getPropertyValue(e);return r?parseFloat(r.replace("px","")):0}function yt(t){let e=M(t,"border-left-width"),n=M(t,"border-right-width");return t.clientWidth+e+n}function vt(t){let e=M(t,"border-top-width"),n=M(t,"border-bottom-width");return t.clientHeight+e+n}function F(t,e={}){let n=e.width||yt(t),r=e.height||vt(t);return{width:n,height:r}}function Y(){let t,e;try{e=process}catch{}let n=e&&e.env?e.env.devicePixelRatio:null;return n&&(t=parseInt(n,10),Number.isNaN(t)&&(t=1)),t||window.devicePixelRatio||1}var m=16384;function J(t){(t.width>m||t.height>m)&&(t.width>m&&t.height>m?t.width>t.height?(t.height*=m/t.width,t.width=m):(t.width*=m/t.height,t.height=m):t.width>m?(t.height*=m/t.width,t.width=m):(t.width*=m/t.height,t.height=m))}function E(t){return new Promise((e,n)=>{let r=new Image;r.onload=()=>{r.decode().then(()=>{requestAnimationFrame(()=>e(r))})},r.onerror=n,r.crossOrigin="anonymous",r.decoding="async",r.src=t})}async function Et(t){return Promise.resolve().then(()=>new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then(e=>`data:image/svg+xml;charset=utf-8,${e}`)}async function Q(t,e,n){let r="http://www.w3.org/2000/svg",o=document.createElementNS(r,"svg"),i=document.createElementNS(r,"foreignObject");return o.setAttribute("width",`${e}`),o.setAttribute("height",`${n}`),o.setAttribute("viewBox",`0 0 ${e} ${n}`),i.setAttribute("width","100%"),i.setAttribute("height","100%"),i.setAttribute("x","0"),i.setAttribute("y","0"),i.setAttribute("externalResourcesRequired","true"),o.appendChild(i),i.appendChild(t),Et(o)}var p=(t,e)=>{if(t instanceof e)return!0;let n=Object.getPrototypeOf(t);return n===null?!1:n.constructor.name===e.name||p(n,e)};function St(t){let e=t.getPropertyValue("content");return`${t.cssText} content: '${e.replace(/'|"/g,"")}';`}function Ct(t,e){return B(e).map(n=>{let r=t.getPropertyValue(n),o=t.getPropertyPriority(n);return`${n}: ${r}${o?" !important":""};`}).join(" ")}function kt(t,e,n,r){let o=`.${t}:${e}`,i=n.cssText?St(n):Ct(n,r);return document.createTextNode(`${o}{${i}}`)}function K(t,e,n,r){let o=window.getComputedStyle(t,n),i=o.getPropertyValue("content");if(i===""||i==="none")return;let a=G();try{e.className=`${e.className} ${a}`}catch{return}let s=document.createElement("style");s.appendChild(kt(a,n,o,r)),e.appendChild(s)}function Z(t,e,n){K(t,e,":before",n),K(t,e,":after",n)}var N="application/font-woff",tt="image/jpeg",Lt={woff:N,woff2:N,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:tt,jpeg:tt,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml",webp:"image/webp"};function At(t){let e=/\.([^./]*?)$/g.exec(t);return e?e[1]:""}function S(t){let e=At(t).toLowerCase();return Lt[e]||""}function Pt(t){return t.split(/,/)[1]}function P(t){return t.search(/^(data:)/)!==-1}function O(t,e){return`data:${e};base64,${t}`}async function W(t,e,n){let r=await fetch(t,e);if(r.status===404)throw new Error(`Resource "${r.url}" not found`);let o=await r.blob();return new Promise((i,a)=>{let s=new FileReader;s.onerror=a,s.onloadend=()=>{try{i(n({res:r,result:s.result}))}catch(l){a(l)}},s.readAsDataURL(o)})}var z={};function Rt(t,e,n){let r=t.replace(/\?.*/,"");return n&&(r=t),/ttf|otf|eot|woff2?/i.test(r)&&(r=r.replace(/.*\//,"")),e?`[${e}]${r}`:r}async function C(t,e,n){let r=Rt(t,e,n.includeQueryParams);if(z[r]!=null)return z[r];n.cacheBust&&(t+=(/\?/.test(t)?"&":"?")+new Date().getTime());let o;try{let i=await W(t,n.fetchRequestInit,({res:a,result:s})=>(e||(e=a.headers.get("Content-Type")||""),Pt(s)));o=O(i,e)}catch(i){o=n.imagePlaceholder||"";let a=`Failed to fetch resource: ${t}`;i&&(a=typeof i=="string"?i:i.message),a&&console.warn(a)}return z[r]=o,o}async function It(t){let e=t.toDataURL();return e==="data:,"?t.cloneNode(!1):E(e)}async function Tt(t,e){if(t.currentSrc){let i=document.createElement("canvas"),a=i.getContext("2d");i.width=t.clientWidth,i.height=t.clientHeight,a?.drawImage(t,0,0,i.width,i.height);let s=i.toDataURL();return E(s)}let n=t.poster,r=S(n),o=await C(n,r,e);return E(o)}async function $t(t,e){var n;try{if(!((n=t?.contentDocument)===null||n===void 0)&&n.body)return await R(t.contentDocument.body,e,!0)}catch{}return t.cloneNode(!1)}async function Mt(t,e){return p(t,HTMLCanvasElement)?It(t):p(t,HTMLVideoElement)?Tt(t,e):p(t,HTMLIFrameElement)?$t(t,e):t.cloneNode(et(t))}var Bt=t=>t.tagName!=null&&t.tagName.toUpperCase()==="SLOT",et=t=>t.tagName!=null&&t.tagName.toUpperCase()==="SVG";async function Dt(t,e,n){var r,o;if(et(e))return e;let i=[];return Bt(t)&&t.assignedNodes?i=h(t.assignedNodes()):p(t,HTMLIFrameElement)&&(!((r=t.contentDocument)===null||r===void 0)&&r.body)?i=h(t.contentDocument.body.childNodes):i=h(((o=t.shadowRoot)!==null&&o!==void 0?o:t).childNodes),i.length===0||p(t,HTMLVideoElement)||await i.reduce((a,s)=>a.then(()=>R(s,n)).then(l=>{l&&e.appendChild(l)}),Promise.resolve()),e}function Ut(t,e,n){let r=e.style;if(!r)return;let o=window.getComputedStyle(t);o.cssText?(r.cssText=o.cssText,r.transformOrigin=o.transformOrigin):B(n).forEach(i=>{let a=o.getPropertyValue(i);i==="font-size"&&a.endsWith("px")&&(a=`${Math.floor(parseFloat(a.substring(0,a.length-2)))-.1}px`),p(t,HTMLIFrameElement)&&i==="display"&&a==="inline"&&(a="block"),i==="d"&&e.getAttribute("d")&&(a=`path(${e.getAttribute("d")})`),r.setProperty(i,a,o.getPropertyPriority(i))})}function Ht(t,e){p(t,HTMLTextAreaElement)&&(e.innerHTML=t.value),p(t,HTMLInputElement)&&e.setAttribute("value",t.value)}function Ft(t,e){if(p(t,HTMLSelectElement)){let r=Array.from(e.children).find(o=>t.value===o.getAttribute("value"));r&&r.setAttribute("selected","")}}function zt(t,e,n){return p(e,Element)&&(Ut(t,e,n),Z(t,e,n),Ht(t,e),Ft(t,e)),e}async function Ot(t,e){let n=t.querySelectorAll?t.querySelectorAll("use"):[];if(n.length===0)return t;let r={};for(let i=0;i<n.length;i++){let s=n[i].getAttribute("xlink:href");if(s){let l=t.querySelector(s),d=document.querySelector(s);!l&&d&&!r[s]&&(r[s]=await R(d,e,!0))}}let o=Object.values(r);if(o.length){let i="http://www.w3.org/1999/xhtml",a=document.createElementNS(i,"svg");a.setAttribute("xmlns",i),a.style.position="absolute",a.style.width="0",a.style.height="0",a.style.overflow="hidden",a.style.display="none";let s=document.createElementNS(i,"defs");a.appendChild(s);for(let l=0;l<o.length;l++)s.appendChild(o[l]);t.appendChild(a)}return t}async function R(t,e,n){return!n&&e.filter&&!e.filter(t)?null:Promise.resolve(t).then(r=>Mt(r,e)).then(r=>Dt(t,r,e)).then(r=>zt(t,r,e)).then(r=>Ot(r,e))}var nt=/url\((['"]?)([^'"]+?)\1\)/g,Wt=/url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,jt=/src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;function Vt(t){let e=t.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1");return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`,"g")}function qt(t){let e=[];return t.replace(nt,(n,r,o)=>(e.push(o),n)),e.filter(n=>!P(n))}async function _t(t,e,n,r,o){try{let i=n?X(e,n):e,a=S(e),s;if(o){let l=await o(i);s=O(l,a)}else s=await C(i,a,r);return t.replace(Vt(e),`$1${s}$3`)}catch{}return t}function Xt(t,{preferredFontFormat:e}){return e?t.replace(jt,n=>{for(;;){let[r,,o]=Wt.exec(n)||[];if(!o)return"";if(o===e)return`src: ${r};`}}):t}function j(t){return t.search(nt)!==-1}async function D(t,e,n){if(!j(t))return t;let r=Xt(t,n);return qt(r).reduce((i,a)=>i.then(s=>_t(s,a,e,n)),Promise.resolve(r))}async function k(t,e,n){var r;let o=(r=e.style)===null||r===void 0?void 0:r.getPropertyValue(t);if(o){let i=await D(o,null,n);return e.style.setProperty(t,i,e.style.getPropertyPriority(t)),!0}return!1}async function Gt(t,e){await k("background",t,e)||await k("background-image",t,e),await k("mask",t,e)||await k("-webkit-mask",t,e)||await k("mask-image",t,e)||await k("-webkit-mask-image",t,e)}async function Yt(t,e){let n=p(t,HTMLImageElement);if(!(n&&!P(t.src))&&!(p(t,SVGImageElement)&&!P(t.href.baseVal)))return;let r=n?t.src:t.href.baseVal,o=await C(r,S(r),e);await new Promise((i,a)=>{t.onload=i,t.onerror=e.onImageErrorHandler?(...l)=>{try{i(e.onImageErrorHandler(...l))}catch(d){a(d)}}:a;let s=t;s.decode&&(s.decode=i),s.loading==="lazy"&&(s.loading="eager"),n?(t.srcset="",t.src=o):t.href.baseVal=o})}async function Jt(t,e){let r=h(t.childNodes).map(o=>V(o,e));await Promise.all(r).then(()=>t)}async function V(t,e){p(t,Element)&&(await Gt(t,e),await Yt(t,e),await Jt(t,e))}function rt(t,e){let{style:n}=t;e.backgroundColor&&(n.backgroundColor=e.backgroundColor),e.width&&(n.width=`${e.width}px`),e.height&&(n.height=`${e.height}px`);let r=e.style;return r!=null&&Object.keys(r).forEach(o=>{n[o]=r[o]}),t}var it={};async function ot(t){let e=it[t];if(e!=null)return e;let r=await(await fetch(t)).text();return e={url:t,cssText:r},it[t]=e,e}async function at(t,e){let n=t.cssText,r=/url\(["']?([^"')]+)["']?\)/g,i=(n.match(/url\([^)]+\)/g)||[]).map(async a=>{let s=a.replace(r,"$1");return s.startsWith("https://")||(s=new URL(s,t.url).href),W(s,e.fetchRequestInit,({result:l})=>(n=n.replace(a,`url(${l})`),[a,l]))});return Promise.all(i).then(()=>n)}function st(t){if(t==null)return[];let e=[],n=/(\/\*[\s\S]*?\*\/)/gi,r=t.replace(n,""),o=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi");for(;;){let l=o.exec(r);if(l===null)break;e.push(l[0])}r=r.replace(o,"");let i=/@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,a="((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",s=new RegExp(a,"gi");for(;;){let l=i.exec(r);if(l===null){if(l=s.exec(r),l===null)break;i.lastIndex=s.lastIndex}else s.lastIndex=i.lastIndex;e.push(l[0])}return e}async function Qt(t,e){let n=[],r=[];return t.forEach(o=>{if("cssRules"in o)try{h(o.cssRules||[]).forEach((i,a)=>{if(i.type===CSSRule.IMPORT_RULE){let s=a+1,l=i.href,d=ot(l).then(u=>at(u,e)).then(u=>st(u).forEach(c=>{try{o.insertRule(c,c.startsWith("@import")?s+=1:o.cssRules.length)}catch(f){console.error("Error inserting rule from remote css",{rule:c,error:f})}})).catch(u=>{console.error("Error loading remote css",u.toString())});r.push(d)}})}catch(i){let a=t.find(s=>s.href==null)||document.styleSheets[0];o.href!=null&&r.push(ot(o.href).then(s=>at(s,e)).then(s=>st(s).forEach(l=>{a.insertRule(l,a.cssRules.length)})).catch(s=>{console.error("Error loading remote stylesheet",s)})),console.error("Error inlining remote css file",i)}}),Promise.all(r).then(()=>(t.forEach(o=>{if("cssRules"in o)try{h(o.cssRules||[]).forEach(i=>{n.push(i)})}catch(i){console.error(`Error while reading CSS rules from ${o.href}`,i)}}),n))}function Kt(t){return t.filter(e=>e.type===CSSRule.FONT_FACE_RULE).filter(e=>j(e.style.getPropertyValue("src")))}async function Zt(t,e){if(t.ownerDocument==null)throw new Error("Provided element is not within a Document");let n=h(t.ownerDocument.styleSheets),r=await Qt(n,e);return Kt(r)}function lt(t){return t.trim().replace(/["']/g,"")}function Nt(t){let e=new Set;function n(r){(r.style.fontFamily||getComputedStyle(r).fontFamily).split(",").forEach(i=>{e.add(lt(i))}),Array.from(r.children).forEach(i=>{i instanceof HTMLElement&&n(i)})}return n(t),e}async function ct(t,e){let n=await Zt(t,e),r=Nt(t);return(await Promise.all(n.filter(i=>r.has(lt(i.style.fontFamily))).map(i=>{let a=i.parentStyleSheet?i.parentStyleSheet.href:null;return D(i.cssText,a,e)}))).join(`
`)}async function dt(t,e){let n=e.fontEmbedCSS!=null?e.fontEmbedCSS:e.skipFonts?null:await ct(t,e);if(n){let r=document.createElement("style"),o=document.createTextNode(n);r.appendChild(o),t.firstChild?t.insertBefore(r,t.firstChild):t.appendChild(r)}}async function te(t,e={}){let{width:n,height:r}=F(t,e),o=await R(t,e,!0);return await dt(o,e),await V(o,e),rt(o,e),await Q(o,n,r)}async function ee(t,e={}){let{width:n,height:r}=F(t,e),o=await te(t,e),i=await E(o),a=document.createElement("canvas"),s=a.getContext("2d"),l=e.pixelRatio||Y(),d=e.canvasWidth||n,u=e.canvasHeight||r;return a.width=d*l,a.height=u*l,e.skipAutoScale||J(a),a.style.width=`${d}`,a.style.height=`${u}`,e.backgroundColor&&(s.fillStyle=e.backgroundColor,s.fillRect(0,0,a.width,a.height)),s.drawImage(i,0,0,a.width,a.height),a}async function ut(t,e={}){return(await ee(t,e)).toDataURL()}function pt(t){if(!t)return"";let e=[],n=t,r=0;for(;n&&n!==document.body&&n!==document.documentElement&&r<6;){let o=n;if(o.id){e.unshift(`#${o.id}`);break}let i=o.tagName.toLowerCase(),a=o.parentElement;if(a){let s=Array.from(a.children).filter(l=>l.tagName===o.tagName);if(s.length>1){let l=s.indexOf(o)+1;i+=`:nth-of-type(${l})`}}e.unshift(i),n=a,r++}return e.length===0?t.tagName.toLowerCase():e.join(" > ")}function ft(t){let e=t.id?`#${t.id}`:"",n="";return typeof t.className=="string"&&t.className.trim()&&(n="."+t.className.trim().split(/\s+/).slice(0,2).join(".")),(t.tagName.toLowerCase()+e+n).slice(0,80)}function mt(t,e=120){let n=(t.textContent||"").replace(/\s+/g," ").trim();return n.length<=e?n:n.slice(0,e-1).trimEnd()+"..."}async function q(t){try{document.querySelectorAll("[data-maw-hover]").forEach(s=>s.removeAttribute("data-maw-hover"));let e=document.documentElement,n=await ut(e,{backgroundColor:"#ffffff",width:e.scrollWidth,height:e.scrollHeight,filter:s=>!((s instanceof HTMLElement||s instanceof SVGElement)&&(s.hasAttribute("data-maw-chrome")||s.tagName.toLowerCase()==="make-a-wish-widget"||s.closest&&(s.closest("[data-maw-chrome]")||s.closest("make-a-wish-widget"))))});if(t.length===0)return n;let r=new Image;r.src=n,await new Promise((s,l)=>{r.onload=()=>s(),r.onerror=()=>l(new Error("failed to load screenshot image"))});let o=document.createElement("canvas");o.width=r.naturalWidth,o.height=r.naturalHeight;let i=o.getContext("2d");if(!i)return n;i.drawImage(r,0,0);let a=o.width/e.scrollWidth;return t.forEach((s,l)=>{let d=(s.rect.x+window.scrollX)*a,u=(s.rect.y+window.scrollY)*a,c=13*a;i.beginPath(),i.arc(d,u,c,0,Math.PI*2),i.fillStyle="#fc3165",i.fill(),i.strokeStyle="#ffffff",i.lineWidth=2*a,i.stroke(),i.fillStyle="#ffffff",i.font=`bold ${14*a}px "Inter", -apple-system, sans-serif`,i.textAlign="center",i.textBaseline="middle",i.fillText(String(l+1),d,u)}),o.toDataURL("image/png")}catch(e){return console.error("[make-a-wish] screenshot capture failed:",e),null}}function H(t,e){let n=[],r=o=>{if(!o)return;let i=o.trim();if(i){if(i.startsWith("[")&&i.endsWith("]"))try{let a=JSON.parse(i);if(Array.isArray(a)){for(let s of a)typeof s=="string"&&s.trim()&&n.push(s.trim());return}}catch{}for(let a of i.split(",")){let s=a.trim();s&&!n.includes(s)&&n.push(s)}}};return r(t),r(e),Array.from(new Set(n))}var ne=[{label:"Bug",emoji:"\u{1F41B}"},{label:"Idea",emoji:"\u{1F4A1}"},{label:"Question",emoji:"\u2753"},{label:"Praise",emoji:"\u2764\uFE0F"}],U=class{constructor(e,n){this.isOpen=!1;this.isAnnotating=!1;this.isSubmitting=!1;this.isDone=!1;this.selectedCategory="Bug";this.textValue="";this.annotations=[];this.screenshotDataUrl=null;this.errorMessage=null;this.modalPos=null;this.annotationOverlay=null;this.annotationPill=null;this.hoveredElement=null;this.pinElements=[];this.root=e,this.config=n,window.addEventListener("resize",()=>{if(this.modalPos&&this.isOpen){let r=this.root.querySelector(".maw-modal");if(r){let o=r.getBoundingClientRect(),i=8,a=Math.max(i,window.innerWidth-o.width-i),s=Math.max(i,window.innerHeight-o.height-i);this.modalPos.x=Math.max(i,Math.min(a,this.modalPos.x)),this.modalPos.y=Math.max(i,Math.min(s,this.modalPos.y)),r.style.left=`${this.modalPos.x}px`,r.style.top=`${this.modalPos.y}px`}}}),this.render()}updateConfig(e){this.config={...this.config,...e},this.render()}render(){this.root.innerHTML=`
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
                  Our autonomous triage agent will inspect the request, test the code, and open a pull request on GitHub.
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
                  ${this.isSubmitting||!this.textValue.trim()?"disabled":""}
                >
                  ${this.isSubmitting?"Submitting wish...":"Send wish \u2728"}
                </button>
              </div>
            `}
          </div>
        </div>
      `:""}
    `,this.bindEvents()}bindEvents(){let e=this.root.getElementById("mawLauncherBtn");e&&e.addEventListener("click",()=>{this.isOpen=!0,this.render()});let n=this.root.getElementById("mawCloseBtn");n&&n.addEventListener("click",()=>{this.isOpen=!1,this.render()});let r=this.root.getElementById("mawHeader"),o=this.root.querySelector(".maw-modal");r&&o&&r.addEventListener("pointerdown",c=>{if(c.target.closest("button")||c.button!==0)return;c.preventDefault();let f=o.getBoundingClientRect(),g=c.clientX,I=c.clientY,L=f.left,A=f.top;o.classList.add("is-dragging"),o.style.left=`${L}px`,o.style.top=`${A}px`,o.style.right="auto",o.style.bottom="auto",o.style.animation="none",this.modalPos={x:L,y:A};let b=x=>{let gt=x.clientX-g,wt=x.clientY-I,T=L+gt,$=A+wt,y=8,xt=Math.max(y,window.innerWidth-f.width-y),bt=Math.max(y,window.innerHeight-f.height-y);T=Math.max(y,Math.min(xt,T)),$=Math.max(y,Math.min(bt,$)),o.style.left=`${T}px`,o.style.top=`${$}px`,this.modalPos={x:T,y:$}},w=()=>{o.classList.remove("is-dragging"),window.removeEventListener("pointermove",b),window.removeEventListener("pointerup",w),window.removeEventListener("pointercancel",w)};window.addEventListener("pointermove",b),window.addEventListener("pointerup",w),window.addEventListener("pointercancel",w)}),this.root.querySelectorAll(".maw-chip").forEach(c=>{c.addEventListener("click",f=>{let g=f.currentTarget.getAttribute("data-category");this.selectedCategory=g,this.render()})});let a=this.root.getElementById("mawTextInput");a&&a.addEventListener("input",c=>{this.textValue=c.target.value;let f=this.root.getElementById("mawSubmitBtn");f&&(f.disabled=this.isSubmitting||!this.textValue.trim())});let s=this.root.getElementById("mawStartAnnotateBtn");s&&s.addEventListener("click",()=>{this.startAnnotationMode()});let l=this.root.getElementById("mawRemoveShotBtn");l&&l.addEventListener("click",()=>{this.screenshotDataUrl=null,this.annotations=[],this.render()});let d=this.root.getElementById("mawSubmitBtn");d&&d.addEventListener("click",()=>{this.submitFeedback()});let u=this.root.getElementById("mawResetBtn");u&&u.addEventListener("click",()=>{this.isDone=!1,this.textValue="",this.selectedCategory="Bug",this.annotations=[],this.screenshotDataUrl=null,this.errorMessage=null,this.render()})}startAnnotationMode(){this.isAnnotating=!0,this.render();let e=document.createElement("div");e.setAttribute("data-maw-chrome",""),e.style.position="fixed",e.style.inset="0",e.style.zIndex="2147483642",e.style.cursor="crosshair",e.style.background="rgba(15, 23, 42, 0.02)",document.body.appendChild(e),this.annotationOverlay=e;let n=document.createElement("div");if(n.setAttribute("data-maw-chrome",""),n.style.position="fixed",n.style.top="20px",n.style.right="20px",n.style.zIndex="2147483645",n.style.background="#1a1a2e",n.style.color="#ffffff",n.style.padding="8px 16px",n.style.borderRadius="9999px",n.style.border="1px solid rgba(229, 231, 235, 0.2)",n.style.display="flex",n.style.alignItems="center",n.style.gap="10px",n.style.boxShadow="0 10px 25px -3px rgba(0, 0, 0, 0.35)",n.style.fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif",n.style.fontSize="13px",n.style.cursor="grab",n.style.userSelect="none",n.style.touchAction="none",n.title="Drag to move",n.innerHTML=`
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
    `,document.body.appendChild(n),this.annotationPill=n,n.addEventListener("pointerdown",a=>{if(a.target.closest("button")||a.button!==0)return;a.preventDefault(),n.style.cursor="grabbing";let s=n.getBoundingClientRect(),l=a.clientX,d=a.clientY,u=s.left,c=s.top;n.style.left=`${u}px`,n.style.top=`${c}px`,n.style.right="auto",n.style.bottom="auto";let f=I=>{let L=I.clientX-l,A=I.clientY-d,b=u+L,w=c+A,x=8;b=Math.max(x,Math.min(window.innerWidth-s.width-x,b)),w=Math.max(x,Math.min(window.innerHeight-s.height-x,w)),n.style.left=`${b}px`,n.style.top=`${w}px`},g=()=>{n.style.cursor="grab",window.removeEventListener("pointermove",f),window.removeEventListener("pointerup",g),window.removeEventListener("pointercancel",g)};window.addEventListener("pointermove",f),window.addEventListener("pointerup",g),window.addEventListener("pointercancel",g)}),!document.getElementById("maw-hover-style")){let a=document.createElement("style");a.id="maw-hover-style",a.innerHTML="[data-maw-hover] { outline: 2px solid #fc3165 !important; outline-offset: 2px !important; cursor: crosshair !important; }",document.head.appendChild(a)}let r=(a,s)=>{e.style.pointerEvents="none";let l=document.elementFromPoint(a,s);return e.style.pointerEvents="auto",!l||l.closest("[data-maw-chrome]")||l.closest("make-a-wish-widget")?null:l};e.onmousemove=a=>{let s=r(a.clientX,a.clientY);s!==this.hoveredElement&&(this.hoveredElement&&this.hoveredElement.removeAttribute("data-maw-hover"),s&&s.setAttribute("data-maw-hover",""),this.hoveredElement=s)},e.onclick=a=>{a.preventDefault(),a.stopPropagation();let s=r(a.clientX,a.clientY);if(!s)return;let l=s.getBoundingClientRect(),d={selector:pt(s),tag:s.tagName.toLowerCase(),hint:ft(s),text:mt(s),rect:{x:l.x,y:l.y,width:l.width,height:l.height}};this.annotations.push(d),this.renderPin(d,this.annotations.length);let u=n.querySelector("#mawPillText");u&&(u.textContent=`Click elements to pin (${this.annotations.length})`)};let o=n.querySelector("#mawDoneAnnotateBtn");o&&o.addEventListener("click",async()=>{await this.finishAnnotation(!0)});let i=n.querySelector("#mawCancelAnnotateBtn");i&&i.addEventListener("click",async()=>{await this.finishAnnotation(!1)})}renderPin(e,n){let r=document.createElement("div");r.setAttribute("data-maw-chrome",""),r.style.position="fixed",r.style.left=`${e.rect.x}px`,r.style.top=`${e.rect.y}px`,r.style.width="24px",r.style.height="24px",r.style.borderRadius="9999px",r.style.background="#fc3165",r.style.color="#ffffff",r.style.fontFamily="'Inter', -apple-system, sans-serif",r.style.fontSize="12px",r.style.fontWeight="700",r.style.display="flex",r.style.alignItems="center",r.style.justifyContent="center",r.style.boxShadow="0 0 0 2px #ffffff, 0 4px 10px rgba(252, 49, 101, 0.4)",r.style.zIndex="2147483644",r.style.pointerEvents="none",r.textContent=String(n),document.body.appendChild(r),this.pinElements.push(r)}async finishAnnotation(e){if(this.hoveredElement&&(this.hoveredElement.removeAttribute("data-maw-hover"),this.hoveredElement=null),this.annotationOverlay&&(this.annotationOverlay.remove(),this.annotationOverlay=null),this.annotationPill&&(this.annotationPill.remove(),this.annotationPill=null),this.pinElements.forEach(n=>n.remove()),this.pinElements=[],e){let n=await q(this.annotations);this.screenshotDataUrl=n}else this.annotations=[];this.isAnnotating=!1,this.render()}async submitFeedback(){if(!this.textValue.trim()||this.isSubmitting)return;this.isSubmitting=!0,this.errorMessage=null,this.render();let e=this.screenshotDataUrl;e||(e=await q(this.annotations),this.screenshotDataUrl=e);let n=this.config.repos&&this.config.repos.length>0?this.config.repos:this.config.repo?[this.config.repo]:[],r=n[0]||this.config.repo||"",o={appId:this.config.appId||"default-app",repo:r,repos:n,category:this.selectedCategory,text:this.textValue.trim(),annotations:this.annotations,screenshot:e,url:window.location.href,userAgent:navigator.userAgent,userEmail:this.config.userEmail||"",timestamp:new Date().toISOString()};try{let i=(this.config.apiUrl||window.location.origin).replace(/\/$/,""),a=await fetch(`${i}/api/feedback`,{method:"POST",headers:{"Content-Type":"application/json","X-Make-A-Wish-App":this.config.appId||"generic"},body:JSON.stringify(o)});if(!a.ok){let s=await a.text();throw new Error(`Submission failed (${a.status}): ${s.slice(0,150)}`)}this.isDone=!0,this.isSubmitting=!1,this.render()}catch(i){this.isSubmitting=!1,this.errorMessage=i instanceof Error?i.message:"Submission failed",this.render()}}escapeHtml(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}};var _=class extends HTMLElement{constructor(){super();this.ui=null;this.shadow=this.attachShadow({mode:"open"})}static get observedAttributes(){return["data-app","data-repo","data-repos","data-api","data-user","data-position"]}connectedCallback(){let n=this.resolveConfig();this.ui=new U(this.shadow,n)}attributeChangedCallback(n,r,o){if(!this.ui)return;let i={};if(n==="data-app"&&(i.appId=o),n==="data-repo"||n==="data-repos"){let a=H(this.getAttribute("data-repos"),this.getAttribute("data-repo"));i.repos=a,i.repo=a[0]||""}n==="data-api"&&(i.apiUrl=o),n==="data-user"&&(i.userEmail=o),n==="data-position"&&(i.position=o),this.ui.updateConfig(i)}resolveConfig(){let n=H(this.getAttribute("data-repos"),this.getAttribute("data-repo"));return{appId:this.getAttribute("data-app")||"",repo:n[0]||"",repos:n,apiUrl:this.getAttribute("data-api")||window.location.origin,userEmail:this.getAttribute("data-user")||void 0,position:this.getAttribute("data-position")||"bottom-right"}}};typeof window<"u"&&!customElements.get("make-a-wish-widget")&&customElements.define("make-a-wish-widget",_);function ht(){if(typeof document>"u")return;let t=document.currentScript||document.querySelector('script[src*="widget.js"]'),e=window.location.origin,n="",r="",o="",i="",a="bottom-right";if(t){try{e=new URL(t.src,window.location.href).origin}catch{e=window.location.origin}n=t.getAttribute("data-app")||"";let s=t.getAttribute("data-repos"),l=t.getAttribute("data-repo"),d=H(s,l);o=t.getAttribute("data-api")||e,i=t.getAttribute("data-user")||"";let u=t.getAttribute("data-position");if((u==="bottom-left"||u==="bottom-right")&&(a=u),document.querySelector("make-a-wish-widget"))return;let c=document.createElement("make-a-wish-widget");n&&c.setAttribute("data-app",n),d.length>0&&(c.setAttribute("data-repos",d.join(", ")),c.setAttribute("data-repo",d[0])),o&&c.setAttribute("data-api",o),i&&c.setAttribute("data-user",i),c.setAttribute("data-position",a),document.body.appendChild(c)}else if(!document.querySelector("make-a-wish-widget")){let s=document.createElement("make-a-wish-widget");document.body.appendChild(s)}}typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ht):ht());})();
//# sourceMappingURL=widget.js.map
