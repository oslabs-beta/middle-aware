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

eval("const { contextBridge, ipcRenderer } = __webpack_require__(/*! electron */ \"electron\");\ncontextBridge.exposeInMainWorld('electronAPI', {\n    openFile: () => ipcRenderer.invoke('dialog:openFile'),\n    // parseFiles: (dir) => ipcRenderer.invoke('parseFiles', dir),\n    getAllRoutes: () => ipcRenderer.invoke('db:getAllRoutes'),\n    // getRoute: (route) => ipcRenderer.invoke('db:getRoute', route),\n    getTest: (test) => ipcRenderer.invoke('db:getTest', test)\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcHJlbG9hZC50cy5qcyIsIm1hcHBpbmdzIjoiQUFBQSxNQUFNLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxHQUFHLG1CQUFPLENBQUMsMEJBQVUsQ0FBQztBQUUxRCxhQUFhLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFO0lBQzdDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0lBQ3JELDhEQUE4RDtJQUM5RCxZQUFZLEVBQUUsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztJQUN6RCxpRUFBaUU7SUFDakUsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUM7Q0FDMUQsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL21pZGRsZS1hd2FyZS8uL3NyYy9wcmVsb2FkLnRzPzA1NmEiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBjb250ZXh0QnJpZGdlLCBpcGNSZW5kZXJlciB9ID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdlbGVjdHJvbkFQSScsIHtcbiAgb3BlbkZpbGU6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnZGlhbG9nOm9wZW5GaWxlJyksXG4gIC8vIHBhcnNlRmlsZXM6IChkaXIpID0+IGlwY1JlbmRlcmVyLmludm9rZSgncGFyc2VGaWxlcycsIGRpciksXG4gIGdldEFsbFJvdXRlczogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdkYjpnZXRBbGxSb3V0ZXMnKSxcbiAgLy8gZ2V0Um91dGU6IChyb3V0ZSkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKCdkYjpnZXRSb3V0ZScsIHJvdXRlKSxcbiAgZ2V0VGVzdDogKHRlc3QpID0+IGlwY1JlbmRlcmVyLmludm9rZSgnZGI6Z2V0VGVzdCcsIHRlc3QpXG59KVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/preload.ts\n");

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