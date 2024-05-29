import {Track} from "../dto/track.ts";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios, {AxiosError, HttpStatusCode} from "axios";
import {serverUrls} from "../constants/serverUrl.ts";
import {Playlist} from "../dto/playlist.ts";
import {Album} from "../dto/album.ts";

const initialTracks: Track[] = [];
const initialPlaylists: Playlist[] = [];
const initialAlbums: Album[] = [];

const initialMode: "straight" | "cycle" | "random"
    = "straight";
const initialState = {
    mode: initialMode,
    currentPlaylist: initialTracks,
    lastListenedTracks: {
        tracks: initialTracks,
        isLoading: false,
    },
    lastListenedPlaylist: {
        playlists: initialPlaylists,
        isLoading: false,
    },
    lastListenedAlbums: {
        albums: initialAlbums,
        isLoading: false,
    }
};
export const modes = ["straight", "cycle", "random"];

const playlistSlice = createSlice({
    name: 'playlistSlice',
    initialState,
    reducers: {
        changeCurrentPlaylist(state, action: PayloadAction<Track[]>) {
            state.currentPlaylist = action.payload;
        },
        changeMode(state, action) {
            state.mode = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getLastListenedTracks.fulfilled, (state, action) => {
            state.lastListenedTracks.tracks = action.payload;
            state.lastListenedTracks.isLoading = false;
        });
        builder.addCase(getLastListenedTracks.rejected, (state, action) => {
            state.lastListenedTracks.tracks = [];
            state.lastListenedTracks.isLoading = false;
            console.error(action.payload);
        });
        builder.addCase(getLastListenedTracks.pending, (state, _action) => {
            state.lastListenedTracks.isLoading = true;
        });
        builder.addCase(getLastListenedPlaylists.fulfilled, (state, action) => {
            state.lastListenedPlaylist.playlists = action.payload;
            state.lastListenedPlaylist.isLoading = false;
        });
        builder.addCase(getLastListenedPlaylists.rejected, (state, action) => {
            state.lastListenedPlaylist.playlists = [];
            state.lastListenedPlaylist.isLoading = false;
            console.error(action.payload);
        });
        builder.addCase(getLastListenedPlaylists.pending, (state, _action) => {
            state.lastListenedPlaylist.isLoading = true;
        });
        builder.addCase(getLastListenedAlbums.fulfilled, (state, action) => {
            state.lastListenedAlbums.albums = action.payload;
            state.lastListenedAlbums.isLoading = false;
        });
        builder.addCase(getLastListenedAlbums.rejected, (state, action) => {
            state.lastListenedAlbums.albums = [];
            state.lastListenedAlbums.isLoading = false;
            console.error(action.payload);
        });
        builder.addCase(getLastListenedAlbums.pending, (state, _action) => {
            state.lastListenedAlbums.isLoading = true;
        });
    }
});

export const getLastListenedTracks = createAsyncThunk(
    "playlistSlice/getLastListenedTracks",
    async function (_, {rejectWithValue}) {
        try {
            const response =
                await axios.get(serverUrls.lastListened);
            if (response.status == HttpStatusCode.Ok) {
                return response.data;
            }
        } catch (error: AxiosError) {
            console.error(error);
            return rejectWithValue(error.message + ". " + error.response?.data)
        }
    }
);

export const getLastListenedPlaylists = createAsyncThunk(
    "playlistSlice/getLastListenedPlaylists",
    async function (_, {rejectWithValue}) {
        try {
            const response =
                await axios.get(serverUrls.lastListenedPlaylists);
            if (response.status == HttpStatusCode.Ok) {
                return response.data;
            }
        } catch (error: AxiosError) {
            console.error(error);
            return rejectWithValue(error.message + ". " + error.response?.data)
        }
    }
);

export const getLastListenedAlbums = createAsyncThunk(
    "playlistSlice/getLastListenedAlbums",
    async function (_, {rejectWithValue}) {
        try {
            const response =
                await axios.get(serverUrls.lastListenedAlbums);
            if (response.status == HttpStatusCode.Ok) {
                return response.data;
            }
        } catch (error: AxiosError) {
            console.error(error);
            return rejectWithValue(error.message + ". " + error.response?.data)
        }
    }
);

export const {
    changeCurrentPlaylist,
    changeMode
}
    = playlistSlice.actions;
export default playlistSlice.reducer;