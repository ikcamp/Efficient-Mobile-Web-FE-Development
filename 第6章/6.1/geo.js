var map = new AMap.Map('map', {
    // 地图中心点
    center: [121.600000, 31.220000],
    // 默认的放大级别
    zoom: 10
});

// 给地图增加工具条，控制地图的放大和缩小
map.plugin(["AMap.ToolBar"], function () {
    map.addControl(new AMap.ToolBar());
});

var geoOptions = {
    // 是否启用高精度定位（开启GPS定位），默认值为false
    enableHighAccuracy: true,
    // 定位接口超时时间，单位为ms，默认不超时
    timeout: 30000,
    // 位置最大缓存时间，单位为ms，默认值为0
    maximumAge: 1000
}
var timmer;
var lineArr = [];
var polyline, startMarker, stopMarker;
var times = 0;



function getPosition(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var coords = position.coords;
            callback(coords);
        }, function (error) {
            switch (error.code) {
                case 0:
                    alert("尝试获取您的位置信息时发生错误：" + error.message);
                    break;
                case 1:
                    alert("用户拒绝了获取位置信息请求。");
                    break;
                case 2:
                    alert("浏览器无法获取您的位置信息。");
                    break;
                case 3:
                    alert("获取您位置信息超时。");
                    break;
            }
        }, geoOptions);
    }
}

function renderStartMarker(point) {
    var lngLat = new AMap.LngLat(point[0], point[1]);
    if (!startMarker) {
        startMarker = new AMap.Marker({
            position: lngLat,
            map: map
        });
    } else {
        startMarker.setPosition(lngLat);
        startMarker.show();
    }
}

function renderEndMarker(point) {
    var lngLat = new AMap.LngLat(point[0], point[1]);
    if (!stopMarker) {
        stopMarker = new AMap.Marker({
            position: lngLat,
            map: map
        });
    } else {
        stopMarker.setPosition(lngLat);
        stopMarker.show();
    }
}

function renderLine(points) {
    if (!polyline) {
        polyline = new AMap.Polyline({
            path: points,          //设置线覆盖物路径
            strokeColor: "#3366FF", //线颜色
            strokeOpacity: 1,       //线透明度
            strokeWeight: 5,        //线宽
            strokeStyle: "solid",   //线样式
            strokeDasharray: [10, 5] //补充线样式
        });
        polyline.setMap(map);
    } else {
        polyline.show();
        polyline.setPath(points);
    }
}

function renderTracer(points) {
    if (points.length) {
        if (points.length === 1) {
            renderStartMarker(points[0]);
        } else if (points.length > 1) {
            var endPoint = [].concat(points[points.length - 1]);
            renderLine(points);
            renderEndMarker(endPoint);
        }
    }
}

function convert(longitude, latitude) {
    if (coordtransform && coordtransform.wgs84togcj02) {
        var coords = coordtransform.wgs84togcj02(longitude, latitude);
        return {
            longitude: coords[0],
            latitude: coords[1]
        }
    }
    return { longitude: longitude, latitude: latitude };
}

getPosition(function (coords) {
    coords = convert(coords.longitude, coords.latitude);
    var startPoint = new AMap.LngLat(coords.longitude, coords.latitude);
    map.setCenter(startPoint);
    map.setZoom(16);
});

function getPath(arr) {
    var path = [];
    arr.forEach(function (item) {
        path.push([].concat(item));
    });
    return path;
}

function start() {
    timmer = navigator.geolocation.watchPosition(function (position) {
        var coords = position.coords;
        if (coords.accuracy > 20) {
            return;
        }
        coords = convert(coords.longitude, coords.latitude);
        console.log(coords);
        map.setCenter(new AMap.LngLat(coords.longitude, coords.latitude));
        lineArr.push([coords.longitude, coords.latitude]);
        renderTracer(getPath(lineArr));
    }, function (error) {
        console.log(error)
    }, geoOptions);
}

function stop() {
    navigator.geolocation.clearWatch(timmer)
    stopMarker && stopMarker.hide();
    startMarker && startMarker.hide();
    polyline && polyline.hide();
}

document.getElementById("btnStart").addEventListener("click", start);
document.getElementById("btnStop").addEventListener("click", stop);