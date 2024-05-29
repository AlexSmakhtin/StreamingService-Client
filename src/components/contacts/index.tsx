import './style.css'
import React from "react";
import {Link, Text} from "@chakra-ui/react";

interface ContactsInterface {
    email: string,
    phone: string
}

const Contacts: React.FC<ContactsInterface> = ({email, phone}) => {
    return (
        <div className='contactsContainer'>
            <Text fontSize='20px'>
                Contacts:
            </Text>
            <Link
                href={`mailto:${email}`}
                style={{fontFamily: 'RobotoSlab'}}>
                Write to the developer
            </Link>
            <Link
                href={`tel:${phone}`}
                style={{fontFamily: 'RobotoSlab'}}>
                +7-999-970-84-15
            </Link>
        </div>
    )
}

export default Contacts;