import React, {createContext, useContext, useEffect, useState} from 'react';
import {Howl, Howler} from 'howler';
import {Track} from "../dto/track.ts";
import {useAppDispatch, useAppSelector} from "../store/store.ts";
import {createTrackSourceUrl} from "../constants/createTrackSourceUrl.ts";
import {addAlert, AlertStatuses} from "../store/alertStore.ts";
import {v4 as Guid} from 'uuid';
import { useLocalStorage } from "@uidotdev/usehooks";


interface HowlerContextInterface {
    playSound: () => void;
    pauseSound: () => void;
    changeSoundSrc: (newSrc: string) => void;
    changeVolume: (volume: number) => void;
    changePosition: (time: number) => void;
    getCurrentTime: () => number;
    changePlaying: (value: boolean) => void;
    getIsPlaying: (trackId: string) => boolean | null;
    getSrc: () => string;
    getVolume: () => number;
    getCurrentTrack: () => Track | null;
    setCurrentTrack: (track: Track | null) => void;
    changeKey: (value: number) => void;
    getKey: () => number;
    stopSound: () => void;
}

const HowlerContext = createContext<HowlerContextInterface>({
    playSound: () => {
    },
    changePlaying: () => {
    },
    getIsPlaying: () => null,
    pauseSound: () => {
    },
    changeSoundSrc: () => {
    },
    changeVolume: () => {
    },
    changePosition: () => {
    },
    getCurrentTime: () => 0,
    getSrc: () => "",
    getVolume: () => 0,
    getCurrentTrack: () => null,
    setCurrentTrack: () => {
    },
    changeKey: () => {
    },
    getKey: () => 0,
    stopSound: () => {
    }
});

export function setNextTrack(
    getCurrentTrack: () => Track | null,
    mode: "straight" | "cycle" | "random",
    playlist: Track[],
    changeSoundSrc: (value: string) => void,
    setCurrentTrack: (track: Track) => void,
    changePlaying: (value: boolean) => void,
    changeKey: (value: number) => void,
    key: number,
    userId: string) {
    switch (mode) {
        case "straight": {
            const track = getCurrentTrack();
            if (track != null) {
                const index = playlist.findIndex((value) => value.id === track.id) + 1;
                const newTrack = playlist[index];
                if (newTrack == undefined) {
                    const firstTrack = playlist[0];
                    const newSrc = createTrackSourceUrl(firstTrack.id, userId);
                    changeSoundSrc(newSrc);
                    setCurrentTrack(firstTrack);
                } else {
                    const newSrc = createTrackSourceUrl(newTrack.id, userId);
                    changeSoundSrc(newSrc);
                    setCurrentTrack(newTrack);
                }
            }
            changePlaying(true);
            break;
        }
        case "cycle": {
            changeKey(key + 1);
            break;
        }
        case "random": {
            const track = getCurrentTrack();
            if (track != null) {
                const newPlaylist = playlist.slice();
                const index = newPlaylist.indexOf(track);
                if (index !== -1) {
                    newPlaylist.splice(index, 1);
                }
                const randomIndex = Math.floor(Math.random() * newPlaylist.length);
                const newTrack = newPlaylist[randomIndex];
                const newSrc = createTrackSourceUrl(newTrack.id, userId);
                changeSoundSrc(newSrc);
                setCurrentTrack(newTrack);
                changePlaying(true);
            }
            break;
        }
    }
}

export const useHowler = () => useContext(HowlerContext);

// @ts-ignore
const HowlerProvider = ({children}) => {
    const [src, setSrc] = useState<string>("");
    const [sound, setSound] = useState<Howl | null>(null);
    const [interval, setMyInterval] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [trackId, setTrackId] = useState<number>(0);
    const [volume, setVolume] = useLocalStorage<number>("howlVolume", 0);
    const [currentTrack, setTrack]
        = useState<Track | null>(null);
    const {userId} = useAppSelector(state => state.user);
    const {currentPlaylist, mode} = useAppSelector(state => state.playlist);

    const [key, setKey] = useState<number>(0);

    const appDispatch = useAppDispatch();
    useEffect(() => {
        Howler.volume(volume);
    }, []);

    useEffect(() => {
        if (interval != null) {
            clearInterval(interval);
        }
        if (src) {
            if (sound) {
                sound.unload();
                setSound(null);
            }
            const newSound = new Howl({
                html5: true,
                src: [src],
                format: "mp3",
                autoplay: true,
                onplay: (soundId) => {
                    setTrackId(soundId);
                    setMyInterval(setInterval(() => {
                        setCurrentTime(newSound.seek(soundId));
                    }, 500));
                },
                onend: () => setNextTrack(
                    getCurrentTrack,
                    mode,
                    currentPlaylist,
                    changeSoundSrc,
                    setCurrentTrack,
                    changePlaying,
                    setKey,
                    key,
                    userId!),
                onloaderror: (_id, error) => {
                    console.error('Error fetching audio:', error)
                    appDispatch(addAlert({
                        status: AlertStatuses.error,
                        description: "Free tracksbymusician limit reached",
                        guid: Guid(),
                    }));
                }
            });
            setSound(newSound);
        }
    }, [src, key]);
    const playSound = () => {
        if (sound != null) {
            sound.play();
        }
    };

    const changeKey = (value: number) => {
        setKey(value);
    }

    const stopSound = () => {
        if (sound != null) {
            sound.unload();
            setSound(null);
        }
    }

    const pauseSound = () => {
        if (interval != null)
            clearInterval(interval);
        if (sound != null)
            sound.pause();
    }

    const setCurrentTrack = (track: Track | null) => {
        setTrack(track);
    }

    const getCurrentTrack = () => {
        return currentTrack;
    }

    const changeSoundSrc = (newSrc: string) => {
        setSrc(newSrc);
    }

    const changeVolume = (volume: number) => {
        setVolume(volume);
        Howler.volume(volume);
    }

    const changePosition = (time: number) => {
        if (sound != null)
            sound.seek(time, trackId);
    }

    const getCurrentTime = () => {
        return currentTime;
    }

    const changePlaying = (value: boolean) => {
        setIsPlaying(value);
    }

    const getIsPlaying = (trackId: string) => {
        if (currentTrack?.id == trackId)
            return isPlaying;
        return null;
    }

    const getKey = () => {
        return key;
    }

    const getSrc = () => {
        return src;
    }

    const getVolume = () => {
        return volume;
    }

    return (
        <HowlerContext.Provider
            value=
                {{
                    playSound,
                    changePlaying,
                    getIsPlaying,
                    pauseSound,
                    changeSoundSrc,
                    changeVolume,
                    changePosition,
                    getCurrentTime,
                    getSrc,
                    getVolume,
                    setCurrentTrack,
                    getCurrentTrack,
                    changeKey,
                    getKey,
                    stopSound
                }}
        >
            {children}
        </HowlerContext.Provider>
    );
};

export default React.memo(HowlerProvider);