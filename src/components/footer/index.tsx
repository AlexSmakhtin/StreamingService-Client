import './style.css'
import Contacts from "../contacts";
import Links from "../links";

const Footer = () => {
    const email = "lokomotiv96000@gmail.com";
    const phone = "+79999708415";
    const twitter = "https://twitter.com";
    const git = "https://github.com/AlexSmakhtin";
    const facebook = "https://facebook.com";


    return (
        <div className='footerContainer'>
            <Contacts email={email} phone={phone}/>
            <Links twitter={twitter} git={git} facebook={facebook}/>
        </div>
    )
}

export default Footer;