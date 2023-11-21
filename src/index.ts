import express from 'express';
import {readData} from './service/service'
import {saveToElk} from './service/save-to-elk'
import dotenv from 'dotenv';
dotenv.config();

const modbusUrl: string  = process.env.PLC_ADDRESS ? process.env.PLC_ADDRESS : 'localhost:4321'
const modbusPort: number = process.env.PLC_PORT ? parseInt(process.env.PLC_PORT, 10) : 502;
const port: number | undefined = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : 4321;

const app = express();
app.use(express.json());

app.get('/', async (_req, res) => {

  try {
    const result = await readData(modbusUrl, modbusPort);
    console.time('Boiler data')
    await saveToElk(result)
    console.timeEnd('Boiler data')
    console.log('Después de guardar em ELK!!!!')
    res.json(result); // Assuming BoilerData is JSON-serializable
  } catch (error) {
    // save data to ekl error read modbus data
    // todo si no se puede leer devolver otro mensaje diferente, no devolver 500
    console.error("Error reading data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
