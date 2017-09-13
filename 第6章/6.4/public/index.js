// $(".a-upload").on("change","input[type='file']",function(){
//     var filePath=$(this).val();
//     if(filePath.indexOf("jpg")!=-1 || filePath.indexOf("png")!=-1){
//         $(".fileerrorTip").html("").hide();
//         var arr=filePath.split('\\');
//         var fileName=arr[arr.length-1];
//         $(".showFileName").html(fileName);
//     }else{
//         $(".showFileName").html("");
//         $(".fileerrorTip").html("您未上传文件，或者您上传文件类型有误！").show();
//         return false
//     }
// })

var image = document.querySelector("img");
var progress = document.querySelector("#progress");

document.querySelector("#photo").onchange = function(){
  var files = this.files;
  if(files.length === 0){
    return;
  }
  var file = this.files[0];
  uploadFile(file);
  readAsDataURL(file, image);
}

function readAsDataURL(file, image){
  var reader = new FileReader();
  // 将文件以Data URL形式进行读入页面
  reader.readAsDataURL(file);
  reader.onload = function(e){
    image.src = this.result;
  }
  image.style.display = "block";
}

function uploadFile(file){
  var formData = new FormData();
  formData.append(file.name, file);
  $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      // 这两项必填，作为文件上传的时候
      contentType: false,
      processData: false,
      beforeSend: function(xhr) {
        xhr.upload.onprogress = function(e) {
          var percent = Math.floor(e.loaded / e.total *100);
          progress.innerText = percent + "%";
        };
      },
      success: function(resp) {
        progress.innerText = "上传成功";
      },
      error: function() {
        progress.innerText = "上传失败";
      }
  });
}
