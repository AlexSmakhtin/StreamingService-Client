import {Track} from "./track.ts";

export type Playlist={
    name:string,
    tracks: Track[],
    id: string,
    countOfTracks: number
}