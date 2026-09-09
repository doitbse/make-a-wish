"use strict";(()=>{var $t=Object.defineProperty;var Lt=(t,e,n)=>e in t?$t(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var p=(t,e,n)=>Lt(t,typeof e!="symbol"?e+"":e,n);function Z(t,e){if(t.match(/^[a-z]+:\/\//i))return t;if(t.match(/^\/\//))return window.location.protocol+t;if(t.match(/^[a-z]+:/i))return t;let n=document.implementation.createHTMLDocument(),i=n.createElement("base"),a=n.createElement("a");return n.head.appendChild(i),n.body.appendChild(a),e&&(i.href=e),a.href=t,a.href}var tt=(()=>{let t=0,e=()=>`0000${(Math.random()*36**4<<0).toString(36)}`.slice(-4);return()=>(t+=1,`u${e()}${t}`)})();function b(t){let e=[];for(let n=0,i=t.length;n<i;n++)e.push(t[n]);return e}var I=null;function D(t={}){return I||(t.includeStyleProperties?(I=t.includeStyleProperties,I):(I=b(window.getComputedStyle(document.documentElement)),I))}function U(t,e){let i=(t.ownerDocument.defaultView||window).getComputedStyle(t).getPropertyValue(e);return i?parseFloat(i.replace("px","")):0}function Tt(t){let e=U(t,"border-left-width"),n=U(t,"border-right-width");return t.clientWidth+e+n}function Bt(t){let e=U(t,"border-top-width"),n=U(t,"border-bottom-width");return t.clientHeight+e+n}function W(t,e={}){let n=e.width||Tt(t),i=e.height||Bt(t);return{width:n,height:i}}function et(){let t,e;try{e=process}catch{}let n=e&&e.env?e.env.devicePixelRatio:null;return n&&(t=parseInt(n,10),Number.isNaN(t)&&(t=1)),t||window.devicePixelRatio||1}var w=16384;function nt(t){(t.width>w||t.height>w)&&(t.width>w&&t.height>w?t.width>t.height?(t.height*=w/t.width,t.width=w):(t.width*=w/t.height,t.height=w):t.width>w?(t.height*=w/t.width,t.width=w):(t.width*=w/t.height,t.height=w))}function A(t){return new Promise((e,n)=>{let i=new Image;i.onload=()=>{i.decode().then(()=>{requestAnimationFrame(()=>e(i))})},i.onerror=n,i.crossOrigin="anonymous",i.decoding="async",i.src=t})}async function Rt(t){return Promise.resolve().then(()=>new XMLSerializer().serializeToString(t)).then(encodeURIComponent).then(e=>`data:image/svg+xml;charset=utf-8,${e}`)}async function it(t,e,n){let i="http://www.w3.org/2000/svg",a=document.createElementNS(i,"svg"),s=document.createElementNS(i,"foreignObject");return a.setAttribute("width",`${e}`),a.setAttribute("height",`${n}`),a.setAttribute("viewBox",`0 0 ${e} ${n}`),s.setAttribute("width","100%"),s.setAttribute("height","100%"),s.setAttribute("x","0"),s.setAttribute("y","0"),s.setAttribute("externalResourcesRequired","true"),a.appendChild(s),s.appendChild(t),Rt(a)}var g=(t,e)=>{if(t instanceof e)return!0;let n=Object.getPrototypeOf(t);return n===null?!1:n.constructor.name===e.name||g(n,e)};function Pt(t){let e=t.getPropertyValue("content");return`${t.cssText} content: '${e.replace(/'|"/g,"")}';`}function Ut(t,e){return D(e).map(n=>{let i=t.getPropertyValue(n),a=t.getPropertyPriority(n);return`${n}: ${i}${a?" !important":""};`}).join(" ")}function Dt(t,e,n,i){let a=`.${t}:${e}`,s=n.cssText?Pt(n):Ut(n,i);return document.createTextNode(`${a}{${s}}`)}function st(t,e,n,i){let a=window.getComputedStyle(t,n),s=a.getPropertyValue("content");if(s===""||s==="none")return;let o=tt();try{e.className=`${e.className} ${o}`}catch{return}let r=document.createElement("style");r.appendChild(Dt(o,n,a,i)),e.appendChild(r)}function at(t,e,n){st(t,e,":before",n),st(t,e,":after",n)}var ot="application/font-woff",rt="image/jpeg",Ft={woff:ot,woff2:ot,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:rt,jpeg:rt,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml",webp:"image/webp"};function _t(t){let e=/\.([^./]*?)$/g.exec(t);return e?e[1]:""}function C(t){let e=_t(t).toLowerCase();return Ft[e]||""}function Ht(t){return t.split(/,/)[1]}function L(t){return t.search(/^(data:)/)!==-1}function X(t,e){return`data:${e};base64,${t}`}async function G(t,e,n){let i=await fetch(t,e);if(i.status===404)throw new Error(`Resource "${i.url}" not found`);let a=await i.blob();return new Promise((s,o)=>{let r=new FileReader;r.onerror=o,r.onloadend=()=>{try{s(n({res:i,result:r.result}))}catch(l){o(l)}},r.readAsDataURL(a)})}var j={};function zt(t,e,n){let i=t.replace(/\?.*/,"");return n&&(i=t),/ttf|otf|eot|woff2?/i.test(i)&&(i=i.replace(/.*\//,"")),e?`[${e}]${i}`:i}async function M(t,e,n){let i=zt(t,e,n.includeQueryParams);if(j[i]!=null)return j[i];n.cacheBust&&(t+=(/\?/.test(t)?"&":"?")+new Date().getTime());let a;try{let s=await G(t,n.fetchRequestInit,({res:o,result:r})=>(e||(e=o.headers.get("Content-Type")||""),Ht(r)));a=X(s,e)}catch(s){a=n.imagePlaceholder||"";let o=`Failed to fetch resource: ${t}`;s&&(o=typeof s=="string"?s:s.message),o&&console.warn(o)}return j[i]=a,a}async function Vt(t){let e=t.toDataURL();return e==="data:,"?t.cloneNode(!1):A(e)}async function qt(t,e){if(t.currentSrc){let s=document.createElement("canvas"),o=s.getContext("2d");s.width=t.clientWidth,s.height=t.clientHeight,o?.drawImage(t,0,0,s.width,s.height);let r=s.toDataURL();return A(r)}let n=t.poster,i=C(n),a=await M(n,i,e);return A(a)}async function Ot(t,e){var n;try{if(!((n=t?.contentDocument)===null||n===void 0)&&n.body)return await T(t.contentDocument.body,e,!0)}catch{}return t.cloneNode(!1)}async function Wt(t,e){return g(t,HTMLCanvasElement)?Vt(t):g(t,HTMLVideoElement)?qt(t,e):g(t,HTMLIFrameElement)?Ot(t,e):t.cloneNode(lt(t))}var jt=t=>t.tagName!=null&&t.tagName.toUpperCase()==="SLOT",lt=t=>t.tagName!=null&&t.tagName.toUpperCase()==="SVG";async function Xt(t,e,n){var i,a;if(lt(e))return e;let s=[];return jt(t)&&t.assignedNodes?s=b(t.assignedNodes()):g(t,HTMLIFrameElement)&&(!((i=t.contentDocument)===null||i===void 0)&&i.body)?s=b(t.contentDocument.body.childNodes):s=b(((a=t.shadowRoot)!==null&&a!==void 0?a:t).childNodes),s.length===0||g(t,HTMLVideoElement)||await s.reduce((o,r)=>o.then(()=>T(r,n)).then(l=>{l&&e.appendChild(l)}),Promise.resolve()),e}function Gt(t,e,n){let i=e.style;if(!i)return;let a=window.getComputedStyle(t);a.cssText?(i.cssText=a.cssText,i.transformOrigin=a.transformOrigin):D(n).forEach(s=>{let o=a.getPropertyValue(s);s==="font-size"&&o.endsWith("px")&&(o=`${Math.floor(parseFloat(o.substring(0,o.length-2)))-.1}px`),g(t,HTMLIFrameElement)&&s==="display"&&o==="inline"&&(o="block"),s==="d"&&e.getAttribute("d")&&(o=`path(${e.getAttribute("d")})`),i.setProperty(s,o,a.getPropertyPriority(s))})}function Yt(t,e){g(t,HTMLTextAreaElement)&&(e.innerHTML=t.value),g(t,HTMLInputElement)&&e.setAttribute("value",t.value)}function Qt(t,e){if(g(t,HTMLSelectElement)){let n=e,i=Array.from(n.children).find(a=>t.value===a.getAttribute("value"));i&&i.setAttribute("selected","")}}function Jt(t,e,n){return g(e,Element)&&(Gt(t,e,n),at(t,e,n),Yt(t,e),Qt(t,e)),e}async function Nt(t,e){let n=t.querySelectorAll?t.querySelectorAll("use"):[];if(n.length===0)return t;let i={};for(let s=0;s<n.length;s++){let r=n[s].getAttribute("xlink:href");if(r){let l=t.querySelector(r),u=document.querySelector(r);!l&&u&&!i[r]&&(i[r]=await T(u,e,!0))}}let a=Object.values(i);if(a.length){let s="http://www.w3.org/1999/xhtml",o=document.createElementNS(s,"svg");o.setAttribute("xmlns",s),o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.overflow="hidden",o.style.display="none";let r=document.createElementNS(s,"defs");o.appendChild(r);for(let l=0;l<a.length;l++)r.appendChild(a[l]);t.appendChild(o)}return t}async function T(t,e,n){return!n&&e.filter&&!e.filter(t)?null:Promise.resolve(t).then(i=>Wt(i,e)).then(i=>Xt(t,i,e)).then(i=>Jt(t,i,e)).then(i=>Nt(i,e))}var ct=/url\((['"]?)([^'"]+?)\1\)/g,Kt=/url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,Zt=/src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;function te(t){let e=t.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1");return new RegExp(`(url\\(['"]?)(${e})(['"]?\\))`,"g")}function ee(t){let e=[];return t.replace(ct,(n,i,a)=>(e.push(a),n)),e.filter(n=>!L(n))}async function ne(t,e,n,i,a){try{let s=n?Z(e,n):e,o=C(e),r;if(a){let l=await a(s);r=X(l,o)}else r=await M(s,o,i);return t.replace(te(e),`$1${r}$3`)}catch{}return t}function ie(t,{preferredFontFormat:e}){return e?t.replace(Zt,n=>{for(;;){let[i,,a]=Kt.exec(n)||[];if(!a)return"";if(a===e)return`src: ${i};`}}):t}function Y(t){return t.search(ct)!==-1}async function F(t,e,n){if(!Y(t))return t;let i=ie(t,n);return ee(i).reduce((s,o)=>s.then(r=>ne(r,o,e,n)),Promise.resolve(i))}async function $(t,e,n){var i;let a=(i=e.style)===null||i===void 0?void 0:i.getPropertyValue(t);if(a){let s=await F(a,null,n);return e.style.setProperty(t,s,e.style.getPropertyPriority(t)),!0}return!1}async function se(t,e){await $("background",t,e)||await $("background-image",t,e),await $("mask",t,e)||await $("-webkit-mask",t,e)||await $("mask-image",t,e)||await $("-webkit-mask-image",t,e)}async function ae(t,e){let n=g(t,HTMLImageElement);if(!(n&&!L(t.src))&&!(g(t,SVGImageElement)&&!L(t.href.baseVal)))return;let i=n?t.src:t.href.baseVal,a=await M(i,C(i),e);await new Promise((s,o)=>{t.onload=s,t.onerror=e.onImageErrorHandler?(...l)=>{try{s(e.onImageErrorHandler(...l))}catch(u){o(u)}}:o;let r=t;r.decode&&(r.decode=s),r.loading==="lazy"&&(r.loading="eager"),n?(t.srcset="",t.src=a):t.href.baseVal=a})}async function oe(t,e){let i=b(t.childNodes).map(a=>Q(a,e));await Promise.all(i).then(()=>t)}async function Q(t,e){g(t,Element)&&(await se(t,e),await ae(t,e),await oe(t,e))}function dt(t,e){let{style:n}=t;e.backgroundColor&&(n.backgroundColor=e.backgroundColor),e.width&&(n.width=`${e.width}px`),e.height&&(n.height=`${e.height}px`);let i=e.style;return i!=null&&Object.keys(i).forEach(a=>{n[a]=i[a]}),t}var pt={};async function ut(t){let e=pt[t];if(e!=null)return e;let i=await(await fetch(t)).text();return e={url:t,cssText:i},pt[t]=e,e}async function mt(t,e){let n=t.cssText,i=/url\(["']?([^"')]+)["']?\)/g,s=(n.match(/url\([^)]+\)/g)||[]).map(async o=>{let r=o.replace(i,"$1");return r.startsWith("https://")||(r=new URL(r,t.url).href),G(r,e.fetchRequestInit,({result:l})=>(n=n.replace(o,`url(${l})`),[o,l]))});return Promise.all(s).then(()=>n)}function ht(t){if(t==null)return[];let e=[],n=/(\/\*[\s\S]*?\*\/)/gi,i=t.replace(n,""),a=new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})","gi");for(;;){let l=a.exec(i);if(l===null)break;e.push(l[0])}i=i.replace(a,"");let s=/@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,o="((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",r=new RegExp(o,"gi");for(;;){let l=s.exec(i);if(l===null){if(l=r.exec(i),l===null)break;s.lastIndex=r.lastIndex}else r.lastIndex=s.lastIndex;e.push(l[0])}return e}async function re(t,e){let n=[],i=[];return t.forEach(a=>{if("cssRules"in a)try{b(a.cssRules||[]).forEach((s,o)=>{if(s.type===CSSRule.IMPORT_RULE){let r=o+1,l=s.href,u=ut(l).then(h=>mt(h,e)).then(h=>ht(h).forEach(c=>{try{a.insertRule(c,c.startsWith("@import")?r+=1:a.cssRules.length)}catch(x){console.error("Error inserting rule from remote css",{rule:c,error:x})}})).catch(h=>{console.error("Error loading remote css",h.toString())});i.push(u)}})}catch(s){let o=t.find(r=>r.href==null)||document.styleSheets[0];a.href!=null&&i.push(ut(a.href).then(r=>mt(r,e)).then(r=>ht(r).forEach(l=>{o.insertRule(l,o.cssRules.length)})).catch(r=>{console.error("Error loading remote stylesheet",r)})),console.error("Error inlining remote css file",s)}}),Promise.all(i).then(()=>(t.forEach(a=>{if("cssRules"in a)try{b(a.cssRules||[]).forEach(s=>{n.push(s)})}catch(s){console.error(`Error while reading CSS rules from ${a.href}`,s)}}),n))}function le(t){return t.filter(e=>e.type===CSSRule.FONT_FACE_RULE).filter(e=>Y(e.style.getPropertyValue("src")))}async function ce(t,e){if(t.ownerDocument==null)throw new Error("Provided element is not within a Document");let n=b(t.ownerDocument.styleSheets),i=await re(n,e);return le(i)}function ft(t){return t.trim().replace(/["']/g,"")}function de(t){let e=new Set;function n(i){(i.style.fontFamily||getComputedStyle(i).fontFamily).split(",").forEach(s=>{e.add(ft(s))}),Array.from(i.children).forEach(s=>{s instanceof HTMLElement&&n(s)})}return n(t),e}async function gt(t,e){let n=await ce(t,e),i=de(t);return(await Promise.all(n.filter(s=>i.has(ft(s.style.fontFamily))).map(s=>{let o=s.parentStyleSheet?s.parentStyleSheet.href:null;return F(s.cssText,o,e)}))).join(`
`)}async function wt(t,e){let n=e.fontEmbedCSS!=null?e.fontEmbedCSS:e.skipFonts?null:await gt(t,e);if(n){let i=document.createElement("style"),a=document.createTextNode(n);i.appendChild(a),t.firstChild?t.insertBefore(i,t.firstChild):t.appendChild(i)}}async function pe(t,e={}){let{width:n,height:i}=W(t,e),a=await T(t,e,!0);return await wt(a,e),await Q(a,e),dt(a,e),await it(a,n,i)}async function ue(t,e={}){let{width:n,height:i}=W(t,e),a=await pe(t,e),s=await A(a),o=document.createElement("canvas"),r=o.getContext("2d"),l=e.pixelRatio||et(),u=e.canvasWidth||n,h=e.canvasHeight||i;return o.width=u*l,o.height=h*l,e.skipAutoScale||nt(o),o.style.width=`${u}`,o.style.height=`${h}`,e.backgroundColor&&(r.fillStyle=e.backgroundColor,r.fillRect(0,0,o.width,o.height)),r.drawImage(s,0,0,o.width,o.height),o}async function xt(t,e={}){return(await ue(t,e)).toDataURL()}function bt(t){if(!t)return"";let e=[],n=t,i=0;for(;n&&n!==document.body&&n!==document.documentElement&&i<6;){let a=n;if(a.id){e.unshift(`#${a.id}`);break}let s=a.tagName.toLowerCase(),o=a.parentElement;if(o){let r=Array.from(o.children).filter(l=>l.tagName===a.tagName);if(r.length>1){let l=r.indexOf(a)+1;s+=`:nth-of-type(${l})`}}e.unshift(s),n=o,i++}return e.length===0?t.tagName.toLowerCase():e.join(" > ")}function yt(t){let e=t.id?`#${t.id}`:"",n="";return typeof t.className=="string"&&t.className.trim()&&(n="."+t.className.trim().split(/\s+/).slice(0,2).join(".")),(t.tagName.toLowerCase()+e+n).slice(0,80)}function vt(t,e=120){let n=(t.textContent||"").replace(/\s+/g," ").trim();return n.length<=e?n:n.slice(0,e-1).trimEnd()+"..."}async function _(t){try{document.querySelectorAll("[data-maw-hover]").forEach(f=>f.removeAttribute("data-maw-hover"));let e=document.documentElement,n=await xt(e,{backgroundColor:"#ffffff",width:e.scrollWidth,height:e.scrollHeight,filter:f=>!((f instanceof HTMLElement||f instanceof SVGElement)&&(f.hasAttribute("data-maw-chrome")||f.tagName.toLowerCase()==="make-a-wish-widget"||f.closest&&(f.closest("[data-maw-chrome]")||f.closest("make-a-wish-widget"))))}),i=new Image;i.src=n,await new Promise((f,y)=>{i.onload=()=>f(),i.onerror=()=>y(new Error("failed to load screenshot image"))});let a=1440,s=i.naturalWidth||e.scrollWidth,o=i.naturalHeight||e.scrollHeight;(s>a||o>a)&&(s>o?(o=Math.round(o*a/s),s=a):(s=Math.round(s*a/o),o=a));let r=document.createElement("canvas");r.width=s,r.height=o;let l=r.getContext("2d");if(!l)return n;l.drawImage(i,0,0,s,o);let u=s/e.scrollWidth,h=o/e.scrollHeight,c=s/e.scrollWidth;t.length>0&&t.forEach((f,y)=>{let E=(f.rect.x+window.scrollX)*u,S=(f.rect.y+window.scrollY)*h,v=13*c;l.beginPath(),l.arc(E,S,v,0,Math.PI*2),l.fillStyle="#fc3165",l.fill(),l.strokeStyle="#ffffff",l.lineWidth=2*c,l.stroke(),l.fillStyle="#ffffff",l.font=`bold ${14*c}px "Inter", -apple-system, sans-serif`,l.textAlign="center",l.textBaseline="middle",l.fillText(String(y+1),E,S)});let x=r.toDataURL("image/jpeg",.82);return x.length>65e4&&(x=r.toDataURL("image/jpeg",.65)),x}catch(e){return console.error("[make-a-wish] screenshot capture failed:",e),null}}function z(t,e){let n=[],i=a=>{if(!a)return;let s=a.trim();if(s){if(s.startsWith("[")&&s.endsWith("]"))try{let o=JSON.parse(s);if(Array.isArray(o)){for(let r of o)typeof r=="string"&&r.trim()&&n.push(r.trim());return}}catch{}for(let o of s.split(",")){let r=o.trim();r&&!n.includes(r)&&n.push(r)}}};return i(t),i(e),Array.from(new Set(n))}var me=[{label:"Bug",emoji:"\u{1F41B}"},{label:"Idea",emoji:"\u{1F4A1}"},{label:"Question",emoji:"\u2753"},{label:"Praise",emoji:"\u2764\uFE0F"}],H=class{constructor(e,n){p(this,"root");p(this,"config");p(this,"isOpen",!1);p(this,"isAnnotating",!1);p(this,"isSubmitting",!1);p(this,"isDone",!1);p(this,"selectedCategory","Bug");p(this,"selectedAgentMode","adk");p(this,"textValue","");p(this,"questionAnswer",null);p(this,"lastAskedQuestion","");p(this,"sessionId",null);p(this,"chatMessages",[]);p(this,"isAskingFollowUp",!1);p(this,"followUpInputValue","");p(this,"annotations",[]);p(this,"screenshotDataUrl",null);p(this,"errorMessage",null);p(this,"modalPos",null);p(this,"shouldFocusTextarea",!1);p(this,"isEditingEmail",!1);p(this,"annotationOverlay",null);p(this,"annotationPill",null);p(this,"hoveredElement",null);p(this,"pinElements",[]);if(this.root=e,this.config=n,!this.config.userEmail)try{let i=window.localStorage?.getItem("maw_user_email")||window.localStorage?.getItem("user_email");i&&i.includes("@")&&(this.config.userEmail=i.trim())}catch{}try{this.sessionId=window.localStorage.getItem("maw_session_id")||null;let i=window.localStorage.getItem("maw_chat_messages");i&&(this.chatMessages=JSON.parse(i))}catch{this.sessionId=null,this.chatMessages=[]}window.addEventListener("resize",()=>{if(this.modalPos&&this.isOpen){let i=this.root.querySelector(".maw-modal");if(i){let a=i.getBoundingClientRect(),s=8,o=Math.max(s,window.innerWidth-a.width-s),r=Math.max(s,window.innerHeight-a.height-s);this.modalPos.x=Math.max(s,Math.min(o,this.modalPos.x)),this.modalPos.y=Math.max(s,Math.min(r,this.modalPos.y)),i.style.left=`${this.modalPos.x}px`,i.style.top=`${this.modalPos.y}px`}}}),this.render()}updateConfig(e){this.config={...this.config,...e},this.render()}hasMeaningfulText(){return this.textValue.replace(/\(\d+\)\s*/g,"").trim().length>0}render(){this.root.innerHTML=`
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
        .maw-user-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 11px;
          color: #64748b;
          margin-top: 4px;
        }
        .maw-user-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .maw-user-email-val {
          font-weight: 600;
          color: #1e293b;
        }
        .maw-user-change-btn {
          background: none;
          border: none;
          color: #fc3165;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          padding: 0 4px;
          text-decoration: underline;
        }
        .maw-user-change-btn:hover {
          color: #e02554;
        }
        .maw-email-input-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 4px;
        }
        .maw-email-input {
          width: 100%;
          padding: 7px 10px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 12px;
          font-family: inherit;
          color: #1e293b;
          background: #ffffff;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .maw-email-input:focus {
          border-color: #fc3165;
          box-shadow: 0 0 0 2px rgba(252, 49, 101, 0.1);
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
                ${me.map(e=>`
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

              ${this.config.userEmail&&!this.isEditingEmail?`
                <div class="maw-user-bar">
                  <div class="maw-user-badge">
                    <svg viewBox="0 0 24 24" style="width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <span>Submitting as <span class="maw-user-email-val">${this.escapeHtml(this.config.userEmail)}</span></span>
                  </div>
                  <button type="button" class="maw-user-change-btn" id="mawChangeEmailBtn">Change</button>
                </div>
              `:`
                <div class="maw-email-input-row">
                  <input
                    type="email"
                    id="mawUserEmailInput"
                    class="maw-email-input"
                    placeholder="Your email (e.g. you@doit.com)"
                    value="${this.escapeHtml(this.config.userEmail||"")}"
                  />
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
    `,this.bindEvents()}bindEvents(){let e=this.root.getElementById("mawLauncherBtn");e&&e.addEventListener("click",()=>{this.isOpen=!0,this.render()});let n=this.root.getElementById("mawCloseBtn");n&&n.addEventListener("click",()=>{this.isOpen=!1,this.render()});let i=this.root.getElementById("mawHeader"),a=this.root.querySelector(".maw-modal");i&&a&&i.addEventListener("pointerdown",d=>{if(d.target.closest("button")||d.button!==0)return;d.preventDefault();let m=a.getBoundingClientRect(),V=d.clientX,kt=d.clientY,q=m.left,O=m.top;a.classList.add("is-dragging"),a.style.left=`${q}px`,a.style.top=`${O}px`,a.style.right="auto",a.style.bottom="auto",a.style.animation="none",this.modalPos={x:q,y:O};let N=K=>{let It=K.clientX-V,At=K.clientY-kt,R=q+It,P=O+At,k=8,Ct=Math.max(k,window.innerWidth-m.width-k),Mt=Math.max(k,window.innerHeight-m.height-k);R=Math.max(k,Math.min(Ct,R)),P=Math.max(k,Math.min(Mt,P)),a.style.left=`${R}px`,a.style.top=`${P}px`,this.modalPos={x:R,y:P}},B=()=>{a.classList.remove("is-dragging"),window.removeEventListener("pointermove",N),window.removeEventListener("pointerup",B),window.removeEventListener("pointercancel",B)};window.addEventListener("pointermove",N),window.addEventListener("pointerup",B),window.addEventListener("pointercancel",B)}),this.root.querySelectorAll(".maw-chip").forEach(d=>{d.addEventListener("click",m=>{let V=m.currentTarget.getAttribute("data-category");this.selectedCategory=V,this.errorMessage=null,this.render()})});let o=this.root.getElementById("mawFollowUpInput");o&&(o.addEventListener("input",d=>{this.followUpInputValue=d.target.value;let m=this.root.getElementById("mawFollowUpSendBtn");m&&(m.disabled=!this.followUpInputValue.trim()||this.isAskingFollowUp)}),o.addEventListener("keydown",d=>{d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),this.submitFollowUp())}));let r=this.root.getElementById("mawFollowUpSendBtn");r&&r.addEventListener("click",()=>{this.submitFollowUp()});let l=this.root.getElementById("mawNewTopicBtn");l&&l.addEventListener("click",()=>{this.resetChatSession()});let u=this.root.getElementById("mawChatDoneBtn");u&&u.addEventListener("click",()=>{this.isOpen=!1,this.render()});let h=this.root.getElementById("mawEscalateBtn");h&&h.addEventListener("click",()=>{let d=this.chatMessages.filter(m=>m.role==="user").map(m=>m.text);this.selectedCategory="Idea",this.textValue=d.length>0?`Follow-up request from discussion:
${d.map(m=>"- "+m).join(`
`)}

Proposed improvement / fix:
`:`Feature request following question:

`,this.chatMessages=[],this.questionAnswer=null,this.errorMessage=null,this.render()});let c=this.root.getElementById("mawTextInput");c&&(this.shouldFocusTextarea&&(this.shouldFocusTextarea=!1,setTimeout(()=>{c.focus();let d=c.value.length;c.setSelectionRange(d,d)},50)),c.addEventListener("input",d=>{this.textValue=d.target.value;let m=this.root.getElementById("mawSubmitBtn");m&&(m.disabled=this.isSubmitting||!this.hasMeaningfulText())}));let x=this.root.getElementById("mawStartAnnotateBtn");x&&x.addEventListener("click",()=>{this.startAnnotationMode()});let f=this.root.getElementById("mawRemoveShotBtn");f&&f.addEventListener("click",()=>{this.screenshotDataUrl=null,this.annotations=[],this.textValue==="(1) "&&(this.textValue=""),this.render()});let y=this.root.getElementById("mawChangeEmailBtn");y&&y.addEventListener("click",()=>{this.isEditingEmail=!0,this.render();let d=this.root.getElementById("mawUserEmailInput");d&&d.focus()});let E=this.root.getElementById("mawUserEmailInput");E&&E.addEventListener("input",d=>{let m=d.target.value.trim();this.config.userEmail=m;try{m&&m.includes("@")&&window.localStorage?.setItem("maw_user_email",m)}catch{}});let S=this.root.getElementById("mawSubmitBtn");S&&S.addEventListener("click",()=>{this.submitFeedback()});let v=this.root.getElementById("mawResetBtn");v&&v.addEventListener("click",()=>{this.isDone=!1,this.textValue="",this.selectedCategory="Bug",this.selectedAgentMode="adk",this.questionAnswer=null,this.lastAskedQuestion="",this.annotations=[],this.screenshotDataUrl=null,this.errorMessage=null,this.render()})}startAnnotationMode(){this.isAnnotating=!0,this.textValue.trim()||(this.textValue="(1) "),this.render();let e=document.createElement("div");e.setAttribute("data-maw-chrome",""),e.style.position="fixed",e.style.inset="0",e.style.zIndex="2147483642",e.style.cursor="crosshair",e.style.background="rgba(15, 23, 42, 0.02)",document.body.appendChild(e),this.annotationOverlay=e;let n=document.createElement("div");if(n.setAttribute("data-maw-chrome",""),n.style.position="fixed",n.style.top="20px",n.style.right="20px",n.style.zIndex="2147483645",n.style.background="#1a1a2e",n.style.color="#ffffff",n.style.padding="8px 16px",n.style.borderRadius="9999px",n.style.border="1px solid rgba(229, 231, 235, 0.2)",n.style.display="flex",n.style.alignItems="center",n.style.gap="10px",n.style.boxShadow="0 10px 25px -3px rgba(0, 0, 0, 0.35)",n.style.fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif",n.style.fontSize="13px",n.style.cursor="grab",n.style.userSelect="none",n.style.touchAction="none",n.title="Drag to move",n.innerHTML=`
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
    `,document.body.appendChild(n),this.annotationPill=n,n.addEventListener("pointerdown",o=>{if(o.target.closest("button")||o.button!==0)return;o.preventDefault(),n.style.cursor="grabbing";let r=n.getBoundingClientRect(),l=o.clientX,u=o.clientY,h=r.left,c=r.top;n.style.left=`${h}px`,n.style.top=`${c}px`,n.style.right="auto",n.style.bottom="auto";let x=y=>{let E=y.clientX-l,S=y.clientY-u,v=h+E,d=c+S,m=8;v=Math.max(m,Math.min(window.innerWidth-r.width-m,v)),d=Math.max(m,Math.min(window.innerHeight-r.height-m,d)),n.style.left=`${v}px`,n.style.top=`${d}px`},f=()=>{n.style.cursor="grab",window.removeEventListener("pointermove",x),window.removeEventListener("pointerup",f),window.removeEventListener("pointercancel",f)};window.addEventListener("pointermove",x),window.addEventListener("pointerup",f),window.addEventListener("pointercancel",f)}),!document.getElementById("maw-hover-style")){let o=document.createElement("style");o.id="maw-hover-style",o.innerHTML="[data-maw-hover] { outline: 2px solid #fc3165 !important; outline-offset: 2px !important; cursor: crosshair !important; }",document.head.appendChild(o)}let i=(o,r)=>{e.style.pointerEvents="none";let l=document.elementFromPoint(o,r);return e.style.pointerEvents="auto",!l||l.closest("[data-maw-chrome]")||l.closest("make-a-wish-widget")?null:l};e.onmousemove=o=>{let r=i(o.clientX,o.clientY);r!==this.hoveredElement&&(this.hoveredElement&&this.hoveredElement.removeAttribute("data-maw-hover"),r&&r.setAttribute("data-maw-hover",""),this.hoveredElement=r)},e.onclick=o=>{o.preventDefault(),o.stopPropagation();let r=i(o.clientX,o.clientY);if(!r)return;let l=r.getBoundingClientRect(),u={selector:bt(r),tag:r.tagName.toLowerCase(),hint:yt(r),text:vt(r),rect:{x:l.x,y:l.y,width:l.width,height:l.height}};this.annotations.push(u),this.renderPin(u,this.annotations.length);let h=n.querySelector("#mawPillText");h&&(h.textContent=`Click elements to pin (${this.annotations.length})`);let c=this.annotations.length;c===1?this.textValue.trim()?this.textValue.includes("(1)")||(this.textValue=this.textValue.trimEnd()+`
(1) `):this.textValue="(1) ":c>1&&(this.textValue.includes(`(${c})`)||(this.textValue=this.textValue.trimEnd()+`
(${c}) `))};let a=n.querySelector("#mawDoneAnnotateBtn");a&&a.addEventListener("click",async()=>{await this.finishAnnotation(!0)});let s=n.querySelector("#mawCancelAnnotateBtn");s&&s.addEventListener("click",async()=>{await this.finishAnnotation(!1)})}renderPin(e,n){let i=document.createElement("div");i.setAttribute("data-maw-chrome",""),i.style.position="fixed",i.style.left=`${e.rect.x}px`,i.style.top=`${e.rect.y}px`,i.style.width="24px",i.style.height="24px",i.style.borderRadius="9999px",i.style.background="#fc3165",i.style.color="#ffffff",i.style.fontFamily="'Inter', -apple-system, sans-serif",i.style.fontSize="12px",i.style.fontWeight="700",i.style.display="flex",i.style.alignItems="center",i.style.justifyContent="center",i.style.boxShadow="0 0 0 2px #ffffff, 0 4px 10px rgba(252, 49, 101, 0.4)",i.style.zIndex="2147483644",i.style.pointerEvents="none",i.textContent=String(n),document.body.appendChild(i),this.pinElements.push(i)}async finishAnnotation(e){if(this.hoveredElement&&(this.hoveredElement.removeAttribute("data-maw-hover"),this.hoveredElement=null),this.annotationOverlay&&(this.annotationOverlay.remove(),this.annotationOverlay=null),this.annotationPill&&(this.annotationPill.remove(),this.annotationPill=null),this.pinElements.forEach(n=>n.remove()),this.pinElements=[],e){let n=await _(this.annotations);if(this.screenshotDataUrl=n,this.annotations.length>0){this.textValue.trim()?this.textValue.includes("(1)")||(this.textValue=this.textValue.trimEnd()+`
(1) `):this.textValue="(1) ";for(let i=2;i<=this.annotations.length;i++)this.textValue.includes(`(${i})`)||(this.textValue=this.textValue.trimEnd()+`
(${i}) `)}this.shouldFocusTextarea=!0}else this.textValue==="(1) "&&(this.textValue=""),this.annotations=[];this.isAnnotating=!1,this.render()}async submitFeedback(){if(this.selectedCategory==="Question")return this.submitQuestion();if(!this.hasMeaningfulText()||this.isSubmitting)return;this.isSubmitting=!0,this.errorMessage=null,this.render();let e=this.screenshotDataUrl;e||(e=await _(this.annotations),this.screenshotDataUrl=e);let n=this.config.repos&&this.config.repos.length>0?this.config.repos:this.config.repo?[this.config.repo]:[],i=n[0]||this.config.repo||"",a={appId:this.config.appId||"default-app",repo:i,repos:n,agentMode:this.selectedAgentMode,category:this.selectedCategory,text:this.textValue.trim(),annotations:this.annotations,screenshot:e,url:window.location.href,userAgent:navigator.userAgent,userEmail:this.config.userEmail||"",timestamp:new Date().toISOString()};try{let s=(this.config.apiUrl||window.location.origin).replace(/\/$/,""),o=await fetch(`${s}/api/feedback`,{method:"POST",headers:{"Content-Type":"application/json","X-Make-A-Wish-App":this.config.appId||"generic"},body:JSON.stringify(a)});if(!o.ok){let r=await o.text();throw new Error(`Submission failed (${o.status}): ${r.slice(0,150)}`)}this.isDone=!0,this.isSubmitting=!1,this.render()}catch(s){this.isSubmitting=!1,this.errorMessage=s instanceof Error?s.message:"Submission failed",this.render()}}async submitQuestion(){if(!this.hasMeaningfulText()||this.isSubmitting)return;let e=this.textValue.trim();this.isSubmitting=!0,this.errorMessage=null,this.lastAskedQuestion=e,this.chatMessages.push({id:`msg_${Date.now()}_u`,role:"user",text:e,timestamp:new Date().toISOString()}),this.textValue="",this.render(),this.scrollChatToBottom();let n=this.screenshotDataUrl;!n&&this.annotations.length>0&&(n=await _(this.annotations),this.screenshotDataUrl=n);let i=this.config.repos&&this.config.repos.length>0?this.config.repos:this.config.repo?[this.config.repo]:[],a=i[0]||this.config.repo||"",s={question:e,sessionId:this.sessionId,appId:this.config.appId||"default-app",repo:a,repos:i,screenshot:n,annotations:this.annotations,url:window.location.href,userAgent:navigator.userAgent,userEmail:this.config.userEmail||"sascha@doit.com",timestamp:new Date().toISOString()};try{let o=(this.config.apiUrl||window.location.origin).replace(/\/$/,""),r=await fetch(`${o}/api/question`,{method:"POST",headers:{"Content-Type":"application/json","X-Make-A-Wish-App":this.config.appId||"generic"},body:JSON.stringify(s)});if(!r.ok){let h=await r.text();throw new Error(`Agent query failed (${r.status}): ${h.slice(0,150)}`)}let l=await r.json();if(!l.ok&&l.error)throw new Error(l.message||l.error);if(l.sessionId){this.sessionId=l.sessionId;try{window.localStorage.setItem("maw_session_id",this.sessionId)}catch{}}let u=l.answer||"No answer returned.";this.questionAnswer=u,this.chatMessages.push({id:`msg_${Date.now()}_a`,role:"agent",text:u,timestamp:new Date().toISOString()});try{window.localStorage.setItem("maw_chat_messages",JSON.stringify(this.chatMessages))}catch{}this.isSubmitting=!1,this.render(),this.scrollChatToBottom()}catch(o){this.isSubmitting=!1,this.errorMessage=o instanceof Error?o.message:"Failed to receive answer from agent",this.render()}}async submitFollowUp(){let e=this.followUpInputValue.trim();if(!e||this.isAskingFollowUp)return;this.followUpInputValue="",this.isAskingFollowUp=!0,this.errorMessage=null,this.chatMessages.push({id:`msg_${Date.now()}_u`,role:"user",text:e,timestamp:new Date().toISOString()}),this.render(),this.scrollChatToBottom();let n=this.config.repos&&this.config.repos.length>0?this.config.repos:this.config.repo?[this.config.repo]:[],i=n[0]||this.config.repo||"",a={question:e,sessionId:this.sessionId,appId:this.config.appId||"default-app",repo:i,repos:n,url:window.location.href,userAgent:navigator.userAgent,userEmail:this.config.userEmail||"sascha@doit.com",timestamp:new Date().toISOString()};try{let s=(this.config.apiUrl||window.location.origin).replace(/\/$/,""),o=await fetch(`${s}/api/question`,{method:"POST",headers:{"Content-Type":"application/json","X-Make-A-Wish-App":this.config.appId||"generic"},body:JSON.stringify(a)});if(!o.ok){let u=await o.text();throw new Error(`Agent query failed (${o.status}): ${u.slice(0,150)}`)}let r=await o.json();if(!r.ok&&r.error)throw new Error(r.message||r.error);if(r.sessionId){this.sessionId=r.sessionId;try{window.localStorage.setItem("maw_session_id",this.sessionId)}catch{}}let l=r.answer||"No answer returned.";this.chatMessages.push({id:`msg_${Date.now()}_a`,role:"agent",text:l,timestamp:new Date().toISOString()});try{window.localStorage.setItem("maw_chat_messages",JSON.stringify(this.chatMessages))}catch{}this.isAskingFollowUp=!1,this.render(),this.scrollChatToBottom()}catch(s){this.isAskingFollowUp=!1,this.errorMessage=s instanceof Error?s.message:"Failed to receive answer from agent",this.render()}}resetChatSession(){this.sessionId=null,this.chatMessages=[],this.followUpInputValue="",this.isAskingFollowUp=!1,this.questionAnswer=null,this.errorMessage=null;try{window.localStorage.removeItem("maw_session_id"),window.localStorage.removeItem("maw_chat_messages")}catch{}this.render()}scrollChatToBottom(){setTimeout(()=>{let e=this.root.getElementById("mawChatMessages");e&&(e.scrollTop=e.scrollHeight);let n=this.root.getElementById("mawFollowUpInput");n&&!this.isAskingFollowUp&&n.focus()},40)}renderMarkdown(e){if(!e)return"";let n=this.escapeHtml(e);return n=n.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g,(i,a,s)=>`<pre class="maw-code-block"><code>${s.trim()}</code></pre>`),n=n.replace(/`([^`]+)`/g,'<code class="maw-inline-code">$1</code>'),n=n.replace(/^### (.*$)/gm,'<h4 class="maw-h4">$1</h4>'),n=n.replace(/^## (.*$)/gm,'<h3 class="maw-h3">$1</h3>'),n=n.replace(/^# (.*$)/gm,'<h2 class="maw-h2">$1</h2>'),n=n.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),n=n.replace(/\*([^*]+)\*/g,"<em>$1</em>"),n=n.replace(/^\s*[-*]\s+(.*$)/gm,'<li class="maw-list-item">$1</li>'),n=n.replace(/(<li class="maw-list-item">[\s\S]*?<\/li>)/g,'<ul class="maw-list">$1</ul>'),n=n.replace(/<\/ul>\s*<ul class="maw-list">/g,""),n=n.replace(/^\s*(\d+)\.\s+(.*$)/gm,'<li class="maw-num-item"><span>$1.</span> $2</li>'),n=n.replace(/(<li class="maw-num-item">[\s\S]*?<\/li>)/g,'<ol class="maw-num-list">$1</ol>'),n=n.replace(/<\/ol>\s*<ol class="maw-num-list">/g,""),n=n.replace(/\n\n+/g,'</p><p class="maw-para">'),n=n.replace(/\n/g,"<br/>"),`<div class="maw-md"><p class="maw-para">${n}</p></div>`}escapeHtml(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}};function St(){if(typeof window>"u")return;let t=window,e=[t.__USER_EMAIL__,t.USER_EMAIL,t.currentUser?.email,t.user?.email,t.__NEXT_DATA__?.props?.pageProps?.user?.email,t.__INITIAL_STATE__?.user?.email,t.__AUTH__?.user?.email];for(let n of e)if(typeof n=="string"&&n.includes("@"))return n.trim();try{let n=window.localStorage?.getItem("maw_user_email")||window.localStorage?.getItem("user_email");if(n&&n.includes("@"))return n.trim()}catch{}try{let n=document.querySelector("[data-user-email], [data-user]");if(n&&n.tagName!=="SCRIPT"&&n.tagName!=="MAKE-A-WISH-WIDGET"){let s=n.getAttribute("data-user-email")||n.getAttribute("data-user");if(s&&s.includes("@"))return s.trim()}let i=document.querySelectorAll(".user-email, [data-user-email], .profile-email, .avatar[title*='@'], [data-user], .user, .profile, .avatar"),a=/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;for(let s=0;s<i.length;s++){let o=i[s];if(o.tagName==="SCRIPT"||o.tagName==="MAKE-A-WISH-WIDGET")continue;let r=(o.getAttribute("title")||"").match(a)?.[0]||(o.textContent||"").match(a)?.[0];if(r){let l=r.toLowerCase();if(!l.startsWith("support@")&&!l.startsWith("info@")&&!l.startsWith("help@")&&!l.startsWith("sales@"))return r}}}catch{}}var J=class extends HTMLElement{constructor(){super();p(this,"ui",null);p(this,"shadow");this.shadow=this.attachShadow({mode:"open"})}static get observedAttributes(){return["data-app","data-repo","data-repos","data-api","data-user","data-user-email","data-position"]}connectedCallback(){let n=this.resolveConfig();this.ui=new H(this.shadow,n)}attributeChangedCallback(n,i,a){if(!this.ui)return;let s={};if(n==="data-app"&&(s.appId=a),n==="data-repo"||n==="data-repos"){let o=z(this.getAttribute("data-repos"),this.getAttribute("data-repo"));s.repos=o,s.repo=o[0]||""}n==="data-api"&&(s.apiUrl=a),(n==="data-user"||n==="data-user-email")&&(s.userEmail=a),n==="data-position"&&(s.position=a),this.ui.updateConfig(s)}resolveConfig(){let n=z(this.getAttribute("data-repos"),this.getAttribute("data-repo")),i=this.getAttribute("data-user-email")||this.getAttribute("data-user")||St();return{appId:this.getAttribute("data-app")||"",repo:n[0]||"",repos:n,apiUrl:this.getAttribute("data-api")||window.location.origin,userEmail:i||void 0,position:this.getAttribute("data-position")||"bottom-right"}}};typeof window<"u"&&!customElements.get("make-a-wish-widget")&&customElements.define("make-a-wish-widget",J);function Et(){if(typeof document>"u")return;let t=document.currentScript||document.querySelector('script[src*="widget.js"]'),e=window.location.origin,n="",i="",a="",s="",o="bottom-right";if(t){try{e=new URL(t.src,window.location.href).origin}catch{e=window.location.origin}n=t.getAttribute("data-app")||"";let r=t.getAttribute("data-repos"),l=t.getAttribute("data-repo"),u=z(r,l);a=t.getAttribute("data-api")||e,s=t.getAttribute("data-user-email")||t.getAttribute("data-user")||St()||"";let h=t.getAttribute("data-position");if((h==="bottom-left"||h==="bottom-right")&&(o=h),document.querySelector("make-a-wish-widget"))return;let c=document.createElement("make-a-wish-widget");n&&c.setAttribute("data-app",n),u.length>0&&(c.setAttribute("data-repos",u.join(", ")),c.setAttribute("data-repo",u[0])),a&&c.setAttribute("data-api",a),s&&(c.setAttribute("data-user",s),c.setAttribute("data-user-email",s)),c.setAttribute("data-position",o),document.body.appendChild(c)}else if(!document.querySelector("make-a-wish-widget")){let r=document.createElement("make-a-wish-widget");document.body.appendChild(r)}}typeof document<"u"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Et):Et());})();
//# sourceMappingURL=widget.js.map
