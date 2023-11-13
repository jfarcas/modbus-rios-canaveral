export type BoilerData = BoilerValue[]|[];

export type BoilerValue = {
    name: string;
    value: number;
}

export type CalderaValuesDescriptions = CalderaValueDescription[]|[]

export type CalderaValueDescription = {
    description: string;
    multiplier: number;
}

export type readParameters = {
    address: number;
    length: number;
    descriptions: CalderaValuesDescriptions;
}[]
