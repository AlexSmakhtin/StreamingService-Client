import {Button, FormControl, FormErrorMessage, Input} from "@chakra-ui/react";
import './style.css'
import React, {ChangeEvent, useState} from "react";
import validator from 'validator';
import {useAppDispatch} from "../../store/store.ts";
import {authenticate} from "../../store/userStore.ts";
import {AuthRequest} from "../../dto/authRequest.ts";
import {OnSuccess} from "../register";

const Auth: React.FC<OnSuccess> = ({onSuccess}) => {
    const emailStrError: string = "Invalid email";
    const passStrError: string = "Empty password";

    const [emailInput, setEmailInput] = useState<string>("");
    const [emailError, setEmailError] = useState<string>(emailStrError);
    const [isEmailInvalid, setEmailInvalid] = useState<boolean>(true);

    const [passInput, setPassInput] = useState<string>("");
    const [passError, setPassError] = useState<string>(passStrError);
    const [isPassInvalid, setPassInvalid] = useState<boolean>(true);

    const [isFormDisabled, setForm] = useState<boolean>(false);
    const [isButtonDisabled, setButton] = useState<boolean>(false);

    const appDispatch = useAppDispatch();

    const tryEnter = async () => {
        setButton(true);
        setForm(true);
        const authRequest: AuthRequest = {
            email: emailInput,
            password: passInput
        };
        await appDispatch(authenticate(JSON.stringify(authRequest)));
        onSuccess();
        setButton(false);
        setForm(false);
    };

    const validateEmail = (e: ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmailInput(newEmail);
        if (!validator.isEmail(newEmail)) {
            setEmailError(emailStrError);
            setEmailInvalid(true);
        } else {
            setEmailError('');
            setEmailInvalid(false);
        }
    }

    const validatePassword = (e: ChangeEvent<HTMLInputElement>) => {
        const newPass = e.target.value;
        setPassInput(newPass);
        if (newPass === '') {
            setPassInvalid(true);
            setPassError(passStrError);
        } else {
            setPassInvalid(false);
            setPassError("");
        }
    }

    return (
        <FormControl
            isDisabled={isFormDisabled}
            w="20vw"
            minW="200px"
            isRequired={true}
            isInvalid={isEmailInvalid || isPassInvalid}>
            <FormErrorMessage>{emailError}</FormErrorMessage>
            <Input
                autoComplete='username'
                id='emailAuth'
                isInvalid={isEmailInvalid}
                value={emailInput}
                onChange={validateEmail}
                marginBottom='15px'
                marginTop='5px'
                type='email'
                placeholder='Email'/>
            <FormErrorMessage>{passError}</FormErrorMessage>
            <Input
                autoComplete='current-password'
                id='passAuth'
                value={passInput}
                onChange={validatePassword}
                isInvalid={isPassInvalid}
                marginBottom='15px'
                marginTop='5px'
                type='password'
                placeholder='Password'/>
            <div className='formBtn'>
                <Button
                    isDisabled={isEmailInvalid || isPassInvalid || isButtonDisabled}
                    marginTop='20px'
                    style={{fontFamily: 'RobotoSlab'}}
                    minW="200px"
                    w="20vw"
                    colorScheme='gray'
                    variant='outline'
                    fontSize='20px'
                    onClick={tryEnter}
                >
                    Enter
                </Button>
            </div>
        </FormControl>
    );
};

export default Auth;
