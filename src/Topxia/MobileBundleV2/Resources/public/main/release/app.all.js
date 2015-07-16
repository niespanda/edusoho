var app = angular.module('app', [
            'ngSanitize',
            'ui.router',
            'AppService',
            'AppFactory',
            'AppProvider',
            'ngSideView',
            'pasvaz.bindonce'
  ]);

app.viewFloder = "/bundles/topxiamobilebundlev2/main/";

app.config(['appRouterProvider', function(appRouterProvider) {

}]);
app.config(['$httpProvider', function($httpProvider) {

    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {

        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function(obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;
 
            for (name in obj) {
                value = obj[name];
 
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '='
                            + encodeURIComponent(value) + '&';
                }
            }
 
            return query.length ? query.substr(0, query.length - 1) : query;
        };
 
        return angular.isObject(data) && String(data) !== '[object File]'
                ? param(data)
                : data;
    }];
}]);

app.config([ 'appRouterProvider', '$urlRouterProvider', function(appRouterProvider, $urlRouterProvider)
{
  $urlRouterProvider.when("/", "/index").
  otherwise('/');

  appRouterProvider.init();
}]);

app.run(["applicationProvider", "$rootScope", '$timeout', 'platformUtil',
  function(applicationProvider, $rootScope, $timeout, platformUtil) {

  $rootScope.platform = platformUtil;
  $rootScope.showLoad = function(template) {
    if ($rootScope.loadPop) {
      $rootScope.loadPop.loading("hide");
    }
    $rootScope.loadPop = $.loading({
        content: "加载中...",
    });

    $timeout(function(){
        if ($rootScope.loadPop) {
          $rootScope.loadPop.loading("hide");
        }
    },5000);
  };

  $rootScope.toast = function(template) {
    var el = $.tips({
        content: template,
        stayTime: 2000,
        type: "info"
    });

    $timeout(function(){
        el.loading("hide");
    },2000);
  };

  $rootScope.hideLoad = function() {
    if (! $rootScope.loadPop) {
      return;
    }
    $rootScope.loadPop.loading("hide");
    $rootScope.loadPop = null;
  };

  app.host = window.location.origin;
  app.rootPath = window.location.origin + window.location.pathname;
  $rootScope.stateParams = {};

  applicationProvider.init(app.host);
  FastClick.attach(document.body);
}]);

