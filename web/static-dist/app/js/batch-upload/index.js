webpackJsonp(["app/js/batch-upload/index"],{0:function(e,t){e.exports=jQuery},"13002f9463104d4a7717":function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a("cd078759ac479d74803f"),r=i(n),l=a("7ab4a89ebadbfdecc2bf"),o=i(l),s=a("4602c3f5fe7ad9e3e91d"),c=i(s),d=a("1ff717687cc04d94af8f"),u=i(d),f=a("3b1883fc74dc0f9509af"),h=i(f),p=a("17c25dd7d9d2615bc1d9"),v=i(p),b=function(e){function t(){return(0,o.default)(this,t),(0,u.default)(this,(t.__proto__||(0,r.default)(t)).call(this))}return(0,h.default)(t,e),(0,c.default)(t,[{key:"_open",value:function(){$(".file-chooser-bar").addClass("hidden"),$(".file-chooser-main").removeClass("hidden")}},{key:"_close",value:function(){$(".file-chooser-main").addClass("hidden"),$(".file-chooser-bar").removeClass("hidden")}},{key:"_getUrlParameter",value:function(e,t){var a=e.split("?");if(a&&2==a.length)for(var i=decodeURIComponent(a[1]),n=i.split("&"),r=0;r<n.length;r++){var l=n[r].split("=");if(l[0]===t)return void 0===l[1]?null:l[1]}return null}}]),t}(v.default);t.default=b},"211c14237cb3b0bd0422":function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a("cd078759ac479d74803f"),r=i(n),l=a("7ab4a89ebadbfdecc2bf"),o=i(l),s=a("4602c3f5fe7ad9e3e91d"),c=i(s),d=a("1ff717687cc04d94af8f"),u=i(d),f=a("3b1883fc74dc0f9509af"),h=i(f),p=a("13002f9463104d4a7717"),v=i(p),b=function(e){function t(e){(0,o.default)(this,t);var a=(0,u.default)(this,(t.__proto__||(0,r.default)(t)).call(this));return a.container=e,a._init(),a._initEvent(),a}return(0,h.default)(t,e),(0,c.default)(t,[{key:"_init",value:function(){this._loadList()}},{key:"_initEvent",value:function(){$(this.container).on("click",".pagination a",this._paginationList.bind(this)),$(this.container).on("click",".js-course-browser-search",this._filterByFileName.bind(this))}},{key:"_loadList",value:function(){var e=$(".course-file-browser"),t=e.data("url");$.get(t,this._getParams(),function(t){e.html(t)})}},{key:"_getParams",value:function(){var e={};return $(".js-course-file-search-form").find("input[type=hidden]").each(function(){e[$(this).attr("name")]=$(this).val()}),e}},{key:"_paginationList",value:function(e){e.stopImmediatePropagation(),e.preventDefault();var t=this._getUrlParameter($(e.currentTarget).attr("href"),"page");$(".js-course-file-search-form").find("input[name=page]").val(t),this._loadList()}},{key:"_filterByFileName",value:function(){$(".js-course-file-search-form").find("input[name=keyword]").val($(".js-course-file-name").val()),$(".js-course-file-search-form").find("input[name=page]").val(1),this._loadList()}}]),t}(v.default);t.default=b},"582d7dd2d5834261808b":function(e,t,a){"use strict";var i=a("5899c7c7c1283bfb76ec");new(function(e){return e&&e.__esModule?e:{default:e}}(i).default)({element:"#uploader-container"}),$("#uploader-container").parents(".modal").on("hidden.bs.modal",function(){window.location.reload()})},"5899c7c7c1283bfb76ec":function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a("7ab4a89ebadbfdecc2bf"),r=i(n),l=a("4602c3f5fe7ad9e3e91d"),o=i(l),s=a("b334fd7e4c5a19234db2"),c=i(s),d=a("a50a2424001592315c5e"),u=i(d),f=function(){function e(t){(0,r.default)(this,e),this.element=$(t.element),this.uploader=null,this.files=[],this.$sortable=$("#sortable-list"),this.init()}return(0,o.default)(e,[{key:"init",value:function(){this.initUploader(),this.initEvent();new u.default}},{key:"initUploader",value:function(){var e=this,t=this.element;this.uploader=new UploaderSDK({id:t.attr("id"),sdkBaseUri:app.cloudSdkBaseUri,disableDataUpload:app.cloudDisableLogReport,disableSentry:app.cloudDisableLogReport,initUrl:t.data("initUrl"),finishUrl:t.data("finishUrl"),accept:t.data("accept"),process:this.getUploadProcess(),ui:"batch",fileNumLimit:void 0!==t.data("numLimit")?t.data("numLimit"):null,locale:document.documentElement.lang}),this.uploader.on("file.finish",function(t){e.files.push(t)}),this.uploader.on("error",function(e){var t={F_DUPLICATE:Translator.trans("uploader.file.exist")};e.message||(e.message=t[e.error]),(0,c.default)("danger",e.message)})}},{key:"initEvent",value:function(){var e=this,t=this;$(".js-upload-params").on("change",function(t){e.uploader.setProcess(e.getUploadProcess())}),$(".js-batch-create-lesson-btn").on("click",function(a){var i=$(".js-batch-create-content").find('input[data-role="batch-item"]:checked').length;if(!e.files.length&&i<1)return void(0,c.default)("danger",Translator.trans("uploader.select_one_file"));var n=$(a.currentTarget);n.button("loading"),e.validLessonNum(n)&&(i>0?t.submitSelectFile(n,i):t.submitUploaderFile(n))}),$('[data-toggle="popover"]').popover({html:!0}),$(".js-batch-create-content").on("click","[data-role=batch-select]",function(){1==$(this).is(":checked")?$(this).parents(".js-table-list").find("[data-role=batch-item]").prop("checked",!0):$(this).parents(".js-table-list").find("[data-role=batch-item]").prop("checked",!1)}),$(".js-batch-create-content").on("click","[data-role=batch-item]",function(){1!=$(this).is(":checked")&&$(".js-batch-create-content").find("[data-role=batch-select]").prop("checked",!1)})}},{key:"submitSelectFile",value:function(e,t){var a=this;$(".js-batch-create-content").find('input[data-role="batch-item"]:checked').map(function(i,n,r){var l=!1;i+1==t&&(l=!0);var o=$(n).parents(".file-browser-item").data("id");a.createLesson(e,o,l)})}},{key:"submitUploaderFile",value:function(e){var t=this;this.files.map(function(a,i){var n=!1;i+1==t.files.length&&(n=!0),t.createLesson(e,a.id,n)})}},{key:"getUploadProcess",value:function(){var e=$(".js-upload-params").get().reduce(function(e,t){return e[$(t).attr("name")]=$(t).find("option:selected").val(),e},{}),t={video:e,document:{type:"html"}};return $("[name=support_mobile]").length>0&&(t.common={supportMobile:$("[name=support_mobile]").val()}),t}},{key:"validLessonNum",value:function(e){var t=!0;return $.ajax({type:"post",url:e.data("validUrl"),async:!1,data:{number:this.files.length},success:function(a){a&&a.error&&((0,c.default)("danger",a.error),e.button("reset"),t=!1),t=!0}}),t}},{key:"createLesson",value:function(e,t,a){var i=this;$.ajax({type:"post",url:e.data("url"),async:!1,data:{fileId:t},success:function(e){e&&e.error?(0,c.default)("danger",e.error):i.$sortable.trigger("addItem",e)},error:function(e){(0,c.default)("danger",Translator.trans("uploader.status.error"))},complete:function(e){a&&$("#modal").modal("hide")}})}}]),e}();t.default=f},a50a2424001592315c5e:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a("cd078759ac479d74803f"),r=i(n),l=a("7ab4a89ebadbfdecc2bf"),o=i(l),s=a("4602c3f5fe7ad9e3e91d"),c=i(s),d=a("1ff717687cc04d94af8f"),u=i(d),f=a("3b1883fc74dc0f9509af"),h=i(f),p=a("b3db986f0151b2971eca"),v=i(p),b=a("211c14237cb3b0bd0422"),m=i(b),_=a("17c25dd7d9d2615bc1d9"),g=i(_),k=function(e){function t(e){(0,o.default)(this,t);var a=(0,u.default)(this,(t.__proto__||(0,r.default)(t)).call(this));return a.init(),a}return(0,h.default)(t,e),(0,c.default)(t,[{key:"init",value:function(){this.initTab(),this.initFileChooser()}},{key:"initTab",value:function(){$("#material a").click(function(e){e.preventDefault();var t=$(this);t.find('[type="radio"]').prop("checked","checked"),$(".js-batch-create-content").find("[data-role=batch-item],[data-role=batch-select]").prop("checked",!1),t.closest("li").siblings("li").find('[type="radio"]').prop("checked",!1),t.tab("show")})}},{key:"initFileChooser",value:function(){new v.default($("#chooser-material-panel")),new m.default($("#chooser-course-panel"))}},{key:"fileSelect",value:function(e){this.fillTitle(e),this.emit("select",e)}},{key:"fillTitle",value:function(e){var t=$("#title");if(t.length>0&&""==t.val()){var a=e.name.substring(0,e.name.lastIndexOf("."));t.val(a)}}}],[{key:"openUI",value:function(){$(".file-chooser-bar").addClass("hidden"),$(".file-chooser-main").removeClass("hidden")}},{key:"closeUI",value:function(){$(".file-chooser-main").addClass("hidden"),$(".file-chooser-bar").removeClass("hidden")}}]),t}(g.default);t.default=k},b3db986f0151b2971eca:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a("cc2d3198fedcb28c0d05"),r=i(n),l=a("cd078759ac479d74803f"),o=i(l),s=a("7ab4a89ebadbfdecc2bf"),c=i(s),d=a("4602c3f5fe7ad9e3e91d"),u=i(d),f=a("1ff717687cc04d94af8f"),h=i(f),p=a("3b1883fc74dc0f9509af"),v=i(p),b=a("13002f9463104d4a7717"),m=i(b),_=function(e){function t(e){(0,c.default)(this,t);var a=(0,h.default)(this,(t.__proto__||(0,o.default)(t)).call(this));return a.container=e,a.loadShareingContacts=!1,a._init(),a._initEvent(),a}return(0,v.default)(t,e),(0,u.default)(t,[{key:"_init",value:function(){this._loadList()}},{key:"_initEvent",value:function(){$(this.container).on("click",".js-material-type",this._switchFileSource.bind(this)),$(this.container).on("click",".js-browser-search",this._filterByFileName.bind(this)),$(this.container).on("click",".pagination a",this._paginationList.bind(this))}},{key:"_loadList",value:function(){var e=this,t=$(".js-browser-search").data("url");$.get(t,this._getParams(),function(t){e.container.find(".js-material-list").html(t)})}},{key:"_getParams",value:function(){var e={};return $(".js-material-lib-search-form input[type=hidden]").each(function(t){e[$(this).attr("name")]=$(this).val()}),e}},{key:"_paginationList",value:function(e){e.stopImmediatePropagation(),e.preventDefault();var t=this._getUrlParameter($(e.currentTarget).attr("href"),"page");$("input[name=page]").val(t),this._loadList()}},{key:"_switchFileSource",value:function(e){var t=e.currentTarget,a=$(t).data("type");switch($(t).addClass("active").siblings().removeClass("active"),$("input[name=sourceFrom]").val(a),$("input[name=page]").val(1),a){case"my":$(".js-file-name-group").removeClass("hidden"),$(".js-file-owner-group").addClass("hidden");break;case"sharing":this._loadSharingContacts.call(this,$(t).data("sharingContactsUrl")),$(".js-file-name-group").removeClass("hidden"),$(".js-file-owner-group").addClass("hidden");break;default:$(".js-file-name-group").removeClass("hidden"),$(".js-file-owner-group").addClass("hidden")}this._loadList()}},{key:"_loadSharingContacts",value:function(e){1!=this.loadShareingContacts&&($.get(e,function(e){if((0,r.default)(e).length>0){var t="<option value=''>"+Translator.trans("activity.manage.choose_teacher_hint")+"</option>";$.each(e,function(e,a){t+="<option value='"+a.id+"'>"+a.nickname+" </option>"}),$(".js-file-owner",self.element).html(t)}},"json"),this.loadShareingContacts=!0)}},{key:"_filterByFileName",value:function(){$("input[name=keyword]").val($(".js-file-name").val()),this._loadList()}}]),t}(m.default);t.default=_}},["582d7dd2d5834261808b"]);