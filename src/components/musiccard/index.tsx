import {
    Button,
    Card,
    CardBody,
    IconButton, Popover, PopoverContent, PopoverTrigger, Text, useDisclosure
} from "@chakra-ui/react";
import {Track} from "../../dto/track.ts";
import React, {useEffect, useState} from "react";
import {
    MdAdd,
    MdCheck,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdOutlinePause,
    MdOutlinePlayArrow
} from "react-icons/md";
import './style.css'
import {useHowler} from "../../services/HowlManager.tsx";
import {createTrackSourceUrl} from "../../constants/createTrackSourceUrl.ts";
import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {changeMenuWindow} from "../../store/appStore.ts";
import {routes} from "../../constants/routes.ts";
import {Playlist} from "../../dto/playlist.ts";
import axios from "axios";
import {GetPlaylistsResponse} from "../../dto/getPlaylistsResponse.ts";
import {serverUrls} from "../../constants/serverUrl.ts";

interface MusicCardInterface {
    musicianId: string,
    track: Track,
    changePlaylist: () => void
}

const MusicCard: React.FC<MusicCardInterface> = ({track, changePlaylist, musicianId}) => {
    const {userId} = useAppSelector(state => state.user);
    const {
        playSound,
        pauseSound,
        getIsPlaying,
        changePlaying,
        changeSoundSrc,
        setCurrentTrack
    } = useHowler();
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const appDispatch = useAppDispatch();
    const {onOpen, onClose} = useDisclosure();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [action, setAction] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const playBtnHandler = () => {
        const isPlaying = getIsPlaying(track.id);
        if (isPlaying == null) {
            const newSrc = createTrackSourceUrl(track.id, userId!);
            changeSoundSrc(newSrc);
            setCurrentTrack(track);
            changePlaying(true);
            changePlaylist();
            return;
        }
        if (isPlaying == true) {
            pauseSound();
            changePlaying(false);
        } else {
            playSound();
            changePlaying(true);
        }
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    const handleMouseClick = () => {
        appDispatch(changeMenuWindow(routes.musicians + `/${musicianId}`));
    };
    const AddToPlaylist = () => {
        if (isOpen == false) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    const GetPlaylists = async () => {
        try {
            const response = await axios.get<GetPlaylistsResponse>(serverUrls.playlists + `?pageNumber=${currentPage}`);
            setPlaylists(response.data.playlists)
            setTotalPages(response.data.totalPages === 0 ? 1 : response.data.totalPages)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        GetPlaylists().then();
    }, [currentPage, action]);

    const handleMoveAction = (isMovePrev: boolean) => {
        if (isMovePrev)
            setCurrentPage(prevState => prevState - 1);
        else
            setCurrentPage(prevState => prevState + 1);
    };

    const handleAddTrackToPlaylist = (playlistId: string, trackId: string) => {
        axios.post(serverUrls.addTrackToPlaylist + `?playlistId=${playlistId}&trackId=${trackId}`)
            .then(_response => {
                setAction(!action);
            })
            .catch(error => {
                console.log(error);
            });
    };


    return (
        <Card
            marginLeft='auto'
            marginRight='auto'
            width='stretch'
            textAlign='left'
            minWidth={'300px'}
        >
            <CardBody
                marginRight='10px'
                textAlign='left'
                paddingLeft='10px'
                paddingTop='2px'
                paddingBottom='2px'
                paddingRight='10px'
            >
                <div className='cardBodyContainer'>
                    <div>
                        <Text margin={0} textAlign={"left"} fontSize='17px'>
                            {track.name}
                        </Text>
                        <Text
                            onClick={handleMouseClick}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className={isHovered ? "textSelect" : ""}
                            margin={0}
                            fontSize='15px'>
                            <i>{track.authorName}</i>
                        </Text>
                    </div>
                    <div className='btnsContainer'>
                        <div className='cardBodyButton'>
                            <IconButton
                                width='30px'
                                onClick={playBtnHandler}
                                isRound={true}
                                icon={getIsPlaying(track.id) == true ? <MdOutlinePause size='30'/> :
                                    <MdOutlinePlayArrow size='30'/>}
                                aria-label='Play Btn'/>
                        </div>
                        <div className='cardBodyButton'>
                            <Popover
                                isOpen={isOpen}
                                onOpen={onOpen}
                                onClose={onClose}
                                placement='bottom'
                            >
                                <PopoverTrigger>
                                    <IconButton
                                        width='30px'
                                        onClick={AddToPlaylist}
                                        isRound={true}
                                        icon={<MdAdd/>}
                                        aria-label='Add Btn'/>
                                </PopoverTrigger>
                                <PopoverContent
                                    minHeight={(playlists.length * 40) + ((playlists.length - 1) * 5) + 80}
                                    padding='5px'
                                >
                                    <div className='addToPlaylistContainer'>
                                        {playlists.map((playlist, index) => {
                                            return (
                                                <Button
                                                    onClick={() => handleAddTrackToPlaylist(playlist.id, track.id)}
                                                    key={index}>
                                                    {playlist.name}
                                                    {playlist.tracks.find(e => e.id === track.id) ? <MdCheck/> : <></>}
                                                </Button>
                                            )
                                        })}
                                    </div>
                                    <div className='paginationBtnsContainer'>
                                        <IconButton
                                            size={'sm'}
                                            padding='5px'
                                            isDisabled={currentPage === 1}
                                            onClick={() => handleMoveAction(true)}
                                            aria-label='prev'>
                                            <MdKeyboardArrowLeft size='md'/>
                                        </IconButton>
                                        <Text margin={"auto"}>{currentPage} of {totalPages}</Text>
                                        <IconButton
                                            size={'sm'}
                                            padding='5px'
                                            isDisabled={currentPage === totalPages}
                                            onClick={() => handleMoveAction(false)}
                                            aria-label='next'>
                                            <MdKeyboardArrowRight size='md'/>
                                        </IconButton>
                                    </div>
                                </PopoverContent>
                            </Popover>

                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default MusicCard;
