import './style.css'
import LastListenedTracks from "../homecomponents/lastlistened";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {
    getLastListenedAlbums,
    getLastListenedPlaylists,
    getLastListenedTracks
} from "../../store/playlistStore.ts";
import LastListenedAlbums from "../homecomponents/lastalbum";
import LastListenedPlaylists from "../homecomponents/lastplaylist";
import {Skeleton} from "@chakra-ui/react";

const Home = () => {
    const appDispatch = useAppDispatch();
    const {
        lastListenedTracks,
        lastListenedAlbums,
        lastListenedPlaylist
    } = useAppSelector(state => state.playlist);

    useEffect(() => {
        appDispatch(getLastListenedTracks());
        appDispatch(getLastListenedAlbums());
        appDispatch(getLastListenedPlaylists());
    }, []);

    return (
        <div className='homeContainer'>

            <Skeleton startColor='black' endColor='white' borderRadius='10px'
                      isLoaded={!lastListenedTracks.isLoading}>
                <LastListenedTracks tracks={lastListenedTracks.tracks}/>
            </Skeleton>
            <Skeleton startColor='black' endColor='white' borderRadius='10px'
                      isLoaded={!lastListenedAlbums.isLoading}>
                <LastListenedAlbums albums={lastListenedAlbums.albums}/>
            </Skeleton>
            <Skeleton startColor='black' endColor='white' borderRadius='10px'
                      isLoaded={!lastListenedPlaylist.isLoading}>
                <LastListenedPlaylists playlists={lastListenedPlaylist.playlists}/>
            </Skeleton>
        </div>
    )
};

export default Home;