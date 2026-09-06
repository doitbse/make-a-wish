"use strict";(()=>{function K(t,e){if(t.match(/^[a-z]+:\/\//i))return t;if(t.match(/^\/\//))return window.location.protocol+t;if(t.match(/^[a-z]+:/i))return t;let n=document.implementation.createHTMLDocument(),i=n.createElement("base"),a=n.createElement("a");return n.head.appendChild(i),n.body.appendChild(a),e&&(i.href=e),a.href=t,a.href}var N=(()=>{let t=0,e=()=>`0000${(Math.random()*36**4<<0).toString(36)}`.slice(-4);return()=>(t+=1,`u${e()}${t}`)})();function g(t){let e=[];for(let n=0,i=t.length;n<i;n++)e.push(t[n]);return e}var E=null;function U(t={}){return E||(t.includeStyleProperties?(E=t.includeStyleProperties,E):(E=g(window.getComputedStyle(document.documentElement)),E))}function P(t,e){let i=(t.ownerDocument.defaultView||window).getComputedStyle(t).getPropertyValue(e);return i?parseFloat(i.replace("px","")):0}function At(t){let e=P(t,"border-left-width"),n=P(t,"border-right-width");return t.clientWidth+e+n}function It(t){let e=P(t,"border-top-width"),n=P(t,"border-bottom-width");return t.clientHeight+e+n}function O(t,e={}){let n=e.width||At(t),i=e.height||It(t);return{width:n,height:i}}function Z(){let t,e;try{e=process}catch{}let n=e&&e.env?e.env.devicePixelRatio:null;return n&&(t=parseInt(n,10),Number.isNaN(t)&&(t=1)),t||window.devicePixelRatio||1}var f=16384;function tt(t){(t.width>f||t.height>f)&&(t.width>f&&t.height>f?t.width>t.height?(t.height*=f/t.width,t.width=f):(t.width*=f/t.height,t.height=f):t.width>f?(t.height*=f/t.width,t.width=f):(t.width*=f/t.height,t.height=f))}function S(t){return new Promise((e,n)=>{let i=new Image;i.onload=()=>{i.decode().then(()=>{requestAnimationFrame(()=>e(i))})},i.onerror=n,i.crossOrigin="anonymous",i.decoding="async",i.src=t})}async function Ct(t){return Promise.resolve().then(()=>new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then(e=>`data:image/svg+xml;charset=utf-8,${e}`)}async function et(t,e,n){let i="http://www.w3.org/2000/svg",a=document.createElementNS(i,"svg"),s=document.createElementNS(i,"foreignObject");return a.setAttribute("width",`${e}`),a.setAttribute("height",`${n}`),a.setAttribute("viewBox",`0 0 ${e} ${n}`),s.setAttribute("width","100%"),s.setAttribute("height","100%"),s.setAttribute("x","0"),s.setAttribute("y","0"),s.setAttribute("externalResourcesRequired","true"),a.appendChild(s),s.appendChild(t),Ct(a)}var m=(t,e)=>{if(t instanceof e)return!0;let n=Object.getPrototypeOf(t);return n===null?!1:n.constructor.name===e.name||m(n,e)};function Mt(t){let e=t.getPropertyValue("content");return`${t.cssText} content: '${e.replace(/'|"/g,"")}';`}function $t(t,e){return U(e).map(n=>{let i=t.getPropertyValue(n),a=t.getPropertyPriority(n);return`${n}: ${i}${a?" !important":""};`}).join(" ")}function Lt(t,e,n,i){let a=`.${t}:${e}`,s=n.cssText?Mt(n):$t(n,i);return document.createTextNode(`${a}{${s}}`)}function nt(t,e,n,i){let a=window.getComputedStyle(t,n),s=a.getPropertyValue("content");if(s===""||s==="none")return;let o=N();try{e.className=`${e.className} ${o}`}catch{return}let r=document.createElement("style");r.appendChild(Lt(o,n,a,i)),e.appendChild(r)}function it(t,e,n){nt(t,e,":before",n),nt(t,e,":after",n)}var st="application/font-woff",at="image/jpeg",Tt={woff:st,woff2:st,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:at,jpeg:at,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml",webp:"image/webp"};function Bt(t){let e=/\.([^./]*?)$/g.exec(t);return e?e[1]:""}function k(t){let e=Bt(t).toLowerCase();return Tt[e]||""}function Rt(t){return t.split(/,/)[1]}function M(t){return t.search(/^(data:)/)!==-1}function j(t,e){return`data:${e};base64,${t}`}async function W(t,e,n){let i=await fetch(t,e);if(i.status===404)throw new Error(`Resource "${i.url}" not found`);let a=await i.blob();return new Promise((s,o)=>{let r=new FileReader;r.onerror=o,r.onloadend=()=>{try{s(n({res:i,result:r.result}))}catch(l){o(l)}},r.readAsDataURL(a)})}var _={};function Pt(t,e,n){let i=t.replace(/\?.*/,"");return n&&(i=t),/ttf|otf|eot|woff2?/i.test(i)&&(i=i.replace(/.*\//,"")),e?`[${e}]${i}`:i}async function A(t,e,n){let i=Pt(t,e,n.includeQueryParams);if(_[i]!=null)return _[i];n.cacheBust&&(t+=(/\?/.test(t)?"&":"?")+new Date().getTime());let a;try{let s=await W(t,n.fetchRequestInit,({res:o,result:r})=>(e||(e=o.headers.get("Content-Type")||""),Rt(r)));a=j(s,e)}catch(s){a=n.imagePlaceholder||"";let o=`Failed to fetch resource: ${t}`;s&&(o=typeof s=="string"?s:s.message),o&&console.warn(o)}return _[i]=a,a}async function Ut(t){let e=t.toDataURL();return e==="data:,"?t.cloneNode(!1):S(e)}async function Dt(t,e){if(t.currentSrc){let s=document.createElement("canvas"),o=s.getContext("2d");s.width=t.clientWidth,s.height=t.clientHeight,o?.drawImage(t,0,0,s.width,s.height);let r=s.toDataURL();return S(r)}let n=t.poster,i=k(n),a=await A(n,i,e);return S(a)}async function Ft(t,e){var n;try{if(!((n=t?.contentDocument)===null||n===void 0)&&n.body)return await $(t.contentDocument.body,e,!0)}catch{}return t.cloneNode(!1)}async function Ht(t,e){return m(t,HTMLCanvasElement)?Ut(t):m(t,HTMLVideoElement)?Dt(t,e):m(t,HTMLIFrameElement)?Ft(t,e):t.cloneNode(ot(t))}var Vt=t=>t.tagName!=null&&t.tagName.toUpperCase()==="SLOT",ot=t=>t.tagName!=null&&t.tagName.toUpperCase()==="SVG";async function zt(t,e,n){var i,a;if(ot(e))return e;let s=[];return Vt(t)&&t.assignedNodes?s=g(t.assignedNodes()):m(t,HTMLIFrameElement)&&(!((i=t.contentDocument)===null||i===void 0)&&i.body)?s=g(t.contentDocument.body.childNodes):s=g(((a=t.shadowRoot)!==null&&a!==void 0?a:t).childNodes),s.length===0||m(t,HTMLVideoElement)||await s.reduce((o,r)=>o.then(()=>$(r,n)).then(l=>{l&&e.appendChild(l)}),Promise.resolve()),e}function qt(t,e,n){let i=e.style;if(!i)return;let a=window.getComputedStyle(t);a.cssText?(i.cssText=a.cssText,i.transformOrigin=a.transformOrigin):U(n).forEach(s=>{let o=a.getPropertyValue(s);s==="font-size"&&o.endsWith("px")&&(o=`${Math.floor(parseFloat(o.substring(0,o.length-2)))-.1}px`),m(t,HTMLIFrameElement)&&s==="display"&&o==="inline"&&(o="block"),s==="d"&&e.getAttribute("d")&&(o=`path(${e.getAttribute("d")})`),i.setProperty(s,o,a.getPropertyPriority(s))})}function Ot(t,e){m(t,HTMLTextAreaElement)&&(e.innerHTML=t.value),m(t,HTMLInputElement)&&e.setAttribute("value",t.value)}function _t(t,e){if(m(t,HTMLSelectElement)){let i=Array.from(e.children).find(a=>t.value===a.getAttribute("value"));i&&i.setAttribute("selected","")}}function jt(t,e,n){return m(e,Element)&&(qt(t,e,n),it(t,e,n),Ot(t,e),_t(t,e)),e}async function Wt(t,e){let n=t.querySelectorAll?t.querySelectorAll("use"):[];if(n.length===0)return t;let i={};for(let s=0;s<n.length;s++){let r=n[s].getAttribute("xlink:href");if(r){let l=t.querySelector(r),c=document.querySelector(r);!l&&c&&!i[r]&&(i[r]=await $(c,e,!0))}}let a=Object.values(i);if(a.length){let s="http://www.w3.org/1999/xhtml",o=document.createElementNS(s,"svg");o.setAttribute("xmlns",s),o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.overflow="hidden",o.style.display="none";let r=document.createElementNS(s,"defs");o.appendChild(r);for(let l=0;l<a.length;l++)r.appendChild(a[l]);t.appendChild(o)}return t}async function $(t,e,n){return!n&&e.filter&&!e.filter(t)?null:Promise.resolve(t).then(i=>Ht(i,e)).then(i=>zt(t,i,e)).then(i=>jt(t,i,e)).then(i=>Wt(i,e))}var rt=/url\((['"]?)([^'"]+?)\1\)/g,Xt=/url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,Gt=/src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;function Qt(t){let e=t.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1");return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`,"g")}function Yt(t){let e=[];return t.replace(rt,(n,i,a)=>(e.push(a),n)),e.filter(n=>!M(n))}async function Jt(t,e,n,i,a){try{let s=n?K(e,n):e,o=k(e),r;if(a){let l=await a(s);r=j(l,o)}else r=await A(s,o,i);return t.replace(Qt(e),`$1${r}$3`)}catch{}return t}function Kt(t,{preferredFontFormat:e}){return e?t.replace(Gt,n=>{for(;;){let[i,,a]=Xt.exec(n)||[];if(!a)return"";if(a===e)return`src: ${i};`}}):t}function X(t){return t.search(rt)!==-1}async function D(t,e,n){if(!X(t))return t;let i=Kt(t,n);return Yt(i).reduce((s,o)=>s.then(r=>Jt(r,o,e,n)),Promise.resolve(i))}async function I(t,e,n){var i;let a=(i=e.style)===null||i===void 0?void 0:i.getPropertyValue(t);if(a){let s=await D(a,null,n);return e.style.setProperty(t,s,e.style.getPropertyPriority(t)),!0}return!1}async function Nt(t,e){await I("background",t,e)||await I("background-image",t,e),await I("mask",t,e)||await I("-webkit-mask",t,e)||await I("mask-image",t,e)||await I("-webkit-mask-image",t,e)}async function Zt(t,e){let n=m(t,HTMLImageElement);if(!(n&&!M(t.src))&&!(m(t,SVGImageElement)&&!M(t.href.baseVal)))return;let i=n?t.src:t.href.baseVal,a=await A(i,k(i),e);await new Promise((s,o)=>{t.onload=s,t.onerror=e.onImageErrorHandler?(...l)=>{try{s(e.onImageErrorHandler(...l))}catch(c){o(c)}}:o;let r=t;r.decode&&(r.decode=s),r.loading==="lazy"&&(r.loading="eager"),n?(t.srcset="",t.src=a):t.href.baseVal=a})}async function te(t,e){let i=g(t.childNodes).map(a=>G(a,e));await Promise.all(i).then(()=>t)}async function G(t,e){m(t,Element)&&(await Nt(t,e),await Zt(t,e),await te(t,e))}function lt(t,e){let{style:n}=t;e.backgroundColor&&(n.backgroundColor=e.backgroundColor),e.width&&(n.width=`${e.width}px`),e.height&&(n.height=`${e.height}px`);let i=e.style;return i!=null&&Object.keys(i).forEach(a=>{n[a]=i[a]}),t}var ct={};async function dt(t){let e=ct[t];if(e!=null)return e;let i=await(await fetch(t)).text();return e={url:t,cssText:i},ct[t]=e,e}async function pt(t,e){let n=t.cssText,i=/url\(["']?([^"')]+)["']?\)/g,s=(n.match(/url\([^)]+\)/g)||[]).map(async o=>{let r=o.replace(i,"$1");return r.startsWith("https://")||(r=new URL(r,t.url).href),W(r,e.fetchRequestInit,({result:l})=>(n=n.replace(o,`url(${l})`),[o,l]))});return Promise.all(s).then(()=>n)}function ut(t){if(t==null)return[];let e=[],n=/(\/\*[\s\S]*?\*\/)/gi,i=t.replace(n,""),a=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi");for(;;){let l=a.exec(i);if(l===null)break;e.push(l[0])}i=i.replace(a,"");let s=/@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,o="((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",r=new RegExp(o,"gi");for(;;){let l=s.exec(i);if(l===null){if(l=r.exec(i),l===null)break;s.lastIndex=r.lastIndex}else r.lastIndex=s.lastIndex;e.push(l[0])}return e}async function ee(t,e){let n=[],i=[];return t.forEach(a=>{if("cssRules"in a)try{g(a.cssRules||[]).forEach((s,o)=>{if(s.type===CSSRule.IMPORT_RULE){let r=o+1,l=s.href,c=dt(l).then(p=>pt(p,e)).then(p=>ut(p).forEach(d=>{try{a.insertRule(d,d.startsWith("@import")?r+=1:a.cssRules.length)}catch(w){console.error("Error inserting rule from remote css",{rule:d,error:w})}})).catch(p=>{console.error("Error loading remote css",p.toString())});i.push(c)}})}catch(s){let o=t.find(r=>r.href==null)||document.styleSheets[0];a.href!=null&&i.push(dt(a.href).then(r=>pt(r,e)).then(r=>ut(r).forEach(l=>{o.insertRule(l,o.cssRules.length)})).catch(r=>{console.error("Error loading remote stylesheet",r)})),console.error("Error inlining remote css file",s)}}),Promise.all(i).then(()=>(t.forEach(a=>{if("cssRules"in a)try{g(a.cssRules||[]).forEach(s=>{n.push(s)})}catch(s){console.error(`Error while reading CSS rules from ${a.href}`,s)}}),n))}function ne(t){return t.filter(e=>e.type===CSSRule.FONT_FACE_RULE).filter(e=>X(e.style.getPropertyValue("src")))}async function ie(t,e){if(t.ownerDocument==null)throw new Error("Provided element is not within a Document");let n=g(t.ownerDocument.styleSheets),i=await ee(n,e);return ne(i)}function ht(t){return t.trim().replace(/["']/g,"")}function se(t){let e=new Set;function n(i){(i.style.fontFamily||getComputedStyle(i).fontFamily).split(",").forEach(s=>{e.add(ht(s))}),Array.from(i.children).forEach(s=>{s instanceof HTMLElement&&n(s)})}return n(t),e}async function mt(t,e){let n=await ie(t,e),i=se(t);return(await Promise.all(n.filter(s=>i.has(ht(s.style.fontFamily))).map(s=>{let o=s.parentStyleSheet?s.parentStyleSheet.href:null;return D(s.cssText,o,e)}))).join(`
`)}async function ft(t,e){let n=e.fontEmbedCSS!=null?e.fontEmbedCSS:e.skipFonts?null:await mt(t,e);if(n){let i=document.createElement("style"),a=document.createTextNode(n);i.appendChild(a),t.firstChild?t.insertBefore(i,t.firstChild):t.appendChild(i)}}async function ae(t,e={}){let{width:n,height:i}=O(t,e),a=await $(t,e,!0);return await ft(a,e),await G(a,e),lt(a,e),await et(a,n,i)}async function oe(t,e={}){let{width:n,height:i}=O(t,e),a=await ae(t,e),s=await S(a),o=document.createElement("canvas"),r=o.getContext("2d"),l=e.pixelRatio||Z(),c=e.canvasWidth||n,p=e.canvasHeight||i;return o.width=c*l,o.height=p*l,e.skipAutoScale||tt(o),o.style.width=`${c}`,o.style.height=`${p}`,e.backgroundColor&&(r.fillStyle=e.backgroundColor,r.fillRect(0,0,o.width,o.height)),r.drawImage(s,0,0,o.width,o.height),o}async function gt(t,e={}){return(await oe(t,e)).toDataURL()}function wt(t){if(!t)return"";let e=[],n=t,i=0;for(;n&&n!==document.body&&n!==document.documentElement&&i<6;){let a=n;if(a.id){e.unshift(`#${a.id}`);break}let s=a.tagName.toLowerCase(),o=a.parentElement;if(o){let r=Array.from(o.children).filter(l=>l.tagName===a.tagName);if(r.length>1){let l=r.indexOf(a)+1;s+=`:nth-of-type(${l})`}}e.unshift(s),n=o,i++}return e.length===0?t.tagName.toLowerCase():e.join(" > ")}function xt(t){let e=t.id?`#${t.id}`:"",n="";return typeof t.className=="string"&&t.className.trim()&&(n="."+t.className.trim().split(/\s+/).slice(0,2).join(".")),(t.tagName.toLowerCase()+e+n).slice(0,80)}function bt(t,e=120){let n=(t.textContent||"").replace(/\s+/g," ").trim();return n.length<=e?n:n.slice(0,e-1).trimEnd()+"..."}async function F(t){try{document.querySelectorAll("[data-maw-hover]").forEach(r=>r.removeAttribute("data-maw-hover"));let e=document.documentElement,n=await gt(e,{backgroundColor:"#ffffff",width:e.scrollWidth,height:e.scrollHeight,filter:r=>!((r instanceof HTMLElement||r instanceof SVGElement)&&(r.hasAttribute("data-maw-chrome")||r.tagName.toLowerCase()==="make-a-wish-widget"||r.closest&&(r.closest("[data-maw-chrome]")||r.closest("make-a-wish-widget"))))});if(t.length===0)return n;let i=new Image;i.src=n,await new Promise((r,l)=>{i.onload=()=>r(),i.onerror=()=>l(new Error("failed to load screenshot image"))});let a=document.createElement("canvas");a.width=i.naturalWidth,a.height=i.naturalHeight;let s=a.getContext("2d");if(!s)return n;s.drawImage(i,0,0);let o=a.width/e.scrollWidth;return t.forEach((r,l)=>{let c=(r.rect.x+window.scrollX)*o,p=(r.rect.y+window.scrollY)*o,d=13*o;s.beginPath(),s.arc(c,p,d,0,Math.PI*2),s.fillStyle="#fc3165",s.fill(),s.strokeStyle="#ffffff",s.lineWidth=2*o,s.stroke(),s.fillStyle="#ffffff",s.font=`bold ${14*o}px "Inter", -apple-system, sans-serif`,s.textAlign="center",s.textBaseline="middle",s.fillText(String(l+1),c,p)}),a.toDataURL("image/png")}catch(e){return console.error("[make-a-wish] screenshot capture failed:",e),null}}function V(t,e){let n=[],i=a=>{if(!a)return;let s=a.trim();if(s){if(s.startsWith("[")&&s.endsWith("]"))try{let o=JSON.parse(s);if(Array.isArray(o)){for(let r of o)typeof r=="string"&&r.trim()&&n.push(r.trim());return}}catch{}for(let o of s.split(",")){let r=o.trim();r&&!n.includes(r)&&n.push(r)}}};return i(t),i(e),Array.from(new Set(n))}var re=[{label:"Bug",emoji:"\u{1F41B}"},{label:"Idea",emoji:"\u{1F4A1}"},{label:"Question",emoji:"\u2753"},{label:"Praise",emoji:"\u2764\uFE0F"}],H=class{constructor(e,n){this.isOpen=!1;this.isAnnotating=!1;this.isSubmitting=!1;this.isDone=!1;this.selectedCategory="Bug";this.selectedAgentMode="adk";this.textValue="";this.questionAnswer=null;this.lastAskedQuestion="";this.sessionId=null;this.chatMessages=[];this.isAskingFollowUp=!1;this.followUpInputValue="";this.annotations=[];this.screenshotDataUrl=null;this.errorMessage=null;this.modalPos=null;this.shouldFocusTextarea=!1;this.annotationOverlay=null;this.annotationPill=null;this.hoveredElement=null;this.pinElements=[];this.root=e,this.config=n;try{this.sessionId=window.localStorage.getItem("maw_session_id")||null;let i=window.localStorage.getItem("maw_chat_messages");i&&(this.chatMessages=JSON.parse(i))}catch{this.sessionId=null,this.chatMessages=[]}window.addEventListener("resize",()=>{if(this.modalPos&&this.isOpen){let i=this.root.querySelector(".maw-modal");if(i){let a=i.getBoundingClientRect(),s=8,o=Math.max(s,window.innerWidth-a.width-s),r=Math.max(s,window.innerHeight-a.height-s);this.modalPos.x=Math.max(s,Math.min(o,this.modalPos.x)),this.modalPos.y=Math.max(s,Math.min(r,this.modalPos.y)),i.style.left=`${this.modalPos.x}px`,i.style.top=`${this.modalPos.y}px`}}}),this.render()}updateConfig(e){this.config={...this.config,...e},this.render()}hasMeaningfulText(){return this.textValue.replace(/\(\d+\)\s*/g,"").trim().length>0}render(){this.root.innerHTML=`
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
        .maw-chat-view {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .maw-chat-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .maw-session-indicator {
          font-size: 10px;
          font-weight: 600;
          color: #10b981;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 12px;
          padding: 2px 8px;
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
        .maw-chat-messages {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 250px;
          min-height: 120px;
          overflow-y: auto;
          padding: 6px 4px 6px 0;
        }
        .maw-chat-messages::-webkit-scrollbar {
          width: 5px;
        }
        .maw-chat-messages::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .maw-chat-msg {
          display: flex;
          width: 100%;
        }
        .maw-chat-msg-user {
          justify-content: flex-end;
        }
        .maw-chat-msg-agent {
          justify-content: flex-start;
        }
        .maw-chat-msg-user .maw-chat-msg-bubble {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 14px 14px 2px 14px;
          padding: 8px 12px;
          max-width: 85%;
          font-size: 12.5px;
          color: #1e293b;
          line-height: 1.45;
        }
        .maw-chat-msg-agent .maw-chat-msg-bubble {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px 14px 14px 2px;
          padding: 10px 12px;
          max-width: 92%;
          font-size: 12px;
          color: #1e293b;
          line-height: 1.55;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        .maw-chat-msg-loading {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 12px;
          padding: 8px 12px;
        }
        .maw-typing-dot {
          width: 6px;
          height: 6px;
          background: #6366f1;
          border-radius: 50%;
          animation: mawBounce 1.2s infinite ease-in-out;
        }
        .maw-typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .maw-typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes mawBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
        .maw-chat-input-row {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 4px 6px 4px 10px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .maw-chat-input-row:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
          background: #ffffff;
        }
        .maw-chat-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 12.5px;
          color: #0f172a;
        }
        .maw-chat-input::placeholder {
          color: #94a3b8;
        }
        .maw-chat-send-btn {
          background: #4f46e5;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .maw-chat-send-btn:hover:not(:disabled) {
          background: #4338ca;
        }
        .maw-chat-send-btn:disabled {
          background: #e2e8f0;
          color: #94a3b8;
          cursor: not-allowed;
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
            `:this.selectedCategory==="Question"&&this.chatMessages.length>0?`
              <div class="maw-chat-view">
                <div class="maw-chat-header-bar">
                  <div class="maw-ai-badge">
                    <span>\u2728 Live AI Assistant</span>
                  </div>
                  ${this.sessionId?'<span class="maw-session-indicator" title="Persistent Session">Active Topic</span>':""}
                </div>

                <div class="maw-chat-messages" id="mawChatMessages">
                  ${this.chatMessages.map(e=>`
                    <div class="maw-chat-msg maw-chat-msg-${e.role}">
                      <div class="maw-chat-msg-bubble">
                        ${e.role==="user"?`<div class="maw-user-msg-text">${this.escapeHtml(e.text)}</div>`:`<div class="maw-agent-msg-text">${this.renderMarkdown(e.text)}</div>`}
                      </div>
                    </div>
                  `).join("")}

                  ${this.isAskingFollowUp?`
                    <div class="maw-chat-msg maw-chat-msg-agent">
                      <div class="maw-chat-msg-bubble maw-chat-msg-loading">
                        <div class="maw-typing-dot"></div>
                        <div class="maw-typing-dot"></div>
                        <div class="maw-typing-dot"></div>
                        <span>Thinking...</span>
                      </div>
                    </div>
                  `:""}
                </div>

                <div class="maw-chat-input-row">
                  <input
                    type="text"
                    class="maw-chat-input"
                    id="mawFollowUpInput"
                    placeholder="Ask a follow-up question..."
                    value="${this.escapeHtml(this.followUpInputValue)}"
                    ${this.isAskingFollowUp?"disabled":""}
                  />
                  <button
                    type="button"
                    class="maw-chat-send-btn"
                    id="mawFollowUpSendBtn"
                    ${!this.followUpInputValue.trim()||this.isAskingFollowUp?"disabled":""}
                    title="Send follow-up"
                  >
                    <svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor;"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                  </button>
                </div>

                ${this.errorMessage?`<div class="maw-error">${this.escapeHtml(this.errorMessage)}</div>`:""}

                <div class="maw-answer-actions">
                  <button type="button" class="maw-escalate-btn" id="mawEscalateBtn">
                    <span>\u{1F680}</span> Need code changes? File as Wish / Bug
                  </button>
                  <div style="display: flex; gap: 8px;">
                    <button type="button" class="maw-secondary-btn" id="mawNewTopicBtn" style="flex: 1;">New topic</button>
                    <button type="button" class="maw-submit-btn" id="mawChatDoneBtn" style="flex: 1;">Done</button>
                  </div>
                </div>
              </div>
            `:`
              <div class="maw-categories">
                ${re.map(e=>`
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
    `,this.bindEvents()}bindEvents(){let e=this.root.getElementById("mawLauncherBtn");e&&e.addEventListener("click",()=>{this.isOpen=!0,this.render()});let n=this.root.getElementById("mawCloseBtn");n&&n.addEventListener("click",()=>{this.isOpen=!1,this.render()});let i=this.root.getElementById("mawHeader"),a=this.root.querySelector(".maw-modal");i&&a&&i.addEventListener("pointerdown",u=>{if(u.target.closest("button")||u.button!==0)return;u.preventDefault();let h=a.getBoundingClientRect(),b=u.clientX,y=u.clientY,z=h.left,q=h.top;a.classList.add("is-dragging"),a.style.left=`${z}px`,a.style.top=`${q}px`,a.style.right="auto",a.style.bottom="auto",a.style.animation="none",this.modalPos={x:z,y:q};let Y=J=>{let vt=J.clientX-b,Et=J.clientY-y,B=z+vt,R=q+Et,v=8,St=Math.max(v,window.innerWidth-h.width-v),kt=Math.max(v,window.innerHeight-h.height-v);B=Math.max(v,Math.min(St,B)),R=Math.max(v,Math.min(kt,R)),a.style.left=`${B}px`,a.style.top=`${R}px`,this.modalPos={x:B,y:R}},T=()=>{a.classList.remove("is-dragging"),window.removeEventListener("pointermove",Y),window.removeEventListener("pointerup",T),window.removeEventListener("pointercancel",T)};window.addEventListener("pointermove",Y),window.addEventListener("pointerup",T),window.addEventListener("pointercancel",T)}),this.root.querySelectorAll(".maw-chip").forEach(u=>{u.addEventListener("click",h=>{let b=h.currentTarget.getAttribute("data-category");this.selectedCategory=b,this.errorMessage=null,this.render()})});let o=this.root.getElementById("mawFollowUpInput");o&&(o.addEventListener("input",u=>{this.followUpInputValue=u.target.value;let h=this.root.getElementById("mawFollowUpSendBtn");h&&(h.disabled=!this.followUpInputValue.trim()||this.isAskingFollowUp)}),o.addEventListener("keydown",u=>{u.key==="Enter"&&!u.shiftKey&&(u.preventDefault(),this.submitFollowUp())}));let r=this.root.getElementById("mawFollowUpSendBtn");r&&r.addEventListener("click",()=>{this.submitFollowUp()});let l=this.root.getElementById("mawNewTopicBtn");l&&l.addEventListener("click",()=>{this.resetChatSession()});let c=this.root.getElementById("mawChatDoneBtn");c&&c.addEventListener("click",()=>{this.isOpen=!1,this.render()});let p=this.root.getElementById("mawEscalateBtn");p&&p.addEventListener("click",()=>{let u=this.chatMessages.filter(h=>h.role==="user").map(h=>h.text);this.selectedCategory="Idea",this.textValue=u.length>0?`Follow-up request from discussion:
${u.map(h=>"- "+h).join(`
`)}

Proposed improvement / fix:
`:`Feature request following question:

`,this.chatMessages=[],this.questionAnswer=null,this.errorMessage=null,this.render()});let d=this.root.getElementById("mawTextInput");d&&(this.shouldFocusTextarea&&(this.shouldFocusTextarea=!1,setTimeout(()=>{d.focus();let u=d.value.length;d.setSelectionRange(u,u)},50)),d.addEventListener("input",u=>{this.textValue=u.target.value;let h=this.root.getElementById("mawSubmitBtn");h&&(h.disabled=this.isSubmitting||!this.hasMeaningfulText())}));let w=this.root.getElementById("mawStartAnnotateBtn");w&&w.addEventListener("click",()=>{this.startAnnotationMode()});let x=this.root.getElementById("mawRemoveShotBtn");x&&x.addEventListener("click",()=>{this.screenshotDataUrl=null,this.annotations=[],this.textValue==="(1) "&&(this.textValue=""),this.render()});let C=this.root.getElementById("mawSubmitBtn");C&&C.addEventListener("click",()=>{this.submitFeedback()});let L=this.root.getElementById("mawResetBtn");L&&L.addEventListener("click",()=>{this.isDone=!1,this.textValue="",this.selectedCategory="Bug",this.selectedAgentMode="adk",this.questionAnswer=null,this.lastAskedQuestion="",this.annotations=[],this.screenshotDataUrl=null,this.errorMessage=null,this.render()})}startAnnotationMode(){this.isAnnotating=!0,this.textValue.trim()||(this.textValue="(1) "),this.render();let e=document.createElement("div");e.setAttribute("data-maw-chrome",""),e.style.position="fixed",e.style.inset="0",e.style.zIndex="2147483642",e.style.cursor="crosshair",e.style.background="rgba(15, 23, 42, 0.02)",document.body.appendChild(e),this.annotationOverlay=e;let n=document.createElement("div");if(n.setAttribute("data-maw-chrome",""),n.style.position="fixed",n.style.top="20px",n.style.right="20px",n.style.zIndex="2147483645",n.style.background="#1a1a2e",n.style.color="#ffffff",n.style.padding="8px 16px",n.style.borderRadius="9999px",n.style.border="1px solid rgba(229, 231, 235, 0.2)",n.style.display="flex",n.style.alignItems="center",n.style.gap="10px",n.style.boxShadow="0 10px 25px -3px rgba(0, 0, 0, 0.35)",n.style.fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif",n.style.fontSize="13px",n.style.cursor="grab",n.style.userSelect="none",n.style.touchAction="none",n.title="Drag to move",n.innerHTML=`
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
    `,document.body.appendChild(n),this.annotationPill=n,n.addEventListener("pointerdown",o=>{if(o.target.closest("button")||o.button!==0)return;o.preventDefault(),n.style.cursor="grabbing";let r=n.getBoundingClientRect(),l=o.clientX,c=o.clientY,p=r.left,d=r.top;n.style.left=`${p}px`,n.style.top=`${d}px`,n.style.right="auto",n.style.bottom="auto";let w=C=>{let L=C.clientX-l,u=C.clientY-c,h=p+L,b=d+u,y=8;h=Math.max(y,Math.min(window.innerWidth-r.width-y,h)),b=Math.max(y,Math.min(window.innerHeight-r.height-y,b)),n.style.left=`${h}px`,n.style.top=`${b}px`},x=()=>{n.style.cursor="grab",window.removeEventListener("pointermove",w),window.removeEventListener("pointerup",x),window.removeEventListener("pointercancel",x)};window.addEventListener("pointermove",w),window.addEventListener("pointerup",x),window.addEventListener("pointercancel",x)}),!document.getElementById("maw-hover-style")){let o=document.createElement("style");o.id="maw-hover-style",o.innerHTML="[data-maw-hover] { outline: 2px solid #fc3165 !important; outline-offset: 2px !important; cursor: crosshair !important; }",document.head.appendChild(o)}let i=(o,r)=>{e.style.pointerEvents="none";let l=document.elementFromPoint(o,r);return e.style.pointerEvents="auto",!l||l.closest("[data-maw-chrome]")||l.closest("make-a-wish-widget")?null:l};e.onmousemove=o=>{let r=i(o.clientX,o.clientY);r!==this.hoveredElement&&(this.hoveredElement&&this.hoveredElement.removeAttribute("data-maw-hover"),r&&r.setAttribute("data-maw-hover",""),this.hoveredElement=r)},e.onclick=o=>{o.preventDefault(),o.stopPropagation();let r=i(o.clientX,o.clientY);if(!r)return;let l=r.getBoundingClientRect(),c={selector:wt(r),tag:r.tagName.toLowerCase(),hint:xt(r),text:bt(r),rect:{x:l.x,y:l.y,width:l.width,height:l.height}};this.annotations.push(c),this.renderPin(c,this.annotations.length);let p=n.querySelector("#mawPillText");p&&(p.textContent=`Click elements to pin (${this.annotations.length})`);let d=this.annotations.length;d===1?this.textValue.trim()?this.textValue.includes("(1)")||(this.textValue=this.textValue.trimEnd()+`
(1) `):this.textValue="(1) ":d>1&&(this.textValue.includes(`(${d})`)||(this.textValue=this.textValue.trimEnd()+`
(${d}) `))};let a=n.querySelector("#mawDoneAnnotateBtn");a&&a.addEventListener("click",async()=>{await this.finishAnnotation(!0)});let s=n.querySelector("#mawCancelAnnotateBtn");s&&s.addEventListener("click",async()=>{await this.finishAnnotation(!1)})}renderPin(e,n){let i=document.createElement("div");i.setAttribute("data-maw-chrome",""),i.style.position="fixed",i.style.left=`${e.rect.x}px`,i.style.top=`${e.rect.y}px`,i.style.width="24px",i.style.height="24px",i.style.borderRadius="9999px",i.style.background="#fc3165",i.style.color="#ffffff",i.style.fontFamily="'Inter', -apple-system, sans-serif",i.style.fontSize="12px",i.style.fontWeight="700",i.style.display="flex",i.style.alignItems="center",i.style.justifyContent="center",i.style.boxShadow="0 0 0 2px #ffffff, 0 4px 10px rgba(252, 49, 101, 0.4)",i.style.zIndex="2147483644",i.style.pointerEvents="none",i.textContent=String(n),document.body.appendChild(i),this.pinElements.push(i)}async finishAnnotation(e){if(this.hoveredElement&&(this.hoveredElement.removeAttribute("data-maw-hover"),this.hoveredElement=null),this.annotationOverlay&&(this.annotationOverlay.remove(),this.annotationOverlay=null),this.annotationPill&&(this.annotationPill.remove(),this.annotationPill=null),this.pinElements.forEach(n=>n.remove()),this.pinElements=[],e){let n=await F(this.annotations);if(this.screenshotDataUrl=n,this.annotations.length>0){this.textValue.trim()?this.textValue.includes("(1)")||(this.textValue=this.textValue.trimEnd()+`
(1) `):this.textValue="(1) ";for(let i=2;i<=this.annotations.length;i++)this.textValue.includes(`(${i})`)||(this.textValue=this.textValue.trimEnd()+`
(${i}) `)}this.shouldFocusTextarea=!0}else this.textValue==="(1) "&&(this.textValue=""),this.annotations=[];this.isAnnotating=!1,this.render()}async submitFeedback(){if(this.selectedCategory==="Question")return this.submitQuestion();if(!this.hasMeaningfulText()||this.isSubmitting)return;this.isSubmitting=!0,this.errorMessage=null,this.render();let e=this.screenshotDataUrl;e||(e=await F(this.annotations),this.screenshotDataUrl=e);let n=this.config.repos&&this.config.repos.length>0?this.config.repos:this.config.repo?[this.config.repo]:[],i=n[0]||this.config.repo||"",a={appId:this.config.appId||"default-app",repo:i,repos:n,agentMode:this.selectedAgentMode,category:this.selectedCategory,text:this.textValue.trim(),annotations:this.annotations,screenshot:e,url:window.location.href,userAgent:navigator.userAgent,userEmail:this.config.userEmail||"",timestamp:new Date().toISOString()};try{let s=(this.config.apiUrl||window.location.origin).replace(/\/$/,""),o=await fetch(`${s}/api/feedback`,{method:"POST",headers:{"Content-Type":"application/json","X-Make-A-Wish-App":this.config.appId||"generic"},body:JSON.stringify(a)});if(!o.ok){let r=await o.text();throw new Error(`Submission failed (${o.status}): ${r.slice(0,150)}`)}this.isDone=!0,this.isSubmitting=!1,this.render()}catch(s){this.isSubmitting=!1,this.errorMessage=s instanceof Error?s.message:"Submission failed",this.render()}}async submitQuestion(){if(!this.hasMeaningfulText()||this.isSubmitting)return;let e=this.textValue.trim();this.isSubmitting=!0,this.errorMessage=null,this.lastAskedQuestion=e,this.chatMessages.push({id:`msg_${Date.now()}_u`,role:"user",text:e,timestamp:new Date().toISOString()}),this.textValue="",this.render(),this.scrollChatToBottom();let n=this.screenshotDataUrl;!n&&this.annotations.length>0&&(n=await F(this.annotations),this.screenshotDataUrl=n);let i=this.config.repos&&this.config.repos.length>0?this.config.repos:this.config.repo?[this.config.repo]:[],a=i[0]||this.config.repo||"",s={question:e,sessionId:this.sessionId,appId:this.config.appId||"default-app",repo:a,repos:i,screenshot:n,annotations:this.annotations,url:window.location.href,userAgent:navigator.userAgent,userEmail:this.config.userEmail||"sascha@doit.com",timestamp:new Date().toISOString()};try{let o=(this.config.apiUrl||window.location.origin).replace(/\/$/,""),r=await fetch(`${o}/api/question`,{method:"POST",headers:{"Content-Type":"application/json","X-Make-A-Wish-App":this.config.appId||"generic"},body:JSON.stringify(s)});if(!r.ok){let p=await r.text();throw new Error(`Agent query failed (${r.status}): ${p.slice(0,150)}`)}let l=await r.json();if(!l.ok&&l.error)throw new Error(l.message||l.error);if(l.sessionId){this.sessionId=l.sessionId;try{window.localStorage.setItem("maw_session_id",this.sessionId)}catch{}}let c=l.answer||"No answer returned.";this.questionAnswer=c,this.chatMessages.push({id:`msg_${Date.now()}_a`,role:"agent",text:c,timestamp:new Date().toISOString()});try{window.localStorage.setItem("maw_chat_messages",JSON.stringify(this.chatMessages))}catch{}this.isSubmitting=!1,this.render(),this.scrollChatToBottom()}catch(o){this.isSubmitting=!1,this.errorMessage=o instanceof Error?o.message:"Failed to receive answer from agent",this.render()}}async submitFollowUp(){let e=this.followUpInputValue.trim();if(!e||this.isAskingFollowUp)return;this.followUpInputValue="",this.isAskingFollowUp=!0,this.errorMessage=null,this.chatMessages.push({id:`msg_${Date.now()}_u`,role:"user",text:e,timestamp:new Date().toISOString()}),this.render(),this.scrollChatToBottom();let n=this.config.repos&&this.config.repos.length>0?this.config.repos:this.config.repo?[this.config.repo]:[],i=n[0]||this.config.repo||"",a={question:e,sessionId:this.sessionId,appId:this.config.appId||"default-app",repo:i,repos:n,url:window.location.href,userAgent:navigator.userAgent,userEmail:this.config.userEmail||"sascha@doit.com",timestamp:new Date().toISOString()};try{let s=(this.config.apiUrl||window.location.origin).replace(/\/$/,""),o=await fetch(`${s}/api/question`,{method:"POST",headers:{"Content-Type":"application/json","X-Make-A-Wish-App":this.config.appId||"generic"},body:JSON.stringify(a)});if(!o.ok){let c=await o.text();throw new Error(`Agent query failed (${o.status}): ${c.slice(0,150)}`)}let r=await o.json();if(!r.ok&&r.error)throw new Error(r.message||r.error);if(r.sessionId){this.sessionId=r.sessionId;try{window.localStorage.setItem("maw_session_id",this.sessionId)}catch{}}let l=r.answer||"No answer returned.";this.chatMessages.push({id:`msg_${Date.now()}_a`,role:"agent",text:l,timestamp:new Date().toISOString()});try{window.localStorage.setItem("maw_chat_messages",JSON.stringify(this.chatMessages))}catch{}this.isAskingFollowUp=!1,this.render(),this.scrollChatToBottom()}catch(s){this.isAskingFollowUp=!1,this.errorMessage=s instanceof Error?s.message:"Failed to receive answer from agent",this.render()}}resetChatSession(){this.sessionId=null,this.chatMessages=[],this.followUpInputValue="",this.isAskingFollowUp=!1,this.questionAnswer=null,this.errorMessage=null;try{window.localStorage.removeItem("maw_session_id"),window.localStorage.removeItem("maw_chat_messages")}catch{}this.render()}scrollChatToBottom(){setTimeout(()=>{let e=this.root.getElementById("mawChatMessages");e&&(e.scrollTop=e.scrollHeight);let n=this.root.getElementById("mawFollowUpInput");n&&!this.isAskingFollowUp&&n.focus()},40)}renderMarkdown(e){if(!e)return"";let n=this.escapeHtml(e);return n=n.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g,(i,a,s)=>`<pre class="maw-code-block"><code>${s.trim()}</code></pre>`),n=n.replace(/`([^`]+)`/g,'<code class="maw-inline-code">$1</code>'),n=n.replace(/^### (.*$)/gm,'<h4 class="maw-h4">$1</h4>'),n=n.replace(/^## (.*$)/gm,'<h3 class="maw-h3">$1</h3>'),n=n.replace(/^# (.*$)/gm,'<h2 class="maw-h2">$1</h2>'),n=n.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),n=n.replace(/\*([^*]+)\*/g,"<em>$1</em>"),n=n.replace(/^\s*[-*]\s+(.*$)/gm,'<li class="maw-list-item">$1</li>'),n=n.replace(/(<li class="maw-list-item">[\s\S]*?<\/li>)/g,'<ul class="maw-list">$1</ul>'),n=n.replace(/<\/ul>\s*<ul class="maw-list">/g,""),n=n.replace(/^\s*(\d+)\.\s+(.*$)/gm,'<li class="maw-num-item"><span>$1.</span> $2</li>'),n=n.replace(/(<li class="maw-num-item">[\s\S]*?<\/li>)/g,'<ol class="maw-num-list">$1</ol>'),n=n.replace(/<\/ol>\s*<ol class="maw-num-list">/g,""),n=n.replace(/\n\n+/g,'</p><p class="maw-para">'),n=n.replace(/\n/g,"<br/>"),`<div class="maw-md"><p class="maw-para">${n}</p></div>`}escapeHtml(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}};var Q=class extends HTMLElement{constructor(){super();this.ui=null;this.shadow=this.attachShadow({mode:"open"})}static get observedAttributes(){return["data-app","data-repo","data-repos","data-api","data-user","data-user-email","data-position"]}connectedCallback(){let n=this.resolveConfig();this.ui=new H(this.shadow,n)}attributeChangedCallback(n,i,a){if(!this.ui)return;let s={};if(n==="data-app"&&(s.appId=a),n==="data-repo"||n==="data-repos"){let o=V(this.getAttribute("data-repos"),this.getAttribute("data-repo"));s.repos=o,s.repo=o[0]||""}n==="data-api"&&(s.apiUrl=a),(n==="data-user"||n==="data-user-email")&&(s.userEmail=a),n==="data-position"&&(s.position=a),this.ui.updateConfig(s)}resolveConfig(){let n=V(this.getAttribute("data-repos"),this.getAttribute("data-repo")),i=this.getAttribute("data-user-email")||this.getAttribute("data-user")||(typeof window<"u"?window.__USER_EMAIL__||window.USER_EMAIL:void 0);return{appId:this.getAttribute("data-app")||"",repo:n[0]||"",repos:n,apiUrl:this.getAttribute("data-api")||window.location.origin,userEmail:i||void 0,position:this.getAttribute("data-position")||"bottom-right"}}};typeof window<"u"&&!customElements.get("make-a-wish-widget")&&customElements.define("make-a-wish-widget",Q);function yt(){if(typeof document>"u")return;let t=document.currentScript||document.querySelector('script[src*="widget.js"]'),e=window.location.origin,n="",i="",a="",s="",o="bottom-right";if(t){try{e=new URL(t.src,window.location.href).origin}catch{e=window.location.origin}n=t.getAttribute("data-app")||"";let r=t.getAttribute("data-repos"),l=t.getAttribute("data-repo"),c=V(r,l);a=t.getAttribute("data-api")||e,s=t.getAttribute("data-user-email")||t.getAttribute("data-user")||"";let p=t.getAttribute("data-position");if((p==="bottom-left"||p==="bottom-right")&&(o=p),document.querySelector("make-a-wish-widget"))return;let d=document.createElement("make-a-wish-widget");n&&d.setAttribute("data-app",n),c.length>0&&(d.setAttribute("data-repos",c.join(", ")),d.setAttribute("data-repo",c[0])),a&&d.setAttribute("data-api",a),s&&(d.setAttribute("data-user",s),d.setAttribute("data-user-email",s)),d.setAttribute("data-position",o),document.body.appendChild(d)}else if(!document.querySelector("make-a-wish-widget")){let r=document.createElement("make-a-wish-widget");document.body.appendChild(r)}}typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",yt):yt());})();
//# sourceMappingURL=widget.js.map
