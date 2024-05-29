import {Musician} from "../../dto/musician.ts";
import React, {useEffect, useState} from "react";
import {Avatar, Card, CardBody, CardHeader, Icon, Text} from "@chakra-ui/react";
import axios from "axios";
import {serverUrls} from "../../constants/serverUrl.ts";
import {MdPermIdentity} from "react-icons/md";
import './style.css'
import {useAppDispatch} from "../../store/store.ts";
import {changeMenuWindow} from "../../store/appStore.ts";

interface MusicianProps {
    musician: Musician,
}

const MusicianCard: React.FC<MusicianProps> = ({musician}) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const appDispatch = useAppDispatch();

    useEffect(() => {
        const url = serverUrls.user + `/${musician.id}/avatar`;
        axios.get(url, {responseType: 'blob'})
            .then(response => {
                const imageURL = URL.createObjectURL(response.data);
                setAvatarUrl(imageURL);
            })
            .catch(error => {
                console.error('Error fetching avatar:', error);
            });
    }, []);

    const handleClickAction = () => {
        appDispatch(changeMenuWindow(`/musicians/${musician.id}`))
    };
    return (
            <Card
                className='boxShadowContainer'
                display='flex'
                flexDirection='column'
                flex='0 0 30%'
                minWidth='150px'
                size='sm'>
                <CardHeader>
                    <a
                        style={{cursor: 'pointer'}}
                        onClick={handleClickAction}>
                        <div className='musicianCardHeader'>
                            {
                                avatarUrl !== null ?
                                    <Avatar
                                        size='lg'
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
                            {musician.name}
                        </Text>
                    </a>
                </CardHeader>
                <CardBody display='flex' flexDirection='column' justifyContent='center'>
                    <Text margin='0' fontSize='13px' textAlign='left'>Albums: {musician.albumsCount}</Text>
                    <Text margin='0' fontSize='13px' textAlign='left'>Tracks: {musician.tracksCount}</Text>
                    <Text margin='0' fontSize='13px' textAlign='left'>Listening: {musician.listening}</Text>
                </CardBody>
            </Card>
    );
}

export default MusicianCard;