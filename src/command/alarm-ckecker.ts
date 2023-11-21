
import {ApiResponse, Client} from "@elastic/elasticsearch";
import {config} from 'dotenv';
import * as  nodemailer from 'nodemailer';
import {Alarm, AlarmHit} from "../types";
config( {path: __dirname + '/../../.env'});



const elkUrl: string = process.env.ELK_URL ? process.env.ELK_URL : 'http://localhost';
const elkPort: number = process.env.ELK_PORT ? parseInt(process.env.ELK_PORT, 10) : 9200;
const mailServer: string = process.env.MAIL_SERVER ? process.env.MAIL_SERVER : 'localhost';
const mailPort: number = parseInt(process.env.MAIL_PORT ?? '587', 10) ;
const mailUser: string = process.env.MAIL_USER ? process.env.MAIL_USER : 'localhost';
const mailPassword: string = process.env.MAIL_PASSWORD ? process.env.MAIL_PASSWORD : 'localhost';
const mailFrom: string = process.env.MAIL_FROM ? process.env.MAIL_FROM : 'localhost@localhost';
const mailTo: string = process.env.MAIL_TO ? process.env.MAIL_TO : 'localhost@localhost';
const mailCc: string = process.env.MAIL_CC ? process.env.MAIL_CC : 'localhost@localhost';

const alarmIndex: string = 'canaveral-error-data';


const elkClient = new Client({
    node: elkUrl + ':' + elkPort,
})

const checkAlarm = async () => {
    const data:ApiResponse = await elkClient.search({
        index: alarmIndex,
        body: {
            query: {
                match: {
                    mailSent: false
                }
            }
        }
    })

    const alarms:AlarmHit[] = data.body.hits.hits;
    // console.log(alarms)
    // console.log(data.body)
    let messageBody:string = '';
//     despues de leer los datos de la base de datos preparamos el correo y por cada alarma actualizamos el campo mailSent a true
    if (alarms.length > 0) {
        messageBody = '<h1> 🔥 Alarmas Cañaveral 🔥</h1> <ul>';

        for (const alarm of alarms) {
            const alarmData:Alarm = alarm['_source'];
            console.log(alarmData)
            messageBody += '<li>Alarma: ' + alarmData.name + '<ul><li> Valor: ' + alarmData.value + '</li><li> Estado: ' + alarmData.status + '</li></ul></li>';
            console.log(messageBody)
            alarmData.mailSent = true;
            alarmData.updatedAt = new Date();

            try {
                await elkClient.update({ index: alarmIndex, id: alarm._id, body: {doc: alarmData}}).catch((err: any) => {
                    console.log(err)
                })
            } catch (error) {
                console.log(error)
            }

        }

        let transporter = nodemailer.createTransport({
            host: mailServer, // Use your email service
            port: mailPort,
            auth: {
                user: mailUser, // Your email address
                pass: mailPassword, // Your password
            }
        });
        // // Set email options
        const mailOptions = {
            from: mailFrom, // Sender
            to: mailTo, // Recipient
            cc: mailCc,
            subject: '🔥 Alarma Cañaveral', // Email subject
            html: messageBody, // Email HTML content
            headers: {
                'priority': 'high'
            },
        };

// Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email sending failed:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

}

checkAlarm().then(() => {
    console.log('done')
});
