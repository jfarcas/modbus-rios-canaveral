"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readData = void 0;
const modbus_serial_1 = __importDefault(require("modbus-serial"));
const readParameters_1 = require("./readParameters");
const client = new modbus_serial_1.default();
client.setID(1);
client.setTimeout(1500);
const readData = async (modbusUrl, modbusPort) => {
    console.log('Connecting to PLC: ', modbusUrl, ' on port: ', modbusPort, '...');
    if (modbusUrl === undefined || modbusPort === undefined) {
        throw new Error('Modbus URL or Port not defined');
    }
    await client.connectTCP(modbusUrl, { port: modbusPort });
    let boilerData = [];
    for (const parameter of readParameters_1.readParameters) {
        const descriptions = parameter.descriptions;
        client.setID(parameter.clientId);
        boilerData = await readModBusData(boilerData, parameter.address, parameter.length, descriptions, parameter.readType);
    }
    console.log(boilerData);
    client.close(() => { console.log('Connection closed'); });
    return boilerData;
};
exports.readData = readData;
async function readModBusData(boilerData, address = 0, length = 2, descriptions, readType = 'readInputRegisters') {
    if (readType === 'readInputRegisters') {
        console.log('Reading input registers...');
    }
    let data = await client.readInputRegisters(address, length);
    descriptions.forEach((description, index) => {
        const value = data.data[index] / description.multiplier;
        boilerData.push({
            name: description.description,
            value: value.toFixed(0),
            hasAlarm: description.hasAlarm(value),
            state: description.state(value),
            showOnScreen: description.showOnScreen
        });
    });
    return boilerData;
}
