import {Button, Text} from "@chakra-ui/react";
import {MdHome, MdMusicNote, MdMusicVideo, MdOutlinePeople} from "react-icons/md";
import './style.css'
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {changeMenuWindow} from "../../store/appStore.ts";
import {routes} from "../../constants/routes.ts";
import {Link} from "react-router-dom";

const NavTab = () => {
    const [isHovered, setIsHovered] = useState<number | null>(null);
    const appDispatch = useAppDispatch();
    const {menuWindow} = useAppSelector(state => state.app);
    const handleMouseEnter = (index: number) => {
        setIsHovered(index);
    };

    const handleMouseLeave = () => {
        setIsHovered(null);
    };


    const handleTabClick = (index: number) => {
        switch (index) {
            case 0: {
                appDispatch(changeMenuWindow(routes.home));
                break;
            }
            case 1: {
                appDispatch(changeMenuWindow(routes.playlists));
                break;
            }
            case 2: {
                appDispatch(changeMenuWindow(routes.tracks));
                break;
            }
            case 3: {
                appDispatch(changeMenuWindow(routes.musicians));
                break;
            }
            default:
                break;
        }
    };
    return (
        <div className='navContainer'>
            <Link to={routes.home}>
                <Button
                    padding='10px'
                    size='l'
                    borderRadius='0 0 10px 10px'
                    style={{
                        background: isHovered === 0 ? "black" : menuWindow == routes.home ? "black" : 'white',
                        color: isHovered === 0 ? "white" : menuWindow == routes.home ? "white" : "black",
                        boxShadow: '0 1px 5px rgb(0, 0, 0)'
                    }}
                    onMouseEnter={() => handleMouseEnter(0)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleTabClick(0)}>
                    <div className='mdContainer'>
                        <div className='mdContent'>
                            <MdHome/>
                        </div>
                        <Text textAlign='center'>Home</Text>
                    </div>
                </Button>
            </Link>
            <Link to={routes.playlists}>
                <Button
                    padding='10px'
                    size='l'
                    borderRadius='0 0 10px 10px'
                    style={{
                        background: isHovered === 1 ? "black" : menuWindow == routes.playlists ? "black" : 'white',
                        color: isHovered === 1 ? "white" : menuWindow == routes.playlists ? "white" : 'black',
                        boxShadow: '0 1px 5px rgb(0, 0, 0)'
                    }}
                    onMouseEnter={() => handleMouseEnter(1)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleTabClick(1)}>
                    <div className='mdContainer'>
                        <div className='mdContent'>
                            <MdMusicVideo/>
                        </div>
                        <Text textAlign='center'>My playlists</Text>
                    </div>
                </Button>
            </Link>
            <Link to={routes.tracks}>
                <Button
                    padding='10px'
                    borderRadius='0 0 10px 10px'
                    size='l'
                    style={{
                        background: isHovered === 2 ? "black" : menuWindow == routes.tracks ? "black" : 'white',
                        color: isHovered === 2 ? "white" : menuWindow == routes.tracks ? "white" : 'black',
                        boxShadow: '0 1px 5px rgb(0, 0, 0)'
                    }}
                    onMouseEnter={() => handleMouseEnter(2)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleTabClick(2)}>
                    <div className='mdContainer'>
                        <div className='mdContent'>
                            <MdMusicNote/>
                        </div>
                        <Text textAlign='center'>Tracks</Text>
                    </div>

                </Button>
            </Link>
            <Link to={routes.musicians}>
                <Button
                    padding='10px'
                    size='l'
                    borderRadius='0 0 10px 10px'
                    style={{
                        background: isHovered === 3 ? "black" : menuWindow == routes.musicians ? "black" : 'white',
                        color: isHovered === 3 ? "white" : menuWindow == routes.musicians ? "white" : 'black',
                        boxShadow: '0 1px 5px rgb(0, 0, 0)'
                    }}
                    onMouseEnter={() => handleMouseEnter(3)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleTabClick(3)}>
                    <div className='mdContainer'>
                        <div className='mdContent'>
                            <MdOutlinePeople/>
                        </div>
                        <Text textAlign='center'>Musicians</Text>
                    </div>
                </Button>
            </Link>

        </div>
    );
}

export default NavTab;