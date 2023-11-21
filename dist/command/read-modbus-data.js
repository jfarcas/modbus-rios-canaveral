"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("../service/service");
const save_to_elk_1 = require("../service/save-to-elk");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: __dirname + '/../../.env' });
const readModbusData = async () => {
    const modbusUrl = process.env.PLC_ADDRESS ? process.env.PLC_ADDRESS : 'localhost';
    const modbusPort = process.env.PLC_PORT ? parseInt(process.env.PLC_PORT, 10) : 502;
    const result = await (0, service_1.readData)(modbusUrl, modbusPort);
    await (0, save_to_elk_1.saveToElk)(result);
};
readModbusData()
    .then(() => { console.time('Modbus data readed'); })
    .catch((err) => { console.log(err); })
    .finally(() => { console.timeEnd('Modbus data readed)'); });
