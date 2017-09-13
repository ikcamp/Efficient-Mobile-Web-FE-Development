(function() {
	'use strict';

	function Router() {
		this.routes = {}; // 存放路径和对应方法
		this.route = function(path, callback) { // 实例化后通过调用来增加新的路由
			this.routes[path] = callback; // 通过key-value存放callback
		}
		this.refresh = function() { // 通过一个函数调用最终的callback
			var curUrl = location.hash.slice(1) || '/';	// 在Hash模式下获取路径
				// var curUrl = location.pathname;		// 在History API模式下获取路径
			this.routes[curUrl](); // 调用最终的callback
		}
		this.init = function() { // 初始化方法
			// 监听load事件对应第一次页面加载
			window.addEventListener('load', this.refresh.bind(this), false);
			// Hash模式下监听hashchange事件
			window.addEventListener('hashchange', this.refresh.bind(this), false);
			// History API模式下监听popstate事件
			// window.addEventListener(‘popstate’, this.refresh.bind(this), false);
		}
	}

	var router = new Router(); // 实例化Router方法
	router.init(); // init来监听对应的全局事件
	router.route('/', function() {
		console.log('/')
	});
	router.route('test', function() {
		console.log('test')
	});

})();