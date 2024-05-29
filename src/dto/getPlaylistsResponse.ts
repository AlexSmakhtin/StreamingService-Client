import {Playlist} from "./playlist.ts";

export type GetPlaylistsResponse = {
    playlists: Playlist[],
    totalPages: number
}