var draggableColor = $(".draggable > div");
var redText = $(".text > div:nth-child(2)");

draggableColor.on("dragstart", function(event){
  event.dataTransfer.setData("ele", ".draggable > div");
})

redText.on("dragover", function(event){
  event.preventDefault();
}).on("drop", function(event){
  var dragTarget = event.dataTransfer.getData("ele");
  $(dragTarget).css("visibility", "hidden");
  $(this).text("correct");
})