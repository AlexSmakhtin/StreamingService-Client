import {Musician} from "./musician.ts";

export type GetMusiciansResponse = {
    musicians: Musician[],
    totalPages: number
}