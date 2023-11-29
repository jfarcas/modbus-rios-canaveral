"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToElk = void 0;
const uuid_1 = require("uuid");
const elasticsearch_1 = require("@elastic/elasticsearch");
const index = 'canaveral-boiler-data';
const alarmIndex = 'canaveral-error-data';
// todo comprobar errores si no se puede guardar em elk
const saveToElk = async (result) => {
    const elkUrl = process.env.ELK_URL ? process.env.ELK_URL : 'http://localhost';
    const elkPort = process.env.ELK_PORT ? parseInt(process.env.ELK_PORT, 10) : 9200;
    const elkClient = new elasticsearch_1.Client({
        node: elkUrl + ':' + elkPort,
    });
    const documentData = {
        data: result,
        timestamp: new Date()
    };
    await elkClient.index({ index, body: documentData }).catch((err) => {
        console.log('Error save Data: ', err);
    });
    const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
    for (const data of result) {
        const id = (0, uuid_1.v5)(data.name, MY_NAMESPACE);
        try {
            // buscamos el error en base de datos
            // si no esta o nos da error lo creamos, en caso contrario no hacemos nada
            const savedData = await elkClient.get({ id: id, index: alarmIndex });
            console.log(savedData.body._source);
            const oldAlarm = savedData.body._source;
            if (oldAlarm.mailSent === true && data.state !== oldAlarm.status && data.hasAlarm) {
                const alarmData = {
                    date: new Date(),
                    value: data.value,
                    status: data.state,
                    mailSent: false,
                    updatedAt: new Date()
                };
                await elkClient.update({ index: alarmIndex, id: id, body: { doc: alarmData } }).catch((err) => {
                    console.log(err);
                });
            }
        }
        catch (error) {
            const documentData = {
                id: id,
                name: data.name,
                date: new Date(),
                value: data.value,
                status: data.state,
                mailSent: !data.hasAlarm,
                updatedAt: new Date()
            };
            await elkClient.index({ id: id, index: alarmIndex, body: documentData }).catch((err) => {
                console.log(err);
            });
        }
        console.log(id);
    }
};
exports.saveToElk = saveToElk;
