var root = document.getElementById('root');
function setContent(content){
	root.innerText = content;
}

var value = Math.floor(Math.random() * 10) % 2;
if(value === 0){
	require.ensure(["./a"], function(require) {
		var a = require("./a");
		setContent(a);
	}, "a");
} else {
	require.ensure(["./b"], function(require) {
		var b = require("./b");
		setContent(b);
	}, "b");
}