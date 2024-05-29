import {Album} from "./album"

export type AlbumsByUser = {
    albums: Album[],
    totalPages: number
}