angular.element(document).ready(function() {
    var platformUtil = angular.injector(["AppFactory", "ng"]).get("platformUtil");
    if (platformUtil.native) {
      document.addEventListener("deviceready", function() {
          angular.bootstrap( document, ["app"] );
      });
      return;
    }
    
    angular.bootstrap( document, ["app"] );
});
;
var appFactory = angular.module('AppFactory', []);
appFactory.factory('AppUtil', ['$rootScope', '$timeout', function($rootScope, $timeout) {
	var utils = {
		createArray : function(count) {
			var arr = [];
			for (var i = count- 1; i >= 0; i--) {
				arr.unshift(i);
			};

			return arr;
		},
		coverCategoty : function(categoryTree) {
			var categorys = [];
			for (var i = categoryTree.length - 1; i >= 0; i--) {
				categorys.unshift(categoryTree[i]);
			};
		},
		showPop : function(opts, callback) {
			var confirmPopup = $ionicPopup.confirm({
			     title: opts.title,
			     template: opts.template,
			     okText : opts.okText || "确定",
			     cancelText : opts.cancelText || "取消"
			});
			
			confirmPopup.then(function(res) {
				callback(res);
			});
		},
		createDialog : function(title, template, btns, modalInitFunc) {
			
			var dia=$.dialog({
			        title: title,
			        content: template,
			        button: btns || ["确认"]
			});

			dia.on("dialog:action",function(e){
			       modalInitFunc(e.index);
			       dia.dialog("hide");
			});
		},
		inArray : function(elem, arr, i) {
			    var len;
			    var deletedIds = [];
			    var indexOf = deletedIds.indexOf;
			    if ( arr ) {
			        if ( indexOf ) {
			            return indexOf.call( arr, elem, i );
			        }
			        len = arr.length;
			        i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;
			        for ( ; i < len; i++ ) {
			            if ( i in arr && arr[ i ] === elem ) {
			                return i;
			            }
			        }
			    }

			    return -1;
		}
	};
	
	return utils;
}]).
factory('ServcieUtil', function() {

	return {
		getService : function(name) {
			return angular.injector(["AppService", "ng"]).get(name);
		}
	}
}).
factory('VipUtil', function() {

	var payByYear = {
		title : "按年支付",
		type : 20,
		name : "year"
	};

	var payByMonth  ={
		title : "按月支付",
		type : 30,
		name : "month"
	};

	return {
		getPayType : function() {
			return {
				byYead : 20,
				byMonth : 30
			}
		},
		getPayMode : function(buyType) {
			
			if (buyType == 10) {
				return [payByYear, payByMonth];
			} else if (buyType == 20) {
				return [payByYear];
			} else {
				return [payByMonth];
			}
		}
	}
}).
factory('broadCast', ['$rootScope', function($rootScope) {
	angular.broadQueue = [];
	var broadCastService = {
		bind : function(event, callback){
			angular.broadQueue[event] = callback;
		},
		send : function(event, msg){
			callback = angular.broadQueue[event];
			//delete angular.broadQueue[event];
			callback(event, msg);
		}
	};
	return broadCastService;
}]).
factory('CourseUtil', ['$rootScope', 'CourseService', 'ClassRoomService' ,function(
	$rootScope, CourseService, ClassRoomService) {
	
	return {
		getFavoriteListTypes : function() {
			return {
				'course' : {
					url : "Course/getFavoriteNormalCourse",
					data : undefined,
					start : 0,
					canLoad : true
				},
				'live' : {
					url : "Course/getFavoriteLiveCourse",
					data : undefined,
					start : 0,
					canLoad : true
				}
			}
		},

		getCourseListTypes  : function() {
			return [
		  		{
		  			name : "课程",
		  			type : "normal"
		  		},
		  		{
		  			name : "直播",
		  			type : "live"
		  		}
		  	]
		},

		getCourseListSorts : function() {
			return [
		  		{
		  			name : "最新",
		  			type : "latest"
		  		},
		  		{
		  			name : "最热",
		  			type : "popular"
		  		},
		  		{
		  			name : "推荐",
		  			type : "recommendedSeq"
		  		}
		  	]
		}
	};
}]).
factory('platformUtil', function() {
	var browser = {
	    v: (function(){
	        var u = navigator.userAgent, p = navigator.platform;
	        return {
	            trident: u.indexOf('Trident') > -1, //IE内核
	            presto: u.indexOf('Presto') > -1, //opera内核
	            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
	            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
	            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
	            ios: !!u.match(/i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
	            android: u.indexOf('Android') > -1, //android终端
	            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
	            iPad: u.indexOf('iPad') > -1, //是否iPad
	            weixin: u.indexOf('MicroMessenger') > -1, //是否微信
	            webApp: u.indexOf('Safari') == -1, //是否web应用程序，没有头部与底部
	            UCB: u.match(/UCBrowser/i) == "UCBrowser",
	            QQB: u.match(/MQQBrowser/i) == "MQQBrowser",
	            win: p.indexOf('Win') > -1,//判断是否是WIN操作系统
	            mac: p.indexOf('Mac') > -1,//判断是否是Mac操作系统
	            native: u.indexOf('kuozhi') > -1, //是否native应用程序，没有头部与底部
	        };
	    })()
	};
	
	return browser.v;
}).
factory('cordovaUtil', ['$rootScope', 'sideDelegate', 'localStore', 'platformUtil', 
	function($rootScope, sideDelegate, localStore, platformUtil){
	var cordovaUtil =  {
		learnCourseLesson : function(courseId, lessonId) {
			alert("请在客户端学习非图文课时");
		},
		share : function(url, title, about, pic) {
			alert("请在客户端分享课程");
		},
		openDrawer : function(state) {
			sideDelegate.toggleMenu();
		},
		openWebView : function(url) {
			window.location.href = url;
		},
		pay : function(title, url) {
			alert("请在客户端内支付!");
		},
		getUserToken : function($q) {
			var deferred = $q.defer();
			deferred.resolve({
				user : angular.fromJson(localStore.get("user")),
				token : localStore.get("token")
			});

			return deferred.promise;
		},
		clearUserToken : function() {
			localStore.remove("user");
			localStore.remove("token");
		},
		saveUserToken : function(user, token) {
			localStore.save("user", angular.toJson(user));
			localStore.save("token", token);
		},
		showDownLesson : function(courseId) {
			alert("请在客户端下载课时");
		}, 
		closeWebView : function() {
			window.history.back();
		},
		backWebView : function() {
			window.history.back();
		},
		openPlatformLogin : function(type) {
			alert("请在客户端内登录!");
		}
	};

	var proxy = function() {
		var self = {};

		var isNative = platformUtil.native;
		for ( var func in cordovaUtil) {
			self[func] = isNative ? esNativeCore[func] : cordovaUtil[func];
		}

		return self;
	}
	
	return proxy();
}]);;
var appService = angular.module('AppService', []);
appService.service('localStore', ['$rootScope', function($rootScope) {
	this.save = function(key, value){
		localStorage.setItem(key, value);
	}

	this.remove = function(key) {
		localStorage.removeItem(key);
	}

	this.get = function(key) {
		value = localStorage.getItem(key);
		return value ? value : null; 
	}

	this.clear = function() {
		localStorage.clear();
	}
}]).
service('CategoryService', ['httpService', function(httpService) {

	this.getCategorieTree = function(callback) {
		httpService.get({
			url : app.host + '/mapi_v2/Category/getCategorieTree',
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
			}
		});
	}
}]).
service('LessonService', ['httpService', function(httpService) {
	
	this.getLesson = function(callback) {
		httpService.simpleGet("/mapi_v2/Lesson/getLesson", arguments);
	}

	this.getCourseLessons = function(params, callback) {
		httpService.get({
			url : app.host + '/mapi_v2/Lesson/getCourseLessons',
			params : params,
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
			}
		});
	}
}]).
service('OrderService', ['httpService', function(httpService) {

	this.payCourse = function(params, callback) {
		httpService.simplePost("/mapi_v2/Order/payCourse", arguments);
	}

	this.payVip = function(params, callback) {
		httpService.simpleGet("/mapi_v2/Order/payVip", arguments);
	}

	this.getPayOrder = function() {
		httpService.simplePost('/mapi_v2/Order/getPayOrder', arguments);
	}
}]).
service('NoteService', ['httpService', function(httpService) {

	this.getNote = function(params, callback) {
		httpService.simpleGet("/mapi_v2/Course/getOneNote", arguments);
	}

	this.getNoteList = function(params, callback) {
		httpService.get({
			url : app.host + '/mapi_v2/Course/getNoteList',
			params : params,
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
			}
		});
	}
}]).
service('CouponService', ['httpService', function(httpService) {

	this.checkCoupon = function() {
		httpService.simplePost('/mapi_v2/Course/coupon', arguments);
	}
}]).
service('UserService', ['httpService', 'applicationProvider', function(httpService, applicationProvider) {

	this.follow = function(params, callback) {
		httpService.simplePost("/mapi_v2/User/follow", arguments);
	};

	this.unfollow = function(params, callback) {
		httpService.simplePost("/mapi_v2/User/unfollow", arguments);
	};

	this.searchUserIsFollowed = function(params, callback) {
		httpService.simpleGet("/mapi_v2/User/searchUserIsFollowed", arguments);
	}

	this.getUserTeachCourse = function(params,callback) {
		httpService.simpleGet("/mapi_v2/Course/getUserTeachCourse", arguments);
	}

	this.getLearningCourseWithoutToken = function(params, callback) {
		httpService.simpleGet("/mapi_v2/Course/getLearningCourseWithoutToken", arguments);
	}

	this.getUserInfo = function(params, callback) {
		httpService.simpleGet("/mapi_v2/User/getUserInfo", arguments);
	}

	this.smsSend = function(params, callback) {
		httpService.post({
			url : app.host + '/mapi_v2/User/smsSend',
			data : params,
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
			}
		});
	}

	this.getCourseTeachers = function(params, callback) {
		httpService.get({
			url : app.host + '/mapi_v2/User/getCourseTeachers',
			params : params,
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
			}
		});
	}

	this.regist = function(params, callback) {
		httpService.post({
			url : app.host + '/mapi_v2/User/regist',
			data : params,
			success : function(data, status, headers, config) {
				callback(data);
				if (data && !data.error) {
					applicationProvider.setUser(data.user, data.token);
				}
			},
			error : function(data) {
			}
		});
	}

	this.login = function(params, callback) {
		httpService.post({
			url : app.host + '/mapi_v2/User/login',
			data : params,
			success : function(data, status, headers, config) {
				callback(data);
				if (data && !data.error) {
					applicationProvider.setUser(data.user, data.token);
				}
			},
			error : function(data) {
			}
		});
	}

	this.logout = function(params, callback) {
		httpService.post({
			url : app.host + '/mapi_v2/User/logout',
			data : params,
			success : function(data, status, headers, config) {
				callback(data);
				applicationProvider.clearUser();
			},
			error : function(data) {
			}
		});
	}

}]).
service('ClassRoomService', ['httpService', function(httpService) {

	this.getClassRooms = function(params, callback) {
		httpService.get({
			url : app.host + '/mapi_v2/ClassRoom/getClassRooms',
			params : {
				limit : params.limit
			},
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
			}
		});
	}

	this.myClassRooms = function(params, callback) {
		httpService.get({
			url : app.host + '/mapi_v2/ClassRoom/myClassRooms',
			params : params,
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
			}
		});
	}

}]).
service('QuestionService', ['httpService', function(httpService) {

	this.getCourseThreads = function(params, callback) {
		httpService.get({
			url : app.host + '/mapi_v2/Course/getCourseThreads',
			params : params,
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
			}
		});
	}

	this.getThread = function(params, callback) {
		httpService.get({
			url : app.host + '/mapi_v2/Course/getThread',
			params : params,
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
			}
		});
	}

	this.getThreadTeacherPost = function(params, callback) {
		httpService.get({
			url : app.host + '/mapi_v2/Course/getThreadTeacherPost',
			params : params,
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
			}
		});
	}

	this.getThreadPost = function(params, callback) {
		httpService.get({
			url : app.host + '/mapi_v2/Course/getThreadPost',
			params : params,
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
			}
		});
	}
}]).
service('CourseService', ['httpService', function(httpService) {

	this.getCourseNotices = function(params, callback) {
		httpService.simpleGet("/mapi_v2/Course/getCourseNotices", arguments);
	}
	
	this.unLearnCourse = function(params, callback) {
		httpService.simpleGet("/mapi_v2/Course/unLearnCourse", arguments);
	}
	
	this.vipLearn = function(params, callback) {
		httpService.simpleGet("/mapi_v2/Course/vipLearn", arguments);
	}

	this.favoriteCourse = function(params, callback) {
		httpService.simplePost('/mapi_v2/Course/favoriteCourse', arguments);
	}

	this.unFavoriteCourse = function(params, callback) {
		httpService.simplePost('/mapi_v2/Course/unFavoriteCourse', arguments);
	}

	this.getCourseReviewInfo = function(params, callback) {
		httpService.simpleGet("/mapi_v2/Course/getCourseReviewInfo", arguments);
	}

	this.getReviews = function(params, callback) {
		httpService.get({
			url : app.host + '/mapi_v2/Course/getReviews',
			params : params,
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
			}
		});
	}
	this.getLiveCourses = function(params, callback) {
		httpService.get({
			url : app.host + '/mapi_v2/Course/getLiveCourses',
			params : params,
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
			}
		});
	}

	this.getLearningCourse = function(params, callback) {
		httpService.get({
			url : app.host + '/mapi_v2/Course/getLearningCourse',
			params : params,
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
			}
		});
	}

	this.getFavoriteCourse = function(url, params, callback) {
		httpService.get({
			url : app.host + '/mapi_v2/' + url,
			params : params,
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
			}
		});
	}

	this.getAllLiveCourses = function(params, callback) {
		httpService.get({
			url : app.host + '/mapi_v2/Course/getAllLiveCourses',
			params : params,
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
			}
		});
	}

	this.searchCourse = function(params, callback, error) {
		httpService.get({
			url : app.host + '/mapi_v2/Course/searchCourse',
			params : params,
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
				if (error) {
					error(data)
				}
			}
		});
	}

	this.getCourse = function(params, callback) {
		httpService.simpleGet("/mapi_v2/Course/getCourse", arguments);
	}

	this.getCourses = function(params, callback, error) {
		httpService.get({
			url : app.host + '/mapi_v2/Course/getCourses',
			params : {
				limit : params.limit,
				start: params.start,
				categoryId : params.categoryId,
				sort : params.sort
			},
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
				if (error) {
					error(data)
				}
			}
		});
	}
}]).
service('SchoolService', ['httpService', function(httpService) {

	this.getLiveLatestCourses = function(params, callback) {
		httpService.simpleGet("/mapi_v2/School/getLiveLatestCourses", arguments);
	}

	this.getLiveRecommendCourses = function(params, callback) {
		httpService.simpleGet("/mapi_v2/School/getLiveRecommendCourses", arguments);
	}

	this.getLatestCourses = function(params, callback) {
		httpService.simpleGet("/mapi_v2/School/getLatestCourses", arguments);
	}

	this.getVipPayInfo = function(params, callback) {
		httpService.simpleGet("/mapi_v2/School/getVipPayInfo", arguments);
	}

	this.getSchoolVipList = function(params, callback) {
		httpService.simpleGet('/mapi_v2/School/getSchoolVipList', arguments);
	}

	this.getSchoolPlugins = function(params, callback) {
		httpService.simpleGet('/mapi_v2/School/getSchoolPlugins', arguments);
	}

	this.getSchoolBanner = function(callback) {
		httpService.get({
			url : app.host + '/mapi_v2/School/getSchoolBanner',
			success : function(data, status, headers, config) {
				callback(data);
			}
		});
	}

	this.getRecommendCourses = function(params, callback) {

		httpService.get({
			url : app.host + '/mapi_v2/School/getRecommendCourses',
			params : params,
			success : function(data, status, headers, config) {
				callback(data);
			}
		});
	}
}]).
service('httpService', ['$http', '$rootScope', 'platformUtil', '$q', function($http, $rootScope, platformUtil, $q) {
	
	var self = this;
	this.getOptions = function(method, url, params, callback, errorCallback) {
		var options = {
			method : method,
			url : app.host + url,
			headers : { "token" : $rootScope.token },
			success : function(data, status, headers, config) {
				callback(data);
			},
			error : function(data) {
				if (errorCallback) {
					errorCallback(data);
				} 
			}
		}

		if (method == "get") {
			options["params"] = params;
		} else if (method == "post") {
			options["data"] = params;
		}

		return options;
	};

	this.simpleRequest = function(method, url, params, callback, errorCallback) {
		var options = self.getOptions(method, url, params, callback, errorCallback);
		var http = $http(options).success(options.success);

		if (options.error) {
			http.error(options.error);
		} else {
			http.error(function(data) {
				console.log(data);
			});
		}
	}

	this.nativePost = function(options) {
		esNativeCore.post($q, options.url,  options.headers , options.data )
		.then(function(data) {
			options.success(angular.fromJson(data));
		}, function(error) {
			options.error(angular.fromJson(error));
		});
	};

	this.simplePost = function(url) {
		params  = arguments[1][0];
		callback = arguments[1][1];
		errorCallback = arguments[1][2];

		if (platformUtil.native) {
			var options = {
				url : app.host + url,
				headers : { "token" : $rootScope.token },
				data : params,
				success : callback,
				error : errorCallback
			}
			self.nativePost(options);
		} else {
			self.simpleRequest("post", url, params, callback, errorCallback);
		}
	};

	this.simpleGet = function(url) {
		params  = arguments[1][0];
		callback = arguments[1][1];
		errorCallback = arguments[1][2];

		self.simpleRequest("get", url, params, callback, errorCallback);
	};

	this.get = function(options) {
		options.method  = "get";
		options.headers = { "token" : $rootScope.token };

		var http = $http(options).success(options.success);

		if (options.error) {
			http.error(options.error);
		} else {
			http.error(function(data) {
				console.log(data);
			});
		}
	}

	this.post = function(options) {

		options.method  = "post";
		options.headers = { "token" : $rootScope.token };

		var angularPost = function(options) {
			var http = $http(options).success(options.success);
			if (options.error) {
				http.error(options.error);
			} else {
				http.error(function(data) {
					console.log(data);
				});
			}
		};

		if (platformUtil.native) {
			self.nativePost(options);
		} else {
			angularPost(options);
		}
	}
}]);;
Date.prototype.Format = function(fmt) 
{ //author: meizz 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
}

