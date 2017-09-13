
const react = require("react")
const jsdom = require("jsdom")
let items = {}
if (typeof document === 'undefined') {
    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
    global.window = document.defaultView;
    global.navigator = global.window.navigator;
    global.React = react
    // mock localStorage
    global.localStorage = {
        setItem(key, data) {
            items[key, data]
        },
        getItem(key) {
            return items[key]
        }
    }
    global.window.localStorage = global.localStorage
}