import React, {useEffect, useState} from "react";
import {Track} from "../../dto/track.ts";
import axios from "axios";
import {serverUrls} from "../../constants/serverUrl.ts";
import {
    IconButton,
    Input,
    Popover,
    PopoverArrow,
    PopoverContent,
    PopoverTrigger,
    Skeleton,
    Text
} from "@chakra-ui/react";
import {MdOutlineSearch} from "react-icons/md";
import MusicCard from "../musiccard";
import {changeCurrentPlaylist} from "../../store/playlistStore.ts";
import {useAppDispatch} from "../../store/store.ts";

const Tracks = () => {
    const [tracks, setTracks] = useState<null | Track[]>(null);
    const [searchInput, setSearchInput] = useState<string>("");
    const [isSearchNoContent, setIsSearchNoContent] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const appDispatch = useAppDispatch();

    useEffect(() => {
        if (searchInput === "") {
            setIsLoaded(false);
            axios.get<Track[]>(serverUrls.tracksPopularForAll)
                .then(response => {
                    setTracks(response.data);
                    setIsLoaded(true);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [searchInput]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchInput(value);
    };

    const search = () => {
        setIsLoaded(false);
        axios.get<Track[]>(serverUrls.tracksSearch + `?name=${searchInput}`)
            .then(response => {
                setTracks(response.data);
                if (response.data.length === 0) {
                    setIsSearchNoContent(true);
                } else {
                    setIsSearchNoContent(false);
                }
                setIsLoaded(true);
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        if (searchInput !== "") {
            search();
        } else {
            setIsSearchNoContent(false);
        }
    }, [searchInput]);

    const handleSearchClick = () => {
        if (searchInput !== "") {
            search();
        }
    };

    const handleChangePlaylist = () => {
        if (tracks != null)
            appDispatch(changeCurrentPlaylist(tracks));
    }

    return (
        <div className='tracksContainer'>
            <Popover isOpen={isSearchNoContent} autoFocus={false}>
                <PopoverTrigger>
                    <div className='searchContainer boxShadowContainer'>
                        <Input
                            value={searchInput}
                            onChange={handleInputChange}
                            width='300px'
                            placeholder='Find tracks'>
                        </Input>
                        <IconButton
                            onClick={handleSearchClick}
                            isRound={true}
                            aria-label='search'
                            padding='5px'>
                            <MdOutlineSearch size='md'/>
                        </IconButton>
                    </div>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow/>
                    <Text textAlign={"center"} margin={0}>No matches found</Text>
                </PopoverContent>
            </Popover>
            <Skeleton startColor='black' endColor='white' borderRadius='10px' isLoaded={isLoaded}>
                <div className='musicCardsContainer'>
                    {searchInput === "" || searchInput === null ?
                        <Text
                            textAlign={"center"}
                            className='boxShadowContainer'
                            fontSize='30px'
                            backgroundColor='white'
                            borderRadius='10px'
                            border='1px solid ligthgray'>
                            Popular music
                        </Text> : <></>}
                    {
                        tracks?.map((track, index) => {
                            return <MusicCard track={track} key={index} musicianId={track.musicianId}
                                              changePlaylist={handleChangePlaylist}/>
                        })
                    }
                </div>
            </Skeleton>
        </div>
    )
}

export default Tracks;