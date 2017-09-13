/**
 * 极简路由
 */
var Router = function() {
    this._routers = [];
    this._get = function(hash) {
        var router = this._routers.filter(function(item, index){
            return '#' + item.url === hash;
        });
        return router[0] || {};
    }.bind(this);
};
//注意路由匹配
/**
 * 堆入routers队列
 * @param {Object} route
 * @return {Router}
 */
Router.prototype.push = function(route) {
    this._routers.push(route);
    return this;
}
/**
 * 初始化
 * @return {Router}
 */
Router.prototype.init = function() {
    this.go(this._get(location.hash));
    window.addEventListener('hashchange', function(){
        this.go(this._get(location.hash));
    }.bind(this), false);
    return this;
}
/**
 * 路由跳转
 * @param {String} page
 * @return {Router}
 */
Router.prototype.go = function(page) {
    var enter_page = document.querySelector(page.selector);
    if (!enter_page) return false;
    var enter = (function() {
        enter_page.classList.add('enter');
    }.bind(this)());
    if(page.hasOwnProperty('handle')) {
        page.handle.call(this);
    }
}

// 创建Router实例
var r = new Router();
// 创建首页
var home_page = {
    url: '/',
    selector: '.page-home',
    handle: function() {
        console.log('Home page enter.');
    }
};
// 创建开始页
var start_page = {
    url: '/start',
    selector: '.page-start',
    handle: function() {
        console.log('Start page enter.');
    }
}
// 路由组装
r.push(home_page).push(start_page).init();