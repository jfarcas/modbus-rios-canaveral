import {ReadParameters} from "../types";

const boilerOperationMode: { [id: number]: string } = {
    0: 'Carga permanente',
    1: 'Múltiples sensores en el funcionamiento del acumulador',
    2: 'Funcionamiento del acumulador',
    3: 'Cascada',
    4: 'Modo de quemador',
    5: 'Pot. externa',
    6: 'Prueba de potencia',
    20: 'Funcionamiento automático',
    21: 'Agua caliente sanitaria',
    22: 'Calefac extra',
    23: 'Deshollinador',
    80: 'Fallo',
    90: 'Resolución de problemas',
    99: 'Apagada'
}
const boilerState: { [id: number]: string } = {
    0: 'Fallo',
    1: 'Off',
    2: 'Preparación',
    3: 'Llenar sinfín de alimentación',
    4: 'Alcance de temperatura',
    5: 'Calentar',
    6: 'Parar - Vaciar sinfín de alimentación',
    7: 'Inercia ventilador',
    8: 'Mantenimiento de llama',
    9: 'Fase precalentamiento',
    10: 'Encendido',
    11: 'Fallo encendido',
    12: 'Encendido adicional',
    13: 'Limpieza',
    14: 'Cerrar parrilla',
    15: 'Listo para el funcionamiento',
    16: 'Inercia RCH',
    17: 'Enfriamiento cubierta',
    18: 'Limpieza RCH',
    19: 'Mantenimiento llama enfriamiento cubierta',
    20: 'Preparar enfriamiento de la cubierta',
    21: 'Finalizar enfriamiento cubierta',
    22: 'Preparar modo de caldeo',
    23: 'Modo de caldeo',
    24: 'Ventilar caldera',
    30: 'Quemador giratorio listo',
    31: 'Quemador giratorio activo',
};

