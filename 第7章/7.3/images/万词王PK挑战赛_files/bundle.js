/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}

/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}

/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}


/******/ 	// Copied from https://github.com/facebook/react/blob/bef45b0/src/shared/utils/canDefineProperty.js
/******/ 	var canDefineProperty = false;
/******/ 	try {
/******/ 		Object.defineProperty({}, "x", {
/******/ 			get: function() {}
/******/ 		});
/******/ 		canDefineProperty = true;
/******/ 	} catch(x) {
/******/ 		// IE will fail on defineProperty
/******/ 	}

/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "9305b72c68684d6a73a0"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars

/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(canDefineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}

/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}

/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(canDefineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}

/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],

/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},

/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},

/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}

/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";

/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}

/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;

/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;

/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}

/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}

/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;

/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}

/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}

/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}

/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}

/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}

/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};

/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}

/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}

/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}

/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}

/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}

/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;

/******/ 			var data = {};

/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;

/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;

/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];

/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}

/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}

/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");

/******/ 		hotCurrentHash = hotUpdateNewHash;

/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}

/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}

/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}

/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}

/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://172.16.9.254:3000/resource";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("module.exports = __webpack_require__(4);\n\n\n//////////////////\n// WEBPACK FOOTER\n// multi thanks\n// module id = 0\n// module chunks = 0\n//# sourceURL=webpack:///multi_thanks?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.GetCurrentScore = GetCurrentScore;\nexports.GetScore = GetScore;\nexports.GetComboRate = GetComboRate;\nexports.getHash = getHash;\nexports.getRoute = getRoute;\nexports.hasChildren = hasChildren;\nexports.Api = Api;\n\nvar _config = __webpack_require__(2);\n\nvar _pathToRegexp = __webpack_require__(6);\n\nvar _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n/**\n * 获取当题题目得分;\n * @param {int} qid 问题编号\n * @param {String} anser 答案\n * @param {int} timer 回答用时\n * @param {int} combo 连击数\n * @return {int} \n */\nfunction GetCurrentScore(qid, answer, timer, combo) {\n    if (timer >= _config.TIME) return 0;\n    if (typeof _config.QUESTIONS[qid] === 'undefined') return 0;\n    if (_config.QUESTIONS[qid].answer !== answer) {\n        return 0;\n    } else {\n        return _config.SCORE[timer] * GetComboRate(combo);\n    }\n}\n\n/**\n * 获取答题总分;\n * @param {Object} record答题记录\n * @return {int}\n */\nfunction GetScore(record) {\n    var score = 0,\n        combo = 1;\n    Object.keys(record).forEach(function (item, index) {\n        var question = record[item],\n            current_score = GetCurrentScore(question.qid, question.answer, question.timer, combo);\n        if (current_score === 0) {\n            combo = 1;\n        } else {\n            combo++;\n        }\n        score += current_score;\n    });\n    return score;\n}\n\n/**\n * 获取连击倍率;\n * @param {int} combo\n * @return {int}\n */\nfunction GetComboRate(combo) {\n    var combo_rate = void 0;\n    switch (combo) {\n        case 3:\n            combo_rate = 2;\n            break;\n        case 5:\n            combo_rate = 3;\n            break;\n        case 8:\n            combo_rate = 5;\n            break;\n        case 12:\n            combo_rate = 8;\n            break;\n        case 15:\n            combo_rate = 12;\n            break;\n        default:\n            combo_rate = 1;\n            break;\n    }\n    return combo_rate;\n}\n\n/**\n * 获取url hash\n * @param {String} url\n * @return {String}\n */\nfunction getHash(url) {\n    return url.indexOf('#') !== -1 ? url.substring(url.indexOf('#') + 1) : '/';\n}\n\n/**\n * get route from routes filter by url\n * @param {Array} routes\n * @param {String} url\n * @return {Object}\n */\nfunction getRoute(routes, url) {\n    for (var i = 0, len = routes.length; i < len; i++) {\n        var route = routes[i];\n        var keys = [];\n        var regex = (0, _pathToRegexp2.default)(route.url, keys);\n        var match = regex.exec(url);\n        if (match) {\n            route.params = {};\n            for (var j = 0, l = keys.length; j < l; j++) {\n                var key = keys[j];\n                var name = key.name;\n                route.params[name] = match[j + 1];\n            }\n            return route;\n        }\n    }\n    return null;\n}\n\n/**\n * 是否存在子元素\n * @param {HTMLElement} parent\n * @return {boolean}\n */\nfunction hasChildren(parent) {\n    var children = parent.children;\n    return children.length > 0;\n}\n\n/**\n * 接口请求\n * @param {boolean} oauth\n * @param {String} api_name\n * @param {String} method\n * @param {Object} data\n * @return {$.Deferred}\n */\nfunction Api(oauth, api_name, method, data) {\n    var dtd = $.Deferred(),\n        options = {\n        url: '/' + api_name,\n        dataType: 'json',\n        type: method,\n        data: data,\n        success: function success(response) {\n            if (response.status !== 0) {\n                dtd.reject();\n            } else {\n                dtd.resolve(response);\n            }\n        },\n        timeout: 8000,\n        error: function error(_error) {\n            dtd.reject(_error);\n        }\n    };\n    if (oauth) {\n        options.headers = JSON.parse('{\"' + HEARER_PARAMETER + '\": \"' + ACCESS_TOKEN + '\"}');\n    }\n    $.ajax(options);\n    return dtd.promise();\n}\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/js/util.js\n// module id = 1\n// module chunks = 0\n//# sourceURL=webpack:///./src/js/util.js?");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\n/* 头参数 */\nvar HEARER_PARAMETER = exports.HEARER_PARAMETER = window.HEARER_PARAMETER ? window.HEARER_PARAMETER : 'Access-Token';\n/* access_token */\nvar ACCESS_TOKEN = exports.ACCESS_TOKEN = window.ACCESS_TOKEN ? window.ACCESS_TOKEN : '';\n\n/* 题库 */\nvar QUESTIONS = exports.QUESTIONS = Object.freeze({\n    1: { question: 'red?', answer: true },\n    2: { question: 'blue?', answer: false },\n    3: { question: 'green?', answer: false },\n    4: { question: 'yello?', answer: true },\n    5: { question: 'red?', answer: true },\n    6: { question: 'blue?', answer: false },\n    7: { question: 'green?', answer: false },\n    8: { question: 'yello?', answer: true },\n    9: { question: 'green?', answer: false },\n    10: { question: 'yello?', answer: true },\n    11: { question: 'red?', answer: true },\n    12: { question: 'blue?', answer: false },\n    13: { question: 'green?', answer: false },\n    14: { question: 'yello?', answer: true },\n    15: { question: 'red?', answer: true },\n    16: { question: 'blue?', answer: false },\n    17: { question: 'green?', answer: false },\n    18: { question: 'yello?', answer: true },\n    19: { question: 'green?', answer: false },\n    20: { question: 'yello?', answer: true },\n    21: { question: 'red?', answer: true },\n    22: { question: 'blue?', answer: false },\n    23: { question: 'green?', answer: false },\n    24: { question: 'yello?', answer: true },\n    25: { question: 'red?', answer: true },\n    26: { question: 'blue?', answer: false },\n    27: { question: 'green?', answer: false },\n    28: { question: 'yello?', answer: true },\n    29: { question: 'green?', answer: false },\n    30: { question: 'yello?', answer: true },\n    31: { question: 'red?', answer: true },\n    32: { question: 'blue?', answer: false },\n    33: { question: 'green?', answer: false },\n    34: { question: 'yello?', answer: true },\n    35: { question: 'red?', answer: true },\n    36: { question: 'blue?', answer: false },\n    37: { question: 'green?', answer: false },\n    38: { question: 'yello?', answer: true },\n    39: { question: 'green?', answer: false },\n    40: { question: 'yello?', answer: true },\n    41: { question: 'red?', answer: true },\n    42: { question: 'blue?', answer: false },\n    43: { question: 'green?', answer: false },\n    44: { question: 'yello?', answer: true },\n    45: { question: 'red?', answer: true },\n    46: { question: 'blue?', answer: false },\n    47: { question: 'green?', answer: false },\n    48: { question: 'yello?', answer: true },\n    49: { question: 'green?', answer: false },\n    50: { question: 'yello?', answer: true }\n});\n\n/* PK纪录 */\nvar RECORD = exports.RECORD = {};\n\n/* 答题时间 */\nvar TIME = exports.TIME = 3;\n\n/* 单题分数时间加成 */\nvar SCORE = exports.SCORE = [140, 118, 100];\n\n/* 样式 */\nvar CLASSES = exports.CLASSES = {\n    BUTTONS: {\n        START_PK: '.goto-pk'\n    }\n};\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/js/config.js\n// module id = 2\n// module chunks = 0\n//# sourceURL=webpack:///./src/js/config.js?");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.PK = undefined;\n\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _util = __webpack_require__(1);\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar PK = exports.PK = function () {\n    /* 倒计时timer id */\n    function PK(options) {\n        _classCallCheck(this, PK);\n\n        this._options = {\n            /* 答题时间 */\n            timer: 3000,\n            /* PK对手的纪录 */\n            record: {}\n        };\n        this._timerId = null;\n        this._playerRecord = {};\n    }\n    //this._options = Object.assign({}, this._options, options);\n\n    /* 设置对手纪录 */\n\n\n    /* 玩家纪录 */\n\n\n    _createClass(PK, [{\n        key: 'next',\n        value: function next() {\n            this.countdown();\n        }\n\n        /* 倒计时 */\n\n    }, {\n        key: 'countdown',\n        value: function countdown() {\n            console.log('countdown');\n            var surplus_time = this._options.timer;\n            this._timerId = window.setInterval(function () {\n                surplus_time -= 1000;\n                if (surplus_time <= 0) {\n                    window.clearInterval(this._timerId);\n                    this.answer = _extends({}, this._playerRecord, {});\n                }\n            }.bind(this), 1000);\n        }\n    }, {\n        key: 'opponent',\n        set: function set(record) {\n            this._options.record = record;\n            this.countdown();\n        }\n        /* 答题 */\n\n    }, {\n        key: 'answer',\n        set: function set(record) {\n            console.log('Set Answer');\n            this.next();\n        }\n    }]);\n\n    return PK;\n}();\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/js/PK.js\n// module id = 3\n// module chunks = 0\n//# sourceURL=webpack:///./src/js/PK.js?");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar _util = __webpack_require__(1);\n\nvar _PK = __webpack_require__(3);\n\nvar _router = __webpack_require__(5);\n\nvar _router2 = _interopRequireDefault(_router);\n\nvar _config = __webpack_require__(2);\n\nvar _jquery = __webpack_require__(13);\n\nvar _jquery2 = _interopRequireDefault(_jquery);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n/*************   PK   *************/\n/* 初始化PK */\nvar PK_GAME = new _PK.PK();\n/* 对手信息*/\n// import styles from '../styles/layout.scss';\nvar PK_DATA = {\n    USER: '詹姆斯',\n    RECORD: {}\n};\n/* 玩家信息 */\nvar PLAYER_DATA = {\n    USER: '杜兰特',\n    RECORD: {}\n};\n\n/*************   路由   *************/\nvar router = new _router2.default({ container: '.page', enterTimeout: 300, leaveTimeout: 300 });\n/* 活动首页 */\nvar home = {\n    url: '/',\n    render: function render() {\n        var tpl = __webpack_require__(8);\n        var output = swig.render(tpl, { locals: { id: '' } });\n        return output;\n    },\n    bind: function bind() {\n        var $_start = (0, _jquery2.default)(_config.CLASSES.BUTTONS.START_PK);\n        $_start.on('click', function (evetn) {\n            /* 请求后端接口返回PK数据 */\n            // Api(false, '', 'get').then((response)=>{\n            PK_DATA.RECORD = {\n                1: { qid: 7, answer: true, timer: 1 },\n                2: { qid: 39, answer: false, timer: 2 },\n                3: { qid: 5, answer: true, timer: 0 },\n                4: { qid: 9, answer: true, timer: 1 },\n                5: { qid: 14, answer: false, timer: 1 },\n                6: { qid: 11, answer: false, timer: 2 },\n                7: { qid: 30, answer: true, timer: 3 },\n                8: { qid: 17, answer: true, timer: 0 },\n                9: { qid: 35, answer: false, timer: 0 },\n                10: { qid: 15, answer: true, timer: 1 },\n                11: { qid: 12, answer: false, timer: 1 },\n                12: { qid: 45, answer: true, timer: 2 },\n                13: { qid: 47, answer: false, timer: 3 },\n                14: { qid: 2, answer: true, timer: 0 },\n                15: { qid: 6, answer: false, timer: 1 }\n            };\n            // });\n            location.hash = \"/intro\";\n            event.preventDefault();\n        });\n    }\n};\n/* 引导页 */\nvar intro = {\n    url: '/intro',\n    render: function render() {\n        var tpl = __webpack_require__(9);\n        var output = swig.render(tpl, { locals: { player: PLAYER_DATA.USER, opponent: PK_DATA.USER } });\n        return output;\n    },\n    bind: function bind() {\n        /* 引导动画结束 */\n        window.setTimeout(function () {}, 2000);\n    }\n};\n/* 答题页 */\nvar subjects = {\n    url: '/subjects/:id',\n    render: function render() {\n        var tpl = __webpack_require__(12);\n        var ids = this.params.id;\n        var output = swig.render(tpl, { locals: { id: ids } });\n        return output;\n        // return new Promise((resolve, reject) => {\n\n        // });\n    },\n    bind: function bind() {}\n};\n/* 结果页 */\nvar result = {\n    url: '/result',\n    render: function render() {\n        var tpl = __webpack_require__(11);\n        var output = swig.render(tpl, { locals: { id: '' } });\n        return output;\n    },\n    bind: function bind() {}\n};\n/* 抽奖页 */\nvar luckdraw = {\n    url: '/luckdraw',\n    render: function render() {\n        var tpl = __webpack_require__(10);\n        var output = swig.render(tpl, { locals: { id: '' } });\n        return output;\n    },\n    bind: function bind() {}\n};\n/* 组装路由 */\nrouter.push(home).push(intro).push(subjects).push(result).push(luckdraw).setDefault('/').init();\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/js/app.js\n// module id = 4\n// module chunks = 0\n//# sourceURL=webpack:///./src/js/app.js?");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _util = __webpack_require__(1);\n\nvar util = _interopRequireWildcard(_util);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n/**\n * simple router\n */\nvar Router = function () {\n    function Router(options) {\n        _classCallCheck(this, Router);\n\n        this._options = {\n            container: '.pages',\n            enter: 'enter',\n            enterTimeout: 0,\n            leave: 'leave',\n            leaveTimeout: 0\n        };\n        this._index = 1;\n        this._$container = null;\n        this._routes = [];\n        this._default = null;\n\n        this._options = _extends({}, this._options, options);\n        this._$container = document.querySelector(this._options.container);\n    }\n\n    /** \n     * 初始化\n     * @return {Router}\n     */\n\n\n    _createClass(Router, [{\n        key: 'init',\n        value: function init() {\n            var _this = this;\n\n            window.addEventListener('hashchange', function (event) {\n                var old_hash = util.getHash(event.oldURL);\n                var hash = util.getHash(event.newURL);\n                if (old_hash === hash) return;\n                var state = history.state || {};\n                _this.go(hash, state._index <= _this._index);\n            }, false);\n            if (history.state && history.state._index) {\n                this._index = history.state._index;\n            }\n            this._index--;\n            var hash = util.getHash(location.href);\n            var route = util.getRoute(this._routes, hash);\n            this.go(route ? hash : this._default);\n            return this;\n        }\n\n        /**\n         * 加入routers列表\n         * @param {Object} route\n         * @return {Router}\n         */\n\n    }, {\n        key: 'push',\n        value: function push(route) {\n            var exist = this._routes.filter(function (r) {\n                return r.url === route.url;\n            })[0];\n            if (exist) {\n                throw new Error('route ' + route.url + ' is existed');\n            }\n            route = _extends({}, {\n                url: '',\n                className: '',\n                render: function render() {},\n                bind: function bind() {}\n            }, route);\n            this._routes.push(route);\n            return this;\n        }\n\n        /**\n         * 设置默认匹配\n         * @param {String} url\n         * @return {Router}\n         */\n\n    }, {\n        key: 'setDefault',\n        value: function setDefault(url) {\n            this._default = url;\n            return this;\n        }\n\n        /**\n         * 路由跳转\n         * @param {String} url\n         * @param {Boolean} isBack, default: false\n         * @return {Router}\n         */\n\n    }, {\n        key: 'go',\n        value: function go(url) {\n            var _this2 = this;\n\n            var isBack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n\n            var route = util.getRoute(this._routes, url);\n            if (route) {\n                (function () {\n                    var leave = function leave(hasChildren) {\n                        if (hasChildren) {\n                            (function () {\n                                var child = _this2._$container.children[0];\n                                if (isBack) {\n                                    child.classList.add(_this2._options.leave);\n                                }\n                                if (_this2._options.leaveTimeout > 0) {\n                                    setTimeout(function () {\n                                        child.parentNode.removeChild(child);\n                                    }, _this2._options.leaveTimeout);\n                                } else {\n                                    child.parentNode.removeChild(child);\n                                }\n                            })();\n                        }\n                    };\n\n                    var enter = function enter(hasChildren, html) {\n                        var node = document.createElement('div');\n                        if (route.className) {\n                            node.classList.add(route.className);\n                        }\n                        node.innerHTML = html;\n                        _this2._$container.appendChild(node);\n                        if (!isBack && _this2._options.enter && hasChildren) {\n                            node.classList.add(_this2._options.enter);\n                        }\n                        if (_this2._options.enterTimeout > 0) {\n                            setTimeout(function () {\n                                node.classList.remove(_this2._options.enter);\n                            }, _this2._options.enterTimeout);\n                        } else {\n                            node.classList.remove(_this2._options.enter);\n                        }\n                        location.hash = '#' + url;\n                        try {\n                            isBack ? _this2._index-- : _this2._index++;\n                            history.replaceState && history.replaceState({ _index: _this2._index }, '', location.href);\n                        } catch (e) {}\n                        if (typeof route.bind === 'function') {\n                            route.bind.call(node);\n                        }\n                    };\n\n                    var hasChildren = util.hasChildren(_this2._$container);\n\n                    leave(hasChildren);\n\n                    var callback = function callback(err) {\n                        var html = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';\n\n                        if (err) {\n                            throw err;\n                        }\n                        enter(hasChildren, html);\n                    };\n\n                    var res = route.render(callback);\n                    // promise\n                    if (res && typeof res.then === 'function') {\n                        res.then(function (html) {\n                            callback(null, html);\n                        }, callback);\n                    }\n                    // synchronous\n                    else if (route.render.length === 0) {\n                            callback(null, res);\n                        }\n                        // callback\n                        else {}\n                })();\n            } else {\n                throw new Error('url ' + url + ' was not found');\n            }\n            return this;\n        }\n    }]);\n\n    return Router;\n}();\n\nexports.default = Router;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/js/router.js\n// module id = 5\n// module chunks = 0\n//# sourceURL=webpack:///./src/js/router.js?");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	eval("var isarray = __webpack_require__(7)\n\n/**\n * Expose `pathToRegexp`.\n */\nmodule.exports = pathToRegexp\nmodule.exports.parse = parse\nmodule.exports.compile = compile\nmodule.exports.tokensToFunction = tokensToFunction\nmodule.exports.tokensToRegExp = tokensToRegExp\n\n/**\n * The main path matching regexp utility.\n *\n * @type {RegExp}\n */\nvar PATH_REGEXP = new RegExp([\n  // Match escaped characters that would otherwise appear in future matches.\n  // This allows the user to escape special characters that won't transform.\n  '(\\\\\\\\.)',\n  // Match Express-style parameters and un-named parameters with a prefix\n  // and optional suffixes. Matches appear as:\n  //\n  // \"/:test(\\\\d+)?\" => [\"/\", \"test\", \"\\d+\", undefined, \"?\", undefined]\n  // \"/route(\\\\d+)\"  => [undefined, undefined, undefined, \"\\d+\", undefined, undefined]\n  // \"/*\"            => [\"/\", undefined, undefined, undefined, undefined, \"*\"]\n  '([\\\\/.])?(?:(?:\\\\:(\\\\w+)(?:\\\\(((?:\\\\\\\\.|[^\\\\\\\\()])+)\\\\))?|\\\\(((?:\\\\\\\\.|[^\\\\\\\\()])+)\\\\))([+*?])?|(\\\\*))'\n].join('|'), 'g')\n\n/**\n * Parse a string for the raw tokens.\n *\n * @param  {string}  str\n * @param  {Object=} options\n * @return {!Array}\n */\nfunction parse (str, options) {\n  var tokens = []\n  var key = 0\n  var index = 0\n  var path = ''\n  var defaultDelimiter = options && options.delimiter || '/'\n  var res\n\n  while ((res = PATH_REGEXP.exec(str)) != null) {\n    var m = res[0]\n    var escaped = res[1]\n    var offset = res.index\n    path += str.slice(index, offset)\n    index = offset + m.length\n\n    // Ignore already escaped sequences.\n    if (escaped) {\n      path += escaped[1]\n      continue\n    }\n\n    var next = str[index]\n    var prefix = res[2]\n    var name = res[3]\n    var capture = res[4]\n    var group = res[5]\n    var modifier = res[6]\n    var asterisk = res[7]\n\n    // Push the current path onto the tokens.\n    if (path) {\n      tokens.push(path)\n      path = ''\n    }\n\n    var partial = prefix != null && next != null && next !== prefix\n    var repeat = modifier === '+' || modifier === '*'\n    var optional = modifier === '?' || modifier === '*'\n    var delimiter = res[2] || defaultDelimiter\n    var pattern = capture || group\n\n    tokens.push({\n      name: name || key++,\n      prefix: prefix || '',\n      delimiter: delimiter,\n      optional: optional,\n      repeat: repeat,\n      partial: partial,\n      asterisk: !!asterisk,\n      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')\n    })\n  }\n\n  // Match any characters still remaining.\n  if (index < str.length) {\n    path += str.substr(index)\n  }\n\n  // If the path exists, push it onto the end.\n  if (path) {\n    tokens.push(path)\n  }\n\n  return tokens\n}\n\n/**\n * Compile a string to a template function for the path.\n *\n * @param  {string}             str\n * @param  {Object=}            options\n * @return {!function(Object=, Object=)}\n */\nfunction compile (str, options) {\n  return tokensToFunction(parse(str, options))\n}\n\n/**\n * Prettier encoding of URI path segments.\n *\n * @param  {string}\n * @return {string}\n */\nfunction encodeURIComponentPretty (str) {\n  return encodeURI(str).replace(/[\\/?#]/g, function (c) {\n    return '%' + c.charCodeAt(0).toString(16).toUpperCase()\n  })\n}\n\n/**\n * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.\n *\n * @param  {string}\n * @return {string}\n */\nfunction encodeAsterisk (str) {\n  return encodeURI(str).replace(/[?#]/g, function (c) {\n    return '%' + c.charCodeAt(0).toString(16).toUpperCase()\n  })\n}\n\n/**\n * Expose a method for transforming tokens into the path function.\n */\nfunction tokensToFunction (tokens) {\n  // Compile all the tokens into regexps.\n  var matches = new Array(tokens.length)\n\n  // Compile all the patterns before compilation.\n  for (var i = 0; i < tokens.length; i++) {\n    if (typeof tokens[i] === 'object') {\n      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')\n    }\n  }\n\n  return function (obj, opts) {\n    var path = ''\n    var data = obj || {}\n    var options = opts || {}\n    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent\n\n    for (var i = 0; i < tokens.length; i++) {\n      var token = tokens[i]\n\n      if (typeof token === 'string') {\n        path += token\n\n        continue\n      }\n\n      var value = data[token.name]\n      var segment\n\n      if (value == null) {\n        if (token.optional) {\n          // Prepend partial segment prefixes.\n          if (token.partial) {\n            path += token.prefix\n          }\n\n          continue\n        } else {\n          throw new TypeError('Expected \"' + token.name + '\" to be defined')\n        }\n      }\n\n      if (isarray(value)) {\n        if (!token.repeat) {\n          throw new TypeError('Expected \"' + token.name + '\" to not repeat, but received `' + JSON.stringify(value) + '`')\n        }\n\n        if (value.length === 0) {\n          if (token.optional) {\n            continue\n          } else {\n            throw new TypeError('Expected \"' + token.name + '\" to not be empty')\n          }\n        }\n\n        for (var j = 0; j < value.length; j++) {\n          segment = encode(value[j])\n\n          if (!matches[i].test(segment)) {\n            throw new TypeError('Expected all \"' + token.name + '\" to match \"' + token.pattern + '\", but received `' + JSON.stringify(segment) + '`')\n          }\n\n          path += (j === 0 ? token.prefix : token.delimiter) + segment\n        }\n\n        continue\n      }\n\n      segment = token.asterisk ? encodeAsterisk(value) : encode(value)\n\n      if (!matches[i].test(segment)) {\n        throw new TypeError('Expected \"' + token.name + '\" to match \"' + token.pattern + '\", but received \"' + segment + '\"')\n      }\n\n      path += token.prefix + segment\n    }\n\n    return path\n  }\n}\n\n/**\n * Escape a regular expression string.\n *\n * @param  {string} str\n * @return {string}\n */\nfunction escapeString (str) {\n  return str.replace(/([.+*?=^!:${}()[\\]|\\/\\\\])/g, '\\\\$1')\n}\n\n/**\n * Escape the capturing group by escaping special characters and meaning.\n *\n * @param  {string} group\n * @return {string}\n */\nfunction escapeGroup (group) {\n  return group.replace(/([=!:$\\/()])/g, '\\\\$1')\n}\n\n/**\n * Attach the keys as a property of the regexp.\n *\n * @param  {!RegExp} re\n * @param  {Array}   keys\n * @return {!RegExp}\n */\nfunction attachKeys (re, keys) {\n  re.keys = keys\n  return re\n}\n\n/**\n * Get the flags for a regexp from the options.\n *\n * @param  {Object} options\n * @return {string}\n */\nfunction flags (options) {\n  return options.sensitive ? '' : 'i'\n}\n\n/**\n * Pull out keys from a regexp.\n *\n * @param  {!RegExp} path\n * @param  {!Array}  keys\n * @return {!RegExp}\n */\nfunction regexpToRegexp (path, keys) {\n  // Use a negative lookahead to match only capturing groups.\n  var groups = path.source.match(/\\((?!\\?)/g)\n\n  if (groups) {\n    for (var i = 0; i < groups.length; i++) {\n      keys.push({\n        name: i,\n        prefix: null,\n        delimiter: null,\n        optional: false,\n        repeat: false,\n        partial: false,\n        asterisk: false,\n        pattern: null\n      })\n    }\n  }\n\n  return attachKeys(path, keys)\n}\n\n/**\n * Transform an array into a regexp.\n *\n * @param  {!Array}  path\n * @param  {Array}   keys\n * @param  {!Object} options\n * @return {!RegExp}\n */\nfunction arrayToRegexp (path, keys, options) {\n  var parts = []\n\n  for (var i = 0; i < path.length; i++) {\n    parts.push(pathToRegexp(path[i], keys, options).source)\n  }\n\n  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))\n\n  return attachKeys(regexp, keys)\n}\n\n/**\n * Create a path regexp from string input.\n *\n * @param  {string}  path\n * @param  {!Array}  keys\n * @param  {!Object} options\n * @return {!RegExp}\n */\nfunction stringToRegexp (path, keys, options) {\n  return tokensToRegExp(parse(path, options), keys, options)\n}\n\n/**\n * Expose a function for taking tokens and returning a RegExp.\n *\n * @param  {!Array}          tokens\n * @param  {(Array|Object)=} keys\n * @param  {Object=}         options\n * @return {!RegExp}\n */\nfunction tokensToRegExp (tokens, keys, options) {\n  if (!isarray(keys)) {\n    options = /** @type {!Object} */ (keys || options)\n    keys = []\n  }\n\n  options = options || {}\n\n  var strict = options.strict\n  var end = options.end !== false\n  var route = ''\n\n  // Iterate over the tokens and create our regexp string.\n  for (var i = 0; i < tokens.length; i++) {\n    var token = tokens[i]\n\n    if (typeof token === 'string') {\n      route += escapeString(token)\n    } else {\n      var prefix = escapeString(token.prefix)\n      var capture = '(?:' + token.pattern + ')'\n\n      keys.push(token)\n\n      if (token.repeat) {\n        capture += '(?:' + prefix + capture + ')*'\n      }\n\n      if (token.optional) {\n        if (!token.partial) {\n          capture = '(?:' + prefix + '(' + capture + '))?'\n        } else {\n          capture = prefix + '(' + capture + ')?'\n        }\n      } else {\n        capture = prefix + '(' + capture + ')'\n      }\n\n      route += capture\n    }\n  }\n\n  var delimiter = escapeString(options.delimiter || '/')\n  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter\n\n  // In non-strict mode we allow a slash at the end of match. If the path to\n  // match already ends with a slash, we remove it for consistency. The slash\n  // is valid at the end of a path match, not in the middle. This is important\n  // in non-ending mode, where \"/test/\" shouldn't match \"/test//route\".\n  if (!strict) {\n    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?'\n  }\n\n  if (end) {\n    route += '$'\n  } else {\n    // In non-ending mode, we need the capturing groups to match as much as\n    // possible by using a positive lookahead to the end or next path segment.\n    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)'\n  }\n\n  return attachKeys(new RegExp('^' + route, flags(options)), keys)\n}\n\n/**\n * Normalize the given path string, returning a regular expression.\n *\n * An empty array can be passed in for the keys, which will hold the\n * placeholder key descriptions. For example, using `/user/:id`, `keys` will\n * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.\n *\n * @param  {(string|RegExp|Array)} path\n * @param  {(Array|Object)=}       keys\n * @param  {Object=}               options\n * @return {!RegExp}\n */\nfunction pathToRegexp (path, keys, options) {\n  if (!isarray(keys)) {\n    options = /** @type {!Object} */ (keys || options)\n    keys = []\n  }\n\n  options = options || {}\n\n  if (path instanceof RegExp) {\n    return regexpToRegexp(path, /** @type {!Array} */ (keys))\n  }\n\n  if (isarray(path)) {\n    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)\n  }\n\n  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)\n}\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./~/path-to-regexp/index.js\n// module id = 6\n// module chunks = 0\n//# sourceURL=webpack:///./~/path-to-regexp/index.js?");

