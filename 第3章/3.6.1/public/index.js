var menu = $("ul.navigator > li");
var content = $("div.content");

function initPage(page) {
  menu.removeClass("selected-item");
  menu.filter(function(){
	  return $(this).text().toLowerCase().trim() === page;
  }).addClass("selected-item");
  content.text("this is a " + page + " page");
}

initPage(location.pathname.substring(1));

menu.on("click", function(){
	var page = $(this).text().toLowerCase().trim();
	initPage(page);
	history.pushState("", page, page);
});

window.addEventListener("popstate", function(e) {
    initPage(location.pathname.substring(1));
});