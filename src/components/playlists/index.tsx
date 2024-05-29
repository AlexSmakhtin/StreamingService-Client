import {Button, IconButton, Skeleton, Text} from "@chakra-ui/react";
import {MdAdd, MdKeyboardArrowLeft, MdKeyboardArrowRight} from "react-icons/md";
import {useEffect, useState} from "react";
import {Playlist} from "../../dto/playlist.ts";
import axios from "axios";
import {serverUrls} from "../../constants/serverUrl.ts";
import {GetPlaylistsResponse} from "../../dto/getPlaylistsResponse.ts";
import PlaylistCard from "../playlistcard";
import './style.css'

const Playlists = () => {
    const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [effect, setEffect] = useState<boolean>(false);
    const handleAddPlaylist = () => {
        axios.post(serverUrls.createPlaylist)
            .then(_response => {
                getPlaylists(1);
                setCurrentPage(1);
            })
            .catch(error => {
                console.log(error)
            });
    };
    const getPlaylists = (currentPage: number) => {
        setIsLoaded(false)
        axios.get<GetPlaylistsResponse>(serverUrls.playlists + `?pageNumber=${currentPage}`)
            .then(response => {
                setPlaylists(response.data.playlists)
                setTotalPages(response.data.totalPages === 0 ? 1 : response.data.totalPages)
                setIsLoaded(true)
            })
            .catch(error => {
                console.log(error);
            })
    }
    const handleMoveAction = (isMovePrev: boolean) => {
        if (isMovePrev)
            setCurrentPage(prevState => prevState - 1);
        else
            setCurrentPage(prevState => prevState + 1);
    };

    useEffect(() => {
        getPlaylists(currentPage);
    }, [currentPage, effect]);

    const effectAction = () => {
        setEffect(!effect);
    }

    return (
        <div className='playlistsContainer'>
            <Button
                className='boxShadowContainer'
                onClick={handleAddPlaylist}
            >
                Create playlist <MdAdd/>
            </Button>
            <Skeleton startColor='black' endColor='white' borderRadius='10px' isLoaded={isLoaded}>
                <div className='musiciansCardsContainer'>
                    {playlists?.map((playlist, index) => {
                        return <PlaylistCard playlist={playlist} key={index} onEffect={effectAction}/>
                    })}
                </div>
            </Skeleton>

            <div className='paginationBtnsContainer boxShadowContainer'>
                <IconButton
                    padding='5px'
                    isDisabled={currentPage === 1}
                    onClick={() => handleMoveAction(true)}
                    aria-label='prev'>
                    <MdKeyboardArrowLeft size='md'/>

                </IconButton>
                <Text margin={"auto"}>{currentPage} of {totalPages}</Text>
                <IconButton padding='5px'
                            isDisabled={currentPage === totalPages}
                            onClick={() => handleMoveAction(false)}
                            aria-label='next'>
                    <MdKeyboardArrowRight size='md'/>
                </IconButton>
            </div>
        </div>
    )
}

export default Playlists;