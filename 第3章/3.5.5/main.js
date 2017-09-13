var mediaSource = new MediaSource();	// 创建媒体数据源
// 添加媒体数据源打开时的监听
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
var mediaRecorder, recordedBlobs, sourceBuffer;	// 声明变量
var sourceVideo = document.getElementById('source');	// 源视频
var recordedVideo = document.getElementById('recorded');	// 已录制视频
var recordButton = document.getElementById('record');	// 录制按钮
recordButton.onclick = toggleRecording;	// 设置录制按钮点击动作

// 设置媒体约束，接收声音和视频，视频宽度为320像素
var constraints = { audio: true, video: { width: 320 } };

// 成功获取用户媒体
function handleSuccess(stream) {
	recordButton.disabled = false;	// 设置录制按钮可用
	window.stream = stream;
	sourceVideo.srcObject = stream;	// 将摄像头画面显示在sourceVideo上
}

// 获取用户媒体异常
function handleError(error) {
	console.log('获取用户媒体错误: ', error);
}

// 获取用户媒体
navigator.mediaDevices.getUserMedia(constraints).
		then(handleSuccess).catch(handleError);

// 处理媒体源打开
function handleSourceOpen(event) {
	sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
}

// 处理数据可用
function handleDataAvailable(event) {
	if (event.data && event.data.size > 0) {
		recordedBlobs.push(event.data);	// 将数据追加到录制记录中
	}
}

// 切换录制
function toggleRecording() {
	if (recordButton.textContent === '开始录制') {
		startRecording();	// 开始录制
	} else {
		stopRecording();	// 停止录制
		recordButton.textContent = '开始录制';
	}
}

// 开始录制
function startRecording() {
	recordedBlobs = [];	// 数据记录初始化
	var mimeTypes = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8',
		'video/webm'];
	// 查找支持的视频格式
	var mimeType = mimeTypes.find(type=>MediaRecorder.isTypeSupported(type)) || '';
	try {
		// 创建媒体录制器
		mediaRecorder = new MediaRecorder(window.stream, { mimeType });
	} catch (e) {
		alert('创建媒体录制器异常');
		return;
	}
	recordButton.textContent = '停止录制';
	mediaRecorder.ondataavailable = handleDataAvailable;
	mediaRecorder.start(10);
}

// 停止录制
function stopRecording() {
	mediaRecorder.stop();
	var buf = new Blob(recordedBlobs, { type: 'video/webm' });
	// 设置已录制视频的源为录制好的视频
	recordedVideo.src = window.URL.createObjectURL(buf);
}