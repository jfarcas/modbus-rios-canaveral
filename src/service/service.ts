import ModbusRTU from "modbus-serial";
import {BoilerData, BoilerValue, CalderaValuesDescriptions} from "../types";
import {readParameters} from "./readParameters";

const client = new ModbusRTU();
client.setID(1)
client.setTimeout(1500);

export const readData = async (modbusUrl: string, modbusPort: number):Promise<BoilerData> =>   {
    console.log('Connecting to PLC: ', modbusUrl, ' on port: ', modbusPort, '...')
    if (modbusUrl === undefined || modbusPort === undefined) {
        throw new Error('Modbus URL or Port not defined')
    }
    await client.connectTCP(modbusUrl, {port: modbusPort});

    let boilerData: BoilerValue[] = [];

    for (const parameter of readParameters) {
        const descriptions: CalderaValuesDescriptions = parameter.descriptions;
        client.setID(parameter.clientId)
        boilerData = await readModBusData(boilerData, parameter.address, parameter.length, descriptions, parameter.readType);
    }

    console.log(boilerData)
    client.close(() => {console.log('Connection closed')})


    return boilerData
}

async function readModBusData(boilerData: BoilerValue[], address: number = 0, length: number = 2, descriptions: CalderaValuesDescriptions, readType: string = 'readInputRegisters') {
    if (readType === 'readInputRegisters') {
        console.log('Reading input registers...')
    }
    let data = await client.readInputRegisters(address, length);
    descriptions.forEach((description, index) => {

        const value =  data.data[index] / description.multiplier;


        boilerData.push({
            name: description.description,
            value: value.toFixed(0),
            hasAlarm: description.hasAlarm(value),
            state: description.state(value),
            showOnScreen: description.showOnScreen
        })
    })

    return boilerData;
}
