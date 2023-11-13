import ModbusRTU from "modbus-serial";
import {BoilerData, BoilerValue, CalderaValuesDescriptions} from "../types";
import dotenv from 'dotenv';
dotenv.config();

const modbusUrl: string | undefined = process.env.PLC_ADDRESS;
const modbusPort: number | undefined = process.env.PLC_PORT ? parseInt(process.env.PLC_PORT, 10) : undefined;

import {readParameters} from "./readParameters";
const client = new ModbusRTU();

async function extracted(boilerData: BoilerValue[], address: number = 0, length: number = 2, descriptions: CalderaValuesDescriptions) {
    let data = await client.readInputRegisters(address, length);
    descriptions.forEach((description, index) => {
        boilerData.push({
            name: description.description,
            value: data.data[index] / description.multiplier
        })
    })

    return boilerData;
}

export const readData = async ():Promise<BoilerData> =>   {
    console.log('Connecting to PLC: ', modbusUrl, ' on port: ', modbusPort, '...')
    if (modbusUrl === undefined || modbusPort === undefined) {
        throw new Error('Modbus URL or Port not defined')
    }
    await client.connectTCP(modbusUrl, {port: modbusPort});

    let boilerData: BoilerValue[] = [];

    for (const parameter of readParameters) {
        boilerData = await extracted(boilerData, parameter.address, parameter.length, parameter.descriptions);
    }

    client.close(() => {console.log('Connection closed')})
    console.log(boilerData)
    return boilerData
}
