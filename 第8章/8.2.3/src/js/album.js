"use strict";
(function (window, undefined) {
    var doc = window.document;
    var arr = doc.querySelectorAll('.small-img-box a');
    var bigimg = doc.querySelector('.big-img');
    for (var i = 0; i < arr.length; i++) {
        arr[i].addEventListener('click', function (ev) {
            bigimg.src = this.getAttribute('href').substr(1);
            doc.querySelector('.small-img-box .hover').classList.remove('hover');
            this.classList.add('hover');
            ev.preventDefault();
            return false;
        }, false);
    }
})(window);