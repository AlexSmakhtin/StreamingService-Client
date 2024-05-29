import './style.css'
import {
    Button,
    IconButton,
    Popover, PopoverContent,
    PopoverTrigger,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Text
} from "@chakra-ui/react";
import React, {useState} from "react";
import {setNextTrack, useHowler} from "../../services/HowlManager.tsx";
import {
    MdDehaze,
    MdLoop,
    MdNavigateBefore,
    MdNavigateNext,
    MdOutlineEast,
    MdOutlinePause,
    MdOutlinePlayArrow,
    MdOutlineShuffle,
    MdOutlineVolumeOff,
    MdOutlineVolumeUp
} from "react-icons/md";
import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {changeMode, modes} from "../../store/playlistStore.ts";
import {createTrackSourceUrl} from "../../constants/createTrackSourceUrl.ts";
import MusicCard from "../musiccard";

const Player = () => {
    const {
        getCurrentTime,
        getCurrentTrack,
        getIsPlaying,
        pauseSound,
        playSound,
        changePlaying,
        getVolume,
        changePosition,
        changeVolume,
        changeSoundSrc,
        setCurrentTrack,
        changeKey,
        getKey
    } = useHowler();
    const [isDrag, setDrag] = useState<boolean>(false);
    const {currentPlaylist, mode} = useAppSelector(state => state.playlist);
    const {userId} = useAppSelector(state => state.user);
    const appDispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleChangeTrackPositionStart = () => {
        if (isDrag == false) {
            setDrag(true);
        }
    };
    const handleChangeTrackPositionEnd = (value: number) => {
        changePosition(value);
        setTimeout(() => setDrag(false), 1100);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
        return `${minutes}:${formattedSeconds}`;
    }

    const playBtnHandler = () => {
        const track = getCurrentTrack();
        if (track != null) {
            if (getIsPlaying(track.id) == true) {
                pauseSound();
                changePlaying(false);
            } else {
                playSound();
                changePlaying(true);
            }
        }
    };

    const handleChangePlayerMode = () => {
        const index = modes.findIndex((value) => value === mode);
        const newMode = modes[index + 1];
        if (newMode != undefined) {
            appDispatch(changeMode(newMode as "straight" | "cycle" | "random"));
        } else {
            appDispatch(changeMode(modes[0] as "straight" | "cycle" | "random"));
        }
    };
    const handleVolumeChange = (value: number) => {
        changeVolume(value);
    };
    const handlePreviousTrack = () => {
        const track = getCurrentTrack();
        if (track != null) {
            const index = currentPlaylist.findIndex((value) => value.id === track.id) - 1;
            const newTrack = currentPlaylist[index];
            if (newTrack == undefined) {
                const lastTrack = currentPlaylist[currentPlaylist.length - 1];
                const newSrc = createTrackSourceUrl(lastTrack.id, userId!);
                changeSoundSrc(newSrc);
                setCurrentTrack(lastTrack);
            } else {
                const newSrc = createTrackSourceUrl(newTrack.id, userId!);
                changeSoundSrc(newSrc);
                setCurrentTrack(newTrack);
            }
            changePlaying(true);
        }
    };
    const handleNextTrack = () => {
        setNextTrack(
            getCurrentTrack,
            mode,
            currentPlaylist,
            changeSoundSrc,
            setCurrentTrack,
            changePlaying,
            changeKey,
            getKey(),
            userId!);
    };
    const handleOpenCurrentPlaylist = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className={`currentPlaylistContainer ${!isOpen ? 'open' : ''}`}>
                <Button
                    onClick={handleOpenCurrentPlaylist}
                    isDisabled={currentPlaylist === null || currentPlaylist.length == 0}
                    textAlign='center'
                >
                    <MdDehaze/>
                </Button>
                {currentPlaylist.map((track, index) => (
                    <MusicCard musicianId={track.musicianId} key={index} track={track} changePlaylist={() => {
                    }}/>
                ))}
            </div>
            <div className='playerContainer'>
                <div className='sliderPlayerContainer'>
                    <Text
                        marginBottom='0px'
                        marginRight='20px'
                        fontSize='15px'>
                        {formatTime(getCurrentTime())}
                    </Text>

                    <Slider
                        focusThumbOnChange={false}
                        onChange={handleChangeTrackPositionStart}
                        onChangeEnd={handleChangeTrackPositionEnd}
                        max={getCurrentTrack()?.totalSeconds}
                        value={!isDrag ? getCurrentTime() : undefined}
                        colorScheme='gray'
                    >
                        <SliderTrack>
                            <SliderFilledTrack/>
                        </SliderTrack>
                        <SliderThumb border='1px solid ligthgray'/>
                    </Slider>
                    <Text
                        marginBottom='0px'
                        marginLeft='20px'
                        fontSize='15px'>
                        {formatTime(getCurrentTrack()?.totalSeconds ?? 0)}
                    </Text>
                </div>
                <div className='playerAuthorTrack'>
                    <Text
                        padding='0px'
                        marginBottom='5px'
                        style={{fontFamily: 'RobotoSlab'}}
                    >
                        {getCurrentTrack()?.authorName} - {getCurrentTrack()?.name}
                    </Text>
                </div>
                <div className='playerBtnsContainer'>
                    <IconButton
                        onClick={handleChangePlayerMode}
                        isRound={true}
                        aria-label='volume'
                        icon={
                            mode === modes[1] ? <MdLoop size='30'/>
                                :
                                mode === modes[0] ? <MdOutlineEast size='30'/>
                                    :
                                    <MdOutlineShuffle size='30'/>}/>
                    <IconButton
                        onClick={handlePreviousTrack}
                        isRound={true}
                        aria-label="previous"
                        icon={<MdNavigateBefore size='30'/>}/>
                    <IconButton
                        onClick={playBtnHandler}
                        isRound={true}
                        aria-label="play"
                        icon={getIsPlaying(getCurrentTrack()?.id!) ? <MdOutlinePause size='30'/> :
                            <MdOutlinePlayArrow size='30'/>}
                    />
                    <IconButton
                        onClick={handleNextTrack}
                        isRound={true}
                        aria-label="next"
                        icon={<MdNavigateNext size='30'/>}/>
                    <Popover
                        closeOnBlur={false}
                        placement='right'
                        colorScheme='gray'
                        variant='outlined'
                    >
                        <PopoverTrigger>
                            <IconButton
                                isRound={true}
                                aria-label='volume'
                                icon={getVolume() == 0 ? <MdOutlineVolumeOff size='30'/> :
                                    <MdOutlineVolumeUp size='30'/>}/>
                        </PopoverTrigger>
                        <PopoverContent
                            paddingLeft='5px'
                            paddingRight='5px'
                            justifyContent='center'
                            height='20px'
                            width='200px'
                        >
                            <Slider
                                step={0.01}
                                max={1.0}
                                defaultValue={getVolume()}
                                onChange={handleVolumeChange}
                                colorScheme='gray'
                            >
                                <SliderTrack>
                                    <SliderFilledTrack/>
                                </SliderTrack>
                                <SliderThumb/>
                            </Slider>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </>
    )
};

export default React.memo(Player);