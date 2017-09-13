// 声明一个数据库操作的构造函数
function LocalDB(dbName, tableName) {
	this.dbName = dbName;
	this.tableName = tableName;
	this.db = null;
}
// 在原型链上注册open方法，完成打开数据库的操作
LocalDB.prototype.open = function (callback) {
	var _this = this;
    // 执行打开数据库的动作
	var request = window.indexedDB.open(_this.dbName);
    // 打开成功后的回调
	request.onsuccess = function (event) {
        // 获取打开结果：数据库实例
		_this.db = request.result;
        // 如果调用方有回调函数的话，就执行回调函数
        callback && callback();
	};
    // 第一次创建数据库时触发该事件
	request.onupgradeneeded = function (event) {
        // 获取数据库实例
		var db = request.result;
        // 检查是否存在指定的表
		if (!db.objectStoreNames.contains(_this.tableName)) {
            // 如果不存在，则创建，并指定一个自增的id作为查询依据
			db.createObjectStore(_this.tableName, {
				keyPath: "id",
                autoIncrement: true
			});
		}
	};
}
// 获取数据表的实例
LocalDB.prototype.getStore = function () {
	var transaction = this.db.transaction(this.tableName, 'readwrite');
	var objStore = transaction.objectStore(this.tableName);
	return objStore;
}
// 保存一条数据：支持添加和修改
LocalDB.prototype.set = function (data, callback) {
	var objStore = this.getStore();
	var request = data.id ? objStore.put(data) : objStore.add(data);
	request.onsuccess = function (event) {
		callback && callback(event.target.result);
	};
}
// 获取一条数据
LocalDB.prototype.get = function (id, callback) {
	var objStore = this.getStore();
	var request = objStore.get(id);
	request.onsuccess = function (event) {
		callback && callback(event.target.result);
	}
}
// 获取表中所有的数据
LocalDB.prototype.getAll = function (callback) {
	var objStore = this.getStore();
    // 打开数据游标
	var request = objStore.openCursor();
	request.onsuccess = function (event) {
		var cursor = event.target.result;				
		if (cursor) {
            // 如果游标存在，执行回调并传入当前数据行
			callback && callback(cursor.value);
            // 继续下一行数据
			cursor.continue();
		}
	}
}
// 删除一条数据
LocalDB.prototype.remove = function (id) {
	var objStore = this.getStore();
	objStore.delete(id);
}