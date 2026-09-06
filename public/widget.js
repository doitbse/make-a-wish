"use strict";(()=>{function Y(t,e){if(t.match(/^[a-z]+:\/\//i))return t;if(t.match(/^\/\//))return window.location.protocol+t;if(t.match(/^[a-z]+:/i))return t;let n=document.implementation.createHTMLDocument(),i=n.createElement("base"),o=n.createElement("a");return n.head.appendChild(i),n.body.appendChild(o),e&&(i.href=e),o.href=t,o.href}var J=(()=>{let t=0,e=()=>`0000${(Math.random()*36**4<<0).toString(36)}`.slice(-4);return()=>(t+=1,`u${e()}${t}`)})();function g(t){let e=[];for(let n=0,i=t.length;n<i;n++)e.push(t[n]);return e}var E=null;function D(t={}){return E||(t.includeStyleProperties?(E=t.includeStyleProperties,E):(E=g(window.getComputedStyle(document.documentElement)),E))}function B(t,e){let i=(t.ownerDocument.defaultView||window).getComputedStyle(t).getPropertyValue(e);return i?parseFloat(i.replace("px","")):0}function St(t){let e=B(t,"border-left-width"),n=B(t,"border-right-width");return t.clientWidth+e+n}function kt(t){let e=B(t,"border-top-width"),n=B(t,"border-bottom-width");return t.clientHeight+e+n}function H(t,e={}){let n=e.width||St(t),i=e.height||kt(t);return{width:n,height:i}}function K(){let t,e;try{e=process}catch{}let n=e&&e.env?e.env.devicePixelRatio:null;return n&&(t=parseInt(n,10),Number.isNaN(t)&&(t=1)),t||window.devicePixelRatio||1}var f=16384;function Z(t){(t.width>f||t.height>f)&&(t.width>f&&t.height>f?t.width>t.height?(t.height*=f/t.width,t.width=f):(t.width*=f/t.height,t.height=f):t.width>f?(t.height*=f/t.width,t.width=f):(t.width*=f/t.height,t.height=f))}function S(t){return new Promise((e,n)=>{let i=new Image;i.onload=()=>{i.decode().then(()=>{requestAnimationFrame(()=>e(i))})},i.onerror=n,i.crossOrigin="anonymous",i.decoding="async",i.src=t})}async function At(t){return Promise.resolve().then(()=>new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then(e=>`data:image/svg+xml;charset=utf-8,${e}`)}async function N(t,e,n){let i="http://www.w3.org/2000/svg",o=document.createElementNS(i,"svg"),r=document.createElementNS(i,"foreignObject");return o.setAttribute("width",`${e}`),o.setAttribute("height",`${n}`),o.setAttribute("viewBox",`0 0 ${e} ${n}`),r.setAttribute("width","100%"),r.setAttribute("height","100%"),r.setAttribute("x","0"),r.setAttribute("y","0"),r.setAttribute("externalResourcesRequired","true"),o.appendChild(r),r.appendChild(t),At(o)}var p=(t,e)=>{if(t instanceof e)return!0;let n=Object.getPrototypeOf(t);return n===null?!1:n.constructor.name===e.name||p(n,e)};function Ct(t){let e=t.getPropertyValue("content");return`${t.cssText} content: '${e.replace(/'|"/g,"")}';`}function $t(t,e){return D(e).map(n=>{let i=t.getPropertyValue(n),o=t.getPropertyPriority(n);return`${n}: ${i}${o?" !important":""};`}).join(" ")}function Lt(t,e,n,i){let o=`.${t}:${e}`,r=n.cssText?Ct(n):$t(n,i);return document.createTextNode(`${o}{${r}}`)}function tt(t,e,n,i){let o=window.getComputedStyle(t,n),r=o.getPropertyValue("content");if(r===""||r==="none")return;let s=J();try{e.className=`${e.className} ${s}`}catch{return}let a=document.createElement("style");a.appendChild(Lt(s,n,o,i)),e.appendChild(a)}function et(t,e,n){tt(t,e,":before",n),tt(t,e,":after",n)}var nt="application/font-woff",it="image/jpeg",Mt={woff:nt,woff2:nt,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:it,jpeg:it,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml",webp:"image/webp"};function It(t){let e=/\.([^./]*?)$/g.exec(t);return e?e[1]:""}function k(t){let e=It(t).toLowerCase();return Mt[e]||""}function Tt(t){return t.split(/,/)[1]}function M(t){return t.search(/^(data:)/)!==-1}function O(t,e){return`data:${e};base64,${t}`}async function W(t,e,n){let i=await fetch(t,e);if(i.status===404)throw new Error(`Resource "${i.url}" not found`);let o=await i.blob();return new Promise((r,s)=>{let a=new FileReader;a.onerror=s,a.onloadend=()=>{try{r(n({res:i,result:a.result}))}catch(l){s(l)}},a.readAsDataURL(o)})}var V={};function Rt(t,e,n){let i=t.replace(/\?.*/,"");return n&&(i=t),/ttf|otf|eot|woff2?/i.test(i)&&(i=i.replace(/.*\//,"")),e?`[${e}]${i}`:i}async function A(t,e,n){let i=Rt(t,e,n.includeQueryParams);if(V[i]!=null)return V[i];n.cacheBust&&(t+=(/\?/.test(t)?"&":"?")+new Date().getTime());let o;try{let r=await W(t,n.fetchRequestInit,({res:s,result:a})=>(e||(e=s.headers.get("Content-Type")||""),Tt(a)));o=O(r,e)}catch(r){o=n.imagePlaceholder||"";let s=`Failed to fetch resource: ${t}`;r&&(s=typeof r=="string"?r:r.message),s&&console.warn(s)}return V[i]=o,o}async function Pt(t){let e=t.toDataURL();return e==="data:,"?t.cloneNode(!1):S(e)}async function Bt(t,e){if(t.currentSrc){let r=document.createElement("canvas"),s=r.getContext("2d");r.width=t.clientWidth,r.height=t.clientHeight,s?.drawImage(t,0,0,r.width,r.height);let a=r.toDataURL();return S(a)}let n=t.poster,i=k(n),o=await A(n,i,e);return S(o)}async function Dt(t,e){var n;try{if(!((n=t?.contentDocument)===null||n===void 0)&&n.body)return await I(t.contentDocument.body,e,!0)}catch{}return t.cloneNode(!1)}async function qt(t,e){return p(t,HTMLCanvasElement)?Pt(t):p(t,HTMLVideoElement)?Bt(t,e):p(t,HTMLIFrameElement)?Dt(t,e):t.cloneNode(rt(t))}var Ut=t=>t.tagName!=null&&t.tagName.toUpperCase()==="SLOT",rt=t=>t.tagName!=null&&t.tagName.toUpperCase()==="SVG";async function Ft(t,e,n){var i,o;if(rt(e))return e;let r=[];return Ut(t)&&t.assignedNodes?r=g(t.assignedNodes()):p(t,HTMLIFrameElement)&&(!((i=t.contentDocument)===null||i===void 0)&&i.body)?r=g(t.contentDocument.body.childNodes):r=g(((o=t.shadowRoot)!==null&&o!==void 0?o:t).childNodes),r.length===0||p(t,HTMLVideoElement)||await r.reduce((s,a)=>s.then(()=>I(a,n)).then(l=>{l&&e.appendChild(l)}),Promise.resolve()),e}function zt(t,e,n){let i=e.style;if(!i)return;let o=window.getComputedStyle(t);o.cssText?(i.cssText=o.cssText,i.transformOrigin=o.transformOrigin):D(n).forEach(r=>{let s=o.getPropertyValue(r);r==="font-size"&&s.endsWith("px")&&(s=`${Math.floor(parseFloat(s.substring(0,s.length-2)))-.1}px`),p(t,HTMLIFrameElement)&&r==="display"&&s==="inline"&&(s="block"),r==="d"&&e.getAttribute("d")&&(s=`path(${e.getAttribute("d")})`),i.setProperty(r,s,o.getPropertyPriority(r))})}function Ht(t,e){p(t,HTMLTextAreaElement)&&(e.innerHTML=t.value),p(t,HTMLInputElement)&&e.setAttribute("value",t.value)}function Vt(t,e){if(p(t,HTMLSelectElement)){let i=Array.from(e.children).find(o=>t.value===o.getAttribute("value"));i&&i.setAttribute("selected","")}}function Ot(t,e,n){return p(e,Element)&&(zt(t,e,n),et(t,e,n),Ht(t,e),Vt(t,e)),e}async function Wt(t,e){let n=t.querySelectorAll?t.querySelectorAll("use"):[];if(n.length===0)return t;let i={};for(let r=0;r<n.length;r++){let a=n[r].getAttribute("xlink:href");if(a){let l=t.querySelector(a),c=document.querySelector(a);!l&&c&&!i[a]&&(i[a]=await I(c,e,!0))}}let o=Object.values(i);if(o.length){let r="http://www.w3.org/1999/xhtml",s=document.createElementNS(r,"svg");s.setAttribute("xmlns",r),s.style.position="absolute",s.style.width="0",s.style.height="0",s.style.overflow="hidden",s.style.display="none";let a=document.createElementNS(r,"defs");s.appendChild(a);for(let l=0;l<o.length;l++)a.appendChild(o[l]);t.appendChild(s)}return t}async function I(t,e,n){return!n&&e.filter&&!e.filter(t)?null:Promise.resolve(t).then(i=>qt(i,e)).then(i=>Ft(t,i,e)).then(i=>Ot(t,i,e)).then(i=>Wt(i,e))}var ot=/url\((['"]?)([^'"]+?)\1\)/g,jt=/url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,_t=/src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;function Qt(t){let e=t.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1");return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`,"g")}function Xt(t){let e=[];return t.replace(ot,(n,i,o)=>(e.push(o),n)),e.filter(n=>!M(n))}async function Gt(t,e,n,i,o){try{let r=n?Y(e,n):e,s=k(e),a;if(o){let l=await o(r);a=O(l,s)}else a=await A(r,s,i);return t.replace(Qt(e),`$1${a}$3`)}catch{}return t}function Yt(t,{preferredFontFormat:e}){return e?t.replace(_t,n=>{for(;;){let[i,,o]=jt.exec(n)||[];if(!o)return"";if(o===e)return`src: ${i};`}}):t}function j(t){return t.search(ot)!==-1}async function q(t,e,n){if(!j(t))return t;let i=Yt(t,n);return Xt(i).reduce((r,s)=>r.then(a=>Gt(a,s,e,n)),Promise.resolve(i))}async function C(t,e,n){var i;let o=(i=e.style)===null||i===void 0?void 0:i.getPropertyValue(t);if(o){let r=await q(o,null,n);return e.style.setProperty(t,r,e.style.getPropertyPriority(t)),!0}return!1}async function Jt(t,e){await C("background",t,e)||await C("background-image",t,e),await C("mask",t,e)||await C("-webkit-mask",t,e)||await C("mask-image",t,e)||await C("-webkit-mask-image",t,e)}async function Kt(t,e){let n=p(t,HTMLImageElement);if(!(n&&!M(t.src))&&!(p(t,SVGImageElement)&&!M(t.href.baseVal)))return;let i=n?t.src:t.href.baseVal,o=await A(i,k(i),e);await new Promise((r,s)=>{t.onload=r,t.onerror=e.onImageErrorHandler?(...l)=>{try{r(e.onImageErrorHandler(...l))}catch(c){s(c)}}:s;let a=t;a.decode&&(a.decode=r),a.loading==="lazy"&&(a.loading="eager"),n?(t.srcset="",t.src=o):t.href.baseVal=o})}async function Zt(t,e){let i=g(t.childNodes).map(o=>_(o,e));await Promise.all(i).then(()=>t)}async function _(t,e){p(t,Element)&&(await Jt(t,e),await Kt(t,e),await Zt(t,e))}function st(t,e){let{style:n}=t;e.backgroundColor&&(n.backgroundColor=e.backgroundColor),e.width&&(n.width=`${e.width}px`),e.height&&(n.height=`${e.height}px`);let i=e.style;return i!=null&&Object.keys(i).forEach(o=>{n[o]=i[o]}),t}var at={};async function lt(t){let e=at[t];if(e!=null)return e;let i=await(await fetch(t)).text();return e={url:t,cssText:i},at[t]=e,e}async function ct(t,e){let n=t.cssText,i=/url\(["']?([^"')]+)["']?\)/g,r=(n.match(/url\([^)]+\)/g)||[]).map(async s=>{let a=s.replace(i,"$1");return a.startsWith("https://")||(a=new URL(a,t.url).href),W(a,e.fetchRequestInit,({result:l})=>(n=n.replace(s,`url(${l})`),[s,l]))});return Promise.all(r).then(()=>n)}function dt(t){if(t==null)return[];let e=[],n=/(\/\*[\s\S]*?\*\/)/gi,i=t.replace(n,""),o=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi");for(;;){let l=o.exec(i);if(l===null)break;e.push(l[0])}i=i.replace(o,"");let r=/@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,s="((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",a=new RegExp(s,"gi");for(;;){let l=r.exec(i);if(l===null){if(l=a.exec(i),l===null)break;r.lastIndex=a.lastIndex}else a.lastIndex=r.lastIndex;e.push(l[0])}return e}async function Nt(t,e){let n=[],i=[];return t.forEach(o=>{if("cssRules"in o)try{g(o.cssRules||[]).forEach((r,s)=>{if(r.type===CSSRule.IMPORT_RULE){let a=s+1,l=r.href,c=lt(l).then(u=>ct(u,e)).then(u=>dt(u).forEach(d=>{try{o.insertRule(d,d.startsWith("@import")?a+=1:o.cssRules.length)}catch(w){console.error("Error inserting rule from remote css",{rule:d,error:w})}})).catch(u=>{console.error("Error loading remote css",u.toString())});i.push(c)}})}catch(r){let s=t.find(a=>a.href==null)||document.styleSheets[0];o.href!=null&&i.push(lt(o.href).then(a=>ct(a,e)).then(a=>dt(a).forEach(l=>{s.insertRule(l,s.cssRules.length)})).catch(a=>{console.error("Error loading remote stylesheet",a)})),console.error("Error inlining remote css file",r)}}),Promise.all(i).then(()=>(t.forEach(o=>{if("cssRules"in o)try{g(o.cssRules||[]).forEach(r=>{n.push(r)})}catch(r){console.error(`Error while reading CSS rules from ${o.href}`,r)}}),n))}function te(t){return t.filter(e=>e.type===CSSRule.FONT_FACE_RULE).filter(e=>j(e.style.getPropertyValue("src")))}async function ee(t,e){if(t.ownerDocument==null)throw new Error("Provided element is not within a Document");let n=g(t.ownerDocument.styleSheets),i=await Nt(n,e);return te(i)}function ut(t){return t.trim().replace(/["']/g,"")}function ne(t){let e=new Set;function n(i){(i.style.fontFamily||getComputedStyle(i).fontFamily).split(",").forEach(r=>{e.add(ut(r))}),Array.from(i.children).forEach(r=>{r instanceof HTMLElement&&n(r)})}return n(t),e}async function pt(t,e){let n=await ee(t,e),i=ne(t);return(await Promise.all(n.filter(r=>i.has(ut(r.style.fontFamily))).map(r=>{let s=r.parentStyleSheet?r.parentStyleSheet.href:null;return q(r.cssText,s,e)}))).join(`
`)}async function ht(t,e){let n=e.fontEmbedCSS!=null?e.fontEmbedCSS:e.skipFonts?null:await pt(t,e);if(n){let i=document.createElement("style"),o=document.createTextNode(n);i.appendChild(o),t.firstChild?t.insertBefore(i,t.firstChild):t.appendChild(i)}}async function ie(t,e={}){let{width:n,height:i}=H(t,e),o=await I(t,e,!0);return await ht(o,e),await _(o,e),st(o,e),await N(o,n,i)}async function re(t,e={}){let{width:n,height:i}=H(t,e),o=await ie(t,e),r=await S(o),s=document.createElement("canvas"),a=s.getContext("2d"),l=e.pixelRatio||K(),c=e.canvasWidth||n,u=e.canvasHeight||i;return s.width=c*l,s.height=u*l,e.skipAutoScale||Z(s),s.style.width=`${c}`,s.style.height=`${u}`,e.backgroundColor&&(a.fillStyle=e.backgroundColor,a.fillRect(0,0,s.width,s.height)),a.drawImage(r,0,0,s.width,s.height),s}async function ft(t,e={}){return(await re(t,e)).toDataURL()}function mt(t){if(!t)return"";let e=[],n=t,i=0;for(;n&&n!==document.body&&n!==document.documentElement&&i<6;){let o=n;if(o.id){e.unshift(`#${o.id}`);break}let r=o.tagName.toLowerCase(),s=o.parentElement;if(s){let a=Array.from(s.children).filter(l=>l.tagName===o.tagName);if(a.length>1){let l=a.indexOf(o)+1;r+=`:nth-of-type(${l})`}}e.unshift(r),n=s,i++}return e.length===0?t.tagName.toLowerCase():e.join(" > ")}function gt(t){let e=t.id?`#${t.id}`:"",n="";return typeof t.className=="string"&&t.className.trim()&&(n="."+t.className.trim().split(/\s+/).slice(0,2).join(".")),(t.tagName.toLowerCase()+e+n).slice(0,80)}function wt(t,e=120){let n=(t.textContent||"").replace(/\s+/g," ").trim();return n.length<=e?n:n.slice(0,e-1).trimEnd()+"..."}async function U(t){try{document.querySelectorAll("[data-maw-hover]").forEach(a=>a.removeAttribute("data-maw-hover"));let e=document.documentElement,n=await ft(e,{backgroundColor:"#ffffff",width:e.scrollWidth,height:e.scrollHeight,filter:a=>!((a instanceof HTMLElement||a instanceof SVGElement)&&(a.hasAttribute("data-maw-chrome")||a.tagName.toLowerCase()==="make-a-wish-widget"||a.closest&&(a.closest("[data-maw-chrome]")||a.closest("make-a-wish-widget"))))});if(t.length===0)return n;let i=new Image;i.src=n,await new Promise((a,l)=>{i.onload=()=>a(),i.onerror=()=>l(new Error("failed to load screenshot image"))});let o=document.createElement("canvas");o.width=i.naturalWidth,o.height=i.naturalHeight;let r=o.getContext("2d");if(!r)return n;r.drawImage(i,0,0);let s=o.width/e.scrollWidth;return t.forEach((a,l)=>{let c=(a.rect.x+window.scrollX)*s,u=(a.rect.y+window.scrollY)*s,d=13*s;r.beginPath(),r.arc(c,u,d,0,Math.PI*2),r.fillStyle="#fc3165",r.fill(),r.strokeStyle="#ffffff",r.lineWidth=2*s,r.stroke(),r.fillStyle="#ffffff",r.font=`bold ${14*s}px "Inter", -apple-system, sans-serif`,r.textAlign="center",r.textBaseline="middle",r.fillText(String(l+1),c,u)}),o.toDataURL("image/png")}catch(e){return console.error("[make-a-wish] screenshot capture failed:",e),null}}function z(t,e){let n=[],i=o=>{if(!o)return;let r=o.trim();if(r){if(r.startsWith("[")&&r.endsWith("]"))try{let s=JSON.parse(r);if(Array.isArray(s)){for(let a of s)typeof a=="string"&&a.trim()&&n.push(a.trim());return}}catch{}for(let s of r.split(",")){let a=s.trim();a&&!n.includes(a)&&n.push(a)}}};return i(t),i(e),Array.from(new Set(n))}var oe=[{label:"Bug",emoji:"\u{1F41B}"},{label:"Idea",emoji:"\u{1F4A1}"},{label:"Question",emoji:"\u2753"},{label:"Praise",emoji:"\u2764\uFE0F"}],F=class{constructor(e,n){this.isOpen=!1;this.isAnnotating=!1;this.isSubmitting=!1;this.isDone=!1;this.selectedCategory="Bug";this.selectedAgentMode="adk";this.textValue="";this.questionAnswer=null;this.lastAskedQuestion="";this.annotations=[];this.screenshotDataUrl=null;this.errorMessage=null;this.modalPos=null;this.shouldFocusTextarea=!1;this.annotationOverlay=null;this.annotationPill=null;this.hoveredElement=null;this.pinElements=[];this.root=e,this.config=n,window.addEventListener("resize",()=>{if(this.modalPos&&this.isOpen){let i=this.root.querySelector(".maw-modal");if(i){let o=i.getBoundingClientRect(),r=8,s=Math.max(r,window.innerWidth-o.width-r),a=Math.max(r,window.innerHeight-o.height-r);this.modalPos.x=Math.max(r,Math.min(s,this.modalPos.x)),this.modalPos.y=Math.max(r,Math.min(a,this.modalPos.y)),i.style.left=`${this.modalPos.x}px`,i.style.top=`${this.modalPos.y}px`}}}),this.render()}updateConfig(e){this.config={...this.config,...e},this.render()}hasMeaningfulText(){return this.textValue.replace(/\(\d+\)\s*/g,"").trim().length>0}render(){this.root.innerHTML=`
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
        .maw-question-hint {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          padding: 8px 10px;
        }
        .maw-question-hint-icon {
          font-size: 16px;
          line-height: 1.2;
        }
        .maw-question-hint-body {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .maw-question-hint-title {
          font-size: 11px;
          font-weight: 600;
          color: #1e40af;
        }
        .maw-question-hint-sub {
          font-size: 10px;
          color: #3b82f6;
          line-height: 1.35;
        }
        .maw-answer-view {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .maw-ai-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eef2ff;
          color: #4338ca;
          border: 1px solid #c7d2fe;
          border-radius: 9999px;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 600;
          align-self: flex-start;
        }
        .maw-question-quote {
          background: #f8fafc;
          border-left: 3px solid #6366f1;
          border-radius: 0 8px 8px 0;
          padding: 8px 12px;
        }
        .maw-question-quote-label {
          font-size: 9px;
          text-transform: uppercase;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.05em;
          margin-bottom: 2px;
        }
        .maw-question-quote-text {
          font-size: 12px;
          color: #334155;
          font-weight: 500;
          line-height: 1.4;
        }
        .maw-answer-content {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          max-height: 240px;
          overflow-y: auto;
          font-size: 12px;
          line-height: 1.55;
          color: #1e293b;
        }
        .maw-answer-content::-webkit-scrollbar {
          width: 5px;
        }
        .maw-answer-content::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .maw-answer-actions {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 4px;
        }
        .maw-escalate-btn {
          width: 100%;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
          font-size: 11px;
          font-weight: 600;
          padding: 7px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .maw-escalate-btn:hover {
          background: #dcfce7;
          border-color: #86efac;
        }
        .maw-md h2, .maw-md h3, .maw-md h4 {
          margin: 8px 0 4px 0;
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
        }
        .maw-md p {
          margin: 0 0 6px 0;
        }
        .maw-md p:last-child {
          margin-bottom: 0;
        }
        .maw-md ul, .maw-md ol {
          margin: 4px 0 6px 16px;
          padding: 0;
        }
        .maw-md li {
          margin-bottom: 3px;
        }
        .maw-code-block {
          background: #0f172a;
          color: #f1f5f9;
          padding: 8px 10px;
          border-radius: 6px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 11px;
          overflow-x: auto;
          margin: 6px 0;
        }
        .maw-inline-code {
          background: #f1f5f9;
          color: #0f172a;
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 11px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          border: 1px solid #e2e8f0;
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
                  Google ADK Agent is inspecting the codebase to test the fix and open a pull request on GitHub.
                </div>
                <button type="button" class="maw-secondary-btn" id="mawResetBtn">Send another wish</button>
              </div>
            `:this.selectedCategory==="Question"&&this.questionAnswer?`
              <div class="maw-answer-view">
                <div class="maw-ai-badge">
                  <span>\u2728 Direct AI Answer</span>
                </div>
                <div class="maw-question-quote">
                  <div class="maw-question-quote-label">Your Question</div>
                  <div class="maw-question-quote-text">${this.escapeHtml(this.lastAskedQuestion)}</div>
                </div>
                <div class="maw-answer-content">
                  ${this.renderMarkdown(this.questionAnswer)}
                </div>
                <div class="maw-answer-actions">
                  <button type="button" class="maw-escalate-btn" id="mawEscalateBtn">
                    <span>\u{1F680}</span> Need code changes? File as Wish / Bug
                  </button>
                  <div style="display: flex; gap: 8px;">
                    <button type="button" class="maw-secondary-btn" id="mawAskAnotherBtn" style="flex: 1;">Ask another question</button>
                    <button type="button" class="maw-submit-btn" id="mawAnswerDoneBtn" style="flex: 1;">Done</button>
                  </div>
                </div>
              </div>
            `:`
              <div class="maw-categories">
                ${oe.map(e=>`
                  <button type="button" class="maw-chip ${this.selectedCategory===e.label?"active":""}" data-category="${e.label}">
                    <span>${e.emoji}</span>
                    ${e.label}
                  </button>
                `).join("")}
              </div>

              ${this.selectedCategory==="Question"?`
                <div class="maw-question-hint">
                  <div class="maw-question-hint-icon">\u{1F4AC}</div>
                  <div class="maw-question-hint-body">
                    <span class="maw-question-hint-title">Direct AI Answers</span>
                    <span class="maw-question-hint-sub">Ask a question to receive an immediate answer from the AI agent using live repo knowledge.</span>
                  </div>
                </div>
              `:""}

              <textarea
                class="maw-textarea"
                id="mawTextInput"
                placeholder="${this.selectedCategory==="Question"?"Ask anything about this app, features, or workflows...":"What would make this tool better? Describe what you want or report a bug..."}"
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
                  ${this.isSubmitting?this.selectedCategory==="Question"?"Consulting AI...":"Submitting wish...":this.selectedCategory==="Question"?"Ask question \u{1F4AC}":"Send wish \u2728"}
                </button>
              </div>
            `}
          </div>
        </div>
      `:""}
    `,this.bindEvents()}bindEvents(){let e=this.root.getElementById("mawLauncherBtn");e&&e.addEventListener("click",()=>{this.isOpen=!0,this.render()});let n=this.root.getElementById("mawCloseBtn");n&&n.addEventListener("click",()=>{this.isOpen=!1,this.render()});let i=this.root.getElementById("mawHeader"),o=this.root.querySelector(".maw-modal");i&&o&&i.addEventListener("pointerdown",h=>{if(h.target.closest("button")||h.button!==0)return;h.preventDefault();let m=o.getBoundingClientRect(),$=h.clientX,L=h.clientY,y=m.left,x=m.top;o.classList.add("is-dragging"),o.style.left=`${y}px`,o.style.top=`${x}px`,o.style.right="auto",o.style.bottom="auto",o.style.animation="none",this.modalPos={x:y,y:x};let X=G=>{let bt=G.clientX-$,yt=G.clientY-L,R=y+bt,P=x+yt,v=8,vt=Math.max(v,window.innerWidth-m.width-v),Et=Math.max(v,window.innerHeight-m.height-v);R=Math.max(v,Math.min(vt,R)),P=Math.max(v,Math.min(Et,P)),o.style.left=`${R}px`,o.style.top=`${P}px`,this.modalPos={x:R,y:P}},T=()=>{o.classList.remove("is-dragging"),window.removeEventListener("pointermove",X),window.removeEventListener("pointerup",T),window.removeEventListener("pointercancel",T)};window.addEventListener("pointermove",X),window.addEventListener("pointerup",T),window.addEventListener("pointercancel",T)}),this.root.querySelectorAll(".maw-chip").forEach(h=>{h.addEventListener("click",m=>{let $=m.currentTarget.getAttribute("data-category");this.selectedCategory=$,this.errorMessage=null,this.render()})});let s=this.root.getElementById("mawAskAnotherBtn");s&&s.addEventListener("click",()=>{this.questionAnswer=null,this.textValue="",this.screenshotDataUrl=null,this.annotations=[],this.errorMessage=null,this.render()});let a=this.root.getElementById("mawEscalateBtn");a&&a.addEventListener("click",()=>{this.selectedCategory="Idea",this.textValue=`Feature request following question: "${this.lastAskedQuestion}"

`,this.questionAnswer=null,this.errorMessage=null,this.render()});let l=this.root.getElementById("mawAnswerDoneBtn");l&&l.addEventListener("click",()=>{this.isOpen=!1,this.render()});let c=this.root.getElementById("mawTextInput");c&&(this.shouldFocusTextarea&&(this.shouldFocusTextarea=!1,setTimeout(()=>{c.focus();let h=c.value.length;c.setSelectionRange(h,h)},50)),c.addEventListener("input",h=>{this.textValue=h.target.value;let m=this.root.getElementById("mawSubmitBtn");m&&(m.disabled=this.isSubmitting||!this.hasMeaningfulText())}));let u=this.root.getElementById("mawStartAnnotateBtn");u&&u.addEventListener("click",()=>{this.startAnnotationMode()});let d=this.root.getElementById("mawRemoveShotBtn");d&&d.addEventListener("click",()=>{this.screenshotDataUrl=null,this.annotations=[],this.textValue==="(1) "&&(this.textValue=""),this.render()});let w=this.root.getElementById("mawSubmitBtn");w&&w.addEventListener("click",()=>{this.submitFeedback()});let b=this.root.getElementById("mawResetBtn");b&&b.addEventListener("click",()=>{this.isDone=!1,this.textValue="",this.selectedCategory="Bug",this.selectedAgentMode="adk",this.questionAnswer=null,this.lastAskedQuestion="",this.annotations=[],this.screenshotDataUrl=null,this.errorMessage=null,this.render()})}startAnnotationMode(){this.isAnnotating=!0,this.textValue.trim()||(this.textValue="(1) "),this.render();let e=document.createElement("div");e.setAttribute("data-maw-chrome",""),e.style.position="fixed",e.style.inset="0",e.style.zIndex="2147483642",e.style.cursor="crosshair",e.style.background="rgba(15, 23, 42, 0.02)",document.body.appendChild(e),this.annotationOverlay=e;let n=document.createElement("div");if(n.setAttribute("data-maw-chrome",""),n.style.position="fixed",n.style.top="20px",n.style.right="20px",n.style.zIndex="2147483645",n.style.background="#1a1a2e",n.style.color="#ffffff",n.style.padding="8px 16px",n.style.borderRadius="9999px",n.style.border="1px solid rgba(229, 231, 235, 0.2)",n.style.display="flex",n.style.alignItems="center",n.style.gap="10px",n.style.boxShadow="0 10px 25px -3px rgba(0, 0, 0, 0.35)",n.style.fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif",n.style.fontSize="13px",n.style.cursor="grab",n.style.userSelect="none",n.style.touchAction="none",n.title="Drag to move",n.innerHTML=`
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
    `,document.body.appendChild(n),this.annotationPill=n,n.addEventListener("pointerdown",s=>{if(s.target.closest("button")||s.button!==0)return;s.preventDefault(),n.style.cursor="grabbing";let a=n.getBoundingClientRect(),l=s.clientX,c=s.clientY,u=a.left,d=a.top;n.style.left=`${u}px`,n.style.top=`${d}px`,n.style.right="auto",n.style.bottom="auto";let w=h=>{let m=h.clientX-l,$=h.clientY-c,L=u+m,y=d+$,x=8;L=Math.max(x,Math.min(window.innerWidth-a.width-x,L)),y=Math.max(x,Math.min(window.innerHeight-a.height-x,y)),n.style.left=`${L}px`,n.style.top=`${y}px`},b=()=>{n.style.cursor="grab",window.removeEventListener("pointermove",w),window.removeEventListener("pointerup",b),window.removeEventListener("pointercancel",b)};window.addEventListener("pointermove",w),window.addEventListener("pointerup",b),window.addEventListener("pointercancel",b)}),!document.getElementById("maw-hover-style")){let s=document.createElement("style");s.id="maw-hover-style",s.innerHTML="[data-maw-hover] { outline: 2px solid #fc3165 !important; outline-offset: 2px !important; cursor: crosshair !important; }",document.head.appendChild(s)}let i=(s,a)=>{e.style.pointerEvents="none";let l=document.elementFromPoint(s,a);return e.style.pointerEvents="auto",!l||l.closest("[data-maw-chrome]")||l.closest("make-a-wish-widget")?null:l};e.onmousemove=s=>{let a=i(s.clientX,s.clientY);a!==this.hoveredElement&&(this.hoveredElement&&this.hoveredElement.removeAttribute("data-maw-hover"),a&&a.setAttribute("data-maw-hover",""),this.hoveredElement=a)},e.onclick=s=>{s.preventDefault(),s.stopPropagation();let a=i(s.clientX,s.clientY);if(!a)return;let l=a.getBoundingClientRect(),c={selector:mt(a),tag:a.tagName.toLowerCase(),hint:gt(a),text:wt(a),rect:{x:l.x,y:l.y,width:l.width,height:l.height}};this.annotations.push(c),this.renderPin(c,this.annotations.length);let u=n.querySelector("#mawPillText");u&&(u.textContent=`Click elements to pin (${this.annotations.length})`);let d=this.annotations.length;d===1?this.textValue.trim()?this.textValue.includes("(1)")||(this.textValue=this.textValue.trimEnd()+`
(1) `):this.textValue="(1) ":d>1&&(this.textValue.includes(`(${d})`)||(this.textValue=this.textValue.trimEnd()+`
(${d}) `))};let o=n.querySelector("#mawDoneAnnotateBtn");o&&o.addEventListener("click",async()=>{await this.finishAnnotation(!0)});let r=n.querySelector("#mawCancelAnnotateBtn");r&&r.addEventListener("click",async()=>{await this.finishAnnotation(!1)})}renderPin(e,n){let i=document.createElement("div");i.setAttribute("data-maw-chrome",""),i.style.position="fixed",i.style.left=`${e.rect.x}px`,i.style.top=`${e.rect.y}px`,i.style.width="24px",i.style.height="24px",i.style.borderRadius="9999px",i.style.background="#fc3165",i.style.color="#ffffff",i.style.fontFamily="'Inter', -apple-system, sans-serif",i.style.fontSize="12px",i.style.fontWeight="700",i.style.display="flex",i.style.alignItems="center",i.style.justifyContent="center",i.style.boxShadow="0 0 0 2px #ffffff, 0 4px 10px rgba(252, 49, 101, 0.4)",i.style.zIndex="2147483644",i.style.pointerEvents="none",i.textContent=String(n),document.body.appendChild(i),this.pinElements.push(i)}async finishAnnotation(e){if(this.hoveredElement&&(this.hoveredElement.removeAttribute("data-maw-hover"),this.hoveredElement=null),this.annotationOverlay&&(this.annotationOverlay.remove(),this.annotationOverlay=null),this.annotationPill&&(this.annotationPill.remove(),this.annotationPill=null),this.pinElements.forEach(n=>n.remove()),this.pinElements=[],e){let n=await U(this.annotations);if(this.screenshotDataUrl=n,this.annotations.length>0){this.textValue.trim()?this.textValue.includes("(1)")||(this.textValue=this.textValue.trimEnd()+`
(1) `):this.textValue="(1) ";for(let i=2;i<=this.annotations.length;i++)this.textValue.includes(`(${i})`)||(this.textValue=this.textValue.trimEnd()+`
(${i}) `)}this.shouldFocusTextarea=!0}else this.textValue==="(1) "&&(this.textValue=""),this.annotations=[];this.isAnnotating=!1,this.render()}async submitFeedback(){if(this.selectedCategory==="Question")return this.submitQuestion();if(!this.hasMeaningfulText()||this.isSubmitting)return;this.isSubmitting=!0,this.errorMessage=null,this.render();let e=this.screenshotDataUrl;e||(e=await U(this.annotations),this.screenshotDataUrl=e);let n=this.config.repos&&this.config.repos.length>0?this.config.repos:this.config.repo?[this.config.repo]:[],i=n[0]||this.config.repo||"",o={appId:this.config.appId||"default-app",repo:i,repos:n,agentMode:this.selectedAgentMode,category:this.selectedCategory,text:this.textValue.trim(),annotations:this.annotations,screenshot:e,url:window.location.href,userAgent:navigator.userAgent,userEmail:this.config.userEmail||"",timestamp:new Date().toISOString()};try{let r=(this.config.apiUrl||window.location.origin).replace(/\/$/,""),s=await fetch(`${r}/api/feedback`,{method:"POST",headers:{"Content-Type":"application/json","X-Make-A-Wish-App":this.config.appId||"generic"},body:JSON.stringify(o)});if(!s.ok){let a=await s.text();throw new Error(`Submission failed (${s.status}): ${a.slice(0,150)}`)}this.isDone=!0,this.isSubmitting=!1,this.render()}catch(r){this.isSubmitting=!1,this.errorMessage=r instanceof Error?r.message:"Submission failed",this.render()}}async submitQuestion(){if(!this.hasMeaningfulText()||this.isSubmitting)return;this.isSubmitting=!0,this.errorMessage=null,this.lastAskedQuestion=this.textValue.trim(),this.render();let e=this.screenshotDataUrl;!e&&this.annotations.length>0&&(e=await U(this.annotations),this.screenshotDataUrl=e);let n=this.config.repos&&this.config.repos.length>0?this.config.repos:this.config.repo?[this.config.repo]:[],i=n[0]||this.config.repo||"",o={question:this.lastAskedQuestion,appId:this.config.appId||"default-app",repo:i,repos:n,screenshot:e,annotations:this.annotations,url:window.location.href,userAgent:navigator.userAgent,userEmail:this.config.userEmail||"",timestamp:new Date().toISOString()};try{let r=(this.config.apiUrl||window.location.origin).replace(/\/$/,""),s=await fetch(`${r}/api/question`,{method:"POST",headers:{"Content-Type":"application/json","X-Make-A-Wish-App":this.config.appId||"generic"},body:JSON.stringify(o)});if(!s.ok){let l=await s.text();throw new Error(`Agent query failed (${s.status}): ${l.slice(0,150)}`)}let a=await s.json();if(!a.ok&&a.error)throw new Error(a.message||a.error);this.questionAnswer=a.answer||"No answer returned.",this.isSubmitting=!1,this.render()}catch(r){this.isSubmitting=!1,this.errorMessage=r instanceof Error?r.message:"Failed to receive answer from agent",this.render()}}renderMarkdown(e){if(!e)return"";let n=this.escapeHtml(e);return n=n.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g,(i,o,r)=>`<pre class="maw-code-block"><code>${r.trim()}</code></pre>`),n=n.replace(/`([^`]+)`/g,'<code class="maw-inline-code">$1</code>'),n=n.replace(/^### (.*$)/gm,'<h4 class="maw-h4">$1</h4>'),n=n.replace(/^## (.*$)/gm,'<h3 class="maw-h3">$1</h3>'),n=n.replace(/^# (.*$)/gm,'<h2 class="maw-h2">$1</h2>'),n=n.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),n=n.replace(/\*([^*]+)\*/g,"<em>$1</em>"),n=n.replace(/^\s*[-*]\s+(.*$)/gm,'<li class="maw-list-item">$1</li>'),n=n.replace(/(<li class="maw-list-item">[\s\S]*?<\/li>)/g,'<ul class="maw-list">$1</ul>'),n=n.replace(/<\/ul>\s*<ul class="maw-list">/g,""),n=n.replace(/^\s*(\d+)\.\s+(.*$)/gm,'<li class="maw-num-item"><span>$1.</span> $2</li>'),n=n.replace(/(<li class="maw-num-item">[\s\S]*?<\/li>)/g,'<ol class="maw-num-list">$1</ol>'),n=n.replace(/<\/ol>\s*<ol class="maw-num-list">/g,""),n=n.replace(/\n\n+/g,'</p><p class="maw-para">'),n=n.replace(/\n/g,"<br/>"),`<div class="maw-md"><p class="maw-para">${n}</p></div>`}escapeHtml(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}};var Q=class extends HTMLElement{constructor(){super();this.ui=null;this.shadow=this.attachShadow({mode:"open"})}static get observedAttributes(){return["data-app","data-repo","data-repos","data-api","data-user","data-position","data-engine"]}connectedCallback(){let n=this.resolveConfig();this.ui=new F(this.shadow,n)}attributeChangedCallback(n,i,o){if(!this.ui)return;let r={};if(n==="data-app"&&(r.appId=o),n==="data-repo"||n==="data-repos"){let s=z(this.getAttribute("data-repos"),this.getAttribute("data-repo"));r.repos=s,r.repo=s[0]||""}n==="data-api"&&(r.apiUrl=o),n==="data-user"&&(r.userEmail=o),n==="data-position"&&(r.position=o),n==="data-engine"&&(r.agentMode=o),this.ui.updateConfig(r)}resolveConfig(){let n=z(this.getAttribute("data-repos"),this.getAttribute("data-repo"));return{appId:this.getAttribute("data-app")||"",repo:n[0]||"",repos:n,apiUrl:this.getAttribute("data-api")||window.location.origin,userEmail:this.getAttribute("data-user")||void 0,position:this.getAttribute("data-position")||"bottom-right",agentMode:this.getAttribute("data-engine")||"adk"}}};typeof window<"u"&&!customElements.get("make-a-wish-widget")&&customElements.define("make-a-wish-widget",Q);function xt(){if(typeof document>"u")return;let t=document.currentScript||document.querySelector('script[src*="widget.js"]'),e=window.location.origin,n="",i="",o="",r="bottom-right";if(t){try{e=new URL(t.src,window.location.href).origin}catch{e=window.location.origin}n=t.getAttribute("data-app")||"";let s=t.getAttribute("data-repos"),a=t.getAttribute("data-repo"),l=z(s,a);i=t.getAttribute("data-api")||e,o=t.getAttribute("data-user")||"";let c=t.getAttribute("data-engine"),u=t.getAttribute("data-position");if((u==="bottom-left"||u==="bottom-right")&&(r=u),document.querySelector("make-a-wish-widget"))return;let d=document.createElement("make-a-wish-widget");n&&d.setAttribute("data-app",n),l.length>0&&(d.setAttribute("data-repos",l.join(", ")),d.setAttribute("data-repo",l[0])),i&&d.setAttribute("data-api",i),o&&d.setAttribute("data-user",o),c&&d.setAttribute("data-engine",c),d.setAttribute("data-position",r),document.body.appendChild(d)}else if(!document.querySelector("make-a-wish-widget")){let s=document.createElement("make-a-wish-widget");document.body.appendChild(s)}}typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",xt):xt());})();
//# sourceMappingURL=widget.js.map
