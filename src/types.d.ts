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

export type AlarmHit = {
    _index: string;
    _type: string;
    _id: string;
    _version: number;
    _score: null;
    _source: Alarm;
    sort: number[];
}

export type Alarm = {
    id: string;
    name: string;
    date: Date;
    value: number;
    status: string;
    mailSent: boolean;
    updatedAt: Date;
}
