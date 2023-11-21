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
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToElk = void 0;
var uuid_1 = require("uuid");
var elasticsearch_1 = require("@elastic/elasticsearch");
var index = 'canaveral-boiler-data';
var alarmIndex = 'canaveral-error-data';
// todo comprobar errores si no se puede guardar em elk
var saveToElk = function (result) { return __awaiter(void 0, void 0, void 0, function () {
    var elkUrl, elkPort, elkClient, documentData, MY_NAMESPACE, _i, result_1, data, id, savedData, oldAlarm, alarmData, error_1, documentData_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                elkUrl = process.env.ELK_URL ? process.env.ELK_URL : 'http://localhost';
                elkPort = process.env.ELK_PORT ? parseInt(process.env.ELK_PORT, 10) : 9200;
                elkClient = new elasticsearch_1.Client({
                    node: elkUrl + ':' + elkPort,
                });
                documentData = {
                    data: result,
                    timestamp: new Date()
                };
                return [4 /*yield*/, elkClient.index({ index: index, body: documentData }).catch(function (err) {
                        console.log('Error save Data: ', err);
                    })];
            case 1:
                _a.sent();
                MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
                _i = 0, result_1 = result;
                _a.label = 2;
            case 2:
                if (!(_i < result_1.length)) return [3 /*break*/, 11];
                data = result_1[_i];
                if (!data.hasAlarm) return [3 /*break*/, 10];
                id = (0, uuid_1.v5)(data.name, MY_NAMESPACE);
                _a.label = 3;
            case 3:
                _a.trys.push([3, 7, , 9]);
                return [4 /*yield*/, elkClient.get({ id: id, index: alarmIndex })];
            case 4:
                savedData = _a.sent();
                console.log(savedData.body._source);
                oldAlarm = savedData.body._source;
                if (!(oldAlarm.mailSent === true)) return [3 /*break*/, 6];
                alarmData = {
                    date: new Date(),
                    value: data.value,
                    status: data.state,
                    mailSent: false,
                    updatedAt: new Date()
                };
                return [4 /*yield*/, elkClient.update({ index: alarmIndex, id: id, body: { doc: alarmData } }).catch(function (err) {
                        console.log(err);
                    })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [3 /*break*/, 9];
            case 7:
                error_1 = _a.sent();
                documentData_1 = {
                    id: id,
                    name: data.name,
                    date: new Date(),
                    value: data.value,
                    status: data.state,
                    mailSent: false,
                    updatedAt: new Date()
                };
                return [4 /*yield*/, elkClient.index({ id: id, index: alarmIndex, body: documentData_1 }).catch(function (err) {
                        console.log(err);
                    })];
            case 8:
                _a.sent();
                return [3 /*break*/, 9];
            case 9:
                console.log(id);
                _a.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 2];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.saveToElk = saveToElk;