app.filter('blockStr', ['$rootScope', function($rootScope) {
	return function(content, limitTo){
		if (!content) {
			return "";
		}
		content = content.replace(/<[^>]+>/g, "");
		if (limitTo) {
			content = content.substring(0, limitTo);
		}
		return content;
	};
}]).filter('array', ['AppUtil', function(AppUtil) {
	return function(num){
		return AppUtil.createArray(num);
	};
}]).
filter('lessonType', function() {
	var lessonType = {
		text  : "图文",
		video  : "视频",
		audio  : "音频",
		testpaper  : "考试",
		document  : "文档",
		ppt  : "PPT"
	};
	return function(lesson) {
		if (lesson.type == "live") {
			var returnStr = "";
			var startTime = new Date(lesson.startTime).getTime();
			var endTime = new Date(lesson.endTime).getTime();
			var currentTime = new Date().getTime();

			if (startTime > currentTime) {
				returnStr = new Date(startTime).Format("MM月dd号 hh:mm");;
			} else if (startTime <= currentTime && endTime >= currentTime) {
				returnStr = "<div class='ui-label' >直播中</div>";
			}else if (endTime < currentTime) {
				if (lesson.replayStatus == 'generated' ) {
					returnStr = "<div class='ui-label gray' >回放</div>";
				} else {
					returnStr = "<div class='ui-label gray' >结束</div>";
				}
			}
			return returnStr;
		}
		return "<div class='ui-label' >" + lessonType[lesson.type] + "</div>";
	}
}).
filter('coverIncludePath', function() {
	return function(path) {
		return app.viewFloder + path;
	}
}).
filter('formatPrice', ['$rootScope', function($rootScope){

	return function(price) {
		if (price) {
			price = parseFloat(price);
			return parseFloat(price) <= 0 ? "免费" : "¥" + price.toFixed(2);
		}
		return "";
	}
}]).
filter('coverLearnProsser', ['$rootScope', function($rootScope){

	return function(course) {
		var lessonNum = course.lessonNum;
		var memberLearnedNum = course.memberLearnedNum;
		
		return {
			width : (memberLearnedNum / lessonNum) * 100 + "%"
		}
	}
}]).
filter('reviewProgress', function(){

	return function(progress, total) {
		if (total == 0) {
			return "0%";
		}
		return ( (progress / total) * 100 ).toFixed(0) + "%";
	}
}).
filter('formatChapterNumber', ['$rootScope', function($rootScope){

	return function(chapter) {
		if (chapter.type != "chapter" && chapter.type != "unit") {
			return "";
		}
		var number = chapter.number;
		return "第" + number + (chapter.type == "chapter" ?  "章" : "节");
	}
}]).
filter('coverLearnTime', ['$rootScope', function($rootScope){
	return function(date) {
		if (! date) {
			return "还没开始学习";
		}

	  var currentDates = new Date().getTime() - new Date(date).getTime(),
	        currentDay = parseInt(currentDates / (60000*60) -1) //减去1小时
	        if(currentDay >= 24*3){
	            currentDay = new Date(date).Format("yyyy-MM-dd");
	        }else if(currentDay >= 24){
	            currentDay = parseInt(currentDay / 24) + "天前";
	        }else if(currentDay == 0 ){
	            var currentD = parseInt(currentDates / 60000);
	            if(currentD >= 60){
	                currentDay = "1小时前";
	            }else{
	                currentDay = currentD + "分钟前";
	            }
	        }else{
	            currentDay = currentDay + "小时前";
	        }

	  return currentDay;
	}
}]).
filter('coverDiscountTime', ['$rootScope', function($rootScope){
	return function(endTime) {
		return new Date(new Date(endTime) - new Date()).Format("d天h小时m分钟");
	}
}]).
filter('coverViewPath', ['$rootScope', function($rootScope){
	return function(path) {
		return app.viewFloder + path;
	}
}]).
filter('coverNoticeIcon', ['$rootScope', function($rootScope){
	return function(type) {
		return app.viewFloder + "img/course_notice.png";
	}
}]).
filter('coverGender', ['$rootScope', function($rootScope){

	return function(gender) {
		switch (gender) {
			case "male":
				return "男士";
			case "female":
				return "女士";
			default:
				return "保密";

		}
	}
}]).
filter('coverPic', ['$rootScope', function($rootScope){

	return function(src) {
		if (src) {
			return src;
		}
		return app.viewFloder  + "img/course_default.jpg";
	}
}]).
filter('coverDiscount', ['$rootScope', function($rootScope){

	return function(type, discount) {
		if (type == "free") {
			return "限免";
		}
		var discountNum = parseFloat(discount);
		return discountNum + "折";
	}
}]).
filter('coverAvatar', ['$rootScope', function($rootScope){

	return function(src) {
		if (src) {
			return src;
		}
		return app.viewFloder  + "img/avatar.png";
	}
}]);;
app.directive('onElementReadey', function ($parse, $timeout) {
    return {
        restrict: 'A',
        link : function(scope, element, attrs) {
          $timeout(function() {
            $parse(attrs.onElementReadey)(scope);
           }, 100);
        }
    };
}).
directive('uiTab', function() {
  return {
    restrict: 'A',
    link : function(scope, element, attrs) {

          var self = this;
          var scroller = element[0].querySelector('.ui-tab-content');
          var nav = element[0].querySelector('.ui-tab-nav');

          if ("empty"  != attrs.select) {
            angular.element(scroller.children[0]).addClass('current');
            angular.element(nav.children[0]).addClass('current');
          }

          this.currentPage = 0;
          scroller.style.width = "100%";

          this.itemWidth = scroller.children[0].clientWidth;
          this.scrollWidth = this.itemWidth * this.count;

          function changeTabContentHeight(height) {
              var tabContent = element[0].querySelector('.ui-tab-content');
              $(tabContent).height(height);
          }

          angular.forEach(nav.children, function(item) {
            angular.element(item).on("touchstart", function(e) {

                var tagetHasCurrent = $(item).hasClass('current');
                var tempCurrentPage = self.currentPage;
                self.currentPage = $(item).index();

                $(nav).children().removeClass('current');
                $(scroller).children().removeClass('current');

                if (tempCurrentPage == self.currentPage && "empty"  == attrs.select && tagetHasCurrent) {
                  changeTabContentHeight(0);
                  return;
                }

                var currentScrooler = angular.element(scroller.children[self.currentPage]);
                $(item).addClass('current');
                currentScrooler.addClass("current");
                changeTabContentHeight("100%");
            });
          });

          if ("empty"  == attrs.select) {
              scope.$on("closeTab", function(event, data) {
                angular.element(scroller.children[self.currentPage]).removeClass('current');
                angular.element(nav.children[self.currentPage]).removeClass('current');
                changeTabContentHeight(0);
              });
          }
    }
  }
}).
directive('imgError', function() {
  return {
    restrict: 'A',
    compile: function(tElem, tAttrs) {
            return { 
                post: function postLink(scope, element, attributes) {
                  var errorSrc = "";
                  switch (attributes.imgError) {
                    case "avatar":
                      errorSrc = app.viewFloder  + "img/avatar.png";
                      break;
                    case "course":
                      errorSrc = app.viewFloder  + "img/course_default.jpg";
                      break;
                    case "vip":
                      errorSrc = app.viewFloder  + "img/vip_default.jpg";
                      break;
                  }

                  element.on("error", function(e) {
                    element.attr("src", errorSrc);
                  });
                }
            };
    }
  }
}).
directive('ngImgShow', function() {
  return {
    restrict: 'A',
    link : function(scope, element, attrs) {
      setTimeout(function() {
        var imageArray = [];
        angular.forEach(element[0].getElementsByTagName("img"), function(item, i) {
          imageArray.push(item.src);
          item.alt = i;
          item.addEventListener("click", function() {
            esNativeCore.showImages(this.alt, imageArray);
          });
        });
      }, 100);   
    }
  }
}).
directive('back', function(cordovaUtil, $state) {
  return {
    restrict: 'A',
    compile: function(tElem, tAttrs) {
            return { 
                post: function postLink(scope, element, attributes) {

                  element.on("click", function(){
                    if (attributes["back"] == "go") {
                      cordovaUtil.backWebView();
                      return;
                    }
                    if (attributes["back"] == "close" && scope.close) {
                      scope.close();
                      return;
                    }
                    $state.go("slideView.mainTab");
                  });
                }
            };
    }
  }
}).
directive('ngHtml', function($window, $state) {
  return {
    restrict: 'A',
    compile: function(tElem, tAttrs) {
            return { 
                post: function postLink(scope, element, attributes) {
                  scope.$watch(attributes.ngHtml, function(newValue) {
                    element.html(newValue);
                  });
                }
           };
    }
  }
}).
directive('uiPop', function($window) {
  return {
    restrict: 'A',
    compile: function(tElem, tAttrs) {
            return { 
                post: function postLink(scope, element, attributes) {

                    function changePopStatus() {
                      scope.$apply(function() {
                        scope.isShowMenuPop = ! scope.isShowMenuPop;
                      });
                    }

                    var popBtn = element[0].querySelector(".ui-pop-btn");
                    var popBg = element[0].querySelector(".ui-pop-bg");

                    popBg.style.width = $window.innerWidth + "px";
                    popBg.style.height = $window.innerHeight + "px";
                    angular.element(popBg).on("click", function(e) {
                      changePopStatus();
                    });

                    angular.element(popBtn).on("click", function(e) {
                      changePopStatus();
                    });
                }
           };
    }
  }
}).
directive('uiBar', function() {
  return {
    restrict: 'A',
    link : function(scope, element, attrs) {
        var toolEL = element[0].querySelector(".bar-tool");
        var titleEL = element[0].querySelector(".title");
        
        var toolELWidth = toolEL ? toolEL.offsetWidth : 44;
        toolELWidth = toolELWidth < 44 ? 44 : toolELWidth;
        titleEL.style.paddingRight = toolELWidth + "px";
        titleEL.style.paddingLeft = toolELWidth + "px";
    }
  }
}).
directive('ngHref', function($window) {
  return {
    restrict: 'A',
    compile: function(tElem, tAttrs) {
            return function ngEventHandler(scope, element, attr) {
              element.on("click", function(e) {
                var url = [$window.location.origin, $window.location.pathname, attr.ngHref].join("");
                if (scope.platform.native) {
                  esNativeCore.openWebView(url);
                  return;
                }
                $window.location.href = url;
              });
            };
    }
  }
}).
directive('uiScroll', function($parse) {
  return {
    restrict: 'A',
    link : function(scope, element, attrs) {
      scope.$watch(attrs.data, function(newValue) {

          if (newValue) {
                if (angular.isArray(newValue) && newValue.length == 0) {
                  return;
                }
                var uiHead = element[0].querySelector(".ui-details-head");
                element.on("scroll", function() {
                  var scrollHeight = element[0].scrollHeight;
                  var scrollTop = element[0].scrollTop;
                  var clientHeight = element[0].clientHeight;

                  if (attrs.onScroll) {
                    scope.headTop = uiHead.offsetHeight;
                    scope.scrollTop = scrollTop;
                    $parse(attrs.onScroll)(scope);
                  }
                  if ( !scope.isLoading && ( (scrollTop + clientHeight) >= scrollHeight ) ) {
                    scope.isLoading = true;
                    $parse(attrs.onInfinite)(scope);
                  }
                });
          }
      });
      
    }
  }
}).
directive('uiSliderBox', function() {
  return {
    restrict: 'A',
    link : function(scope, element, attrs) {
          scope.$watch(attrs.uiSliderBox, function(newValue) {
            if (newValue && newValue.length > 0) {
                initSlider();
            }
          });

          function initSlider () {
              var slider = new fz.Scroll('.' + attrs.slider, {
                  role: 'slider',
                  indicator: true,
                  autoplay: false,
                  interval: 3000
              });

              slider.on('beforeScrollStart', function(fromIndex, toIndex) {

              });

              slider.on('scrollEnd', function() {

              });
          }
          
    }
  }
}).
directive('slideIndex', function() {
  return {
    restrict: 'A',
    link : function(scope, element, attrs) {
          var total = 0;
          var $currentIndex = 0;
          scope.slideHasChanged = function($index) {
            $currentIndex = $index;
            changeSlidePointStatus();
          }

          scope.$watch("banners", function(newValue) {
            if (newValue && newValue.length > 0) {
                total = newValue.length;
                initSlideIndex();
            }
          });
          
          function changeSlidePointStatus()
          {
            angular.forEach(element[0].querySelectorAll('.point'), function(item, index){

              if (index == $currentIndex) {
                item.classList.add("active");
              } else {
                item.classList.remove("active");
              }
            });
          }

          function initSlideIndex() {
                var points = "";
            
                for (var i = 0 ; i < total; i++) {
                  if (i == $currentIndex) {
                    points += "<span class='point active'></span>";
                  } else {
                    points += "<span class='point'></span>";
                  }
                  
                };

                element.append("<p class='slide-index'>" + points + "</p>");
          }
    }
  }
}).
directive('lazyLoad', function () {
  return function(scope, elm, attr) {
            echo.init({
            root:elm[0],
            offset: 100,
            throttle: 250,
            unload: false,
            callback: function (element, op) {

            }
        });
    }
}).
directive('modal', function () {
  return {
    restrict: 'EA',
    priority : 10000,
    controller : function($scope, $element) {
    },
    link : function(scope, element, attrs) {
      element.addClass("ui-modal");
      element.on('click', function(event) {
        scope.$emit("closeTab", {});
      });

    }
  }
}).
directive('listEmptyView', function () {
  return {
    restrict: 'EA',
    link : function(scope, element, attrs) {
      var html = '<div class="list-empty">' + 
      '<a> <i class="icon iconfont icon-ebook"></i> <span>' + attrs.title + '</span> </a>' +
      '</div>';
      scope.$watch(attrs.data, function(newValue) {
        if (newValue && newValue.length == 0) {
          element.html(html);
        } else {
          element.html("");
        }
      });
    }
  }
}).
directive('categoryTree', function () {
    return {
        restrict: 'E',
        scope: {  
            data: '=data',
            listener : '=listener'
        }, 
        templateUrl: app.viewFloder + 'view/category_tree.html', 

        link : function(scope, element, attrs) {

          function initCategory($scope) {
            var realityDepth = $scope.data.realityDepth > 3 ? 3 : $scope.data.realityDepth - 1;
            var categoryCols = [];
            var categoryTree = $scope.data.data[0];
            for (var i = realityDepth- 1; i >= 0; i--) {
                categoryCols[i] = [];
            };

            var getRootCategory = function(categoryId) {
              return {
                name : "全部",
                id : categoryId ? categoryId : 0
              }
            };

            categoryCols[0] = [getRootCategory()].concat(categoryTree.childs);
            $scope.categoryCols = categoryCols;

            $scope.selectCategory = function($event, category) {
                    if (category.childs) {
                      for (var i = $scope.categoryCols.length- 1; i >= category.depth; i--) {
                          $scope.categoryCols[i] = [];
                      };
                      var categoryColIndex = category.depth;
                      if (category.depth > 2) {
                        categoryColIndex = 2;
                      }
                      $scope.categoryCols[categoryColIndex] = [getRootCategory(category.id)].concat(category.childs);
                      $event.stopPropagation();
                    } else {
                      $scope.listener(category);
                    }
            };
          }

          scope.$watch("data", function(newValue) {
            if (newValue) {
                initCategory(scope);
            }
          });
        }
    };
});;
var appProvider = angular.module('AppProvider', []);
appProvider.provider('applicationProvider', function() {

	var self = this;
	this.$get = function(localStore, $rootScope, $q, cordovaUtil) {
		var application = {
			host : null,
			user : null,
			token : null
		};

		application.setHost = function(host){
			this.host = host;
		}

		application.init = function(host) {
			application.setHost(host);
			cordovaUtil.getUserToken($q).then(function(data) {
				application.user = data.user;
				application.token = data.token;
      				application.updateScope($rootScope);
			});
		}

		application.clearUser = function() {
			this.user = null;
			this.token = null;
			$rootScope.user = null;
			$rootScope.token = null;
			cordovaUtil.clearUserToken();
		}

		application.setUser = function(user, token) {
			this.user = user;
			this.token = token;
			this.updateScope($rootScope);
			cordovaUtil.saveUserToken(user, token);
		}

		application.updateScope = function($scope) {
			$scope.user = application.user;
			$scope.token = application.token;
		}
	    	return application;
	  }
});

