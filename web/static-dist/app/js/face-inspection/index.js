!function(s){function e(e){for(var t,n,r=e[0],a=e[1],o=e[2],i=0,c=[];i<r.length;i++)n=r[i],Object.prototype.hasOwnProperty.call(l,n)&&l[n]&&c.push(l[n][0]),l[n]=0;for(t in a)Object.prototype.hasOwnProperty.call(a,t)&&(s[t]=a[t]);for(p&&p(e);c.length;)c.shift()();return d.push.apply(d,o||[]),u()}function u(){for(var e,t=0;t<d.length;t++){for(var n=d[t],r=!0,a=1;a<n.length;a++){var o=n[a];0!==l[o]&&(r=!1)}r&&(d.splice(t--,1),e=i(i.s=n[0]))}return e}var n={},l={179:0},d=[];function i(e){if(n[e])return n[e].exports;var t=n[e]={i:e,l:!1,exports:{}};return s[e].call(t.exports,t,t.exports,i),t.l=!0,t.exports}i.m=s,i.c=n,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(n,r,function(e){return t[e]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/static-dist/";var t=window.webpackJsonp=window.webpackJsonp||[],r=t.push.bind(t);t.push=e,t=t.slice();for(var a=0;a<t.length;a++)e(t[a]);var p=r;d.push([611,0]),u()}({15:function(e,t){e.exports=jQuery},294:function(e,t){e.exports=function(e){"use strict";if(!window||window.window!==window)throw new Error("This module is only available in browser");var t=window.Blob||window.MozBlob||window.WebKitBlob;if(!t)throw new Error("Blob was not supported");var n=e.match(/^data:((.*?)(;charset=.*?)?)(;base64)?,/);if(!n)throw new Error("invalid dataURI");for(var r=n[2]?n[1]:"text/plain"+(n[3]||";charset=utf-8"),a=!!n[4],o=e.slice(n[0].length),i=(a?atob:decodeURIComponent)(o),c=[],s=0;s<i.length;s++)c.push(i.charCodeAt(s));return new t([new Uint8Array(c)],{type:r})}},611:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),o=n(1),i=n.n(o),c=n(4),s=n(294),u=n.n(s);new(function(){function e(){a()(this,e);this._checkIEDevice()?($("#capture-btn").addClass("hidden"),Object(c.a)("danger","云监考暂不支持该浏览器，请选择其他浏览器")):this._initEvent()}return i()(e,[{key:"_checkIEDevice",value:function(){var e=navigator.userAgent,t=-1<e.indexOf("compatible")&&-1<e.indexOf("MSIE"),n=-1<e.indexOf("Edge")&&!t,r=-1<e.indexOf("Trident")&&-1<e.indexOf("rv:11.0");return t||n||r}},{key:"_initEvent",value:function(){var e=$("#capture-btn"),t=this;e.addClass("disabled"),e.html("人像采集正在初始化..."),setTimeout(function(){0<$(".js-loading-container").length&&(console.log("人像采集初始化失败"),Object(c.a)("danger",Translator.trans("人像采集初始化失败！")),$(".js-btn-group").html('<button id="reset-btn" class="btn btn-primary">重试</button>'))},15e3),$(document).ready(function(){console.log("云监考初始化成功."),e.removeClass("disabled"),$(".js-loading-container").remove(),e.html("开始采集"),t._initCapture()}),$(".js-btn-group").on("click","#reset-btn",function(e){window.location.reload()})}},{key:"_initCapture",value:function(){var a=0;window.esCaptureSdk.on("capture_real_face.started",function(){Object(c.a)("success",Translator.trans("人像采集已启动,请面对摄像头。")),console.log("人像采集已启动,请面对摄像头。")}),window.esCaptureSdk.on("capture_real_face.captured",function(e){console.log("人像采集成功。"),a++;var t,n,r=new Image(480);r.src=e.capture,$("#real-face-imgs").html(r),3===a&&((t=new Image(480)).src=e.capture,$("#real-face-capture").append(t),(n=new FormData).append("picture",u()(e.capture)),$.ajax({url:$("#capture-btn").data("url"),type:"POST",contentType:!1,processData:!1,data:n,success:function(e){e?($("#capture-btn").addClass("hidden"),$("#capture-finish-btn").removeClass("hidden"),Object(c.a)("success",Translator.trans("恭喜！您已成功完成图像采集!"))):Object(c.a)("danger",Translator.trans("采集失败！请刷新页面重新采集"))}}))}),window.esCaptureSdk.on("capture_real_face.finished",function(){console.log("人像采集结束")}),$("#capture-btn").on("click",function(){console.log("人像采集启动中, 请稍等..."),$(".js-tip-title").remove(),$("input[name=token]").attr("disabled",!0),$("#capture-btn").attr("disabled",!0),Object(c.a)("success",Translator.trans("人像采集启动中, 请稍等...")),window.esCaptureSdk.setToken($("input[name=token]").val()),window.esCaptureSdk.captureRealFaces()})}}]),e}())}});