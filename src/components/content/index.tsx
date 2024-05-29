import React from "react";
import {routes} from "../../constants/routes.ts";
import Home from "../home";
import Musicians from "../musicians";
import Error from "../error/error.tsx";
import MusicianSoloCard from "../musiciansolocard";
import Settings from "../settings";
import TracksByMusician from "../tracksbymusician";
import AlbumsByMusician from "../albumsbymusician";
import Tracks from "../tracks";
import Playlists from "../playlists";

interface ContentProps {
    path: string
    error?: string
}

const Content: React.FC<ContentProps> = ({path, error}) => {

    switch (true) {
        case path === routes.home: {
            return (<Home/>)
        }
        case path === routes.settings: {
            return (<Settings/>)
        }
        case path === routes.playlists: {
            return (<Playlists/>)
        }
        case path === routes.tracks: {
            return (<Tracks/>)
        }
        case path === routes.musicians: {
            return (<Musicians/>)
        }
        case path.startsWith(routes.musicians) && path.endsWith("tracks"): {
            const splits = path.split('/');
            return <TracksByMusician routeId={splits[splits.length - 2]}/>
        }
        case path.startsWith(routes.musicians) && path.endsWith("albums"): {
            const splits = path.split('/');
            return <AlbumsByMusician routeId={splits[splits.length - 2]}/>
        }
        case path.startsWith(routes.musicians): {
            const splits = path.split('/');
            return (<MusicianSoloCard routeId={splits[splits.length - 1]}/>)
        }
        case path === routes.error: {
            return (<Error description={error ?? "Server is not responding"}/>)
        }
        default: {
            return (
                <Error description={error ?? "Server is not responding"}/>
            )
        }
    }
}

export default Content;