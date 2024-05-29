import './style.css'
import {Button, Image, Text} from "@chakra-ui/react";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import React from "react";
import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {changeOpenDrawer} from "../../store/appStore.ts";

interface ImageSliderProps {
    images: string[];
    titles: string[];
    btnTitles: string[];
    currentIndex: number;
    direction: string;
}

const BaitForUser: React.FC<ImageSliderProps> = (
    {
        images,
        btnTitles,
        titles,
        currentIndex,
        direction
    }) => {
    const {isOpenDrawer} = useAppSelector(state => state.app);
    const appDispatch = useAppDispatch();
    const changeAction = () => {
        appDispatch(changeOpenDrawer(!isOpenDrawer));
    }

    return (
        <div className='slide-container'>
            <TransitionGroup>
                <CSSTransition key={currentIndex} timeout={500} classNames={`slide-${direction}`}>
                    <div className='baitContainer'>
                        <Text
                            className='boxShadowContainer'
                            borderRadius='10px'
                            backgroundColor='white'
                            style={{fontFamily: 'RobotoSlab'}}
                            fontSize='calc(2vw + 20px)'
                            width='auto'
                            textAlign='center'
                            margin='10px'
                        >
                            {titles[currentIndex]}
                        </Text>
                        <Image
                            padding='5px'
                            borderRadius='20px'
                            height='30vh'
                            src={images[currentIndex]}
                            objectFit="cover"/>
                        <Button
                            backgroundColor='white'
                            onClick={changeAction}
                            borderRadius='20px'
                            marginTop='20px'
                            marginRight='30px'
                            marginLeft='30px'
                            variant='outline'
                            fontSize='calc(1vw + 20px)'
                            colorScheme='gray'
                            height='6vh+10px'>
                            {btnTitles[currentIndex]}
                        </Button>
                    </div>
                </CSSTransition>
            </TransitionGroup>
        </div>
    );
};

export default BaitForUser;