appProvider.provider('appRouter', function($stateProvider) {

	this.init = function() {
		$stateProvider.state("slideView",{
	                abstract: true,
	                views : {
	                    "rootView" : {
	                        templateUrl : app.viewFloder  + 'view/main.html',
	                        controller : AppInitController
	                    }
	                }
	            }).state("slideView.mainTab",{
	            	url : "/index",
	            	views : {
	              		"menuContent" : {
	                		templateUrl : app.viewFloder  + 'view/main_content.html',
	                		controller : FoundTabController
	              	}
	           }
	           });

	            $stateProvider.state('courseList', {
	              url: "/courselist/:categoryId",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/course_list.html",
	                  controller: CourseListController
	                }
	              }
	            }).state('courseList.type', {
	              url: "/type",
	              views: {
	                'courselist-content': {
	                  templateUrl: app.viewFloder  + "view/courselist_type.html"
	                }
	              }
	            }).state('courseList.sort', {
	              url: "/sort",
	              views: {
	                'courselist-content': {
	                  templateUrl: app.viewFloder  + "view/courselist_sort.html"
	                }
	              }
	            });

	            $stateProvider.state('login', {
	              url: "/login/:goto",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/login.html",
	                  controller: LoginController
	                }
	              }
	            }).state('regist', {
	              url: "/regist",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/regist.html",
	                  controller: RegistController
	                }
	              }
	            });

	            $stateProvider.state('myinfo', {
	              url: "/myinfo/:userId",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/myinfo.html",
	                  controller: MyInfoController
	                }
	              }
	            });

	            $stateProvider.state('mylearn', {
	              url: "/mylearn",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/mylearn.html",
	                  controller : MyLearnController
	                }
	              }
	            });

	            $stateProvider.state('myfavorite', {
	              url: "/myfavorite",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/myfavorite.html"
	                }
	              }
	            })

	            $stateProvider.state('setting', {
	              url: "/setting",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/setting.html",
	                  controller : SettingController
	                }
	              }
	            });
	            $stateProvider.state('question', {
	              url: "/question/:courseId/:threadId",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/question.html",
	                  controller : QuestionController
	                }
	              }
	            });

	            $stateProvider.state('note', {
	              url: "/note/:noteId/",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/note.html",
	                  controller : NoteController
	                }
	              }
	            });

	            $stateProvider.state('course', {
	              url: "/course/:courseId",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/course.html",
	                  controller : CourseController
	                }
	              }
	            });

	            $stateProvider.state('courseDetail', {
	              url: "/coursedetail/:courseId",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/course_detail.html",
	                  controller : CourseDetailController
	                }
	              }
	            });

	            $stateProvider.state('teacherlist', {
	              url: "/teacherlist/:courseId",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/teacher_list.html",
	                  controller : TeacherListController
	                }
	              }
	            });

	            $stateProvider.state('coursePay', {
	              url: "/coursepay/:courseId",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/course_pay.html",
	                  controller : CoursePayController
	                }
	              }
	            });

	            $stateProvider.state('courseCoupon', {
	              url: "/coursecoupon/:courseId",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/coupon.html",
	                  controller : CourseCouponController
	                }
	              }
	            });

	            $stateProvider.state('viplist', {
	              url: "/viplist",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/vip_list.html",
	                  controller : VipListController
	                }
	              }
	            });

	            $stateProvider.state('courseSetting', {
	              url: "/coursesetting/:courseId/:isLearn",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/course_setting.html",
	                  controller : CourseSettingController
	                }
	              }
	            });

	            $stateProvider.state('vipPay', {
	              url: "/vippay/:levelId",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/vip_pay.html",
	                  controller : VipPayController
	                }
	              }
	            });

	            $stateProvider.state('courseNotice', {
	              url: "/coursenotice/:courseId",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/course_notice.html",
	                  controller : CourseNoticeController
	                }
	              }
	            });

	            $stateProvider.state('courseReview', {
	              url: "/coursereview/:courseId",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/course_review.html",
	                  controller : CourseReviewController
	                }
	              }
	            });

	            $stateProvider.state('userInfo', {
	              url: "/userinfo/:userId",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/user_info.html",
	                  controller : UserInfoController
	                }
	              }
	            });

	            $stateProvider.state('lesson', {
	              url: "/lesson/:courseId/:lessonId",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/lesson.html",
	                  controller : LessonController
	                }
	              }
	            });
	            $stateProvider.state('search', {
	              url: "/search",
	              views: {
	                'rootView': {
	                  templateUrl: app.viewFloder  + "view/search.html",
	                  controller : SearchController
	                }
	              }
	            });
	}
	this.$get = function() {
		return {};
	}
});;
app.controller('AppInitController', ['$scope', '$state', 'sideDelegate', 'SchoolService', AppInitController]);

