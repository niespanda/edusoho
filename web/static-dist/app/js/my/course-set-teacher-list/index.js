!function(r){var n={};function o(e){if(n[e])return n[e].exports;var t=n[e]={i:e,l:!1,exports:{}};return r[e].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.m=r,o.c=n,o.d=function(e,t,r){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)o.d(r,n,function(e){return t[e]}.bind(null,n));return r},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/static-dist/",o(o.s=659)}({659:function(e,t){$(".js-course-sticky").on("click",function(e){var t=$(this);t.attr("disabled",!0),$.ajax({url:t.data("url"),type:"post",success:function(){cd.message({type:"success",message:Translator.trans("course.stick.success")}),window.location.reload()},error:function(){t.attr("disabled",!1)}})}),$(".js-course-unsticky").on("click",function(){var e=$(this);e.attr("disabled",!0),$.ajax({url:e.data("url"),type:"post",success:function(){cd.message({type:"success",message:Translator.trans("course.cancel.stick.success")}),window.location.reload()},error:function(){e.attr("disabled",!1)}})})}});