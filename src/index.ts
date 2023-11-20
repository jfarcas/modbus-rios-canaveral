import express from 'express';
import {readData} from './service/service'
import { v5 as uuidv5 } from 'uuid';

import dotenv from 'dotenv';
import {Client, ApiResponse} from "@elastic/elasticsearch";
// import {Client} from "@elastic/elasticsearch";

dotenv.config();
const modbusUrl: string  = process.env.PLC_ADDRESS ? process.env.PLC_ADDRESS : 'miguel.dnsdojo.com';
const modbusPort: number = process.env.PLC_PORT ? parseInt(process.env.PLC_PORT, 10) : 502;
const port: number | undefined = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : 321;

const app = express();
app.use(express.json());

app.get('/', async (_req, res) => {

  try {
    const result = await readData(modbusUrl, modbusPort);
    const index: string = 'canaveral-boiler-data';
    const alarmIndex: string = 'canaveral-error-data';
    const elkClient = new Client({
      node: 'http://185.211.5.244:52135',
    })

    // TODO EXTRACT TO SERVICE
    //  ================SAVE DATA TO ELASTIC SEARCH START HERE===============

    const documentData = {
      data: result,
      timestamp: new Date()
    }

    await elkClient.index({ index, body:documentData}).catch((err: any) => {
      console.log(err)
    })

    // ============== SAVE DATA TO ELASTIC SEARCH ENDS HERE =====================

    // TODO EXTRACT TO SERVICE
    //  ================== SAVE ERROR TO ELASTIC SEARCH START HERE =================
    const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

    for (const data of result) {
      if (data.hasAlarm) {
        const id: string = uuidv5(data.name, MY_NAMESPACE);
        try {
          // buscamos el error en base de datos
          // si no esta o nos da error lo creamos, en caso contrario no hacemos nada
          const savedData:ApiResponse = await elkClient.get({ id:id, index:alarmIndex })
          console.log(savedData.body._source)
          const oldAlarm = savedData.body._source;
          if (oldAlarm.mailSent === true) {
            const alarmData = {
              date: new Date(),
              value: data.value,
              status: data.state,
              mailSent: false,
              updatedAt: new Date()
            }

            await elkClient.update({ index: alarmIndex, id: id, body: {doc: alarmData}}).catch((err: any) => {
              console.log(err)
            })
          }
        } catch (error) {
          const documentData = {
            id: id,
            name: data.name,
            date: new Date(),
            value: data.value,
            status: data.state,
            mailSent: false,
            updatedAt: new Date()
          }

          await elkClient.index({ id:id,  index: alarmIndex, body:documentData}).catch((err: any) => {
            console.log(err)
          })
        }

        console.log(id)
      }
    }
    //  ================ SAVE ERROR TO ELASTIC SEARCH END HERE ====================
    // todo save data to elastic search
    // todo create logs if any alarm
    // todo  save alarms to elastic search

    res.json(result); // Assuming BoilerData is JSON-serializable
  } catch (error) {
    console.error("Error reading data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port + 1}`);
});
