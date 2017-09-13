function loadData() {
	try {
		return JSON.parse(window.localStorage.getItem('todos'));
	} catch (e) {
		// 浏览器不支持localStorage
		return null
	}
}
function saveData(data) {
	try {
		window.localStorage.setItem('todos', JSON.stringify(data));
	} catch (e) {
		console.log(e)
		// 浏览器不支持localStorage
	}
}
/** 根据数据元素的某个属性对数级进行排序 */
function sortArrayByProp(arr, prop, reverse = false) {
	return arr.sort((a, b) => reverse ? a[prop] > b[prop] : a[prop] < b[prop]);
}
/** 当日期、时间单位字符串长度为一位时，前面补充0至两位 */
function fillZero(str) {
	return ('' + str).length === 1 ? '0' + str : str;
}

module.exports = {
    loadData,
    saveData,
    sortArrayByProp,
    fillZero
}