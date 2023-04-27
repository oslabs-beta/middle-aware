/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/preload.ts":
/*!************************!*\
  !*** ./src/preload.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const { contextBridge, ipcRenderer } = __webpack_require__(/*! electron */ \"electron\");\ncontextBridge.exposeInMainWorld('electronAPI', {\n    openFile: () => ipcRenderer.invoke('dialog:openFile'),\n    parseFiles: (dir) => ipcRenderer.invoke('parseFiles', dir),\n    getAllRoutes: () => ipcRenderer.invoke('db:getAllRoutes'),\n    getRoute: (route) => ipcRenderer.invoke('db:getRoute', route),\n    getTest: (test) => ipcRenderer.invoke('db:getTest', test)\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcHJlbG9hZC50cy5qcyIsIm1hcHBpbmdzIjoiQUFBQSxNQUFNLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxHQUFHLG1CQUFPLENBQUMsMEJBQVUsQ0FBQztBQUUxRCxhQUFhLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFO0lBQzdDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0lBQ3JELFVBQVUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDO0lBQzFELFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0lBQ3pELFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDO0lBQzdELE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDO0NBQzFELENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9taWRkbGUtYXdhcmUvLi9zcmMvcHJlbG9hZC50cz8wNTZhIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgY29udGV4dEJyaWRnZSwgaXBjUmVuZGVyZXIgfSA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnZWxlY3Ryb25BUEknLCB7XG4gIG9wZW5GaWxlOiAoKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ2RpYWxvZzpvcGVuRmlsZScpLFxuICBwYXJzZUZpbGVzOiAoZGlyKSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ3BhcnNlRmlsZXMnLCBkaXIpLFxuICBnZXRBbGxSb3V0ZXM6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnZGI6Z2V0QWxsUm91dGVzJyksXG4gIGdldFJvdXRlOiAocm91dGUpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnZGI6Z2V0Um91dGUnLCByb3V0ZSksXG4gIGdldFRlc3Q6ICh0ZXN0KSA9PiBpcGNSZW5kZXJlci5pbnZva2UoJ2RiOmdldFRlc3QnLCB0ZXN0KVxufSlcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/preload.ts\n");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/preload.ts");
/******/ 	
/******/ })()
;