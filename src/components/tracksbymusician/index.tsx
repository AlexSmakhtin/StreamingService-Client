import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {serverUrls} from "../../constants/serverUrl.ts";
import MusicCard from "../musiccard";
import {changeCurrentPlaylist} from "../../store/playlistStore.ts";
import {useAppDispatch} from "../../store/store.ts";
import './style.css'
import {IconButton, Text} from "@chakra-ui/react";
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from "react-icons/md";
import {TracksByUser} from "../../dto/tracksByUser.ts";

interface TracksProps {
    routeId?: string
}

const TracksByMusician: React.FC<TracksProps> = ({routeId}) => {
    const id = useParams().id ?? routeId;
    const [tracksByUser, setTracksByUser] = useState<TracksByUser | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const appDispatch = useAppDispatch();
    useEffect(() => {
        axios.get<TracksByUser>(serverUrls.musicians + `/${id}/tracks?pageNumber=${currentPage}`)
            .then(response => {
                if (response.data.totalPages == 0)
                    response.data.totalPages = 1
                setTracksByUser(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const setPlaylist = () => {
        if (tracksByUser != null)
            appDispatch(changeCurrentPlaylist(tracksByUser.tracks));
    }

    const handleMoveAction = (isMovePrev: boolean) => {
        if (isMovePrev)
            setCurrentPage(prevState => prevState - 1);
        else
            setCurrentPage(prevState => prevState + 1);
    };
    return (
        <div className='tracksContainer'>
            {tracksByUser?.tracks.map((track, index) => {
                return <MusicCard track={track} key={index} musicianId={track.musicianId}
                                  changePlaylist={setPlaylist}/>
            })}
            <div className='paginationBtnsContainer boxShadowContainer'>
                <IconButton
                    padding='5px'
                    isDisabled={currentPage === 1}
                    onClick={() => handleMoveAction(true)}
                    aria-label='prev'>
                    <MdKeyboardArrowLeft size='md'/>
                </IconButton>
                <Text margin={"auto"}>{currentPage} of {tracksByUser?.totalPages}</Text>
                <IconButton padding='5px'
                            isDisabled={currentPage === tracksByUser?.totalPages}
                            onClick={() => handleMoveAction(false)}
                            aria-label='next'>
                    <MdKeyboardArrowRight size='md'/>
                </IconButton>
            </div>
        </div>
    )
}

export default TracksByMusician;