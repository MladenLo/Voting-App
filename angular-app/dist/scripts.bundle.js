webpackJsonp([3,5],{

/***/ 108:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(230)(__webpack_require__(189))

/***/ }),

/***/ 189:
/***/ (function(module, exports) {

module.exports = "$(document).ready(function(){\n    $('#hamburgerBtn').on('click', function(){\n        $('#topNavigation').animate({ top: '0px' }, 300);\n    });\n    $('#menuCloseButton').on('click', function(){\n        $('#topNavigation').animate({ top: '-300px' }, 300);\n    });\n});"

/***/ }),

/***/ 230:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(src) {
	if (typeof execScript !== "undefined")
		execScript(src);
	else
		eval.call(null, src);
}


/***/ }),

/***/ 236:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(108);


/***/ })

},[236]);
//# sourceMappingURL=scripts.bundle.js.map