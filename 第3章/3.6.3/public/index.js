var input = $("input[type='text']");
var cal = $("input[type='button']");
var result = $(".result");

// cal.on("click", function(){
//   console.log("clicked");
//   var initValue = input.val();
//   var resultValue = fibonacci(initValue);
//   result.text(result.text() + resultValue + " ");
// })

cal.on("click", function(){
  var initValue = input.val();
  var w = new Worker("./worker.js");
  w.postMessage(initValue);
  w.onmessage = function(event) {
    result.html(result.html() + initValue + " => " + event.data + "<br/>");
  }
})

// function fibonacci(n) {
//   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
// }