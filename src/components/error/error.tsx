import React from "react";
import {MdSentimentVeryDissatisfied} from "react-icons/md";
import {Text} from "@chakra-ui/react";
import './style.css'

interface ErrorProps {
    description: string
}

const Error: React.FC<ErrorProps> = ({description}) => {
    return (
        <div className="contentWrapper">
            <div className='textError'>
                <div className='iconError'>
                    <MdSentimentVeryDissatisfied/>
                </div>
                <Text
                    className='borderShadowContainer'
                    borderRadius='10px'
                    backgroundColor='white'
                    textAlign='center'
                    marginTop='20px'
                    fontSize='30px'>
                    {description}
                </Text>
            </div>
        </div>
    )
}

export default Error;