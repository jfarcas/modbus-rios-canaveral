export type BoilerData = BoilerValue[]|[];

export type BoilerValue = {
    name: string;
    value: string;
    hasAlarm: boolean;
    state: string;
    showOnScreen: boolean;
}

export type CalderaValuesDescriptions = CalderaValueDescription[]|[]

export type CalderaValueDescription = {
    description: string;
    multiplier: number;
    hasAlarm: (value: number) => boolean;
    state: (value: number) => string;
    showOnScreen: boolean;
}

export type ReadParameters = {
    clientId: number;
    readType: string;
    address: number;
    length: number;
    descriptions: CalderaValuesDescriptions;
}[]
