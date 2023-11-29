import {v5 as uuidv5} from "uuid";
import {ApiResponse, Client} from "@elastic/elasticsearch";
import {BoilerData} from "../types";

const index: string = 'canaveral-boiler-data';
const alarmIndex: string = 'canaveral-error-data';

// todo comprobar errores si no se puede guardar em elk
export const saveToElk = async (result: BoilerData) => {
    const elkUrl: string  = process.env.ELK_URL ? process.env.ELK_URL : 'http://localhost';
    const elkPort: number = process.env.ELK_PORT ? parseInt(process.env.ELK_PORT, 10) : 9200;
    const elkClient = new Client({
        node: elkUrl + ':' + elkPort,
    })
    const documentData = {
        data: result,
        timestamp: new Date()
    }

    await elkClient.index({ index, body:documentData}).catch((err: any) => {
        console.log('Error save Data: ', err)
    })


    const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

    for (const data of result) {
        const id: string = uuidv5(data.name, MY_NAMESPACE);
        try {
            // buscamos el error en base de datos
            // si no esta o nos da error lo creamos, en caso contrario no hacemos nada
            const savedData:ApiResponse = await elkClient.get({ id:id, index:alarmIndex })
            console.log(savedData.body._source)
            const oldAlarm = savedData.body._source;
            if (oldAlarm.mailSent === true && data.state !== oldAlarm.status && data.hasAlarm ) {
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
                mailSent: !data.hasAlarm,
                updatedAt: new Date()
            }

            await elkClient.index({ id:id,  index: alarmIndex, body:documentData}).catch((err: any) => {
                console.log(err)
            })
        }

        console.log(id)

    }
}


