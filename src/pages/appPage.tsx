import './apppage.css'
import '@react-md/icon'
import {MdPermIdentity, MdClear, MdSettings, MdBrightness5, MdExitToApp} from 'react-icons/md'
import {
    Avatar,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Text,

} from "@chakra-ui/react";
import {routes} from "../constants/routes.ts";
import {Helmet} from "react-helmet";
import HeadphoneIcon from "../resources/icons/headphone.png"
import {useEffect, useState} from "react";
import Auth from "../components/auth";
import AlertRequest from "../components/alert";
import Register from "../components/register";
import Welcome from "../components/welcome";
import {useAppDispatch, useAppSelector} from "../store/store.ts";
import Home from "../components/home";
import {changeMenuWindow, changeOpenDrawer} from "../store/appStore.ts";
import {Navigate, Route, Routes} from "react-router-dom";
import NavTab from "../components/navtab";
import {serverUrls} from "../constants/serverUrl.ts";
import axios, {AxiosError, HttpStatusCode} from "axios";
import {removeJwtToken} from "../store/userStore.ts";
import {useHowler} from "../services/HowlManager.tsx";
import MyPlaylists from "../components/myplaylists";
import TracksByMusician from "../components/tracksbymusician";
import Musicians from "../components/musicians";
import Footer from "../components/footer";
import Player from "../components/player";
import Error from "../components/error/error.tsx";
import Content from "../components/content";
import MusicianSoloCard from "../components/musiciansolocard";
import GoTop from "../components/gotop";
import Settings from "../components/settings";
import AlbumsByMusician from "../components/albumsbymusician";
import Playlists from "../components/playlists";
import Tracks from "../components/tracks";

