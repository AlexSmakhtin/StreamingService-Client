import './style.css'
import {AiFillFacebook, AiFillGithub, AiFillTwitterCircle} from "react-icons/ai";
import {Text} from "@chakra-ui/react";
import React from "react";

interface LinksInterface {
    git: string,
    facebook: string,
    twitter: string
}

const Links: React.FC<LinksInterface> = ({git, facebook, twitter}) => {
    return (
        <div className='linksContainer'>
            <Text fontSize='20px'>
                Links:
            </Text>
            <div className='linkIconsContainer'>
                <a  href={facebook} >
                    <AiFillFacebook size='40px'/>
                </a>
                <a  href={git} >
                    <AiFillGithub size='40px'/>
                </a>
                <a  href={twitter} >
                    <AiFillTwitterCircle size='40px'/>
                </a>

            </div>
        </div>
    )
}

export default Links;