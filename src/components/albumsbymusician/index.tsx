import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {AlbumsByUser} from "../../dto/albumsByUser.ts";
import {serverUrls} from "../../constants/serverUrl.ts";
import axios from "axios";
import {IconButton, Text} from "@chakra-ui/react";
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from "react-icons/md";
import AlbumCard from "../albumcard";

interface AlumsProps {
    routeId?: string
}

const AlbumsByMusician: React.FC<AlumsProps> = ({routeId}) => {
    const id = useParams().id ?? routeId;
    const [albumsByUser, setAlbumsByUser] = useState<AlbumsByUser | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    useEffect(() => {
        axios.get<AlbumsByUser>(serverUrls.musicians + `/${id}/albums?pageNumber=${currentPage}`)
            .then(response => {
                if (response.data.totalPages == 0)
                    response.data.totalPages = 1
                setAlbumsByUser(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleMoveAction = (isMovePrev: boolean) => {
        if (isMovePrev)
            setCurrentPage(prevState => prevState - 1);
        else
            setCurrentPage(prevState => prevState + 1);
    };

    return (
        <div className='tracksContainer'>
            {albumsByUser?.albums.map((album, index) => {
                return <AlbumCard key={index} album={album}/>
            })}
            <div className='paginationBtnsContainer boxShadowContainer'>
                <IconButton
                    padding='5px'
                    isDisabled={currentPage === 1}
                    onClick={() => handleMoveAction(true)}
                    aria-label='prev'>
                    <MdKeyboardArrowLeft size='md'/>
                </IconButton>
                <Text
                    margin={"auto"}>{currentPage} of {albumsByUser?.totalPages}</Text>
                <IconButton padding='5px'
                            isDisabled={currentPage === albumsByUser?.totalPages}
                            onClick={() => handleMoveAction(false)}
                            aria-label='next'>
                    <MdKeyboardArrowRight size='md'/>
                </IconButton>
            </div>
        </div>
    )
}

export default AlbumsByMusician;