export const readParameters: ReadParameters = [
    {
        clientId: 1,
        readType: 'readInputRegisters',
        address: 13,
        length: 10,
        descriptions: [
            {
                description: 'Depresión Caldera 1',
                multiplier: 1,
                hasAlarm: (value: number) => {return value > 100000},
                state: (value: number):string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            },
            {
                description: 'Consigna Temperatura caldera 1',
                multiplier: 1,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number):string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            },
            {
                description: 'Consigna Potencia caldera 1',
                multiplier: 1,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number):string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            },
            {
                description: 'Consigna Oxigeno residual caldera 1',
                multiplier: 10,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number):string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            },
            {
                description: 'Consigna retorno caldera 1',
                multiplier: 10,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number):string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            },
            {
                description: 'Consigna depresión caldera 1',
                multiplier: 1,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number):string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            },
            {
                description: 'Estado caldera 1',
                multiplier: 1,
                hasAlarm: (value: number) => {
                    console.log(value);
                    return value === 0 || value === 11;
                },
                state: (value: number):string  => boilerState[value],
                showOnScreen: true,
            },
            {
                description: 'Modo operativo caldera 1',
                multiplier: 1,
                hasAlarm: (value: number) => {return value === 80},
                state: (value: number): string => boilerOperationMode[value],
                showOnScreen: true,
            },
            {
                description: 'Arranque caldera 1',
                multiplier: 1,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            },
            {
                description: 'Función de la caldera 1',
                multiplier: 1,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {
                    return value === 0 ? 'Caldera Apagada' : 'Caldera Encendida';
                },
                showOnScreen: true,
            }
        ]
    },
    {
        clientId: 1,
        readType: 'readInputRegisters',
        address: 0,
        length: 3,
        descriptions: [
            {
                description: 'Temperatura caldera 1',
                multiplier: 10,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: true,
            },
            {
                description: 'Temperatura humos Calera 1',
                multiplier: 1,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            },
            {
                description: 'Oxigeno Residual Calera 1',
                multiplier: 10,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            }
        ]
    },
    {
        clientId: 2,
        readType: 'readInputRegisters',
        address: 13,
        length: 10,
        descriptions: [
            {
                description: 'Depresión Caldera 2',
                multiplier: 1,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            },
            {
                description: 'Consigna Temperatura caldera 2',
                multiplier: 1,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            },
            {
                description: 'Consigna Potencia caldera 2',
                multiplier: 1,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            },
            {
                description: 'Consigna Oxigeno residual caldera 2',
                multiplier: 10,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            },
            {
                description: 'Consigna retorno caldera 2',
                multiplier: 10,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            },
            {
                description: 'Consigna depresión caldera 2',
                multiplier: 1,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            },
            {
                description: 'Estado caldera 2',
                multiplier: 1,
                hasAlarm: (value: number) => {
                    console.log(value);
                    return value === 0 || value === 11;
                },
                state: (value: number): string => boilerState[value],
                showOnScreen: true,
            },
            {
                description: 'Modo operativo caldera 2',
                multiplier: 1,
                hasAlarm: (value: number) => {return value === 80},
                state: (value: number): string => boilerOperationMode[value],
                showOnScreen: true,
            },
            {
                description: 'Arranque caldera 2',
                multiplier: 1,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            },
            {
                description: 'Función de la caldera 2',
                multiplier: 1,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {
                    return value === 0 ? 'Caldera Apagada' : 'Caldera Encendida';
                },
                showOnScreen: true,
            }
        ]
    },
    {
        clientId: 2,
        readType: 'readInputRegisters',
        address: 0,
        length: 3,
        descriptions: [
            {
                description: 'Temperatura caldera 2',
                multiplier: 10,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: true,
            },
            {
                description: 'Temperatura humos Calera 2',
                multiplier: 1,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            },
            {
                description: 'Oxigeno Residual Calera 2',
                multiplier: 10,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            }
        ]
    },
    {
        clientId: 1,
        readType: 'readInputRegisters',
        address: 1030,
        length: 2,
        descriptions: [
            {
                description: 'Impulsion Calefacción circuito 1',
                multiplier: 10,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: true,
            },
            {
                description: 'Consigna Impulsion Calefacción circuito 1',
                multiplier: 10,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            }
        ]
    },
    {
        clientId: 1,
        readType: 'readInputRegisters',
        address: 1060,
        length: 2,
        descriptions: [
            {
                description: 'Impulsion Calefacción circuito 2',
                multiplier: 10,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: true,
            },
            {
                description: 'Consigna Impulsion Calefacción circuito 2',
                multiplier: 10,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            }
        ]
    },
    {
        clientId: 1,
        readType: 'readInputRegisters',
        address: 1090,
        length: 2,
        descriptions: [
            {
                description: 'Impulsion Calefacción circuito 3',
                multiplier: 10,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: true,
            },
            {
                description: 'Consigna Impulsion Calefacción circuito 3',
                multiplier: 10,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 100000 ? 'Error' : 'Ok'},
                showOnScreen: false,
            }
        ]
    },
    {
        clientId: 1,
        readType: 'readInputRegisters',
        address: 1630,
        length: 2,
        descriptions: [
            {
                description: 'Temperatura ACS',
                multiplier: 1,
                hasAlarm: (value: number) => {return value < 50},
                state: (value: number): string => {return value < 50 ? 'Error' : 'Ok'},
                showOnScreen: true,
            },
            {
                description: 'Consigna ACS',
                multiplier: 1,
                hasAlarm: (value: number) => {return value > 10000},
                state: (value: number): string => {return value > 10000 ? 'Error' : 'Ok'},
                showOnScreen: true,
            }
        ]
    },
    {
        clientId: 1,
        readType: 'readInputRegisters',
        address: 2009,
        length: 4,
        descriptions: [
            {
                description: 'Inercia Sonda 1',
                multiplier: 10,
                hasAlarm: (value: number) => {return value < 55},
                state: (value: number): string => { return value < 55 ? 'Temperatura Baja' : 'Ok'},
                showOnScreen: true,
            },
            {
                description: 'Inercia Sonda 2',
                multiplier: 10,
                hasAlarm: (value: number) => {return value < 55},
                state: (value: number): string => { return value < 55 ? 'Temperatura Baja' : 'Ok'},
                showOnScreen: true,
            },
            {
                description: 'Inercia Sonda 3',
                multiplier: 10,
                hasAlarm: (value: number) => {return value < 55},
                state: (value: number): string => { return value < 55 ? 'Temperatura Baja' : 'Ok'},
                showOnScreen: true,
            },
            {
                description: 'Inercia Sonda 4',
                multiplier: 10,
                hasAlarm: (value: number) => {return value < 55},
                state: (value: number): string => { return value < 55 ? 'Temperatura Baja' : 'Ok'},
                showOnScreen: true,
            },
        ]
    }
];
