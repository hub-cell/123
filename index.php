<!doctypehtml>
<html lang=en-us>
   <head>
      <meta charset=utf-8>
      <meta content="text/html; charset=utf-8"http-equiv=Content-Type>
      <meta content=#db5945 name=theme-color>
      <meta content="width=device-width,user-scalable=no,initial-scale=1,minimum-scale=1,maximum-scale=1,viewport-fit=cover,minimal-ui"name=viewport>
      <meta content=yes name=apple-mobile-web-app-capable>
      <meta content=yes name=full-screen>
      <meta content=landscape name=screen-orientation>
      <link href=images/icon-512.png rel=icon sizes=512x512>
      <link href=css/main.css rel=stylesheet>
      <title>Worms Zone a Slithery Snake</title>
      <script src=https://www.googletagmanager.com/gtag/js async></script><script>function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date)</script><script src=https://www.gstatic.com/firebasejs/7.12.0/firebase-app.js></script><script src=https://www.gstatic.com/firebasejs/7.12.0/firebase-analytics.js></script><script>var firebaseConfig={apiKey:"AIzaSyB2DcYpUnEE1KnQ_sn-Fj81AF43rQCfspQ",authDomain:"worms-zone-43213285.firebaseapp.com",databaseURL:"https://worms-zone-43213285.firebaseio.com",projectId:"worms-zone-43213285",storageBucket:"worms-zone-43213285.appspot.com",messagingSenderId:"287197829660",appId:"1:287197829660:web:b472aef5a010cab77f5dd9",measurementId:"G-SGXQB3QHGZ"};firebase.initializeApp(firebaseConfig),firebase.analytics()</script><script src=//api.ok.ru/js/fapi5.js></script><script src=js/oksdk.js></script>
   </head>
   <body bgcolor=#000000 build=2.2.3 version=2.2.3>
      <div id=viewport>
         <canvas id=canvas oncontextmenu=event.preventDefault()></canvas>
      </div>
      <script>var config={lockorientation:"landscape",fitwindow:!1,app_id:1273100288,app_key:"CBAJPCOMEBABABABA"}</script><script src=js/main.js></script><script>var ASSERTIONS=0;
         /**
          * @license
          * Copyright 2017 The Emscripten Authors
          * SPDX-License-Identifier: MIT
          */function hasPrefix(r,e){return String.prototype.startsWith?r.startsWith(e):0===r.indexOf(e)}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(r){return hasPrefix(r,dataURIPrefix)}var fileURIPrefix="file://";function isFileURI(r){return hasPrefix(r,fileURIPrefix)}var decodeBase64="function"==typeof atob?atob:function(r){var e,t,i,n,a,o,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",m="",f=0;r=r.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{e=s.indexOf(r.charAt(f++))<<2|(n=s.indexOf(r.charAt(f++)))>>4,t=(15&n)<<4|(a=s.indexOf(r.charAt(f++)))>>2,i=(3&a)<<6|(o=s.indexOf(r.charAt(f++))),m+=String.fromCharCode(e),64!==a&&(m+=String.fromCharCode(t)),64!==o&&(m+=String.fromCharCode(i))}while(f<r.length);return m};function intArrayFromBase64(r){try{for(var e=decodeBase64(r),t=new Uint8Array(e.length),i=0;i<e.length;++i)t[i]=e.charCodeAt(i);return t}catch(r){throw new Error("Converting base64 string to bytes failed.")}}function tryParseAsDataURI(r){if(isDataURI(r))return intArrayFromBase64(r.slice(dataURIPrefix.length))}
         /**
          * @license
          * Copyright 2017 The Emscripten Authors
          * SPDX-License-Identifier: MIT
          */function intArrayFromString(r,e,t){var i=t>0?t:lengthBytesUTF8(r)+1,n=new Array(i),a=stringToUTF8Array(r,n,0,n.length);return e&&(n.length=a),n}function intArrayToString(r){for(var e=[],t=0;t<r.length;t++){var i=r[t];i>255&&(ASSERTIONS&&assert(!1,"Character code "+i+" ("+String.fromCharCode(i)+")  at offset "+t+" not in 0x00-0xFF."),i&=255),e.push(String.fromCharCode(i))}return e.join("")}var memoryInitializer="WormsZone.html.mem";memoryInitializer=Module.locateFile?Module.locateFile(memoryInitializer,""):memoryInitializer,Module.memoryInitializerRequestURL=memoryInitializer;var meminitXHR=Module.memoryInitializerRequest=new XMLHttpRequest;meminitXHR.open("GET",memoryInitializer,!0),meminitXHR.responseType="arraybuffer",meminitXHR.send(null);var script=document.createElement("script");script.src="WormsZone.js",document.body.appendChild(script)
      </script>
   </body>
</html>