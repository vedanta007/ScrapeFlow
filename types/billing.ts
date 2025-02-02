export enum PackId {
    SMALL = 'SMALL',
    MEDIUM = 'MEDIUM',
    LARGE = 'LARGE',
}

export type CreditsPack = {
    id: PackId
    label: string
    name: string
    credits: number
    price: number
    priceId: string
}

export const creditsPacks: CreditsPack[] = [
    {
        id: PackId.SMALL,
        label: '1000 Credits',
        name: 'Small Pack',
        credits: 1000,
        price: 9900, //99.00
        priceId: process.env.STRIPE_PRICE_ID_SMALL!,
    },
    {
        id: PackId.MEDIUM,
        label: '5000 Credits',
        name: 'Medium Pack',
        credits: 5000,
        price: 39900, //399.00
        priceId: process.env.STRIPE_PRICE_ID_MEDIUM!,
    },
    {
        id: PackId.LARGE,
        label: '10000 Credits',
        name: 'Large Pack',
        credits: 10000,
        price: 69900, //699.00
        priceId: process.env.STRIPE_PRICE_ID_LARGE!,
    },
]

export const getCreditsPack = (id: PackId) => creditsPacks.find(pack => pack.id === id)