function baseController($scope)
{
	this.getService = function(name) {
		return angular.injector(["AppService", "ng"]).get(name);
	}
}

function AppInitController($scope, $state, sideDelegate, SchoolService)
{	
	console.log("AppInitController");
	$scope.toggle = function() {
	    	sideDelegate.toggleMenu();
	};

	$scope.showMyView = function(state) {
		if ($scope.user) {
			$state.go(state);
		} else {
			$state.go("login");
		}
	}

	SchoolService.getSchoolPlugins(null, function(data) {
		$scope.plugins = data;
	});
};
app.controller('CourseController', ['$scope', '$stateParams', 'CourseService', 'AppUtil', '$state', 'cordovaUtil', CourseController]);
app.controller('CourseDetailController', ['$scope', '$stateParams', 'CourseService', CourseDetailController]);
app.controller('CourseSettingController', ['$scope', '$stateParams', 'CourseService', '$window', CourseSettingController]);

function CourseReviewController($scope, $stateParams, CourseService, $window)
{

  var self = this;
  $scope.canLoad = true;
  $scope.start = $scope.start || 0;

  $scope.loadMore = function(){
        if (! $scope.canLoad) {
          return;
        }
       setTimeout(function() {
          self.loadReviews();
       }, 200);
  };

  this.loadReviews = function() {
    CourseService.getReviews({
      start : $scope.start,
      limit : 10,
      courseId : $stateParams.courseId
    }, function(data) {

      var length  = data ? data.data.length : 0;
      if (!data || length == 0 || length < 10) {
          $scope.canLoad = false;
      }

      $scope.reviews = $scope.reviews || [];
      for (var i = 0; i < length; i++) {
        $scope.reviews.push(data.data[i]);
      };

      $scope.start += data.limit;

    });
  }

  this.loadReviewInfo = function() {
    CourseService.getCourseReviewInfo({
      courseId : $stateParams.courseId
    }, function(data) {
      $scope.reviewData = data;
    });
  }
  
  this.loadReviewInfo();
  this.loadReviews();
}

function CourseSettingController($scope, $stateParams, CourseService, $window)
{
  $scope.isLearn = $stateParams.isLearn;
  $scope.exitLearnCourse = function() {
    $scope.showLoad();
    CourseService.unLearnCourse({
      courseId : $stateParams.courseId
    }, function(data) {
      $scope.hideLoad();
      if (! data.error) {
        $window.history.back();
        setTimeout(function() {
          $scope.$emit("refresh", {});
        }, 10);
        
      } else {
        $scope.toast(data.error.message);
      }
    });
  }
}

function CourseDetailController($scope, $stateParams, CourseService)
{
  CourseService.getCourse({
      courseId : $stateParams.courseId
    }, function(data) {
      $scope.course = data.course;
    });
}

app.controller('CourseToolController', ['$scope', '$stateParams', 'OrderService', 'CourseService', 'cordovaUtil', '$state', CourseToolController]);
function CourseToolController($scope, $stateParams, OrderService, CourseService, cordovaUtil, $state)
{
    var self = this;
    this.payCourse = function() {
      OrderService.payCourse({
        courseId : $stateParams.courseId
      }, function(data) {
        if (data.paid == true) {
          console.log("reload");
          window.location.reload();
        } else {
          var error = "加入学习失败";
          if (data.error) {
            error = data.error.message;
          } 
          $scope.toast(error);
        }
      }, function(error) {
        console.log(error);
      });
    }

    $scope.vipLeand = function() {
      if ($scope.user == null) {
        cordovaUtil.openWebView(app.rootPath + "#/login/course");
        return;
      }
      CourseService.vipLearn({
        courseId : $stateParams.courseId
      }, function(data){
        if (! data.error) {
          window.location.reload();
        } else {
          $scope.toast(data.error.message);
        }
      }, function(error) {
        console.log(error);
      });
    }

    $scope.joinCourse = function() {
      if ($scope.user == null) {
        cordovaUtil.openWebView(app.rootPath + "#/login/course");
        return;
      }
      if ($scope.course.price <= 0) {
        self.payCourse();
      } else {
        $state.go("coursePay", { courseId : $scope.course.id });
      }
      
    }

    $scope.favoriteCourse = function() {
      if ($scope.user == null) {
        cordovaUtil.openWebView(app.rootPath + "#/login/course");
        return;
      }
      var params = {
          courseId : $stateParams.courseId
      };

      if ($scope.isFavorited) {
        CourseService.unFavoriteCourse(params, function(data) {
          if (data == true) {
            $scope.isFavorited = false;
          }
        });
      } else {
        CourseService.favoriteCourse(params, function(data) {
          if (data == true) {
            $scope.isFavorited = true;
          }
        });
      }
    }

    $scope.shardCourse = function() {
      var about = $scope.course.about;
      if (about.length > 20) {
        about = about.substring(0, 20);
      }
      cordovaUtil.share(app.host + "/course/" + $scope.course.id, $scope.course.title, about, $scope.course.largePicture);
    }
}

