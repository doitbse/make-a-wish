"use strict";(()=>{function D(t,e){if(t.match(/^[a-z]+:\/\//i))return t;if(t.match(/^\/\//))return window.location.protocol+t;if(t.match(/^[a-z]+:/i))return t;let n=document.implementation.createHTMLDocument(),r=n.createElement("base"),o=n.createElement("a");return n.head.appendChild(r),n.body.appendChild(o),e&&(r.href=e),o.href=t,o.href}var M=(()=>{let t=0,e=()=>`0000${(Math.random()*36**4<<0).toString(36)}`.slice(-4);return()=>(t+=1,`u${e()}${t}`)})();function h(t){let e=[];for(let n=0,r=t.length;n<r;n++)e.push(t[n]);return e}var p=null;function S(t={}){return p||(t.includeStyleProperties?(p=t.includeStyleProperties,p):(p=h(window.getComputedStyle(document.documentElement)),p))}function E(t,e){let r=(t.ownerDocument.defaultView||window).getComputedStyle(t).getPropertyValue(e);return r?parseFloat(r.replace("px","")):0}function ot(t){let e=E(t,"border-left-width"),n=E(t,"border-right-width");return t.clientWidth+e+n}function at(t){let e=E(t,"border-top-width"),n=E(t,"border-bottom-width");return t.clientHeight+e+n}function A(t,e={}){let n=e.width||ot(t),r=e.height||at(t);return{width:n,height:r}}function U(){let t,e;try{e=process}catch{}let n=e&&e.env?e.env.devicePixelRatio:null;return n&&(t=parseInt(n,10),Number.isNaN(t)&&(t=1)),t||window.devicePixelRatio||1}var f=16384;function F(t){(t.width>f||t.height>f)&&(t.width>f&&t.height>f?t.width>t.height?(t.height*=f/t.width,t.width=f):(t.width*=f/t.height,t.height=f):t.width>f?(t.height*=f/t.width,t.width=f):(t.width*=f/t.height,t.height=f))}function g(t){return new Promise((e,n)=>{let r=new Image;r.onload=()=>{r.decode().then(()=>{requestAnimationFrame(()=>e(r))})},r.onerror=n,r.crossOrigin="anonymous",r.decoding="async",r.src=t})}async function st(t){return Promise.resolve().then(()=>new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then(e=>`data:image/svg+xml;charset=utf-8,${e}`)}async function H(t,e,n){let r="http://www.w3.org/2000/svg",o=document.createElementNS(r,"svg"),i=document.createElementNS(r,"foreignObject");return o.setAttribute("width",`${e}`),o.setAttribute("height",`${n}`),o.setAttribute("viewBox",`0 0 ${e} ${n}`),i.setAttribute("width","100%"),i.setAttribute("height","100%"),i.setAttribute("x","0"),i.setAttribute("y","0"),i.setAttribute("externalResourcesRequired","true"),o.appendChild(i),i.appendChild(t),st(o)}var d=(t,e)=>{if(t instanceof e)return!0;let n=Object.getPrototypeOf(t);return n===null?!1:n.constructor.name===e.name||d(n,e)};function lt(t){let e=t.getPropertyValue("content");return`${t.cssText} content: '${e.replace(/'|"/g,"")}';`}function ct(t,e){return S(e).map(n=>{let r=t.getPropertyValue(n),o=t.getPropertyPriority(n);return`${n}: ${r}${o?" !important":""};`}).join(" ")}function ut(t,e,n,r){let o=`.${t}:${e}`,i=n.cssText?lt(n):ct(n,r);return document.createTextNode(`${o}{${i}}`)}function z(t,e,n,r){let o=window.getComputedStyle(t,n),i=o.getPropertyValue("content");if(i===""||i==="none")return;let a=M();try{e.className=`${e.className} ${a}`}catch{return}let s=document.createElement("style");s.appendChild(ut(a,n,o,r)),e.appendChild(s)}function O(t,e,n){z(t,e,":before",n),z(t,e,":after",n)}var W="application/font-woff",j="image/jpeg",dt={woff:W,woff2:W,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:j,jpeg:j,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml",webp:"image/webp"};function ft(t){let e=/\.([^./]*?)$/g.exec(t);return e?e[1]:""}function w(t){let e=ft(t).toLowerCase();return dt[e]||""}function ht(t){return t.split(/,/)[1]}function y(t){return t.search(/^(data:)/)!==-1}function R(t,e){return`data:${e};base64,${t}`}async function T(t,e,n){let r=await fetch(t,e);if(r.status===404)throw new Error(`Resource "${r.url}" not found`);let o=await r.blob();return new Promise((i,a)=>{let s=new FileReader;s.onerror=a,s.onloadend=()=>{try{i(n({res:r,result:s.result}))}catch(l){a(l)}},s.readAsDataURL(o)})}var L={};function mt(t,e,n){let r=t.replace(/\?.*/,"");return n&&(r=t),/ttf|otf|eot|woff2?/i.test(r)&&(r=r.replace(/.*\//,"")),e?`[${e}]${r}`:r}async function b(t,e,n){let r=mt(t,e,n.includeQueryParams);if(L[r]!=null)return L[r];n.cacheBust&&(t+=(/\?/.test(t)?"&":"?")+new Date().getTime());let o;try{let i=await T(t,n.fetchRequestInit,({res:a,result:s})=>(e||(e=a.headers.get("Content-Type")||""),ht(s)));o=R(i,e)}catch(i){o=n.imagePlaceholder||"";let a=`Failed to fetch resource: ${t}`;i&&(a=typeof i=="string"?i:i.message),a&&console.warn(a)}return L[r]=o,o}async function pt(t){let e=t.toDataURL();return e==="data:,"?t.cloneNode(!1):g(e)}async function gt(t,e){if(t.currentSrc){let i=document.createElement("canvas"),a=i.getContext("2d");i.width=t.clientWidth,i.height=t.clientHeight,a?.drawImage(t,0,0,i.width,i.height);let s=i.toDataURL();return g(s)}let n=t.poster,r=w(n),o=await b(n,r,e);return g(o)}async function wt(t,e){var n;try{if(!((n=t?.contentDocument)===null||n===void 0)&&n.body)return await v(t.contentDocument.body,e,!0)}catch{}return t.cloneNode(!1)}async function bt(t,e){return d(t,HTMLCanvasElement)?pt(t):d(t,HTMLVideoElement)?gt(t,e):d(t,HTMLIFrameElement)?wt(t,e):t.cloneNode(V(t))}var xt=t=>t.tagName!=null&&t.tagName.toUpperCase()==="SLOT",V=t=>t.tagName!=null&&t.tagName.toUpperCase()==="SVG";async function yt(t,e,n){var r,o;if(V(e))return e;let i=[];return xt(t)&&t.assignedNodes?i=h(t.assignedNodes()):d(t,HTMLIFrameElement)&&(!((r=t.contentDocument)===null||r===void 0)&&r.body)?i=h(t.contentDocument.body.childNodes):i=h(((o=t.shadowRoot)!==null&&o!==void 0?o:t).childNodes),i.length===0||d(t,HTMLVideoElement)||await i.reduce((a,s)=>a.then(()=>v(s,n)).then(l=>{l&&e.appendChild(l)}),Promise.resolve()),e}function vt(t,e,n){let r=e.style;if(!r)return;let o=window.getComputedStyle(t);o.cssText?(r.cssText=o.cssText,r.transformOrigin=o.transformOrigin):S(n).forEach(i=>{let a=o.getPropertyValue(i);i==="font-size"&&a.endsWith("px")&&(a=`${Math.floor(parseFloat(a.substring(0,a.length-2)))-.1}px`),d(t,HTMLIFrameElement)&&i==="display"&&a==="inline"&&(a="block"),i==="d"&&e.getAttribute("d")&&(a=`path(${e.getAttribute("d")})`),r.setProperty(i,a,o.getPropertyPriority(i))})}function Et(t,e){d(t,HTMLTextAreaElement)&&(e.innerHTML=t.value),d(t,HTMLInputElement)&&e.setAttribute("value",t.value)}function St(t,e){if(d(t,HTMLSelectElement)){let r=Array.from(e.children).find(o=>t.value===o.getAttribute("value"));r&&r.setAttribute("selected","")}}function Ct(t,e,n){return d(e,Element)&&(vt(t,e,n),O(t,e,n),Et(t,e),St(t,e)),e}async function kt(t,e){let n=t.querySelectorAll?t.querySelectorAll("use"):[];if(n.length===0)return t;let r={};for(let i=0;i<n.length;i++){let s=n[i].getAttribute("xlink:href");if(s){let l=t.querySelector(s),c=document.querySelector(s);!l&&c&&!r[s]&&(r[s]=await v(c,e,!0))}}let o=Object.values(r);if(o.length){let i="http://www.w3.org/1999/xhtml",a=document.createElementNS(i,"svg");a.setAttribute("xmlns",i),a.style.position="absolute",a.style.width="0",a.style.height="0",a.style.overflow="hidden",a.style.display="none";let s=document.createElementNS(i,"defs");a.appendChild(s);for(let l=0;l<o.length;l++)s.appendChild(o[l]);t.appendChild(a)}return t}async function v(t,e,n){return!n&&e.filter&&!e.filter(t)?null:Promise.resolve(t).then(r=>bt(r,e)).then(r=>yt(t,r,e)).then(r=>Ct(t,r,e)).then(r=>kt(r,e))}var q=/url\((['"]?)([^'"]+?)\1\)/g,At=/url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,Lt=/src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;function Rt(t){let e=t.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1");return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`,"g")}function Tt(t){let e=[];return t.replace(q,(n,r,o)=>(e.push(o),n)),e.filter(n=>!y(n))}async function Pt(t,e,n,r,o){try{let i=n?D(e,n):e,a=w(e),s;if(o){let l=await o(i);s=R(l,a)}else s=await b(i,a,r);return t.replace(Rt(e),`$1${s}$3`)}catch{}return t}function It(t,{preferredFontFormat:e}){return e?t.replace(Lt,n=>{for(;;){let[r,,o]=At.exec(n)||[];if(!o)return"";if(o===e)return`src: ${r};`}}):t}function P(t){return t.search(q)!==-1}async function C(t,e,n){if(!P(t))return t;let r=It(t,n);return Tt(r).reduce((i,a)=>i.then(s=>Pt(s,a,e,n)),Promise.resolve(r))}async function x(t,e,n){var r;let o=(r=e.style)===null||r===void 0?void 0:r.getPropertyValue(t);if(o){let i=await C(o,null,n);return e.style.setProperty(t,i,e.style.getPropertyPriority(t)),!0}return!1}async function $t(t,e){await x("background",t,e)||await x("background-image",t,e),await x("mask",t,e)||await x("-webkit-mask",t,e)||await x("mask-image",t,e)||await x("-webkit-mask-image",t,e)}async function Bt(t,e){let n=d(t,HTMLImageElement);if(!(n&&!y(t.src))&&!(d(t,SVGImageElement)&&!y(t.href.baseVal)))return;let r=n?t.src:t.href.baseVal,o=await b(r,w(r),e);await new Promise((i,a)=>{t.onload=i,t.onerror=e.onImageErrorHandler?(...l)=>{try{i(e.onImageErrorHandler(...l))}catch(c){a(c)}}:a;let s=t;s.decode&&(s.decode=i),s.loading==="lazy"&&(s.loading="eager"),n?(t.srcset="",t.src=o):t.href.baseVal=o})}async function Dt(t,e){let r=h(t.childNodes).map(o=>I(o,e));await Promise.all(r).then(()=>t)}async function I(t,e){d(t,Element)&&(await $t(t,e),await Bt(t,e),await Dt(t,e))}function _(t,e){let{style:n}=t;e.backgroundColor&&(n.backgroundColor=e.backgroundColor),e.width&&(n.width=`${e.width}px`),e.height&&(n.height=`${e.height}px`);let r=e.style;return r!=null&&Object.keys(r).forEach(o=>{n[o]=r[o]}),t}var G={};async function X(t){let e=G[t];if(e!=null)return e;let r=await(await fetch(t)).text();return e={url:t,cssText:r},G[t]=e,e}async function Y(t,e){let n=t.cssText,r=/url\(["']?([^"')]+)["']?\)/g,i=(n.match(/url\([^)]+\)/g)||[]).map(async a=>{let s=a.replace(r,"$1");return s.startsWith("https://")||(s=new URL(s,t.url).href),T(s,e.fetchRequestInit,({result:l})=>(n=n.replace(a,`url(${l})`),[a,l]))});return Promise.all(i).then(()=>n)}function J(t){if(t==null)return[];let e=[],n=/(\/\*[\s\S]*?\*\/)/gi,r=t.replace(n,""),o=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi");for(;;){let l=o.exec(r);if(l===null)break;e.push(l[0])}r=r.replace(o,"");let i=/@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,a="((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",s=new RegExp(a,"gi");for(;;){let l=i.exec(r);if(l===null){if(l=s.exec(r),l===null)break;i.lastIndex=s.lastIndex}else s.lastIndex=i.lastIndex;e.push(l[0])}return e}async function Mt(t,e){let n=[],r=[];return t.forEach(o=>{if("cssRules"in o)try{h(o.cssRules||[]).forEach((i,a)=>{if(i.type===CSSRule.IMPORT_RULE){let s=a+1,l=i.href,c=X(l).then(u=>Y(u,e)).then(u=>J(u).forEach(m=>{try{o.insertRule(m,m.startsWith("@import")?s+=1:o.cssRules.length)}catch(it){console.error("Error inserting rule from remote css",{rule:m,error:it})}})).catch(u=>{console.error("Error loading remote css",u.toString())});r.push(c)}})}catch(i){let a=t.find(s=>s.href==null)||document.styleSheets[0];o.href!=null&&r.push(X(o.href).then(s=>Y(s,e)).then(s=>J(s).forEach(l=>{a.insertRule(l,a.cssRules.length)})).catch(s=>{console.error("Error loading remote stylesheet",s)})),console.error("Error inlining remote css file",i)}}),Promise.all(r).then(()=>(t.forEach(o=>{if("cssRules"in o)try{h(o.cssRules||[]).forEach(i=>{n.push(i)})}catch(i){console.error(`Error while reading CSS rules from ${o.href}`,i)}}),n))}function Ut(t){return t.filter(e=>e.type===CSSRule.FONT_FACE_RULE).filter(e=>P(e.style.getPropertyValue("src")))}async function Ft(t,e){if(t.ownerDocument==null)throw new Error("Provided element is not within a Document");let n=h(t.ownerDocument.styleSheets),r=await Mt(n,e);return Ut(r)}function Q(t){return t.trim().replace(/["']/g,"")}function Ht(t){let e=new Set;function n(r){(r.style.fontFamily||getComputedStyle(r).fontFamily).split(",").forEach(i=>{e.add(Q(i))}),Array.from(r.children).forEach(i=>{i instanceof HTMLElement&&n(i)})}return n(t),e}async function K(t,e){let n=await Ft(t,e),r=Ht(t);return(await Promise.all(n.filter(i=>r.has(Q(i.style.fontFamily))).map(i=>{let a=i.parentStyleSheet?i.parentStyleSheet.href:null;return C(i.cssText,a,e)}))).join(`
`)}async function Z(t,e){let n=e.fontEmbedCSS!=null?e.fontEmbedCSS:e.skipFonts?null:await K(t,e);if(n){let r=document.createElement("style"),o=document.createTextNode(n);r.appendChild(o),t.firstChild?t.insertBefore(r,t.firstChild):t.appendChild(r)}}async function zt(t,e={}){let{width:n,height:r}=A(t,e),o=await v(t,e,!0);return await Z(o,e),await I(o,e),_(o,e),await H(o,n,r)}async function Ot(t,e={}){let{width:n,height:r}=A(t,e),o=await zt(t,e),i=await g(o),a=document.createElement("canvas"),s=a.getContext("2d"),l=e.pixelRatio||U(),c=e.canvasWidth||n,u=e.canvasHeight||r;return a.width=c*l,a.height=u*l,e.skipAutoScale||F(a),a.style.width=`${c}`,a.style.height=`${u}`,e.backgroundColor&&(s.fillStyle=e.backgroundColor,s.fillRect(0,0,a.width,a.height)),s.drawImage(i,0,0,a.width,a.height),a}async function N(t,e={}){return(await Ot(t,e)).toDataURL()}function tt(t){if(!t)return"";let e=[],n=t,r=0;for(;n&&n!==document.body&&n!==document.documentElement&&r<6;){let o=n;if(o.id){e.unshift(`#${o.id}`);break}let i=o.tagName.toLowerCase(),a=o.parentElement;if(a){let s=Array.from(a.children).filter(l=>l.tagName===o.tagName);if(s.length>1){let l=s.indexOf(o)+1;i+=`:nth-of-type(${l})`}}e.unshift(i),n=a,r++}return e.length===0?t.tagName.toLowerCase():e.join(" > ")}function et(t){let e=t.id?`#${t.id}`:"",n="";return typeof t.className=="string"&&t.className.trim()&&(n="."+t.className.trim().split(/\s+/).slice(0,2).join(".")),(t.tagName.toLowerCase()+e+n).slice(0,80)}function nt(t,e=120){let n=(t.textContent||"").replace(/\s+/g," ").trim();return n.length<=e?n:n.slice(0,e-1).trimEnd()+"..."}async function $(t){try{document.querySelectorAll("[data-maw-hover]").forEach(s=>s.removeAttribute("data-maw-hover"));let e=document.documentElement,n=await N(e,{backgroundColor:"#ffffff",width:e.scrollWidth,height:e.scrollHeight,filter:s=>!((s instanceof HTMLElement||s instanceof SVGElement)&&(s.hasAttribute("data-maw-chrome")||s.tagName.toLowerCase()==="make-a-wish-widget"||s.closest&&(s.closest("[data-maw-chrome]")||s.closest("make-a-wish-widget"))))});if(t.length===0)return n;let r=new Image;r.src=n,await new Promise((s,l)=>{r.onload=()=>s(),r.onerror=()=>l(new Error("failed to load screenshot image"))});let o=document.createElement("canvas");o.width=r.naturalWidth,o.height=r.naturalHeight;let i=o.getContext("2d");if(!i)return n;i.drawImage(r,0,0);let a=o.width/e.scrollWidth;return t.forEach((s,l)=>{let c=(s.rect.x+window.scrollX)*a,u=(s.rect.y+window.scrollY)*a,m=13*a;i.beginPath(),i.arc(c,u,m,0,Math.PI*2),i.fillStyle="#6366f1",i.fill(),i.strokeStyle="#ffffff",i.lineWidth=2*a,i.stroke(),i.fillStyle="#ffffff",i.font=`bold ${14*a}px Arial, sans-serif`,i.textAlign="center",i.textBaseline="middle",i.fillText(String(l+1),c,u)}),o.toDataURL("image/png")}catch(e){return console.error("[make-a-wish] screenshot capture failed:",e),null}}var Wt=[{label:"Bug",emoji:"\u{1F41B}"},{label:"Idea",emoji:"\u{1F4A1}"},{label:"Question",emoji:"\u2753"},{label:"Praise",emoji:"\u2764\uFE0F"}],k=class{constructor(e,n){this.isOpen=!1;this.isAnnotating=!1;this.isSubmitting=!1;this.isDone=!1;this.selectedCategory="Bug";this.textValue="";this.annotations=[];this.screenshotDataUrl=null;this.errorMessage=null;this.annotationOverlay=null;this.annotationPill=null;this.hoveredElement=null;this.pinElements=[];this.root=e,this.config=n,this.render()}updateConfig(e){this.config={...this.config,...e},this.render()}render(){this.root.innerHTML=`
      <style>
        :host {
          all: initial;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
          line-height: 1.5;
          font-size: 14px;
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
          height: 48px;
          padding: 0 16px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #ffffff;
          border: none;
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4), 0 8px 10px -6px rgba(99, 102, 241, 0.2);
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        .maw-launcher:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px -5px rgba(99, 102, 241, 0.5);
          background: linear-gradient(135deg, #4338ca 0%, #4f46e5 100%);
        }
        .maw-launcher svg {
          width: 20px;
          height: 20px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
        }
        .maw-modal {
          position: fixed;
          ${this.config.position==="bottom-left"?"left: 24px;":"right: 24px;"}
          bottom: 84px;
          z-index: 2147483641;
          width: min(92vw, 380px);
          max-height: calc(100vh - 100px);
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: maw-pop 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes maw-pop {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .maw-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        .maw-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 15px;
          color: #0f172a;
        }
        .maw-badge {
          font-size: 11px;
          font-weight: 500;
          color: #6366f1;
          background: #eef2ff;
          padding: 2px 8px;
          border-radius: 9999px;
        }
        .maw-close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .maw-close-btn:hover {
          color: #334155;
          background: #f1f5f9;
        }
        .maw-body {
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .maw-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .maw-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          font-size: 12px;
          font-weight: 500;
          color: #475569;
          cursor: pointer;
          transition: all 0.12s ease;
        }
        .maw-chip:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }
        .maw-chip.active {
          background: #4f46e5;
          color: #ffffff;
          border-color: #4f46e5;
        }
        .maw-textarea {
          width: 100%;
          min-height: 90px;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-family: inherit;
          font-size: 13px;
          color: #0f172a;
          resize: vertical;
          outline: none;
        }
        .maw-textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
        .maw-annotate-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 8px;
        }
        .maw-annotate-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
        }
        .maw-annotate-btn:hover {
          background: #f1f5f9;
        }
        .maw-screenshot-preview {
          position: relative;
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
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
          background: rgba(15, 23, 42, 0.75);
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
          background: #4f46e5;
          color: #ffffff;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .maw-submit-btn:hover:not(:disabled) {
          background: #4338ca;
        }
        .maw-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .maw-error {
          padding: 8px 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
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
          width: 48px;
          height: 48px;
          border-radius: 9999px;
          background: #ecfdf5;
          color: #10b981;
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
          font-weight: 700;
          font-size: 16px;
          color: #0f172a;
        }
        .maw-success-desc {
          font-size: 13px;
          color: #64748b;
        }
        .maw-secondary-btn {
          margin-top: 8px;
          background: #f1f5f9;
          color: #334155;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .maw-secondary-btn:hover {
          background: #e2e8f0;
        }
      </style>

      ${this.isOpen?"":`
        <button type="button" class="maw-launcher" id="mawLauncherBtn" data-maw-chrome>
          <svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>
          Make a wish
        </button>
      `}

      ${this.isOpen&&!this.isAnnotating?`
        <div class="maw-modal" data-maw-chrome>
          <div class="maw-header">
            <div class="maw-title">
              <svg style="width:18px;height:18px;color:#4f46e5;fill:none;stroke:currentColor;stroke-width:2;" viewBox="0 0 24 24"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>
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
                ${Wt.map(e=>`
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
    `,this.bindEvents()}bindEvents(){let e=this.root.getElementById("mawLauncherBtn");e&&e.addEventListener("click",()=>{this.isOpen=!0,this.render()});let n=this.root.getElementById("mawCloseBtn");n&&n.addEventListener("click",()=>{this.isOpen=!1,this.render()}),this.root.querySelectorAll(".maw-chip").forEach(c=>{c.addEventListener("click",u=>{let m=u.currentTarget.getAttribute("data-category");this.selectedCategory=m,this.render()})});let o=this.root.getElementById("mawTextInput");o&&o.addEventListener("input",c=>{this.textValue=c.target.value;let u=this.root.getElementById("mawSubmitBtn");u&&(u.disabled=this.isSubmitting||!this.textValue.trim())});let i=this.root.getElementById("mawStartAnnotateBtn");i&&i.addEventListener("click",()=>{this.startAnnotationMode()});let a=this.root.getElementById("mawRemoveShotBtn");a&&a.addEventListener("click",()=>{this.screenshotDataUrl=null,this.annotations=[],this.render()});let s=this.root.getElementById("mawSubmitBtn");s&&s.addEventListener("click",()=>{this.submitFeedback()});let l=this.root.getElementById("mawResetBtn");l&&l.addEventListener("click",()=>{this.isDone=!1,this.textValue="",this.selectedCategory="Bug",this.annotations=[],this.screenshotDataUrl=null,this.errorMessage=null,this.render()})}startAnnotationMode(){this.isAnnotating=!0,this.render();let e=document.createElement("div");e.setAttribute("data-maw-chrome",""),e.style.position="fixed",e.style.inset="0",e.style.zIndex="2147483642",e.style.cursor="crosshair",e.style.background="rgba(15, 23, 42, 0.02)",document.body.appendChild(e),this.annotationOverlay=e;let n=document.createElement("div");if(n.setAttribute("data-maw-chrome",""),n.style.position="fixed",n.style.top="20px",n.style.right="20px",n.style.zIndex="2147483645",n.style.background="#0f172a",n.style.color="#ffffff",n.style.padding="8px 16px",n.style.borderRadius="9999px",n.style.display="flex",n.style.alignItems="center",n.style.gap="12px",n.style.boxShadow="0 10px 15px -3px rgba(0, 0, 0, 0.3)",n.style.fontFamily="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",n.style.fontSize="13px",n.innerHTML=`
      <span id="mawPillText">Click elements to pin (${this.annotations.length})</span>
      <button type="button" id="mawDoneAnnotateBtn" style="background:#ffffff;color:#0f172a;border:none;padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:600;cursor:pointer;">Done</button>
      <button type="button" id="mawCancelAnnotateBtn" style="background:transparent;color:#94a3b8;border:none;padding:4px 8px;font-size:12px;cursor:pointer;">Cancel</button>
    `,document.body.appendChild(n),this.annotationPill=n,!document.getElementById("maw-hover-style")){let a=document.createElement("style");a.id="maw-hover-style",a.innerHTML="[data-maw-hover] { outline: 2px solid #6366f1 !important; outline-offset: 2px !important; cursor: crosshair !important; }",document.head.appendChild(a)}let r=(a,s)=>{e.style.pointerEvents="none";let l=document.elementFromPoint(a,s);return e.style.pointerEvents="auto",!l||l.closest("[data-maw-chrome]")||l.closest("make-a-wish-widget")?null:l};e.onmousemove=a=>{let s=r(a.clientX,a.clientY);s!==this.hoveredElement&&(this.hoveredElement&&this.hoveredElement.removeAttribute("data-maw-hover"),s&&s.setAttribute("data-maw-hover",""),this.hoveredElement=s)},e.onclick=a=>{a.preventDefault(),a.stopPropagation();let s=r(a.clientX,a.clientY);if(!s)return;let l=s.getBoundingClientRect(),c={selector:tt(s),tag:s.tagName.toLowerCase(),hint:et(s),text:nt(s),rect:{x:l.x,y:l.y,width:l.width,height:l.height}};this.annotations.push(c),this.renderPin(c,this.annotations.length);let u=n.querySelector("#mawPillText");u&&(u.textContent=`Click elements to pin (${this.annotations.length})`)};let o=n.querySelector("#mawDoneAnnotateBtn");o&&o.addEventListener("click",async()=>{await this.finishAnnotation(!0)});let i=n.querySelector("#mawCancelAnnotateBtn");i&&i.addEventListener("click",async()=>{await this.finishAnnotation(!1)})}renderPin(e,n){let r=document.createElement("div");r.setAttribute("data-maw-chrome",""),r.style.position="fixed",r.style.left=`${e.rect.x}px`,r.style.top=`${e.rect.y}px`,r.style.width="24px",r.style.height="24px",r.style.borderRadius="9999px",r.style.background="#4f46e5",r.style.color="#ffffff",r.style.fontSize="12px",r.style.fontWeight="700",r.style.display="flex",r.style.alignItems="center",r.style.justifyContent="center",r.style.boxShadow="0 0 0 2px #ffffff, 0 4px 6px -1px rgba(0, 0, 0, 0.2)",r.style.zIndex="2147483644",r.style.pointerEvents="none",r.textContent=String(n),document.body.appendChild(r),this.pinElements.push(r)}async finishAnnotation(e){if(this.hoveredElement&&(this.hoveredElement.removeAttribute("data-maw-hover"),this.hoveredElement=null),this.annotationOverlay&&(this.annotationOverlay.remove(),this.annotationOverlay=null),this.annotationPill&&(this.annotationPill.remove(),this.annotationPill=null),this.pinElements.forEach(n=>n.remove()),this.pinElements=[],e){let n=await $(this.annotations);this.screenshotDataUrl=n}else this.annotations=[];this.isAnnotating=!1,this.render()}async submitFeedback(){if(!this.textValue.trim()||this.isSubmitting)return;this.isSubmitting=!0,this.errorMessage=null,this.render();let e=this.screenshotDataUrl;e||(e=await $(this.annotations),this.screenshotDataUrl=e);let n={appId:this.config.appId||"default-app",repo:this.config.repo||"",category:this.selectedCategory,text:this.textValue.trim(),annotations:this.annotations,screenshot:e,url:window.location.href,userAgent:navigator.userAgent,userEmail:this.config.userEmail||"",timestamp:new Date().toISOString()};try{let r=(this.config.apiUrl||window.location.origin).replace(/\/$/,""),o=await fetch(`${r}/api/feedback`,{method:"POST",headers:{"Content-Type":"application/json","X-Make-A-Wish-App":this.config.appId||"generic"},body:JSON.stringify(n)});if(!o.ok){let i=await o.text();throw new Error(`Submission failed (${o.status}): ${i.slice(0,150)}`)}this.isDone=!0,this.isSubmitting=!1,this.render()}catch(r){this.isSubmitting=!1,this.errorMessage=r instanceof Error?r.message:"Submission failed",this.render()}}escapeHtml(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}};var B=class extends HTMLElement{constructor(){super();this.ui=null;this.shadow=this.attachShadow({mode:"open"})}static get observedAttributes(){return["data-app","data-repo","data-api","data-user","data-position"]}connectedCallback(){let n=this.resolveConfig();this.ui=new k(this.shadow,n)}attributeChangedCallback(n,r,o){if(!this.ui)return;let i={};n==="data-app"&&(i.appId=o),n==="data-repo"&&(i.repo=o),n==="data-api"&&(i.apiUrl=o),n==="data-user"&&(i.userEmail=o),n==="data-position"&&(i.position=o),this.ui.updateConfig(i)}resolveConfig(){return{appId:this.getAttribute("data-app")||"",repo:this.getAttribute("data-repo")||"",apiUrl:this.getAttribute("data-api")||window.location.origin,userEmail:this.getAttribute("data-user")||void 0,position:this.getAttribute("data-position")||"bottom-right"}}};typeof window<"u"&&!customElements.get("make-a-wish-widget")&&customElements.define("make-a-wish-widget",B);function rt(){if(typeof document>"u")return;let t=document.currentScript||document.querySelector('script[src*="widget.js"]'),e=window.location.origin,n="",r="",o="",i="",a="bottom-right";if(t){try{e=new URL(t.src,window.location.href).origin}catch{e=window.location.origin}n=t.getAttribute("data-app")||"",r=t.getAttribute("data-repo")||"",o=t.getAttribute("data-api")||e,i=t.getAttribute("data-user")||"";let l=t.getAttribute("data-position");(l==="bottom-left"||l==="bottom-right")&&(a=l)}if(document.querySelector("make-a-wish-widget"))return;let s=document.createElement("make-a-wish-widget");n&&s.setAttribute("data-app",n),r&&s.setAttribute("data-repo",r),o&&s.setAttribute("data-api",o),i&&s.setAttribute("data-user",i),s.setAttribute("data-position",a),document.body.appendChild(s)}typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",rt):rt());})();
//# sourceMappingURL=widget.js.map
