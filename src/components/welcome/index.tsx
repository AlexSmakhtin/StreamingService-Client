import './style.css'
import {Button, Image} from "@chakra-ui/react"
import LeftIcon from "../../resources/icons/left-arrow.png"
import RightIcon from "../../resources/icons/right-arrow.png"
import BaitForUser from "../baitforuser";
import BaitImage1 from "../../resources/images/bait1.png";
import BaitImage2 from "../../resources/images/bait2.png";
import BaitImage3 from "../../resources/images/bait3.png";
import {useState} from "react";


const Welcome = () => {
    const images = [BaitImage1, BaitImage2, BaitImage3];
    const titles = [
        "Immerse yourself in wonderful world of music",
        "Check out hundreds of musicians and thousands of tracksbymusician",
        "Join for free and get the opportunity to listen to music for up to 15 tracksbymusician a day"
    ];
    const btnTitles = ["Join now", "Listen now", "Join for free"];

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [direction, setDirection] = useState<"left" | "right">("left");


    const goToPrevious = () => {
        setDirection("left");
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    }

    const goToNext = () => {
        setDirection("right");
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    }

    return (
        <div className='welcomeMainContainer'>
            <div className='moveLeftContainer'>
                <Button
                    backgroundColor='white'
                    onClick={goToPrevious}
                    height='60px'
                    width='60px'
                    borderRadius='full'
                    variant='outline'
                    colorScheme='gray'>
                    <Image color='gray' marginRight='3px' src={LeftIcon}/>
                </Button>
            </div>
            <div className='welcomeDataContainer'>
                <BaitForUser
                    currentIndex={currentIndex}
                    images={images}
                    titles={titles}
                    btnTitles={btnTitles}
                    direction={direction}/>
            </div>
            <div className='moveRightContainer'>
                <Button
                    backgroundColor='white'
                    onClick={goToNext}
                    height='60px'
                    width='60px'
                    borderRadius='full'
                    variant='outline'
                    colorScheme='gray'>
                    <Image marginLeft='3px' src={RightIcon}/>
                </Button>
            </div>
        </div>
    );
};

export default Welcome;
