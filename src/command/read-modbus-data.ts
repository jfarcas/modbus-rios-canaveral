import {readData} from "../service/service";
import {saveToElk} from "../service/save-to-elk";
import {config} from 'dotenv';
config( {path: __dirname + '/../../.env'});
const readModbusData = async () => {
    const modbusUrl: string  = process.env.PLC_ADDRESS ? process.env.PLC_ADDRESS : 'localhost'
    const modbusPort: number = process.env.PLC_PORT ? parseInt(process.env.PLC_PORT, 10) : 502;
    const result = await readData(modbusUrl, modbusPort);
    await saveToElk(result)
}

readModbusData()
    .then(() => {console.log('Modbus data readed')})
    .catch((err) => {console.log(err)})
    .finally(() => {process.exit()})
