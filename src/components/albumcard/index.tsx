import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {useHowler} from "../../services/HowlManager.tsx";
import {createTrackSourceUrl} from "../../constants/createTrackSourceUrl.ts";
import {changeCurrentPlaylist} from "../../store/playlistStore.ts";
import {Card, CardBody, IconButton, Text} from "@chakra-ui/react";
import {MdOutlinePause, MdOutlinePlayArrow} from "react-icons/md";
import {Album} from "../../dto/album.ts";
import './style.css'
import axios from "axios";
import {serverUrls} from "../../constants/serverUrl.ts";
import {changeMenuWindow} from "../../store/appStore.ts";
import {routes} from "../../constants/routes.ts";

interface AlbumInterface {
    album: Album,
}

const AlbumCard: React.FC<AlbumInterface> = ({album}) => {
    const {userId} = useAppSelector(state => state.user);
    const {currentPlaylist} = useAppSelector(state => state.playlist)
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
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    const handleMouseClick = () => {
        appDispatch(changeMenuWindow(routes.musicians + `/${album.musicianId}`));
    };
    const playBtnHandler = () => {
        if (currentPlaylist === album.tracks) {
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
            const newSrc = createTrackSourceUrl(album.tracks[0].id, userId!);
            changeSoundSrc(newSrc);
            setCurrentTrack(album.tracks[0]);
            changePlaying(true);
            appDispatch(changeCurrentPlaylist(album.tracks));
            axios.post(serverUrls.setLastListenedAlbum + `?albumId=${album.id}`)
                .then(_ => {
                    console.log("ok")
                })
                .catch(error => {
                    console.error(error);
                });
            return;
        }
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
                        <Text
                            fontSize='17px'
                            margin={0}>
                            {album.name}
                        </Text>
                        <Text
                            onClick={handleMouseClick}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className={isHovered ? "textSelect" : ""}
                            fontSize='15px'
                            margin={0}>
                            <i>{album.authorName} </i>
                        </Text>
                        <Text
                            fontSize='15px'
                            margin={0}>
                            {album.countOfTracks} tracks
                        </Text>
                    </div>
                    <div className='cardBodyButton'>
                        <IconButton
                            width='30px'
                            onClick={playBtnHandler}
                            isRound={true}
                            icon={currentPlaylist === album.tracks && getIsPlaying(getCurrentTrack()!.id) == true ?
                                <MdOutlinePause size='30'/> :
                                <MdOutlinePlayArrow size='30'/>}
                            aria-label='Play Btn'/>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default AlbumCard;