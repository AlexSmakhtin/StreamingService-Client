import {Playlist} from "../../dto/playlist.ts";
import React, {ChangeEvent, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {useHowler} from "../../services/HowlManager.tsx";
import {createTrackSourceUrl} from "../../constants/createTrackSourceUrl.ts";
import {
    Card,
    CardBody,
    IconButton,
    Popover, PopoverArrow,
    PopoverContent,
    PopoverTrigger,
    Text,
    Textarea,
    useDisclosure
} from "@chakra-ui/react";
import {MdBlock, MdDelete, MdDone, MdModeEdit, MdOutlinePause, MdOutlinePlayArrow} from "react-icons/md";
import './style.css'
import {changeCurrentPlaylist} from "../../store/playlistStore.ts";
import {serverUrls} from "../../constants/serverUrl.ts";
import axios from "axios";

interface PlaylistInterface {
    playlist: Playlist,
    onEffect: () => void
}

const PlaylistCard: React.FC<PlaylistInterface> = ({playlist, onEffect}) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [tracksToDelete, setTracksToDelete] = useState<string[]>([])
    const [name, setName] = useState<string>(playlist.name);
    const {userId} = useAppSelector(state => state.user);
    const {currentPlaylist} = useAppSelector(state => state.playlist);
    const {onOpen, onClose} = useDisclosure();
    const appDispatch = useAppDispatch();
    const {
        playSound,
        pauseSound,
        getIsPlaying,
        changePlaying,
        changeSoundSrc,
        setCurrentTrack,
        getCurrentTrack
    } = useHowler();
    /*доделать кнопки добавления трека в плейлист на MusicCard и сделать удаление из плйлиста id Track
     которые добавятся по нажатию на del в tracksIdToDel проверить все сделать презу и мапануть на ноут
     */
    const playBtnHandler = () => {
        if (currentPlaylist === playlist.tracks) {
            const track = getCurrentTrack();
            if (track != null) {
                const isPlaying = getIsPlaying(track.id);
                if (isPlaying != null) {
                    if (isPlaying == true) {
                        pauseSound();
                        changePlaying(false);
                    } else {
                        playSound();
                        changePlaying(true);
                    }
                }
            }
        } else {
            const newSrc = createTrackSourceUrl(playlist.tracks[0].id, userId!);
            changeSoundSrc(newSrc);
            setCurrentTrack(playlist.tracks[0]);
            changePlaying(true);
            appDispatch(changeCurrentPlaylist(playlist.tracks));
            axios.post(serverUrls.setLastListenedPlaylist + `?playlistId=${playlist.id}`)
                .then(_ => {
                    console.log("ok")
                })
                .catch(error => {
                    console.error(error);
                });
            return;
        }
    };

    const handleDeletePlaylist = () => {
        axios.post(serverUrls.deletePlaylist + `?playlistId=${playlist.id}`)
            .then(_response => {
                onEffect();
            })
            .catch(error => {
                console.log(error)
            });
    };
    const handleEditPlaylist = () => {
        if (isEdit === true) {
            axios.post(serverUrls.playlistUpdate + `?playlistId=${playlist.id}`,
                {name: name, trackIds: tracksToDelete})
                .then(_response => {
                    onEffect();
                })
                .catch(error => {
                    setName(playlist.name)
                    console.log(error);
                });
            setIsEdit(false)
            return;
        }
        setIsEdit(true);
    };
    const handleNameChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target.value;
        setName(input);
    };
    const handleCancel = () => {
        setName(playlist.name);
        setTracksToDelete([]);
        setIsEdit(false)
    };

    const handleAddToDeleteTrack = (id: string) => {
        setTracksToDelete(prevState => {
            return [...prevState, id];
        })
    };

    return (
        <Card
            paddingLeft='6px'
            paddingTop='6px'
            paddingBottom='6px'
            marginLeft='auto'
            marginRight='auto'
            width='stretch'
            textAlign='left'
            minWidth={'300px'}
        >
            <Popover isOpen={isEdit}
                     onOpen={onOpen}
                     onClose={onClose}
                     placement='bottom'
            >
                <PopoverTrigger>


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
                                {isEdit ?
                                    <Textarea
                                        onChange={handleNameChange}
                                        value={name}
                                        width={'130px'}
                                        padding={0}
                                        textAlign={'center'}
                                        fontSize='17px'
                                        margin={0}>
                                    </Textarea> :
                                    <Text
                                        fontSize='17px'
                                        margin={0}>
                                        {playlist.name}
                                    </Text>}

                                <Text
                                    fontSize='15px'
                                    margin={0}>
                                    {playlist.countOfTracks} tracks
                                </Text>
                            </div>
                            <div className='btnsContainer'>
                                <div className='cardBodyButton'>
                                    <IconButton
                                        width='30px'
                                        onClick={playBtnHandler}
                                        isRound={true}
                                        icon={currentPlaylist === playlist.tracks && getIsPlaying(getCurrentTrack()!.id) == true ?
                                            <MdOutlinePause size='30'/> :
                                            <MdOutlinePlayArrow size='30'/>}
                                        aria-label='Play Btn'/>

                                </div>
                                <div className='cardBodyButton'>
                                    <IconButton
                                        width='30px'
                                        onClick={handleDeletePlaylist}
                                        isRound={true}
                                        icon={<MdDelete/>}
                                        aria-label='Delete Btn'/>
                                </div>
                                <div className='cardBodyButton'>
                                    <IconButton
                                        width='30px'
                                        onClick={handleEditPlaylist}
                                        isRound={true}
                                        icon={isEdit ? <MdDone/>
                                            : <MdModeEdit/>}
                                        aria-label='Edit Btn'/>
                                    {isEdit ?
                                        <IconButton
                                            width='30px'
                                            onClick={handleCancel}
                                            isRound={true}
                                            icon={<MdBlock/>}
                                            aria-label='Block Btn'/> : <></>}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </PopoverTrigger>
                {playlist.tracks.length > 0 ?
                    <PopoverContent>
                        <PopoverArrow/>
                        <div>
                            {playlist.tracks.map((track, index) => {
                                return (
                                    <div key={index} className='playlistTracksContainer'>
                                        <Text
                                            textDecoration={tracksToDelete.find((id) => id === track.id) == null ? '' : 'line-through'}
                                            margin={"auto"}
                                        >
                                            {track.name}
                                        </Text>
                                        <IconButton
                                            onClick={() => handleAddToDeleteTrack(track.id)}
                                            aria-label={"Del tracks"}
                                            icon={<MdDelete/>}
                                        />
                                    </div>)
                            })}
                        </div>
                    </PopoverContent> : <></>}
            </Popover>
        </Card>
    );
};

export default PlaylistCard;