function CourseController($scope, $stateParams, CourseService, AppUtil, $state, cordovaUtil)
{
    $scope.showLoad();

    CourseService.getCourse({
      courseId : $stateParams.courseId
    }, function(data) {
      $scope.ratingArray = AppUtil.createArray(5);
      $scope.vipLevels = data.vipLevels;
      $scope.course = data.course;
      $scope.member = data.member;
      $scope.isFavorited = data.userFavorited;
      $scope.discount = data.discount;

      if (data.member) {
        var progress = data.course.lessonNum == 0 ? 0 : data.member.learnedNum / data.course.lessonNum;
        $scope.learnProgress = (progress * 100) + "%" ;
      }

      $scope.courseView = app.viewFloder + (data.member ? "view/course_learn.html" : "view/course_no_learn.html");
      $scope.hideLoad();
    });

    $scope.loadReviews = function(){
      CourseService.getReviews({
        courseId : $stateParams.courseId,
        limit : 1
      }, function(data) {
        $scope.reviews = data.data;
      });
    }

    $scope.exitLearnCourse = function() {
      $scope.showLoad();
      CourseService.unLearnCourse({
        courseId : $stateParams.courseId,
        token : $scope.token
      }, function(data) {
        $scope.hideLoad();
        if (! data.error) {
          window.location.reload();
        } else {
          $scope.toast(data.error.message);
        }
      });
    }

    $scope.showDownLesson = function() {
      cordovaUtil.showDownLesson($scope.course.id);
    }

    $scope.$parent.$on("refresh", function(event, data) {
      window.location.reload();
    });
};
app.controller('CourseListController', ['$scope', '$stateParams', '$state', 'CourseUtil', 'CourseService', 'CategoryService', CourseListController]);
function CourseListController($scope, $stateParams, $state, CourseUtil, CourseService, CategoryService)
{
    $scope.categoryTab = {
      category : "分类",
      type : "全部分类",
      sort : "综合排序",
    };

    $scope.canLoad = true;
    $scope.start = $scope.start || 0;

    console.log("CourseListController");
      $scope.loadMore = function(){
            if (! $scope.canLoad) {
              return;
            }
           setTimeout(function() {
              $scope.loadCourseList($stateParams.sort);
           }, 200);
         
      };

      $scope.loadCourseList = function(sort) {
             $scope.showLoad();
              CourseService.searchCourse({
                limit : 10,
                start: $scope.start,
                categoryId : $stateParams.categoryId,
                sort : sort,
                type : $stateParams.type
              }, function(data) {
                        $scope.hideLoad();
                        var length  = data ? data.data.length : 0;
                        if (!data || length == 0 || length < 10) {
                            $scope.canLoad = false;
                        }

                        $scope.courses = $scope.courses || [];
                        for (var i = 0; i < length; i++) {
                          $scope.courses.push(data.data[i]);
                        };

                        $scope.start += data.limit;
              });
      }

      $scope.courseListSorts = CourseUtil.getCourseListSorts();
      $scope.courseListTypes = CourseUtil.getCourseListTypes();

      CategoryService.getCategorieTree(function(data) {
        $scope.categoryTree = data;
      });

      $scope.selectType = function(item) {
             $scope.$emit("closeTab", {});
             $scope.categoryTab.type = item.name;
             clearData();
             $stateParams.type  = item.type;
             setTimeout(function(){
                $scope.loadCourseList($scope.sort);
             }, 100);
      }

      function clearData() {
                $scope.canLoad = true;
                $scope.start = 0;
                $scope.courses = null;
      }

      $scope.selectSort = function(item) {
        $scope.$emit("closeTab", {});
        $scope.categoryTab.sort = item.name;
        $scope.sort = item.type;
        clearData();
        setTimeout(function(){
            $scope.loadCourseList(item.type);
         }, 100);
      }

      $scope.onRefresh = function() {
        clearData();
        $scope.loadCourseList($scope.sort);
      }

      $scope.categorySelectedListener = function(category) {
             $scope.$emit("closeTab", {});
             $scope.categoryTab.category = category.name;
             clearData();
             $stateParams.type = null;
             $stateParams.categoryId  =category.id;
             $scope.loadCourseList($scope.sort);
      }

      $scope.loadCourseList();
};
app.controller('CourseNoticeController', ['$scope', 'CourseService', '$stateParams', CourseNoticeController]);

function CourseNoticeController($scope, CourseService, $stateParams)
{
	var limit = 10;
	$scope.start = 0;
	$scope.showLoadMore = true;
	
	function loadNotices(start, limit) {
		CourseService.getCourseNotices({
			start : $scope.start,
			limit : limit,
			courseId : $stateParams.courseId
		}, function(data) {
			$scope.notices = $scope.notices || [];
			
			if (! data || data.length == 0) {
				$scope.showLoadMore = false;
				$scope.toast("没有更多消息");
				return;
			}
			
			for (var i = 0; i < data.length; i++) {
		                  $scope.notices.push(data[i]);
		           };
			$scope.start += limit;
		});
	}

	$scope.loadMore = function() {
		loadNotices($scope.start, limit);
	}

	loadNotices($scope.start, limit);
};
app.controller('FoundCourseController', ['$scope', 'SchoolService', '$state', FoundCourseController]);

function FoundCourseController($scope, SchoolService, $state)
{
	console.log("FoundCourseController");
	SchoolService.getSchoolBanner(function(data) {
		$scope.banners = data;
	});
	SchoolService.getSchoolBanner(function(data) {
		$scope.banners = data;
	});

	SchoolService.getRecommendCourses({ limit : 3 }, function(data) {
		$scope.recommedCourses = data.data;
	});

	SchoolService.getLatestCourses({ limit : 3 }, function(data) {
		$scope.latestCourses = data.data;
	});
}

app.controller('FoundLiveController', ['$scope', 'SchoolService', FoundLiveController]);

function FoundLiveController($scope, SchoolService)
{
	console.log("FoundLiveController");

	SchoolService.getLiveRecommendCourses({ limit : 3 } , function(data) {
		$scope.liveRecommedCourses = data.data;
	});

	SchoolService.getLiveLatestCourses( {  limit : 3,  },  function(data) {
		$scope.liveLatestCourses = data.data;
	});
}


app.controller('FoundClassRoomController', ['$scope', '$http', FoundClassRoomController]);

function FoundClassRoomController($scope, ClassRoomService, SchoolService)
{
	console.log("FoundClassRoomController");

	SchoolService.getSchoolBanner(function(data) {
		$scope.banners = data;
	});

  	ClassRoomService.getClassRooms({ limit : 3 }, function(data) {
  		$scope.classRooms = data.data;
  	});
};
app.controller('LessonController', ['$scope', '$stateParams', 'LessonService', 'cordovaUtil', LessonController]);

function LessonController($scope, $stateParams, LessonService, cordovaUtil)
{	
	var self = this;

	self.loadLesson = function() {
		LessonService.getLesson({
			courseId : $stateParams.courseId,
			lessonId : $stateParams.lessonId
		},function(data) {
			if (data.error) {
				$scope.toast(data.error.message);
				return;
			}
			$scope.lesson = data;
			if (data.type != "text") {
				cordovaUtil.learnCourseLesson(data.courseId, data.id); 
				window.history.back();
				return;
			}
			$scope.lessonView = "view/lesson_" + data.type + ".html";
		});
	}

	this.loadLesson();
}

app.controller('CourseLessonController', ['$scope', '$stateParams', 'LessonService', '$state', 'cordovaUtil', CourseLessonController]);
function CourseLessonController($scope, $stateParams, LessonService, $state, cordovaUtil)
{

  $scope.loading = true;
  this.loadLessons = function() {
      LessonService.getCourseLessons({
        courseId : $stateParams.courseId,
        token : $scope.token
      }, function(data) {
        $scope.loading = false;
        $scope.lessons = data.lessons;
        $scope.learnStatuses = data.learnStatuses;

        for( index in data.learnStatuses ) {
            $scope.lastLearnStatusIndex = index;
        }
      });
    }

    $scope.learnLesson = function(lesson) {
      if (! $scope.member && 1 != lesson.free) {
        alert("请先加入学习");
        return;
      }

      if ("text" == lesson.type) {
        $state.go("lesson",  { courseId : lesson.courseId, lessonId : lesson.id } );
        return;
      }

      cordovaUtil.learnCourseLesson(lesson.courseId, lesson.id);     
    }

    this.loadLessons();
};
app.controller('LoginController', ['$scope', 'UserService', '$stateParams', 'platformUtil', 'cordovaUtil', '$state', LoginController]);

function LoginController($scope, UserService, $stateParams, platformUtil, cordovaUtil, $state)
{	
	console.log("LoginController");

	$scope.user = {
		username : null,
		password : null
	};

	$scope.jumpToMain = function() {
		$state.go("slideView.mainTab");
	}

    	$scope.login = function(user) {
    		$scope.showLoad();
    		UserService.login({
    			"_username": user.username,
			"_password" : user.password
    		}, function(data) {
    			
			$scope.hideLoad();
    			if (data.error) {
				$scope.toast(data.error.message);
				return;
			}

			if (platformUtil.native) {
				esNativeCore.closeWebView();
				return;
			}

			if ($stateParams.goto) {
				window.history.back();
			} else {
				$scope.jumpToMain();
			}
			
    		});
    	}

    	$scope.loginWithOpen = function(type) {
    		cordovaUtil.openPlatformLogin(type);
    	}
};
function MainTabController($scope, sideDelegate, $state)
{
	console.log("MainTabController");
}

app.controller('FoundTabController', ['$scope', 'CategoryService', 'AppUtil', 'sideDelegate', '$state', FoundTabController]);

function FoundTabController($scope, CategoryService, AppUtil, cordovaUtil, $state)
{
	console.log("FoundTabController");
	$scope.toggleView = function(view) {
		$state.go("slideView.mainTab." + view);
	};

	$scope.toggle = function() {
		cordovaUtil.openDrawer("open");
	};

	$scope.categorySelectedListener  = function(category) {
		cordovaUtil.openWebView(app.rootPath + "#/courselist/" + category.id);
	};

	CategoryService.getCategorieTree(function(data) {
		$scope.categoryTree = data;
    		$scope.openModal = function($event) {
    			var dialog = $(".ui-dialog");
			dialog.dialog("show");
			$(".ui-dialog-bg").click(function(e) {
				dialog.dialog("hide");
			});
		};
	});

	var self = this;
	this.parseBannerAction = function(action) {
		this.courseAction = function(params) {
			cordovaUtil.openWebView(app.rootPath + "#/course/" + params);
		}

		this.webviewAction = function(params) {
			cordovaUtil.openWebView(params);
		}

		this.noneAction = function() {
		}

		return this[action + "Action"];
	}

	$scope.bannerClick = function(banner) {
		var bannerAction = self.parseBannerAction(banner.action);
		bannerAction(banner.params);
	}
}


app.controller('MessageTabController', ['$scope', FoundTabController]);

function MessageTabController($scope)
{
	console.log("MessageTabController");
}

app.controller('ContactTabController', ['$scope', ContactTabController]);

