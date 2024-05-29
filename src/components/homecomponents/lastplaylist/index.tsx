import React from "react";
import {Text} from "@chakra-ui/react";
import {Playlist} from "../../../dto/playlist.ts";
import PlaylistCard from "../../playlistcard";
import './style.css'

interface Playlists {
    playlists: Playlist[] | null,
}

const LastListenedPlaylists: React.FC<Playlists> = ({playlists}) => {
    return (
        <div className='lastListenedContainer'>
            <Text
                className='boxShadowContainer'
                fontSize='30px'
                backgroundColor='white'
                borderRadius='10px'
                border='1px solid ligthgray'>
                Recent playlists
            </Text>
            <div className='musicCardsContainer'>
                {playlists?.map((playlist, index) => (
                    <PlaylistCard key={index} playlist={playlist}/>
                ))}
                {playlists?.length == 0 ?
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

export default LastListenedPlaylists