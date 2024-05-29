export type Subscription = {
    name: string,
    expireDate: Date
}

export type SubscriptionToBuy = {
    id: string,
    name: string,
    duration: Date,
    cost: number
}
