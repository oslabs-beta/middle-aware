"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var _a = require('./dbModels'), Test = _a.Test, Route = _a.Route;
var mongoose = require('mongoose');
var dbController = {
    getAllRoutes: function () { return __awaiter(void 0, void 0, void 0, function () {
        var allRoutes, allRoutesStringified, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Route.find({})];
                case 1:
                    allRoutes = _a.sent();
                    allRoutesStringified = JSON.stringify(allRoutes);
                    // console.log(allRoutesStringified)
                    return [2 /*return*/, allRoutesStringified];
                case 2:
                    err_1 = _a.sent();
                    console.log('something: ', err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getRoute: function (route) { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    if (!route.includes('/')) return [3 /*break*/, 2];
                    return [4 /*yield*/, Route.findOne({ detail: route })]; // changed to findOne.
                case 1: return [2 /*return*/, _a.sent()]; // changed to findOne.
                case 2: return [4 /*yield*/, Route.findById({ _id: route })]; // changed to findById.
                case 3: 
                // otherwise assume a route _id was passed
                return [2 /*return*/, _a.sent()]; // changed to findById.
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    console.log('Error caught in dbController.getRoute: ', err_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); },
    // find route
    updateRoute: function (obj) { return __awaiter(void 0, void 0, void 0, function () {
        var route, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, Route.findOne({ _id: obj.routeId })];
                case 1:
                    route = _a.sent();
                    route.last_test_id = obj.testId;
                    return [4 /*yield*/, route.save()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    err_3 = _a.sent();
                    console.log('Error in updateRoute in dbController', err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    createRoute: function (route) { return __awaiter(void 0, void 0, void 0, function () {
        var err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Route.create({ detail: route })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_4 = _a.sent();
                    console.log('Error in createRoute in dbController:', err_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getTest: function (test) { return __awaiter(void 0, void 0, void 0, function () {
        var testData, testDataStringified, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log('test id queried: ', test);
                    return [4 /*yield*/, Test.find({ _id: test })];
                case 1:
                    testData = _a.sent();
                    testDataStringified = JSON.stringify(testData);
                    console.log(testDataStringified);
                    return [2 /*return*/, testDataStringified];
                case 2:
                    err_5 = _a.sent();
                    console.log('Error caught in dbController.getTest: ', err_5);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    createTest: function (test, info) { return __awaiter(void 0, void 0, void 0, function () {
        var err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Test.create({
                            route_id: test,
                            created_at: Date.now(),
                            request: {
                                method: info.method,
                                endpoint: info.endpoint
                            },
                            response: {
                                status_code: info.statusCode,
                                message: info.body,
                                payload: ''
                            },
                            error: info.body,
                            rtt: info.roundTripTime
                        })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_6 = _a.sent();
                    console.log('Error in dbController.createTest: ', err_6);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
exports["default"] = dbController;
