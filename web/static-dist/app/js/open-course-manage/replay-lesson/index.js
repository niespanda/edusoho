!function(t){var n={};function o(e){if(n[e])return n[e].exports;var r=n[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=t,o.c=n,o.d=function(e,r,t){o.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(r,e){if(1&e&&(r=o(r)),8&e)return r;if(4&e&&"object"==typeof r&&r&&r.__esModule)return r;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:r}),2&e&&"string"!=typeof r)for(var n in r)o.d(t,n,function(e){return r[e]}.bind(null,n));return t},o.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(r,"a",r),r},o.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},o.p="/static-dist/",o(o.s=641)}({641:function(e,r){$(".js-generate-replay").on("click",function(e){var r=$(e.currentTarget),t=Translator.trans("confirm.replay_lesson.message"),n=r.data("url");t&&$.post(n,function(e){var r;e.error?10019==e.code?cd.message({type:"danger",message:Translator.trans("notify.not_record.message")}):1403==e.code?cd.message({type:"danger",message:Translator.trans("notify.no_replay_file.message")}):cd.message({type:"danger",message:Translator.trans("notify.record_error.message")}):(r="#"+$(e).attr("id"),$(r).replaceWith(e),cd.message({type:"success",message:Translator.trans("notify.lesson_recorded.message")}))})}),$(".js-tip-show").tooltip()}});