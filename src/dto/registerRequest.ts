export type RegisterRequest = {
    name: string,
    email: string,
    role: Roles,
    status: Statuses,
    birthday: Date,
    password: string
};

export enum Extensions {
    jpg = ".jpg",
    jpeg = ".jpeg",
    png = ".png",
    none = ""
}

export enum Roles {
    listener,
    musician
}

export enum Statuses {
    common,
    premium
}