/***/ },
/* 7 */
/***/ function(module, exports) {

	eval("module.exports = Array.isArray || function (arr) {\n  return Object.prototype.toString.call(arr) == '[object Array]';\n};\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./~/path-to-regexp/~/isarray/index.js\n// module id = 7\n// module chunks = 0\n//# sourceURL=webpack:///./~/path-to-regexp/~/isarray/index.js?");

/***/ },
/* 8 */
/***/ function(module, exports) {

	eval("module.exports = \"<div class=\\\"title-img\\\">万词王PK争霸赛</div>\\n<div class=\\\"active-box\\\">\\n  <div class=\\\"title\\\">活动内容</div>\\n  <div class=\\\"active-con\\\">这里是活动内容接收到回复这里是活动内容接收到回复这里是活动内容接收到回复这里是活动内容接收到回复这里是活动内容接收到回复这里是活动内容接收到回复</div>\\n</div>\\n<div class=\\\"active-box\\\">\\n  <div class=\\\"title\\\">活动规则</div>\\n  <div class=\\\"active-con\\\">这里是活动内容接收到回复这里是活动内容接收到回复这里是活动内容接收到回复这里是活动内容接收到回复这里是活动内容接收到回复这里是活动内容接收到回复</div>\\n</div>\\n<div class=\\\"btn-box\\\"><a href=\\\"/#/intro\\\" class=\\\"goto-pk\\\">立即PK</a></div>\"\n\n//////////////////\n// WEBPACK FOOTER\n// ./~/raw-loader!./src/template/home.html\n// module id = 8\n// module chunks = 0\n//# sourceURL=webpack:///./src/template/home.html?./~/raw-loader");

/***/ },
/* 9 */
/***/ function(module, exports) {

	eval("module.exports = \"{{player}} {{opponent}}\"\n\n//////////////////\n// WEBPACK FOOTER\n// ./~/raw-loader!./src/template/intro.html\n// module id = 9\n// module chunks = 0\n//# sourceURL=webpack:///./src/template/intro.html?./~/raw-loader");

/***/ },
/* 10 */
/***/ function(module, exports) {

	eval("module.exports = \" <h1>万词王PK争霸赛抽奖</h1>\\n<div class=\\\"slyder-adventures\\\">\\n  <div class=\\\"rotate-box\\\">\\n    <div class=\\\"scorte-box\\\"></div>\\n  <div class=\\\"wiggle rotate-pointer\\\">立即抽奖</div>\\n  </div>\\n  <div class=\\\"gift-info\\\">\\n    <span>已有<b>999</b>人中奖</span><br> \\n    <span>累计送出大奖价值<b>9999</b>元</span>\\n  </div>\\n</div>\\n\\n<div class=\\\"cover-layer\\\">\\n  <div class=\\\"warn-info\\\">\\n  <div class=\\\"close-btn\\\">×</div>\\n    <h1>抽奖提示</h1>\\n    <div class=\\\"error-info\\\">您未进入<b>xxx</b>名,还不能抽奖哦~</div>\\n    <div class=\\\"handle-btn\\\">\\n      <a href=\\\"#\\\" class=\\\"close-cover-layer\\\">知道了</a>\\n      <a href=\\\"http://172.16.9.1:3001/answerpk\\\" class=\\\"again-gopk\\\">重新PK</a>\\n    </div>\\n  </div>\\n</div>\"\n\n//////////////////\n// WEBPACK FOOTER\n// ./~/raw-loader!./src/template/luckdraw.html\n// module id = 10\n// module chunks = 0\n//# sourceURL=webpack:///./src/template/luckdraw.html?./~/raw-loader");

/***/ },
/* 11 */
/***/ function(module, exports) {

	eval("module.exports = \" <div class=\\\"top-result\\\">\\n  <div class=\\\"pic-show\\\">挑战胜利</div>\\n  <div class=\\\"pk-result-info\\\">\\n    <div class=\\\"my-result\\\">\\n      <span class=\\\"score-num\\\">23344</span><br>\\n      <span class=\\\"name-word\\\">爱你哦随你吧dkjfjgkl</span>\\n    </div>\\n    <div class=\\\"pk-flage\\\">PK</div>\\n    <div class=\\\"others-result\\\">\\n      <span class=\\\"score-num\\\">345678</span><br>\\n      <span class=\\\"name-word\\\">俄日泸沽湖dkjfjgkl</span>\\n    </div>\\n  </div>\\n</div>\\n<div class=\\\"rank-list\\\">\\n  <h2>排行榜</h2>\\n  <ul class=\\\"list-info\\\">\\n    <li class=\\\"super-word-king\\\">\\n      <span>宇宙超级词王</span>\\n      <span>2456754</span>\\n    </li>\\n    <li>\\n      <span>1</span>\\n      <span>name</span>\\n      <span>2456754</span>\\n    </li>\\n    <li>\\n      <span>2</span>\\n      <span>name</span>\\n      <span>2456754</span>\\n    </li>\\n    <li class=\\\"last-li\\\">\\n      <a href=\\\"#\\\" class=\\\"invitation-btn\\\">+邀请好友PK</a>\\n    </li>\\n  </ul>\\n  <ol class=\\\"others-way-box\\\">\\n    <a href=\\\"\\\" class=\\\"refreshpk-btn\\\">重新PK</a>\\n    <a href=\\\"\\\" class=\\\"goluckdraw-btn\\\">去抽奖</a>\\n  </ol>\\n</div>\\n<div class=\\\"bot-btn-box\\\">\\n  <a href=\\\"#\\\" class=\\\"wordarea-btn\\\">\\n    <div class=\\\"word-log\\\">词</div>\\n    <div class=\\\"explain-word\\\">\\n      <span>开心词场</span><br>  \\n      <span>背词也可以很开心</span>\\n    </div>\\n  </a>\\n  <a href=\\\"#\\\" class=\\\"downlod-btn\\\">立即下载</a>\\n</div>\"\n\n//////////////////\n// WEBPACK FOOTER\n// ./~/raw-loader!./src/template/result.html\n// module id = 11\n// module chunks = 0\n//# sourceURL=webpack:///./src/template/result.html?./~/raw-loader");

/***/ },
/* 12 */
/***/ function(module, exports) {

	eval("module.exports = \"<!-- 启动页 -->\\n<div class=\\\"page-subject\\\">\\n  <div class=\\\"begin-pk-box\\\">VS</div>\\n  \\t<div class=\\\"first-people\\\">\\n    <p class=\\\"match-name\\\">安东尼安东尼安东尼</p>\\n  </div>\\n  <div class=\\\"second-people\\\">\\n    <p class=\\\"match-name\\\">奥多开</p>\\n  </div>\\n</div>\\n<!-- pk页面 -->\\n<div class=\\\"access-result\\\">\\n  <div class=\\\"score-mine\\\">234</div>\\n  <div class=\\\"middle-box\\\">\\n    <div class=\\\"top-info\\\">\\n      <span class=\\\"left-name\\\">奥多开奥多开奥多开</span>\\n      <span class=\\\"count-down\\\">20s</span>\\n      <span class=\\\"right-name\\\">安东尼安东尼安东尼</span>\\n    </div>\\n    <div class=\\\"line-bar\\\">\\n      <div class=\\\"left-bar\\\"></div>\\n      <div class=\\\"right-bar\\\"></div>\\n    </div>\\n  </div>\\n  <div class=\\\"score-others\\\">644</div>\\n</div>\\n<div class=\\\"problem-img\\\"></div>\\n<div class=\\\"word-card-box\\\">\\n    <a href=\\\"\\\" class=\\\"item\\\">\\n    <img src=\\\"\\\" alt=\\\"\\\">\\n  </a><a href=\\\"\\\" class=\\\"item\\\">\\n    <img src=\\\"\\\" alt=\\\"\\\">\\n  </a><a href=\\\"\\\" class=\\\"item\\\">\\n    <img src=\\\"\\\" alt=\\\"\\\"></a><a href=\\\"\\\" class=\\\"item\\\">\\n    <img src=\\\"\\\" alt=\\\"\\\"></a><a href=\\\"\\\" class=\\\"item\\\">\\n    <img src=\\\"\\\" alt=\\\"\\\"></a><a href=\\\"\\\" class=\\\"item\\\">\\n    <img src=\\\"\\\" alt=\\\"\\\"></a>\\n</div>\\n<div class=\\\"check-right\\\">\\n  <div class=\\\"error-warn\\\">❎</div>\\n  <div class=\\\"right-warn\\\">✅</div>\\n</div>\"\n\n//////////////////\n// WEBPACK FOOTER\n// ./~/raw-loader!./src/template/subject.html\n// module id = 12\n// module chunks = 0\n//# sourceURL=webpack:///./src/template/subject.html?./~/raw-loader");

/***/ },
/* 13 */
/***/ function(module, exports) {

	eval("module.exports = $;\n\n//////////////////\n// WEBPACK FOOTER\n// external \"$\"\n// module id = 13\n// module chunks = 0\n//# sourceURL=webpack:///external_%22$%22?");

/***/ }
/******/ ]);