export const readParameters = [
    {
        address: 13,
        length: 4,
        descriptions: [
            {
                description: 'Depresión',
                multiplier: 1
            },
            {
                description: 'Consigna Temperatura caldera',
                multiplier: 1
            },
            {
                description: 'Consigna Potencia caldera',
                multiplier: 1
            },
            {
                description: 'Consigna Oxigeno residual caldera',
                multiplier: 10
            }
        ]
    },
    {
        address: 0,
        length: 3,
        descriptions: [
            {
                description: 'Temperatura caldera 1',
                multiplier: 10
            },
            {
                description: 'Temperatura humos Calera 1',
                multiplier: 1
            },
            {
                description: 'Oxigeno Residual Calera 1',
                multiplier: 10
            }
        ]
    },
    {
        address: 1030,
        length: 2,
        descriptions: [
            {
                description: 'Impulsion Calefacción circuito 1',
                multiplier: 10
            },
            {
                description: 'Consigna Impulsion Calefacción circuito 1',
                multiplier: 10
            }
        ]
    },
    {
        address: 1060,
        length: 2,
        descriptions: [
            {
                description: 'Impulsion Calefacción circuito 2',
                multiplier: 10
            },
            {
                description: 'Consigna Impulsion Calefacción circuito 2',
                multiplier: 10
            }
        ]
    },
    {
        address: 1090,
        length: 2,
        descriptions: [
            {
                description: 'Impulsion Calefacción circuito 3',
                multiplier: 10
            },
            {
                description: 'Consigna Impulsion Calefacción circuito 3',
                multiplier: 10
            }
        ]
    },
    {
        address: 1630,
        length: 2,
        descriptions: [
            {
                description: 'Temperatura ACS',
                multiplier: 1
            },
            {
                description: 'Consigna ACS',
                multiplier: 1
            }
        ]
    }
];
