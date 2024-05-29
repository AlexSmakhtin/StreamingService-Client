import './style.css'
import {Text} from "@chakra-ui/react";
import {Track} from "../../../dto/track.ts";
import React from "react";
import MusicCard from "../../musiccard";
import {useAppDispatch, useAppSelector} from "../../../store/store.ts";
import {changeCurrentPlaylist} from "../../../store/playlistStore.ts";

interface Tracks {
    tracks: Track[] | null,
}

const LastListenedTracks: React.FC<Tracks> = ({tracks}) => {
    const {lastListenedTracks} = useAppSelector(state => state.playlist);
    const appDispatch = useAppDispatch();

    const setPlaylist = () => {
        appDispatch(changeCurrentPlaylist(lastListenedTracks.tracks));
    }

    return (
        <div className='lastListenedContainer'>
            <Text
                className='boxShadowContainer'
                fontSize='30px'
                backgroundColor='white'
                borderRadius='10px'
                border='1px solid ligthgray'>
                Recent music
            </Text>
            <div className='musicCardsContainer'>
                {tracks?.map((track, index) => (
                    <MusicCard key={index} track={track} musicianId={track.musicianId} changePlaylist={setPlaylist}/>
                ))}
                {tracks?.length == 0 ?
                    <Text
                        className='boxShadowContainer'
                        fontSize='20px'
                        backgroundColor='white'
                        borderRadius='10px'
                        border='1px solid ligthgray'>
                        There's nothing here yet
                    </Text>
                    : <></>}
            </div>
        </div>
    )
};

export default LastListenedTracks