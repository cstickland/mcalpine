!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(t="undefined"!=typeof globalThis?globalThis:t||self).CategoryArchive=n()}(this,(function(){"use strict";function t(){}function n(t,n){for(const e in n)t[e]=n[e];return t}function e(t){return t()}function o(){return Object.create(null)}function r(t){t.forEach(e)}function c(t){return"function"==typeof t}function i(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}let l;function s(t,n){return l||(l=document.createElement("a")),l.href=n,t===l.href}function u(n,e,o){n.$$.on_destroy.push(function(n,...e){if(null==n)return t;const o=n.subscribe(...e);return o.unsubscribe?()=>o.unsubscribe():o}(e,o))}const a="undefined"!=typeof window;let f=a?()=>window.performance.now():()=>Date.now(),d=a?t=>requestAnimationFrame(t):t;const p=new Set;function g(t){p.forEach((n=>{n.c(t)||(p.delete(n),n.f())})),0!==p.size&&d(g)}function m(t,n){t.appendChild(n)}function h(t,n,e){t.insertBefore(n,e||null)}function $(t){t.parentNode&&t.parentNode.removeChild(t)}function b(t){return document.createElement(t)}function y(t){return document.createTextNode(t)}function v(){return y(" ")}function x(){return y("")}function w(t,n,e,o){return t.addEventListener(n,e,o),()=>t.removeEventListener(n,e,o)}function P(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function T(t,n){n=""+n,t.data!==n&&(t.data=n)}let _;function k(t){_=t}function E(t){(function(){if(!_)throw new Error("Function called outside component initialization");return _})().$$.on_mount.push(t)}const L=[],A=[];let O=[];const S=[],U=Promise.resolve();let C=!1;function N(t){O.push(t)}function I(t){S.push(t)}const M=new Set;let j=0;function z(){if(0!==j)return;const t=_;do{try{for(;j<L.length;){const t=L[j];j++,k(t),q(t.$$)}}catch(t){throw L.length=0,j=0,t}for(k(null),L.length=0,j=0;A.length;)A.pop()();for(let t=0;t<O.length;t+=1){const n=O[t];M.has(n)||(M.add(n),n())}O.length=0}while(L.length);for(;S.length;)S.pop()();C=!1,M.clear(),k(t)}function q(t){if(null!==t.fragment){t.update(),r(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(N)}}const D=new Set;let F;function B(){F={r:0,c:[],p:F}}function X(){F.r||r(F.c),F=F.p}function Y(t,n){t&&t.i&&(D.delete(t),t.i(n))}function H(t,n,e,o){if(t&&t.o){if(D.has(t))return;D.add(t),F.c.push((()=>{D.delete(t),o&&(e&&t.d(1),o())})),t.o(n)}else o&&o()}function V(t,n,e){const o=t.$$.props[n];void 0!==o&&(t.$$.bound[o]=e,e(t.$$.ctx[o]))}function J(t){t&&t.c()}function Z(t,n,o,i){const{fragment:l,after_update:s}=t.$$;l&&l.m(n,o),i||N((()=>{const n=t.$$.on_mount.map(e).filter(c);t.$$.on_destroy?t.$$.on_destroy.push(...n):r(n),t.$$.on_mount=[]})),s.forEach(N)}function G(t,n){const e=t.$$;null!==e.fragment&&(!function(t){const n=[],e=[];O.forEach((o=>-1===t.indexOf(o)?n.push(o):e.push(o))),e.forEach((t=>t())),O=n}(e.after_update),r(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function K(t,n){-1===t.$$.dirty[0]&&(L.push(t),C||(C=!0,U.then(z)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function Q(n,e,c,i,l,s,u,a=[-1]){const f=_;k(n);const d=n.$$={fragment:null,ctx:[],props:s,update:t,not_equal:l,bound:o(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(f?f.$$.context:[])),callbacks:o(),dirty:a,skip_bound:!1,root:e.target||f.$$.root};u&&u(d.root);let p=!1;if(d.ctx=c?c(n,e.props||{},((t,e,...o)=>{const r=o.length?o[0]:e;return d.ctx&&l(d.ctx[t],d.ctx[t]=r)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](r),p&&K(n,t)),e})):[],d.update(),p=!0,r(d.before_update),d.fragment=!!i&&i(d.ctx),e.target){if(e.hydrate){const t=function(t){return Array.from(t.childNodes)}(e.target);d.fragment&&d.fragment.l(t),t.forEach($)}else d.fragment&&d.fragment.c();e.intro&&Y(n.$$.fragment),Z(n,e.target,e.anchor,e.customElement),z()}k(f)}class R{$destroy(){G(this,1),this.$destroy=t}$on(n,e){if(!c(e))return t;const o=this.$$.callbacks[n]||(this.$$.callbacks[n]=[]);return o.push(e),()=>{const t=o.indexOf(e);-1!==t&&o.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function W(n){let e,o,r,c,i,l,u,a,f,d,p,g,x,w;return{c(){e=b("li"),o=b("a"),r=b("div"),c=b("img"),l=v(),u=b("div"),a=b("h5"),f=y(n[3]),d=v(),p=b("div"),p.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="13.922" height="16.245" viewBox="0 0 13.922 16.245"><path d="M0,16.245V11.68L6.667,7.869,0,4.06V0L13.922,8.122,0,16.244Z" fill="#fff"></path></svg>',g=v(),x=b("a"),w=y(n[3]),P(c,"class","category-card-image"),s(c.src,i=n[1])||P(c,"src",i),P(c,"alt",n[2]),P(p,"class","product-category-link"),P(u,"class","category-link-container"),P(r,"class","category-card"),P(o,"class","category-card"),P(o,"href",n[0]),P(x,"class","category-card-link-small"),P(x,"href",n[0]),P(e,"class","category-card-container")},m(t,n){h(t,e,n),m(e,o),m(o,r),m(r,c),m(r,l),m(r,u),m(u,a),m(a,f),m(u,d),m(u,p),m(e,g),m(e,x),m(x,w)},p(t,[n]){2&n&&!s(c.src,i=t[1])&&P(c,"src",i),4&n&&P(c,"alt",t[2]),8&n&&T(f,t[3]),1&n&&P(o,"href",t[0]),8&n&&T(w,t[3]),1&n&&P(x,"href",t[0])},i:t,o:t,d(t){t&&$(e)}}}function tt(t,n,e){let{url:o}=n,{imageUrl:r}=n,{imageAlt:c}=n,{title:i}=n;return t.$$set=t=>{"url"in t&&e(0,o=t.url),"imageUrl"in t&&e(1,r=t.imageUrl),"imageAlt"in t&&e(2,c=t.imageAlt),"title"in t&&e(3,i=t.title)},[o,r,c,i]}class nt extends R{constructor(t){super(),Q(this,t,tt,W,i,{url:0,imageUrl:1,imageAlt:2,title:3})}}var et={$:t=>"string"==typeof t?document.querySelector(t):t,extend:(...t)=>Object.assign(...t),cumulativeOffset(t){let n=0,e=0;do{n+=t.offsetTop||0,e+=t.offsetLeft||0,t=t.offsetParent}while(t);return{top:n,left:e}},directScroll:t=>t&&t!==document&&t!==document.body,scrollTop(t,n){let e=void 0!==n;return this.directScroll(t)?e?t.scrollTop=n:t.scrollTop:e?document.documentElement.scrollTop=document.body.scrollTop=n:window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0},scrollLeft(t,n){let e=void 0!==n;return this.directScroll(t)?e?t.scrollLeft=n:t.scrollLeft:e?document.documentElement.scrollLeft=document.body.scrollLeft=n:window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0}};const ot={container:"body",duration:500,delay:0,offset:0,easing:function(t){return t<.5?4*t*t*t:.5*Math.pow(2*t-2,3)+1},onStart:t,onDone:t,onAborting:t,scrollX:!1,scrollY:!0},rt=t=>{let{offset:n,duration:e,delay:o,easing:r,x:c=0,y:i=0,scrollX:l,scrollY:s,onStart:u,onDone:a,container:m,onAborting:h,element:$}=t;"function"==typeof n&&(n=n());var b=et.cumulativeOffset(m),y=$?et.cumulativeOffset($):{top:i,left:c},v=et.scrollLeft(m),x=et.scrollTop(m),w=y.left-b.left+n,P=y.top-b.top+n,T=w-v,_=P-x;let k=!0,E=!1,L=f()+o,A=L+e;function O(t){t||(E=!0,u($,{x:c,y:i}))}function S(t){!function(t,n,e){l&&et.scrollLeft(t,e),s&&et.scrollTop(t,n)}(m,x+_*t,v+T*t)}function U(){k=!1}return function(t){let n;0===p.size&&d(g),new Promise((e=>{p.add(n={c:t,f:e})}))}((t=>{if(!E&&t>=L&&O(!1),E&&t>=A&&(S(1),U(),a($,{x:c,y:i})),!k)return h($,{x:c,y:i}),!1;if(E){S(0+1*r((t-L)/e))}return!0})),O(o),S(0),U},ct=t=>rt((t=>{let n=et.extend({},ot,t);return n.container=et.$(n.container),n.element=et.$(n.element),n})(t));function it(n){let e;return{c(){e=b("button"),e.textContent="Prev",P(e,"class","prev-next-button"),e.disabled=!0},m(t,n){h(t,e,n)},p:t,d(t){t&&$(e)}}}function lt(n){let e,o,r;return{c(){e=b("button"),e.textContent="Prev",P(e,"class","prev-next-button")},m(t,c){h(t,e,c),o||(r=w(e,"click",n[4]),o=!0)},p:t,d(t){t&&$(e),o=!1,r()}}}function st(t){let n,e,o,r,c=t[0]-2+"";return{c(){n=b("button"),e=y(c),P(n,"class","pagination-button")},m(c,i){h(c,n,i),m(n,e),o||(r=w(n,"click",t[5]),o=!0)},p(t,n){1&n&&c!==(c=t[0]-2+"")&&T(e,c)},d(t){t&&$(n),o=!1,r()}}}function ut(t){let n,e,o,r,c=t[0]-1+"";return{c(){n=b("button"),e=y(c),P(n,"class","pagination-button")},m(c,i){h(c,n,i),m(n,e),o||(r=w(n,"click",t[6]),o=!0)},p(t,n){1&n&&c!==(c=t[0]-1+"")&&T(e,c)},d(t){t&&$(n),o=!1,r()}}}function at(t){let n,e,o,r,c=t[0]+1+"";return{c(){n=b("button"),e=y(c),P(n,"class","pagination-button")},m(c,i){h(c,n,i),m(n,e),o||(r=w(n,"click",t[7]),o=!0)},p(t,n){1&n&&c!==(c=t[0]+1+"")&&T(e,c)},d(t){t&&$(n),o=!1,r()}}}function ft(t){let n,e,o,r,c=t[0]+2+"";return{c(){n=b("button"),e=y(c),P(n,"class","pagination-button")},m(c,i){h(c,n,i),m(n,e),o||(r=w(n,"click",t[8]),o=!0)},p(t,n){1&n&&c!==(c=t[0]+2+"")&&T(e,c)},d(t){t&&$(n),o=!1,r()}}}function dt(t){let n,e,o,r,c,i;return{c(){n=b("div"),n.innerHTML="<span>...</span>",e=v(),o=b("button"),r=y(t[1]),P(n,"class","pagination-seperator-dots"),P(o,"class","pagination-button")},m(l,s){h(l,n,s),h(l,e,s),h(l,o,s),m(o,r),c||(i=w(o,"click",t[9]),c=!0)},p(t,n){2&n&&T(r,t[1])},d(t){t&&$(n),t&&$(e),t&&$(o),c=!1,i()}}}function pt(n){let e;return{c(){e=b("button"),e.textContent="Next",P(e,"class","prev-next-button"),e.disabled=!0},m(t,n){h(t,e,n)},p:t,d(t){t&&$(e)}}}function gt(n){let e,o,r;return{c(){e=b("button"),e.textContent="Next",P(e,"class","prev-next-button")},m(t,c){h(t,e,c),o||(r=w(e,"click",n[10]),o=!0)},p:t,d(t){t&&$(e),o=!1,r()}}}function mt(n){let e,o,r,c,i,l,s,u,a,f,d;function p(t,n){return t[0]>1?lt:it}let g=p(n),w=g(n),_=n[0]==n[1]&&n[1]>2&&st(n),k=n[0]>1&&ut(n),E=n[0]<n[1]&&at(n),L=1==n[0]&&n[1]>2&&ft(n),A=n[0]<n[1]-1&&n[1]>3&&dt(n);function O(t,n){return t[0]<t[1]?gt:pt}let S=O(n),U=S(n);return{c(){w.c(),e=v(),o=b("div"),_&&_.c(),r=v(),k&&k.c(),c=v(),i=b("button"),l=y(n[0]),s=v(),E&&E.c(),u=v(),L&&L.c(),a=v(),A&&A.c(),f=v(),U.c(),d=x(),P(i,"class","pagination-button pagination-button__current"),P(o,"class","page-number-buttons")},m(t,n){w.m(t,n),h(t,e,n),h(t,o,n),_&&_.m(o,null),m(o,r),k&&k.m(o,null),m(o,c),m(o,i),m(i,l),m(o,s),E&&E.m(o,null),m(o,u),L&&L.m(o,null),m(o,a),A&&A.m(o,null),h(t,f,n),U.m(t,n),h(t,d,n)},p(t,[n]){g===(g=p(t))&&w?w.p(t,n):(w.d(1),w=g(t),w&&(w.c(),w.m(e.parentNode,e))),t[0]==t[1]&&t[1]>2?_?_.p(t,n):(_=st(t),_.c(),_.m(o,r)):_&&(_.d(1),_=null),t[0]>1?k?k.p(t,n):(k=ut(t),k.c(),k.m(o,c)):k&&(k.d(1),k=null),1&n&&T(l,t[0]),t[0]<t[1]?E?E.p(t,n):(E=at(t),E.c(),E.m(o,u)):E&&(E.d(1),E=null),1==t[0]&&t[1]>2?L?L.p(t,n):(L=ft(t),L.c(),L.m(o,a)):L&&(L.d(1),L=null),t[0]<t[1]-1&&t[1]>3?A?A.p(t,n):(A=dt(t),A.c(),A.m(o,null)):A&&(A.d(1),A=null),S===(S=O(t))&&U?U.p(t,n):(U.d(1),U=S(t),U&&(U.c(),U.m(d.parentNode,d)))},i:t,o:t,d(t){w.d(t),t&&$(e),t&&$(o),_&&_.d(),k&&k.d(),E&&E.d(),L&&L.d(),A&&A.d(),t&&$(f),U.d(t),t&&$(d)}}}function ht(t,n,e){let{currentPage:o}=n,{totalPages:r}=n,{transition:c}=n;function i(t){ct({element:"#category-archive",duration:200}),e(3,c=!0),e(0,o=t),setTimeout((()=>{e(3,c=!1)}),10)}return t.$$set=t=>{"currentPage"in t&&e(0,o=t.currentPage),"totalPages"in t&&e(1,r=t.totalPages),"transition"in t&&e(3,c=t.transition)},[o,r,i,c,()=>{i(o-1)},()=>{i(o-2)},()=>{i(o-1)},()=>{i(o+1)},()=>{i(o+2)},()=>{i(r)},()=>{i(o+1)}]}class $t extends R{constructor(t){super(),Q(this,t,ht,mt,i,{currentPage:0,totalPages:1,transition:3})}}const bt=[];const yt=function(n,e=t){let o;const r=new Set;function c(t){if(i(n,t)&&(n=t,o)){const t=!bt.length;for(const t of r)t[1](),bt.push(t,n);if(t){for(let t=0;t<bt.length;t+=2)bt[t][0](bt[t+1]);bt.length=0}}}return{set:c,update:function(t){c(t(n))},subscribe:function(i,l=t){const s=[i,l];return r.add(s),1===r.size&&(o=e(c)||t),i(n),()=>{r.delete(s),0===r.size&&o&&(o(),o=null)}}}}([]);async function vt(t){const n=await fetch("/graphql",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:t})});return await n.json()}function xt(t,n,e){const o=t.slice();return o[10]=n[e],o}function wt(t){let n,e,o=t[2],r=[];for(let n=0;n<o.length;n+=1)r[n]=Pt(xt(t,o,n));const c=t=>H(r[t],1,1,(()=>{r[t]=null}));return{c(){for(let t=0;t<r.length;t+=1)r[t].c();n=x()},m(t,o){for(let n=0;n<r.length;n+=1)r[n]&&r[n].m(t,o);h(t,n,o),e=!0},p(t,e){if(4&e){let i;for(o=t[2],i=0;i<o.length;i+=1){const c=xt(t,o,i);r[i]?(r[i].p(c,e),Y(r[i],1)):(r[i]=Pt(c),r[i].c(),Y(r[i],1),r[i].m(n.parentNode,n))}for(B(),i=o.length;i<r.length;i+=1)c(i);X()}},i(t){if(!e){for(let t=0;t<o.length;t+=1)Y(r[t]);e=!0}},o(t){r=r.filter(Boolean);for(let t=0;t<r.length;t+=1)H(r[t]);e=!1},d(t){!function(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}(r,t),t&&$(n)}}}function Pt(t){let e,o;const r=[t[10]];let c={};for(let t=0;t<r.length;t+=1)c=n(c,r[t]);return e=new nt({props:c}),{c(){J(e.$$.fragment)},m(t,n){Z(e,t,n),o=!0},p(t,n){const o=4&n?function(t,n){const e={},o={},r={$$scope:1};let c=t.length;for(;c--;){const i=t[c],l=n[c];if(l){for(const t in i)t in l||(o[t]=1);for(const t in l)r[t]||(e[t]=l[t],r[t]=1);t[c]=l}else for(const t in i)r[t]=1}for(const t in o)t in e||(e[t]=void 0);return e}(r,[(c=t[10],"object"==typeof c&&null!==c?c:{})]):{};var c;e.$set(o)},i(t){o||(Y(e.$$.fragment,t),o=!0)},o(t){H(e.$$.fragment,t),o=!1},d(t){G(e,t)}}}function Tt(t){let n,e,o,r;function c(n){t[7](n)}function i(n){t[8](n)}let l={totalPages:t[3]};return void 0!==t[0]&&(l.currentPage=t[0]),void 0!==t[1]&&(l.transition=t[1]),n=new $t({props:l}),A.push((()=>V(n,"currentPage",c))),A.push((()=>V(n,"transition",i))),{c(){J(n.$$.fragment)},m(t,e){Z(n,t,e),r=!0},p(t,r){const c={};8&r&&(c.totalPages=t[3]),!e&&1&r&&(e=!0,c.currentPage=t[0],I((()=>e=!1))),!o&&2&r&&(o=!0,c.transition=t[1],I((()=>o=!1))),n.$set(c)},i(t){r||(Y(n.$$.fragment,t),r=!0)},o(t){H(n.$$.fragment,t),r=!1},d(t){G(n,t)}}}function _t(t){let n,e,o,r,c,i,l=0==t[1]&&wt(t),s=t[3]>1&&Tt(t);return{c(){n=b("section"),e=b("div"),o=b("ul"),l&&l.c(),r=v(),c=b("div"),s&&s.c(),P(o,"class","insight-archive-grid mobile-two-column"),P(e,"class","insight-archive-grid-container"),P(c,"class","pagination-container"),P(n,"class","insight-archive")},m(t,u){h(t,n,u),m(n,e),m(e,o),l&&l.m(o,null),m(n,r),m(n,c),s&&s.m(c,null),i=!0},p(t,[n]){0==t[1]?l?(l.p(t,n),2&n&&Y(l,1)):(l=wt(t),l.c(),Y(l,1),l.m(o,null)):l&&(B(),H(l,1,1,(()=>{l=null})),X()),t[3]>1?s?(s.p(t,n),8&n&&Y(s,1)):(s=Tt(t),s.c(),Y(s,1),s.m(c,null)):s&&(B(),H(s,1,1,(()=>{s=null})),X())},i(t){i||(Y(l),Y(s),i=!0)},o(t){H(l),H(s),i=!1},d(t){t&&$(n),l&&l.d(),s&&s.d()}}}function kt(t,n,e){let o,r,c;u(t,yt,(t=>e(9,c=t)));let i,{archiveType:l=""}=n,{postsPerPage:s}=n,a=1,f=!1;return E((async()=>{let t;var n;if(c=[],n=c,yt.set(n),"warranties"==l){t="{\n  warranties {\n    edges {\n      node {\n        id\n        title\n        link\n        featuredImage {\n          node {\n            altText\n            sourceUrl(size: MEDIUM)\n          }\n        }\n      }\n    }\n  }\n}";let n=[];(await vt(t)).data.warranties.edges.forEach((t=>{let e={title:t.node.title,url:t.node.link,imageUrl:t.node.featuredImage.node.sourceUrl,imageAlt:t.node.featuredImage.node.altText};n.push(e)})),yt.set(n)}if("categories"==l){t="{\n  productCategories(first: 1000) {\n    edges {\n      node {\n        id\n        name\n        parentId\n        link\n        customFields {\n          categoryImage {\n            altText\n            sourceUrl(size: MEDIUM)\n          }\n        }\n      }\n    }\n  }\n}";let n=[],e=await vt(t);console.log(e),e.data.productCategories.edges.forEach((t=>{let e={title:t.node.name,url:t.node.link,imageUrl:t.node.customFields.categoryImage?.sourceUrl,imageAlt:t.node.customFields.categoryImage?.altText};n.push(e)})),yt.set(n)}})),yt.subscribe((t=>{e(6,i=function(t,n,e){let o=[],r=[];return n.forEach((n=>{if(o.push(n),o.length==t)return r.push(o),void(o=[])})),o.length>0&&r.push(o),console.log(r),r}(s,t))})),t.$$set=t=>{"archiveType"in t&&e(4,l=t.archiveType),"postsPerPage"in t&&e(5,s=t.postsPerPage)},t.$$.update=()=>{64&t.$$.dirty&&e(3,o=i.length),65&t.$$.dirty&&e(2,r=i[a-1]||[])},[a,f,r,o,l,s,i,function(t){a=t,e(0,a)},function(t){f=t,e(1,f)}]}return class extends R{constructor(t){super(),Q(this,t,kt,_t,i,{archiveType:4,postsPerPage:5})}}}));
//# sourceMappingURL=category-archive.js.map
