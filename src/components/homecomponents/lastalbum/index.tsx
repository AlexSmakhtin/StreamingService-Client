import './style.css'
import React from "react";
import {Text} from "@chakra-ui/react";
import {Album} from "../../../dto/album.ts";
import AlbumCard from "../../albumcard";

interface Albums {
    albums: Album[] | null,
}

const LastListenedAlbums: React.FC<Albums> = ({albums}) => {
    return (
        <div className='lastListenedContainer'>
            <Text
                className='boxShadowContainer'
                fontSize='30px'
                backgroundColor='white'
                borderRadius='10px'
                border='1px solid ligthgray'>
                Recent albums
            </Text>
            <div className='musicCardsContainer'>
                {albums?.map((album, index) => (
                    <AlbumCard key={index} album={album}/>
                ))}
                {albums?.length == 0 ?
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

export default LastListenedAlbums