"use strict";

(function () {
    var $title = document.getElementById("tbTitle");
    var $markdown = document.getElementById("tbMarkdown");
    var $preview = document.getElementById("preview");
    var mdConverter = new showdown.Converter();
    var $saveBtn = document.getElementById("btnSave");
    var $addBtn = document.querySelector(".icon-add");
    var $list = document.querySelector(".list");

    var artical = {};

    var bindEvents = function bindEvents() {
        $markdown.addEventListener("keyup", function () {
            renderPreview();
        });
        $list.addEventListener("click", function (e) {
            var target = e.target;
            if (target.matches(".icon-delete")) {
                var $li = target.parentNode;
                var id = parseInt($li.getAttribute("data-id"));
                MKDB.delete(id).then(function () {
                    renderList();
                });
            } else if (target.matches(".title")) {
                (function () {
                    var $li = target.parentNode;
                    var id = parseInt($li.getAttribute("data-id"));
                    MKDB.getById(id).then(function (data) {
                        Object.assign(artical, {
                            id: parseInt($li.getAttribute("data-id"))
                        }, data);
                        renderArtical();
                    });
                })();
            }
        });
        $addBtn.addEventListener("click", function (e) {
            artical = {};
            renderArtical();
            e.preventDefault();
        });
        $saveBtn.addEventListener("click", function () {
            Object.assign(artical, {
                title: $title.value,
                content: $markdown.value
            });
            console.log(artical);
            MKDB.save(artical).then(function () {
                renderList();
            }).catch(function (ex) {
                console.log(ex);
            });
        });
    };

    var renderList = function renderList() {
        window.MKDB.getAll().then(function (data) {
            var frag = document.createDocumentFragment();

            data.forEach(function (item) {
                var li = document.createElement("li");
                li.innerHTML = "<a href=\"#\" class=\"title\">" + item.title + "</a><div class=\"btn-delete icon-delete\">";
                li.setAttribute("data-id", item.id);
                frag.appendChild(li);
            });
            $list.innerHTML = "";
            $list.appendChild(frag);
            console.log(data);
        });
    };

    var renderArtical = function renderArtical() {
        var _artical = artical,
            _artical$title = _artical.title,
            title = _artical$title === undefined ? "" : _artical$title,
            _artical$content = _artical.content,
            content = _artical$content === undefined ? "" : _artical$content;

        $title.value = title;
        $markdown.value = content;
        renderPreview();
    };

    var renderPreview = function renderPreview() {
        var result = convertMarkdown($markdown.value);
        $preview.innerHTML = result;
    };

    var convertMarkdown = function convertMarkdown(markdownStr) {
        return mdConverter.makeHtml(markdownStr);
    };
    bindEvents();
    document.addEventListener("DOMContentLoaded", function () {
        renderList();
    });
})();
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