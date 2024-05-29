import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {serverUrls} from "../../constants/serverUrl.ts";
import {Musician} from "../../dto/musician.ts";
import {Avatar, Card, CardHeader, Icon, Skeleton, Text} from "@chakra-ui/react";
import {MdPermIdentity} from "react-icons/md";
import './style.css';
import {Album} from "../../dto/album.ts";
import AlbumCard from "../albumcard";
import MusicCard from "../musiccard";
import {Track} from "../../dto/track.ts";
import {changeCurrentPlaylist} from "../../store/playlistStore.ts";
import {useAppDispatch} from "../../store/store.ts";
import {changeMenuWindow} from "../../store/appStore.ts";
import {routes} from "../../constants/routes.ts";

interface SoloProps {
    routeId?: string
}

const MusicianSoloCard: React.FC<SoloProps> = ({routeId}) => {
    const id = useParams().id ?? routeId;
    const [avatarUrl, setAvatarUrl] = useState<null | string>(null);
    const [musician, setMusician] = useState<null | Musician>(null);
    const [albums, setAlbums] = useState<null | Album[]>(null);
    const [tracks, setTracks] = useState<null | Track[]>(null);

    const [isAlbumsLoaded, setIsAlbumsLoaded] = useState<boolean>(false);
    const [isTracksLoaded, setIsTracksLoaded] = useState<boolean>(false);
    const [isTracksHovered, setIsTracksHovered] = useState(false);
    const [isAlbumsHovered, setIsAlbumsHovered] = useState(false);

    const appDispatch = useAppDispatch();
    const setPlaylist = () => {
        if (tracks !== null)
            appDispatch(changeCurrentPlaylist(tracks));
    }

    const handleTracksMouseEnter = () => {
        setIsTracksHovered(true);
    };
    const handleTracksMouseLeave = () => {
        setIsTracksHovered(false);
    };
    const handleTracksMouseClick = () => {
        appDispatch(changeMenuWindow(routes.musicians + `/${id}/tracks`));
    };

    const handleAlbumsMouseEnter = () => {
        setIsAlbumsHovered(true);
    };
    const handleAlbumsMouseLeave = () => {
        setIsAlbumsHovered(false);
    };
    const handleAlbumsMouseClick = () => {
        appDispatch(changeMenuWindow(routes.musicians + `/${id}/albums`));
    };

    useEffect(() => {
        axios.get<Musician>(serverUrls.musicians + `/${id}`)
            .then(response => {
                setMusician(response.data);
            })
            .catch(error => {
                console.error(error);
            });
        axios.get(serverUrls.user + `/${id}/avatar`, {responseType: 'blob'})
            .then(response => {
                const imageURL = URL.createObjectURL(response.data);
                setAvatarUrl(imageURL);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        if (musician !== null) {
            setIsAlbumsLoaded(false);
            axios.get<Album[]>(serverUrls.popularAlbums + `?musicianId=${musician.id}`)
                .then(response => {
                    setAlbums(response.data);
                    setIsAlbumsLoaded(true);
                })
                .catch(error => {
                    console.error(error);
                });
            setIsTracksLoaded(false)
            axios.get<Track[]>(serverUrls.popularTracks + `?musicianId=${musician.id}`)
                .then(response => {
                    setTracks(response.data);
                    setIsTracksLoaded(true);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [musician]);
    return (

        <div className='musicianSoloCardContainer'>
            <Card
                marginLeft='auto'
                marginRight='auto'
                borderRadius='10px'
                className='boxShadowContainer'
                display='flex'
                flexDirection='column'
                width='300px'
            >
                <CardHeader paddingBottom={'20px'}>
                    <div className='musicianCardHeader'>
                        {
                            avatarUrl !== null ?
                                <Avatar
                                    height='140px'
                                    width='140px'
                                    src={avatarUrl}
                                />
                                :
                                <Icon
                                    marginLeft='10px'
                                    marginTop='10px'>
                                    <MdPermIdentity size='lg'/>
                                </Icon>
                        }
                    </div>
                    <Text
                        margin={0}
                        textAlign='center'
                        fontSize='20px'>
                        {musician?.name}
                    </Text>
                    <Text
                        className={isAlbumsHovered ? "textSelect" : ""}
                        onClick={handleAlbumsMouseClick}
                        onMouseLeave={handleAlbumsMouseLeave}
                        onMouseEnter={handleAlbumsMouseEnter}
                        margin='0'
                        fontSize='13px'
                        textAlign='center'>
                        Albums: {musician?.albumsCount}
                    </Text>
                    <Text
                        className={isTracksHovered ? "textSelect" : ""}
                        onClick={handleTracksMouseClick}
                        onMouseLeave={handleTracksMouseLeave}
                        onMouseEnter={handleTracksMouseEnter}
                        margin='0'
                        fontSize='13px'
                        textAlign='center'>
                        Tracks: {musician?.tracksCount}
                    </Text>
                    <Text margin='0' fontSize='13px' textAlign='center'>Listening: {musician?.listening}</Text>
                </CardHeader>
            </Card>
            <Text
                textAlign='center'
                className='boxShadowContainer'
                fontSize='30px'
                backgroundColor='white'
                borderRadius='10px'
                border='1px solid ligthgray'>
                Popular albums
            </Text>
            <Skeleton startColor='black' endColor='white' borderRadius='10px'
                      isLoaded={isAlbumsLoaded === true}>
                <div className='musicCardsContainer'>
                    {
                        albums?.map((album, index) => (
                            <AlbumCard key={index} album={album}/>
                        ))
                    }
                </div>
            </Skeleton>
            <Text
                textAlign='center'
                className='boxShadowContainer'
                fontSize='30px'
                backgroundColor='white'
                borderRadius='10px'
                border='1px solid ligthgray'>
                Popular tracks
            </Text>
            <Skeleton marginBottom='20px' startColor='black' endColor='white' borderRadius='10px'
                      isLoaded={isTracksLoaded === true}>
                <div className='musicCardsContainer'>
                    {
                        tracks?.map((track, index) => (
                            <MusicCard musicianId={track.musicianId} key={index} track={track}
                                       changePlaylist={setPlaylist}/>
                        ))
                    }
                </div>
            </Skeleton>
        </div>
    );
}

export default MusicianSoloCard;