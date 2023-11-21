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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var elasticsearch_1 = require("@elastic/elasticsearch");
var dotenv_1 = require("dotenv");
var nodemailer = require("nodemailer");
(0, dotenv_1.config)({ path: __dirname + '/../../.env' });
var elkUrl = process.env.ELK_URL ? process.env.ELK_URL : 'http://localhost';
var elkPort = process.env.ELK_PORT ? parseInt(process.env.ELK_PORT, 10) : 9200;
var mailServer = process.env.MAIL_SERVER ? process.env.MAIL_SERVER : 'localhost';
var mailPort = parseInt((_a = process.env.MAIL_PORT) !== null && _a !== void 0 ? _a : '587', 10);
var mailUser = process.env.MAIL_USER ? process.env.MAIL_USER : 'localhost';
var mailPassword = process.env.MAIL_PASSWORD ? process.env.MAIL_PASSWORD : 'localhost';
var mailFrom = process.env.MAIL_FROM ? process.env.MAIL_FROM : 'localhost@localhost';
var mailTo = process.env.MAIL_TO ? process.env.MAIL_TO : 'localhost@localhost';
var mailCc = process.env.MAIL_CC ? process.env.MAIL_CC : 'localhost@localhost';
var alarmIndex = 'canaveral-error-data';
var elkClient = new elasticsearch_1.Client({
    node: elkUrl + ':' + elkPort,
});
var checkAlarm = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, alarms, messageBody, _i, alarms_1, alarm, alarmData, error_1, transporter, mailOptions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, elkClient.search({
                    index: alarmIndex,
                    body: {
                        query: {
                            match: {
                                mailSent: false
                            }
                        }
                    }
                })];
            case 1:
                data = _a.sent();
                alarms = data.body.hits.hits;
                messageBody = '';
                if (!(alarms.length > 0)) return [3 /*break*/, 8];
                messageBody = '<h1> 🔥 Alarmas Cañaveral 🔥</h1> <ul>';
                _i = 0, alarms_1 = alarms;
                _a.label = 2;
            case 2:
                if (!(_i < alarms_1.length)) return [3 /*break*/, 7];
                alarm = alarms_1[_i];
                alarmData = alarm['_source'];
                console.log(alarmData);
                messageBody += '<li>Alarma: ' + alarmData.name + '<ul><li> Valor: ' + alarmData.value + '</li><li> Estado: ' + alarmData.status + '</li></ul></li>';
                console.log(messageBody);
                alarmData.mailSent = true;
                alarmData.updatedAt = new Date();
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, elkClient.update({ index: alarmIndex, id: alarm._id, body: { doc: alarmData } }).catch(function (err) {
                        console.log(err);
                    })];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 6];
            case 6:
                _i++;
                return [3 /*break*/, 2];
            case 7:
                transporter = nodemailer.createTransport({
                    host: mailServer,
                    port: mailPort,
                    auth: {
                        user: mailUser,
                        pass: mailPassword, // Your password
                    }
                });
                mailOptions = {
                    from: mailFrom,
                    to: mailTo,
                    cc: mailCc,
                    subject: '🔥 Alarma Cañaveral',
                    html: messageBody,
                    headers: {
                        'priority': 'high'
                    },
                };
                // Send the email
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.error('Email sending failed:', error);
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                _a.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };
checkAlarm().then(function () {
    console.log('done');
});
