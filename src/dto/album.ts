import {Track} from "./track.ts";

export type Album = {
    name: string,
    musicianId:string,
    authorName: string,
    tracks: Track[],
    id: string,
    countOfTracks: number
}