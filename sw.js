if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let t={};const d=e=>n(e,o),c={module:{uri:o},exports:t,require:d};i[o]=Promise.all(s.map((e=>c[e]||d(e)))).then((e=>(r(...e),t)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-CYLa8i6j.css",revision:null},{url:"assets/index-D7H_Na_Z.js",revision:null},{url:"index.html",revision:"a799d5cf10842011bc9adf332e0dcb81"},{url:"registerSW.js",revision:"4d09e21d5b0aa6e3839b8731fca37520"},{url:"icons/icon-192x192.png",revision:"d7f6beae9f0acbdfb622d0e3fd59ec89"},{url:"icons/icon-512x512.png",revision:"d7f6beae9f0acbdfb622d0e3fd59ec89"},{url:"manifest.webmanifest",revision:"46ac2d9fb450838944965cc3791a94de"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
