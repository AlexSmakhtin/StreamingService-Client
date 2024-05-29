import {IconButton} from "@chakra-ui/react";
import './style.css'
import {MdArrowUpward} from "react-icons/md";
import {useEffect, useState} from "react";

const GoTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Функция, которая будет вызываться при прокрутке страницы
        function handleScroll() {
            const currentPosition = window.scrollY;

            // Если текущая позиция прокрутки больше 100 пикселей, показываем кнопку,
            // иначе скрываем её
            if (currentPosition > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        }

        // Добавляем обработчик события прокрутки при монтировании компонента
        window.addEventListener('scroll', handleScroll);

        // Убираем обработчик события при размонтировании компонента, чтобы избежать утечек памяти
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const handleClick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    };
    return (
        <div
            className={isVisible ? 'goTopContainer show' : 'goTopContainer hide'}>
            <IconButton
                variant='solid'
                colorScheme='blackAlpha'
                aria-label={"goTop"}
                onClick={handleClick}>
                <MdArrowUpward color='white' size='md'/>
            </IconButton>
        </div>
    );
}
export default GoTop;