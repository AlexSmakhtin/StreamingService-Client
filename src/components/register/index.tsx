import './style.css'
import React, {ChangeEvent, useState} from "react";
import {Extensions, RegisterRequest, Roles, Statuses} from "../../dto/registerRequest.ts";
import {
    Button,
    FormControl,
    FormErrorMessage,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Radio,
    RadioGroup,
    Stack
} from "@chakra-ui/react";
import validator from "validator";
import {changeAvatarAction, register} from "../../store/userStore.ts";
import {useAppDispatch} from "../../store/store.ts";
import axios from "axios";

export interface OnSuccess {
    onSuccess: () => void;
}

const Register: React.FC<OnSuccess> = ({onSuccess}) => {
    const nameStrError: string = "Invalid name";
    const emailStrError: string = "Invalid email";
    const passStrError: string = "Invalid password. The password must contain a symbol, a number, " +
        "an upper and lower case letter, and be at least 12 characters";
    const confirmPassStrError: string = "Password doesn't match";
    const avatarStrError: string = "Invalid avatar";
    const bDayErrorStr: string = "Invalid birthday";
    const userStatus = Statuses.common;

    const [emailInput, setEmailInput] = useState<string>("");
    const [emailError, setEmailError] = useState<string>(emailStrError);
    const [isEmailInvalid, setEmailInvalid] = useState<boolean>(true);

    const [passInput, setPassInput] = useState<string>("");
    const [passError, setPassError] = useState<string>(passStrError);
    const [isPassInvalid, setPassInvalid] = useState<boolean>(true);

    const [confirmPassError, setConfirmPassError] = useState<string>(confirmPassStrError);
    const [isConfirmPassInvalid, setConfirmPassInvalid] = useState<boolean>(true);

    const [avatarInput, setAvatarInput] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>("");

    const [avatarError, setAvatarError] = useState<string>("");
    const [isAvatarInvalid, setAvatarInvalid] = useState<boolean>(false);

    const [isFormDisabled, setForm] = useState<boolean>(false);
    const [isButtonDisabled, setButton] = useState<boolean>(false);

    const [birthdayInput, setBirthdayInput] = useState<Date>(new Date());
    const [birthdayError, setBirthdayError] = useState<string>(bDayErrorStr);


    const [userRoleInput, setUserRoleInput] = useState<Roles>(Roles.listener);

    const [userNameInput, setUserNameInput] = useState<string>("");
    const [nameError, setNameError] = useState<string>(nameStrError);
    const [isNameInvalid, setNameInvalid] = useState<boolean>(true);

    const [show, setShowPass] = useState<boolean>(false);

    const appDispatch = useAppDispatch();

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

    const tryRegister = async () => {
        setButton(true);
        setForm(true);
        const regRequest: RegisterRequest = {
            name: userNameInput,
            email: emailInput,
            role: userRoleInput,
            status: userStatus,
            birthday: birthdayInput,
            password: passInput
        }
        const response = await appDispatch(register(JSON.stringify(regRequest)));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.payload.jwtToken}`;
        if (avatarInput != null) {
            const form: FormData = new FormData();
            form.append('file', avatarInput);
            await appDispatch(changeAvatarAction(form));
        }
        onSuccess();
        setButton(false);
        setForm(false);
    };

    const validatePassword = (e: ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassInput(newPassword);
        if (!validator.isStrongPassword(
            newPassword,
            {
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })
        ) {
            setPassError(passStrError);
            setPassInvalid(true);
        } else {
            setPassError('');
            setPassInvalid(false);
        }
    }

    const validateName = (e: ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setUserNameInput(newName);
        if (newName.length < 2) {
            setNameError(nameStrError);
            setNameInvalid(true);
        } else {
            setNameError('');
            setNameInvalid(false);
        }
    }

    const changeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
        setAvatarError("");
        setAvatarInvalid(false);
        if (e.target.files === null)
            return;
        const file = e.target.files[0];
        setAvatarInput(file);
        if (!file.name.endsWith(Extensions.jpeg)
            && !file.name.endsWith(Extensions.jpg)
            && !file.name.endsWith(Extensions.png)) {
            setAvatarError(avatarStrError);
            setAvatarInvalid(true);
            setAvatarInput(null);
            setAvatarUrl("");
            return;
        }
        setAvatarInput(file);
        setAvatarUrl(URL.createObjectURL(file));
        setAvatarInvalid(false);
    }


    const validateConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
        const newPassConfirm = e.target.value;
        if (passInput === newPassConfirm) {
            setConfirmPassError("");
            setConfirmPassInvalid(false);
        } else {
            setConfirmPassError(confirmPassStrError);
            setConfirmPassInvalid(true);
        }
    }

    const changeRole = (e: ChangeEvent<HTMLInputElement>) => {
        const role = e.target.value;
        if (role === "musician") {
            setUserRoleInput(Roles.musician);
        } else {
            setUserRoleInput(Roles.listener);
        }
    }

    const showPassword = () => {
        setShowPass(!show);
    }

    const changeBirthday = (e: ChangeEvent<HTMLInputElement>) => {
        const bDay = e.target.valueAsDate;
        if (bDay != null) {
            setBirthdayInput(bDay);
            setBirthdayError("");
        } else {
            setBirthdayInput(new Date());
            setBirthdayError(bDayErrorStr);
        }
    }

    const calculateMaxDate = () => {
        const currentDate = new Date();
        const maxDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
        return maxDate.toISOString().slice(0, 10);
    };

    return (
        <FormControl
            isDisabled={isFormDisabled}
            w="20vw"
            minW="200px"
            isRequired={true}
            isInvalid={isEmailInvalid || isPassInvalid || isNameInvalid}>
            <FormErrorMessage>{nameError}</FormErrorMessage>
            <Input
                id='nameRegister'
                isInvalid={isNameInvalid}
                value={userNameInput}
                onChange={validateName}
                marginBottom='15px'
                marginTop='5px'
                type='text'
                placeholder='Name'/>
            <FormErrorMessage>{emailError}</FormErrorMessage>
            <Input
                id='emailRegister'
                isInvalid={isEmailInvalid}
                value={emailInput}
                onChange={validateEmail}
                marginBottom='15px'
                marginTop='5px'
                type='email'
                placeholder='Email'/>
            <Input
                id='avatarRegister'
                isInvalid={isAvatarInvalid}
                marginBottom='15px'
                marginTop='5px'
                type="file"
                accept={`${Extensions.jpg},${Extensions.png},${Extensions.jpeg}`}
                style={{display: "none"}}
                multiple={false}
                onChange={changeAvatar}
            />
            <FormErrorMessage>{avatarError}</FormErrorMessage>
            <label htmlFor="avatarRegister">
                <Button
                    isDisabled={isButtonDisabled}
                    as="span"
                    minW="200px"
                    w="20vw"
                    colorScheme='gray'
                    variant='outline'
                    cursor='pointer'>
                    Choose avatar
                </Button>
            </label>
            <Image
                marginLeft='auto'
                marginRight='auto'
                marginTop='10px'
                src={avatarUrl}
                border='2px solid gray'
                borderRadius='full'
                boxSize='200px'
            />
            <RadioGroup defaultValue={"listener"}>
                <Stack
                    spacing={5}
                    direction='row'
                    justifyContent='center'
                    paddingTop='10px'>
                    <Radio
                        isInvalid={false}
                        colorScheme='gray'
                        value={"listener"}
                        checked={userRoleInput === Roles.listener}
                        onChange={changeRole}>
                        Listener
                    </Radio>
                    <Radio
                        isInvalid={false}
                        colorScheme='gray'
                        checked={userRoleInput === Roles.musician}
                        value={"musician"}
                        onChange={changeRole}>
                        Musician
                    </Radio>
                </Stack>
            </RadioGroup>
            <FormErrorMessage>{birthdayError}</FormErrorMessage>
            <Input
                id='bdayRegister'
                marginBottom='15px'
                marginTop='5px'
                type='date'
                colorScheme='gray'
                onChange={changeBirthday}
                min='1900-01-01'
                max={calculateMaxDate()}
            />
            <FormErrorMessage>{passError}</FormErrorMessage>
            <InputGroup>
                <Input
                    id='passRegister'
                    value={passInput}
                    onChange={validatePassword}
                    isInvalid={isPassInvalid}
                    marginBottom='15px'
                    marginTop='5px'
                    type={show ? 'text' : 'password'}
                    placeholder='Password'/>
                <InputRightElement width='4.5rem'>
                    <Button
                        marginTop='10px'
                        h='1.5rem'
                        size='sm'
                        onClick={showPassword}>
                        {show ? 'Hide' : 'Show'}
                    </Button>
                </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{confirmPassError}</FormErrorMessage>
            <Input
                id='confirmPassRegister'
                onChange={validateConfirmPassword}
                isInvalid={isConfirmPassInvalid}
                marginBottom='15px'
                marginTop='5px'
                type={show ? 'text' : 'password'}
                placeholder='Confirm the password'/>
            <div className='formBtn'>
                <Button
                    isDisabled={
                        isEmailInvalid || isPassInvalid || isAvatarInvalid || isConfirmPassInvalid ||
                        isNameInvalid || isButtonDisabled}
                    marginTop='20px'
                    style={{fontFamily: 'RobotoSlab'}}
                    minW="200px"
                    w="20vw"
                    colorScheme='gray'
                    variant='outline'
                    fontSize='20px'
                    onClick={tryRegister}
                >
                    Register
                </Button>
            </div>
        </FormControl>
    );
};

export default Register;