import './style.css'
import {
    IconButton,
    Input,
    Popover,
    PopoverArrow,
    PopoverContent,
    PopoverTrigger,
    Skeleton,
    Text
} from "@chakra-ui/react";
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdOutlineSearch
} from "react-icons/md";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {serverUrls} from "../../constants/serverUrl.ts";
import {Musician} from "../../dto/musician.ts";
import MusicianCard from "../musiciancard";
import {GetMusiciansResponse} from "../../dto/getMusiciansResponse.ts";

const Musicians = () => {
    const [musicians, setMusicians]
        = useState<null | Musician[]>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchInput, setSearchInput] = useState<string>("");
    const [isSearchNoContent, setIsSearchNoContent] = useState<boolean>(false);

    useEffect(() => {
        if (searchInput === "") {
            setIsLoaded(false);
            axios.get<GetMusiciansResponse>(serverUrls.musicians + `?pageNumber=${currentPage}`)
                .then(response => {
                    setMusicians(response.data.musicians);
                    setTotalPages(response.data.totalPages)
                    setIsLoaded(true);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [currentPage, searchInput]);

    const handleMoveAction = (isMovePrev: boolean) => {
        if (isMovePrev)
            setCurrentPage(prevState => prevState - 1);
        else
            setCurrentPage(prevState => prevState + 1);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchInput(value);
    };

    const search = () => {
        setCurrentPage(1);
        setIsLoaded(false);
        axios.get<GetMusiciansResponse>(serverUrls.musiciansSearch + `?pageNumber=${currentPage}&name=${searchInput}`)
            .then(response => {
                setMusicians(response.data.musicians);
                if (response.data.totalPages === 0) {
                    setTotalPages(1)
                    setIsSearchNoContent(true);
                } else {
                    setTotalPages(response.data.totalPages)
                    setIsSearchNoContent(false);
                }
                setIsLoaded(true);
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        if (searchInput !== "") {
            search();
        }else{
            setIsSearchNoContent(false);
        }
    }, [searchInput, currentPage]);

    const handleSearchClick = () => {
        if (searchInput !== "") {
            search();
        }
    };
    return (
        <div className='musiciansContainer'>
            <Popover isOpen={isSearchNoContent} autoFocus={false}>
                <PopoverTrigger>
                    <div className='searchContainer boxShadowContainer'>
                        <Input
                            value={searchInput}
                            onChange={handleInputChange}
                            width='300px'
                            placeholder='Find authors'>
                        </Input>
                        <IconButton
                            onClick={handleSearchClick}
                            isRound={true}
                            aria-label='search'
                            padding='5px'>
                            <MdOutlineSearch size='md'/>
                        </IconButton>
                    </div>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow/>
                    <Text textAlign={"center"} margin={0}>No matches found</Text>
                </PopoverContent>
            </Popover>
            <Skeleton startColor='black' endColor='white' borderRadius='10px' isLoaded={isLoaded}>
                <div className='musiciansCardsContainer'>
                    {
                        musicians?.map((value, index) => {
                            return <MusicianCard musician={value} key={index}/>
                        })
                    }
                </div>
            </Skeleton>
            <div className='paginationBtnsContainer boxShadowContainer'>
                <IconButton
                    padding='5px'
                    isDisabled={currentPage === 1}
                    onClick={() => handleMoveAction(true)}
                    aria-label='prev'>
                    <MdKeyboardArrowLeft size='md'/>

                </IconButton>
                <Text margin={"auto"}>{currentPage} of {totalPages}</Text>
                <IconButton padding='5px'
                            isDisabled={currentPage === totalPages}
                            onClick={() => handleMoveAction(false)}
                            aria-label='next'>
                    <MdKeyboardArrowRight size='md'/>

                </IconButton>
            </div>
        </div>
    )
}
export default Musicians;