function ContactTabController($scope)
{
	console.log("ContactTabController");
}
;
app.controller('MyFavoriteCourseController', ['$scope', 'CourseService', 'CourseUtil', MyFavoriteCourseController]);
app.controller('MyFavoriteLiveController', ['$scope', 'CourseService', 'CourseUtil', MyFavoriteLiveController]);

function MyFavoriteBaseController($scope, CourseService, CourseUtil)
{
  var self = this;
  $scope.data  = CourseUtil.getFavoriteListTypes();

    this.loadDataList = function(type) {
      $scope.showLoad();
      var content = $scope.data[type];
      CourseService.getFavoriteCourse(
        content.url,
        {
          limit : 100,
        start: content.start
      }, function(data) {
            $scope.hideLoad();
            if (!data || data.data.length == 0) {
              content.canLoad = false;
            }

            content.data = content.data || [];
            content.data = content.data.concat(data.data);
            content.start += data.limit;

            if (data.total && content.start >= data.total) {
              content.canLoad = false;
            }
        }
      );
    }
}

function MyFavoriteCourseController($scope, CourseService, CourseUtil)
{
      console.log("MyFavoriteCourseController");
	this.__proto__ = new MyFavoriteBaseController($scope, CourseService, CourseUtil);

      var self = this;
      this.loadCourses = function() {
        self.loadDataList("course");
      }

      this.loadCourses();
}

function MyFavoriteLiveController($scope, CourseService, CourseUtil)
{
      console.log("MyFavoriteLiveController");
      this.__proto__ = new MyFavoriteBaseController($scope, CourseService, CourseUtil);

      var self = this;
      this.loadLiveCourses = function() {
        self.loadDataList("live");
      }

      this.loadLiveCourses();
};
function MyGroupBaseController($scope, serviceCallBack) {

  var self = this;
  this.limit = 10;
  $scope.data = [];
  $scope.canLoad = true;
  $scope.start = $scope.start || 0;

  this.loadDataList = function(type) {
      serviceCallBack({
        limit : self.limit,
        start: $scope.start,
        type : type
      }, function(data) {
        
        var length  = data ? data.data.length : 0;
        if (!data || length == 0 || length < self.limit) {
            $scope.canLoad = false;
          }

          $scope.data = $scope.data.concat(data.data);
          $scope.start += self.limit;
      });
    }
}

function MyGroupNoteController($scope, NoteService, cordovaUtil, $state)
{
      console.log("MyGroupNoteController");
      var self = this;
      this.__proto__ = new MyGroupBaseController($scope, NoteService.getNoteList);

    $scope.canLoadMore = function() {
      return $scope.canLoad;
    };

    $scope.loadMore = function(){
      self.loadDataList();
    };

     this.loadDataList();
}

function MyGroupQuestionController($scope, QuestionService)
{
  console.log("MyGroupQuestionController");
      this.__proto__ = new MyGroupBaseController($scope, QuestionService.getCourseThreads);
  
    $scope.canLoadMore = function() {
      return $scope.canLoad;
    };

    $scope.loadMore = function(){
      self.loadDataList("question");
    };

     this.loadDataList("question");
}

function MyGroupThreadController($scope, QuestionService)
{
  console.log("MyGroupThreadController");
  this.__proto__ = new MyGroupBaseController($scope, QuestionService.getCourseThreads);

    $scope.canLoadMore = function() {
      return $scope.canLoad;
    };

    $scope.loadMore = function(){
      self.loadDataList("discussion");
    };

   this.loadDataList("discussion");
}

app.controller('MyGroupQuestionController', ['$scope', 'QuestionService', MyGroupQuestionController]);
app.controller('MyGroupNoteController', ['$scope', 'NoteService', 'cordovaUtil', '$state', MyGroupNoteController]);
app.controller('MyGroupThreadController', ['$scope', 'QuestionService', MyGroupThreadController]);;
app.controller('MyLearnController', ['$scope', 'CourseService', MyLearnController]);

function MyLearnController($scope, CourseService)
{
	var self = this;
	self.content = {
		course : {
			start : 0,
			canLoad : true,
			data : undefined
		},
		live : {
			start : 0,
			canLoad : true,
			data : undefined
		}
	};

	$scope.course = self.content.course;
	$scope.live = self.content.live;

  	self.loadDataList = function(content, serviceCallback) {
  		serviceCallback({
  			limit : 10,
			start: content.start
  		}, function(data) {

  			if (!data || data.data.length == 0) {
	    			content.canLoad = false;
	    		}

	    		content.data = content.data || [];
	    		content.data = content.data.concat(data.data);
	    		content.start += data.limit;

	    		if (data.limit > data.data.length) {
	    			content.canLoad = false;
	    		}
	    		if (data.total && content.start >= data.total) {
	    			content.canLoad = false;
	    		}
  		});
  	}

  	$scope.canLoadMore = function(type) {
  		return self.content[type].canLoad;
  	};

  	$scope.loadMore = function(type){
  		switch (type) {
  			case "course": 
  				self.loadDataList(self.content.course, CourseService.getLearningCourse);
  				break;
  			case "live": 
  				self.loadDataList(self.content.live, CourseService.getLiveCourses);
  				break;
  		}
  	};

  	$scope.loadCourses = function() {
  		self.loadDataList(self.content.course, CourseService.getLearningCourse);
  	}

  	$scope.loadLiveCourses = function() {
  		self.loadDataList(self.content.live, CourseService.getLiveCourses);
  	}

  	$scope.loadCourses();
  	$scope.loadLiveCourses();
};
app.controller('CourseCouponController', ['$scope', 'CouponService', '$stateParams', '$window', CourseCouponController]);
app.controller('VipListController', ['$scope', '$stateParams', 'SchoolService', VipListController]);
app.controller('VipPayController', ['$scope', '$stateParams', 'SchoolService', 'VipUtil', 'OrderService', 'cordovaUtil', VipPayController]);

function BasePayController()
{
	this.showPayResultDlg = function() {
		var dia = $.dialog({
		        title : '确认支付' ,
		        content : '是否支付完成?' ,
		        button : [ "确认" ,"取消" ]
		});

		dia.on("dialog:action",function(e){
		        if (e.index == 0) {
		        	window.history.back();
		        }
		});
	}
}

function VipPayController($scope, $stateParams, SchoolService, VipUtil, OrderService, cordovaUtil)
{
	var self = this;
	this.__proto__ = new BasePayController();

	$scope.showLoad();
	SchoolService.getVipPayInfo({
		levelId : $stateParams.levelId
	}, function(data) {
		$scope.hideLoad();
		$scope.data = data;
		$scope.payModes = VipUtil.getPayMode(data.buyType);
		$scope.selectedNum = 1;
		$scope.selectedPayMode = $scope.payModes[0];

		$scope.sumTotalPirce();
		$scope.initPopver();
	});
	
	$scope.sumTotalPirce = function() {
		var level = $scope.data.level;
		var payTypes = VipUtil.getPayType();

		var price = $scope.selectedPayMode.type == payTypes.byMonth ? level.monthPrice : level.yearPrice;
		$scope.totalPayPrice = $scope.selectedNum * price;
	}

	$scope.add = function() {
		if ($scope.selectedNum < 12) {
			$scope.selectedNum ++;
			$scope.sumTotalPirce();
		}
	}

	$scope.sub = function() {
		if ($scope.selectedNum > 1) {
			$scope.selectedNum --;
			$scope.sumTotalPirce();
		}
	}

	$scope.initPopver = function() {

		  $scope.showPopover = function($event) {
		  	$scope.isShowPayMode = ! $scope.isShowPayMode ;
		  };

		  $scope.selectPayMode = function(payMode) {
		  	$scope.selectedPayMode = payMode;
			$scope.sumTotalPirce();
		  	$scope.isShowPayMode = false;
		  }
	}

	$scope.payVip = function() {
		OrderService.payVip({
			targetId : $stateParams.levelId,
			duration : $scope.selectedNum,
			unitType : $scope.selectedPayMode.name
		}, function(data) {
			if (data.status == "ok" && data.payUrl != "") {
				cordovaUtil.pay("支付会员", data.payUrl);
				self.showPayResultDlg();
			} else if (data.error) {
				$scope.toast(data.error.message);
			}
		});
	}

}

function VipListController($scope, $stateParams, SchoolService)
{
	var user = null;
	SchoolService.getSchoolVipList({
		userId : $scope.user.id
	}, function(data) {
		$scope.data = data;
		user = data.user;
	});

	$scope.getVipName = function() {
		if (!$scope.data) {
			return "";
		}

		if (!user || !user.vip) {
			return "暂时还不是会员";
		}
		var levelId = user.vip.levelId;
		var vips = $scope.data.vips;
		if (levelId <= 0) {
			return "暂时还不是会员";
		}
		for (var i = 0; i < vips.length; i++) {
			if (levelId == vips[i].id) {
				return vips[i].name;
			}
		};

		return "暂时还不是会员";
	}
}

function CourseCouponController($scope, CouponService, $stateParams, $window)
{	
	$scope.formData = { code : "" };
	$scope.checkCoupon = function() {
		$scope.formData.error = "";
		$scope.showLoad();
		CouponService.checkCoupon({
			courseId : $stateParams.courseId,
			type : "course",
			code : $scope.formData.code
		}, function(data) {
			$scope.hideLoad();
			if (data.meta.code != 200) {
				$scope.formData.error = data.meta.message;
				return;
			}
			$window.history.back();
			$scope.$emit("coupon", { coupon : data.data });
		}, function(data) {
			$scope.hideLoad();
			$scope.toast("检验优惠码错误");
		});
	}
}

