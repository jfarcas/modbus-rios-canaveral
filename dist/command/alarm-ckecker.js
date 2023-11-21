"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch_1 = require("@elastic/elasticsearch");
const nodemailer = __importStar(require("nodemailer"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: __dirname + '/../../.env' });
const elkUrl = process.env.ELK_URL ? process.env.ELK_URL : 'http://localhost';
const elkPort = process.env.ELK_PORT ? parseInt(process.env.ELK_PORT, 10) : 9200;
const mailServer = process.env.MAIL_SERVER ? process.env.MAIL_SERVER : 'localhost';
const mailPort = parseInt((_a = process.env.MAIL_PORT) !== null && _a !== void 0 ? _a : '587', 10);
const mailUser = process.env.MAIL_USER ? process.env.MAIL_USER : 'localhost';
const mailPassword = process.env.MAIL_PASSWORD ? process.env.MAIL_PASSWORD : 'localhost';
const mailFrom = process.env.MAIL_FROM ? process.env.MAIL_FROM : 'localhost@localhost';
const mailTo = process.env.MAIL_TO ? process.env.MAIL_TO : 'localhost@localhost';
const mailCc = process.env.MAIL_CC ? process.env.MAIL_CC : 'localhost@localhost';
const alarmIndex = 'canaveral-error-data';
const elkClient = new elasticsearch_1.Client({
    node: elkUrl + ':' + elkPort,
});
const checkAlarm = async () => {
    const data = await elkClient.search({
        index: alarmIndex,
        body: {
            query: {
                match: {
                    mailSent: false
                }
            }
        }
    });
    const alarms = data.body.hits.hits;
    // console.log(alarms)
    // console.log(data.body)
    let messageBody = '';
    //     despues de leer los datos de la base de datos preparamos el correo y por cada alarma actualizamos el campo mailSent a true
    if (alarms.length > 0) {
        messageBody = '<h1> 🔥 Alarmas Cañaveral 🔥</h1> <ul>';
        for (const alarm of alarms) {
            const alarmData = alarm['_source'];
            console.log(alarmData);
            messageBody += '<li>Alarma: ' + alarmData.name + '<ul><li> Valor: ' + alarmData.value + '</li><li> Estado: ' + alarmData.status + '</li></ul></li>';
            console.log(messageBody);
            alarmData.mailSent = true;
            alarmData.updatedAt = new Date();
            try {
                await elkClient.update({ index: alarmIndex, id: alarm._id, body: { doc: alarmData } }).catch((err) => {
                    console.log(err);
                });
            }
            catch (error) {
                console.log(error);
            }
        }
        let transporter = nodemailer.createTransport({
            host: mailServer,
            port: mailPort,
            auth: {
                user: mailUser,
                pass: mailPassword, // Your password
            }
        });
        // // Set email options
        const mailOptions = {
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
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email sending failed:', error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
};
checkAlarm().then(() => {
    console.log('done');
});
