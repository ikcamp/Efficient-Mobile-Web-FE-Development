"use strict";

(function ($window) {
    var indexedDB = $window.indexedDB;
    var DB_NAME = "mkeditor";
    var STORE_NAME = "artical";
    var openDB = function openDB() {
        var version = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        return new Promise(function (resolve, reject) {
            var request = indexedDB.open(DB_NAME, version);
            request.addEventListener("error", function (e) {
                reject(e.target.error);
            });
            request.addEventListener("success", function (e) {
                resolve(e.target.result);
            });
            request.addEventListener("upgradeneeded", function (e) {
                var db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
                }
            });
        });
    };

    var wrapPromise = function wrapPromise(fn) {
        return new Promise(function (resolve, reject) {
            var request = fn();
            request.addEventListener("error", function (e) {
                reject(e.target.error);
            });
            request.addEventListener("success", function (e) {
                resolve(e.target.result);
            });
        });
    };

    var getStore = function getStore() {
        var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "readonly";

        return openDB().then(function (db) {
            return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
        });
    };

    var add = function add(data) {
        return getStore('readwrite').then(function (store) {
            return wrapPromise(function () {
                return store.add(data);
            });
        });
    };

    var save = function save(data) {
        var id = data.id;
        if (id) {
            return getStore("readwrite").then(function (store) {
                return wrapPromise(function () {
                    return store.get(id);
                }).then(function (result) {
                    if (result) {
                        Object.assign(result, data);
                        return wrapPromise(function () {
                            return store.put(result);
                        });
                    } else {
                        return Promise.reject(new Error("item with id " + id + " not found"));
                    }
                });
            });
        } else {
            return add(data);
        }
    };

    var getAll = function getAll() {
        return getStore().then(function (store) {
            return new Promise(function (resolve, reject) {
                var request = store.openCursor();
                var resuts = [];
                request.addEventListener("success", function (e) {
                    var cursor = e.target.result;
                    if (cursor) {
                        resuts.push(cursor.value);
                        cursor.continue();
                    } else {
                        return resolve(resuts);
                    }
                });
                request.addEventListener("error", function (e) {
                    reject(e.target.error);
                });
            });
        });
    };

    var getById = function getById(id) {
        return getStore().then(function (store) {
            return wrapPromise(function () {
                return store.get(id);
            });
        });
    };

    var delData = function delData(id) {
        return getStore("readwrite").then(function (store) {
            return wrapPromise(function () {
                return store.delete(id);
            });
        });
    };
    $window.MKDB = {
        save: save,
        getAll: getAll,
        getById: getById,
        delete: delData
    };
})(window);