app.controller('CoursePayController', ['$scope', '$stateParams', 'OrderService', 'AppUtil', 'cordovaUtil', CoursePayController]);
function CoursePayController($scope, $stateParams, OrderService, AppUtil, cordovaUtil)
{	
	var self = this;
	this.__proto__ = new BasePayController();

	OrderService.getPayOrder({
		courseId : $stateParams.courseId
	}, function(data) {
		$scope.data = data;
	});

	$scope.$parent.$on("coupon", function(event, data) {
		$scope.$apply(function() {
			$scope.coupon = data.coupon;
		});
	});

	$scope.selectCoupon = function() {
		$scope.formData = { code : "", error : '' };
		self.dialog = $(".ui-dialog");
		self.dialog.dialog("show");
	}

	$scope.pay = function() {
		OrderService.payCourse({
			courseId : $stateParams.courseId
		}, function(data) {
			if (data.status == "ok" && data.payUrl != "") {
				cordovaUtil.pay("支付课程", data.payUrl);
				self.showPayResultDlg();
			}
		});
	}

	$scope.checkCoupon = function() {
		$scope.showLoad();
		ServcieUtil.getService("CouponService").checkCoupon({
			courseId : $stateParams.courseId,
			type : "course",
			code : $scope.formData.code
		}, function(data) {
			$scope.hideLoad();
			if (data.error) {
				$scope.$apply(function() {
					$scope.formData.error = data.error.message;
				});
				return;
			}
			$scope.$emit("coupon", { coupon : data });
			$scope.close();

		}, function(data) {
			$scope.hideLoad();
			$scope.toast("检验优惠码错误");
		});
	}

	$scope.close = function() {
		self.dialog.dialog("hide");
	}
}
;
app.controller('QuestionController', ['$scope', 'QuestionService', '$stateParams', QuestionController]);
app.controller('NoteController', ['$scope', 'NoteService', '$stateParams', NoteController]);

function QuestionController($scope, QuestionService, $stateParams)
{	
	var self = this;
	this.loadQuestion = function() {
		$scope.showLoad();
		QuestionService.getThread({
			courseId: $stateParams.courseId,
			threadId : $stateParams.threadId
		}, function(data) {
			$scope.thread = data;
			$scope.hideLoad();

			self.loadTeacherPost();
			self.loadTheadPost();
		});
	}
	
	this.loadTeacherPost = function() {
		QuestionService.getThreadTeacherPost({
			courseId: $stateParams.courseId,
			threadId : $stateParams.threadId
		}, function(data) {
			$scope.teacherPosts = data;
		});
	}

	this.loadTheadPost = function() {
		QuestionService.getThreadPost({
			courseId: $stateParams.courseId,
			threadId : $stateParams.threadId
		}, function(data) {
			$scope.threadPosts = data.data;
		});
	}

	self.loadQuestion();
}

function NoteController($scope, NoteService, $stateParams)
{	
	var self = this;
	this.loadNote = function() {
		$scope.showLoad();
		NoteService.getNote({
			noteId: $stateParams.noteId
		}, function(data) {
			$scope.note = data;
			$scope.hideLoad();
		});
	}

	self.loadNote();
};
app.controller('RegistController', ['$scope', 'platformUtil', 'UserService', '$state', RegistController]);

function RegistController($scope, platformUtil, UserService, $state)
{
	console.log("RegistController");

	$scope.user = {
		phone : null,
		code : null,
		password: null
	};

	var self = this;

	this.registHandler = function(params) {
		$scope.showLoad();
		UserService.regist(params, function(data) {
			$scope.hideLoad();
			if (data.error) {
				$scope.toast(data.error.message);
				return;
			}
			if (platformUtil.native) {
				esNativeCore.closeWebView();
				return;
			}
			self.jumpToMain();
		}, function(error) {
			$scope.toast("注册失败");
		});
	}

	this.jumpToMain = function() {
		$state.go("slideView.mainTab");
	}

	$scope.checkCode = function(code) {
		return !code || code.length == 0;
	};

	$scope.sendSmsCode = function(phone) {
		if (!parseInt(phone)) {
			alert("手机格式不正确!");
			return;
		}

		UserService.smsSend({
			phoneNumber : phone
		}, function(data) {
			$scope.toast(data.meta.message);
		});
	}

	$scope.registWithPhone = function(user) {
		if (!parseInt(user.phone)) {
			alert("手机格式不正确!");
			return;
		}
		if (user.password && (user.password.length < 5 || user.password.length > 20)) {
			alert("密码格式不正确!");
			return;
		}

		if ($scope.checkCode(user.code)) {
			alert("验证码不正确!");
			return;
		}
		self.registHandler({
			phone : user.phone,
			smsCode : user.code,
			password : user.password,
		});
	}

	$scope.registWithEmail = function(user) {
		if (!user.email) {
			alert("邮箱格式不正确!");
			return;
		}
		if (user.password && (user.password.length < 5 || user.password.length > 20)) {
			alert("密码格式不正确!");
			return;
		}
		self.registHandler({
			email : user.email,
			password : user.password,
		});
	}
};
app.controller('SearchController', ['$scope', 'CourseService', 'cordovaUtil', '$timeout', SearchController]);

function SearchController($scope, CourseService, cordovaUtil, $timeout)
{
	$scope.search = "";
	var self = this;
	
	$scope.focusSearchInput = function() {
		$('.ui-searchbar-wrap').addClass('focus');
        		$('.ui-searchbar-input input').focus();
        		esNativeCore.showKeyInput();
	};

	$scope.inputKeyPress = function($event) {
		if ($event.keyCode == 13 && $scope.search.length > 0) {
			self.search();
		}
	};

	$scope.seach = function() {
		if ($scope.search.length == 0) {
			cordovaUtil.closeWebView();
			return;
		}
		self.search();
	};

	$scope.canLoad = false;
    	$scope.start = $scope.start || 0;

    	this.search = function() {
    		$scope.start = 0;
		$scope.searchDatas = undefined;
		self.loadSearchData();
    	};

	this.loadSearchData = function() {
             $scope.showLoad();
              CourseService.searchCourse({
                limit : 10,
                start: $scope.start,
                search : $scope.search
              }, function(data) {
                        $scope.hideLoad();
                        var length  = data ? data.data.length : 0;
                        $scope.canLoad = ! (! data || length < 10);

                        $scope.searchDatas = $scope.searchDatas || [];
                        for (var i = 0; i < length; i++) {
                          $scope.searchDatas.push(data.data[i]);
                        };

                        $scope.start += data.limit;
                        $scope.$apply();
              });
      	};

      	$scope.loadMore = function(){
	            if (! $scope.canLoad) {
	              return;
	            }
	           setTimeout(function() {
	              self.loadSearchData();
	           }, 200); 
	};
};
app.controller('SettingController', ['$scope', 'UserService', '$state', SettingController]);

function SettingController($scope, UserService, $state)
{
	$scope.isShowLogoutBtn = $scope.user ? true : false;
	$scope.logout = function() {
		$scope.showLoad();
		UserService.logout( {}, function(data) {
			$scope.hideLoad();
			$state.go("slideView.mainTab");
		});
	}
};
app.controller('MyInfoController', ['$scope', 'httpService', '$stateParams', MyInfoController]);
app.controller('TeacherListController', ['$scope', 'UserService', '$stateParams', TeacherListController]);
app.controller('UserInfoController', ['$scope', 'UserService', '$stateParams', 'AppUtil', UserInfoController]);

function TeacherListController($scope, UserService, $stateParams)
{
	UserService.getCourseTeachers({
		courseId : $stateParams.courseId
	}, function(data) {
		$scope.users = data;
	});
}

function MyInfoController($scope, httpService, $stateParams) 
{
	httpService.get({
		url : app.host + "/mapi_v2/User/getUserInfo",
		params : {
			userId : $scope.user.id
		},
		success : function(data) {
			$scope.userinfo = data;
		},
		error : function(data) {
			$ionicLoading.hide();
		}
	});
}

function UserInfoController($scope, UserService, $stateParams, AppUtil) 
{
	var self = this;

	$scope.isFollower = null;
	$scope.uiBarTransparent = true;

	$scope.changeTabStatus = function(headTop, scrollTop) {
		var transparent = scrollTop < headTop;
		if (transparent == $scope.uiBarTransparent) {
			return;
		}

		$scope.$apply(function() {
			$scope.uiBarTransparent = transparent;
		});
	}

	this.isTeacher = function(role) {
		return AppUtil.inArray('ROLE_TEACHER',role) > 0;
	}

	this.getUserLearnCourse = function() {
		UserService.getLearningCourseWithoutToken({
			userId : $stateParams.userId
		}, function(data) {
			$scope.courses = data.data;
		});
	}

	this.getUserTeachCourse = function() {
		UserService.getUserTeachCourse({
			userId : $stateParams.userId
		}, function(data) {
			$scope.courses = data.data;
		});
	}

	UserService.getUserInfo({
		userId : $stateParams.userId
	}, function(data) {
		if (! data) {
			$scope.toast("获取用户信息失败！");
			return;
		}
		$scope.userinfo = data;
		$scope.isTeacher = self.isTeacher(data.roles);
		if ($scope.isTeacher) {
			self.getUserTeachCourse();
		} else {
			self.getUserLearnCourse();
		}

		if ($scope.user) {
			UserService.searchUserIsFollowed({
				userId : $scope.user.id,
				toId : $stateParams.userId
			}, function(data) {
				$scope.isFollower = true == data ? true : false;
			});
		}
	});

	this.follow = function() {
		UserService.follow({
			toId : $stateParams.userId
		}, function(data) {
			if (data && data.toId == $stateParams.userId) {
				$scope.isFollower = true;
			}
		});
	}

	this.unfollow = function() {
		UserService.unfollow({
			toId : $stateParams.userId
		}, function(data) {
			if (data) {
				$scope.isFollower = false;
			}
		});
	}

	$scope.changeFollowUser = function() {
		if (true == $scope.isFollower) {
			self.unfollow();
		} else {
			self.follow();
		}
		
	}

	

}