const AppPage = () => {
    const pageTitle: string = "Streaming Service";
    const [icon, setIcon] = useState<string>("");
    const [changeForm, setForm] = useState<boolean>(true);
    const {jwtToken} = useAppSelector(state => state.user);
    const {isOpenDrawer} = useAppSelector(state => state.app);
    const appDispatch = useAppDispatch();
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    const {name} = useAppSelector(state => state.user);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isPingError, setPingError] = useState<boolean>(false);
    const {stopSound, changePlaying, setCurrentTrack} = useHowler();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(serverUrls.ping);
                console.log('Server is working:');
                setPingError(false);
            } catch (error: AxiosError) {
                if (error.code === "ERR_NETWORK") {
                    setPingError(true);
                    console.error('Server not responding');
                } else if (error.response.status == HttpStatusCode.Unauthorized) {
                    appDispatch(removeJwtToken());
                    console.log('Server is working, but: ', error.response);
                    setPingError(false);
                } else {
                    console.error('Unexpected error: ', error.response);
                    setPingError(true);
                }
            }
        };
        const interval = 1_000;
        const intervalId = setInterval(fetchData, interval);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (jwtToken != null && jwtToken !== "") {
            axios.get(serverUrls.userAvatar,
                {responseType: 'blob'})
                .then((response) => {
                    const imageURL = URL.createObjectURL(response.data);
                    setAvatarUrl(imageURL);
                })
                .catch((error) => {
                    console.error('Error fetching avatar:', error);
                });
        } else {
            setAvatarUrl("");
        }
    }, [jwtToken]);

    const {menuWindow} = useAppSelector(state => state.app)

    const openCloseAction = () => {
        appDispatch(changeOpenDrawer(!isOpenDrawer));
    };

    useEffect(() => {
        setIcon(HeadphoneIcon);
    }, []);

    const isAuth = () => {
        setForm(!changeForm);
    }
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const openUserTools = () => {

    }
    const handleSettingsClick = () => {
        appDispatch(changeMenuWindow(routes.settings));
    };

    return (
        <div className="mainContainer">
            <Helmet>
                <link rel="icon" type="image/png" href={icon}/>
                <title>{jwtToken && jwtToken.trim() !== '' ? pageTitle : `Welcome to ${pageTitle}`}</title>
            </Helmet>
            <div className="alertComponentContainer">
                <AlertRequest/>
            </div>
            <div className="header">
                <a className="headerText" style={{fontFamily: 'RobotoSlab'}} href={routes.welcome}>
                    Streaming Service
                </a>
                {isPingError ? <></> :
                    <Popover
                        closeOnBlur={false}
                        colorScheme='gray'
                        variant='outlined'>
                        <PopoverTrigger>
                            <IconButton
                                marginTop={'10px'}
                                marginBottom={'10px'}
                                height={'60px'}
                                width={'60px'}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                isRound={true}
                                flexDirection='column'
                                justifyContent='center'
                                className="authBtn"
                                variant='outline'
                                colorScheme='gray'
                                aria-label='Call Sage'
                                icon={jwtToken && jwtToken.trim() !== '' ? avatarUrl ? isHovered ?
                                        <MdSettings size={'40px'}/> :
                                        <Avatar
                                            padding='5px'
                                            src={avatarUrl}
                                        />
                                    : <MdPermIdentity size={'40px'}/> : <MdPermIdentity size={'40px'}/>}
                                onClick={jwtToken && jwtToken.trim() !== '' ? openUserTools : openCloseAction}
                            />
                        </PopoverTrigger>
                        {jwtToken && jwtToken.trim() !== '' ?
                            <PopoverContent>
                                <PopoverArrow/>
                                <PopoverHeader>
                                    <Text textAlign='center' margin='auto'>
                                        {name}
                                    </Text>
                                </PopoverHeader>
                                <Button
                                    onClick={handleSettingsClick}
                                    borderRadius='0px'
                                    border='0px'
                                    colorScheme='gray'
                                    variant='outline'>
                                    Account settings <MdBrightness5/>
                                </Button>
                                <Button
                                    onClick={() => {
                                        changePlaying(false);
                                        setCurrentTrack(null);
                                        stopSound();
                                        appDispatch(removeJwtToken());
                                    }}
                                    borderRadius='0px'
                                    border='0px'
                                    colorScheme='gray'
                                    variant='outline'>
                                    Exit <MdExitToApp/>
                                </Button>
                            </PopoverContent>
                            : <></>}
                    </Popover>
                }
                <Drawer
                    preserveScrollBarGap={true}
                    isFullHeight={true}
                    placement='bottom'
                    onClose={openCloseAction}
                    isOpen={isOpenDrawer}>
                    <DrawerOverlay min-width="300px"/>
                    <DrawerContent gap={2}>
                        <IconButton
                            marginLeft="auto"
                            marginRight="20px"
                            marginTop="20px"
                            w={10}
                            h={10}
                            className="authLogo"
                            variant='outline'
                            colorScheme='gray'
                            aria-label='Call Sage'
                            fontSize='20px'
                            icon={<MdClear/>}
                            onClick={openCloseAction}
                        />
                        <DrawerHeader
                            padding='0'
                            borderBottomWidth='2px'
                            alignSelf="center"
                            fontSize={30}
                            style={{fontFamily: 'RobotoSlab'}}>
                            {changeForm ? " Sign in" : "Create account"}
                        </DrawerHeader>
                        <DrawerBody alignSelf="center">
                            {changeForm ? (<Auth onSuccess={openCloseAction}/>) : (
                                <Register onSuccess={openCloseAction}/>)}
                            <div className='registerBtnContainer'>
                                <Text
                                    decoration='overline lightgray'
                                    colorScheme='gray'
                                    marginTop='60px'
                                    fontSize='22px'>
                                    {changeForm ? "Not registered yet?" : "Already registered?"}
                                </Text>
                                <Button
                                    variant='outline'
                                    colorScheme='gray'
                                    fontSize='15px'
                                    onClick={isAuth}>
                                    {changeForm ? "Create account" : "Sign in"}
                                </Button>
                            </div>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </div>
            <div className='backgroundContainer'>
                {
                    !isPingError ? jwtToken && jwtToken.trim() !== '' ?
                        (<NavTab/>) : (<></>) : (<></>)
                }
                <div className="contentWrapper">
                    {
                        !isPingError ?
                            jwtToken !== null && jwtToken.trim() !== '' ?
                                menuWindow != null ?
                                    <Content path={menuWindow}/>
                                    :
                                    <Routes>
                                        <Route path={"*"} element={<Navigate to={routes.home}/>}/>
                                        <Route path={routes.home} element={<Home/>}/>
                                        <Route path={routes.musicians} element={<Musicians/>}/>
                                        <Route path={routes.musician} element={<MusicianSoloCard/>}/>
                                        <Route path={routes.settings} element={<Settings/>}/>
                                        <Route path={routes.musicianTracks} element={<TracksByMusician/>}/>
                                        <Route path={routes.musicianAlbums} element={<AlbumsByMusician/>}/>
                                        <Route path={routes.tracks} element={<Tracks/>}/>
                                        <Route path={routes.playlists} element={<Playlists/>}/>
                                    </Routes>
                                :
                                <Routes>
                                    <Route path={"*"} element={<Navigate to={routes.welcome}/>}/>
                                    <Route path={routes.welcome} element={<Welcome/>}/>
                                </Routes>
                            :
                            <Routes>
                                <Route path={"*"} element={<Navigate to={routes.error}/>}/>
                                <Route path={routes.error}
                                       element={<Error description={"Server is not responding"}/>}/>
                            </Routes>
                    }
                </div>
            </div>
            {
                !isPingError ? jwtToken !== null ? <Player/> : <></> : <></>
            }
            <GoTop/>
            <div className="footer">
                <Footer/>
            </div>
        </div>
    )
};
export default AppPage;