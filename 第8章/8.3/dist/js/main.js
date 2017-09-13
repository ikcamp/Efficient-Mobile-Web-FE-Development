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