import {
    Button,
    Divider, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, FormControl,
    FormErrorMessage, IconButton,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Text
} from "@chakra-ui/react";
import './style.css'
import {ChangeEvent, useEffect, useState} from "react";
import {useAppDispatch} from "../../store/store.ts";
import axios, {AxiosError, HttpStatusCode} from "axios";
import {serverUrls} from "../../constants/serverUrl.ts";
import {User} from "../../dto/user.ts";
import {Extensions} from "../../dto/registerRequest.ts";
import validator from "validator";
import {addAlert, AlertStatuses, changeAlert} from "../../store/alertStore.ts";
import {v4 as Guid} from 'uuid';
import {Subscription, SubscriptionToBuy} from "../../dto/subscription.ts";
import {MdClear} from "react-icons/md";
import SubscriptionCard from "../subscriptioncard";
import {changeAvatarAction} from "../../store/userStore.ts";


enum SettingsContent {
    data = 'data',
    password = 'password',
    subs = 'subs'
}

const Settings = () => {
    const [content, setContent] = useState<SettingsContent>(SettingsContent.data);
    const [user, setUser] = useState<User | null>(null);

    const nameStrError: string = "Invalid name";
    const emailStrError: string = "Invalid email";
    const oldPassErrorStr: string = "Password is empty";
    const newPassStrError: string = "Invalid password. The password must contain a symbol, a number, " +
        "an upper and lower case letter, and be at least 12 characters and should not be the same as the previous one";
    const confirmNewPassStrError: string = "Password doesn't match";
    const avatarStrError: string = "Invalid avatar";

    const [emailInput, setEmailInput] = useState<string>("");
    const [emailError, setEmailError] = useState<string>(emailStrError);
    const [isEmailInvalid, setIsEmailInvalid] = useState<boolean>(true);

    const [oldPasswordInput, setOldPasswordInput] = useState<string>("");
    const [oldPassError, setOldPassError] = useState<string>(oldPassErrorStr);
    const [isOldPassInvalid, setIsOldPassInvalid] = useState<boolean>(true);

    const [newPasswordInput, setNewPasswordInput] = useState<string>("");
    const [newPassError, setNewPassError] = useState<string>(newPassStrError);
    const [isNewPassInvalid, setIsNewPassInvalid] = useState<boolean>(true);

    const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState<string>("");
    const [confirmNewPassError, setConfirmNewPassError] = useState<string>(confirmNewPassStrError);
    const [isConfirmNewPassInvalid, setIsConfirmNewPassInvalid] = useState<boolean>(true);

    const [avatarInput, setAvatarInput] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>("");

    const [avatarError, setAvatarError] = useState<string>("");
    const [isAvatarInvalid, setAvatarInvalid] = useState<boolean>(false);

    const [isFormDisabled, setForm] = useState<boolean>(false);
    const [isButtonDisabled, setButton] = useState<boolean>(false);

    const [userNameInput, setUserNameInput] = useState<string>("");
    const [nameError, setNameError] = useState<string>(nameStrError);
    const [isNameInvalid, setNameInvalid] = useState<boolean>(true);

    const [show, setShowPass] = useState<boolean>(false);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [isSubscriptionError, setIsSubscriptionError] = useState<boolean>(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
    const appDispatch = useAppDispatch();
    const expireDate = subscription?.expireDate ? new Date(subscription.expireDate) : null;
    const formattedDate = expireDate ? expireDate.toISOString().split('T')[0] : '';

    const [subsList, setSubsList] = useState<SubscriptionToBuy[] | null>(null);

    useEffect(() => {
        axios.get<SubscriptionToBuy[]>(serverUrls.subscriptions)
            .then(response => {
                setSubsList(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const validateEmail = (e: ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmailInput(newEmail);
        if (!validator.isEmail(newEmail)) {
            setEmailError(emailStrError);
            setIsEmailInvalid(true);
        } else {
            setEmailError('');
            setIsEmailInvalid(false);
        }
    }

    const validateNewPassword = (e: ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setNewPasswordInput(newPassword);
        if (!validator.isStrongPassword(
                newPassword,
                {
                    minLength: 12,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                })
            || newPassword == oldPasswordInput) {
            setNewPassError(newPassStrError);
            setIsNewPassInvalid(true);
        } else {
            setNewPassError('');
            setIsNewPassInvalid(false);
        }
    }

    const validateConfirmNewPassword = (e: ChangeEvent<HTMLInputElement>) => {
        const newPassConfirm = e.target.value;
        setConfirmNewPasswordInput(newPassConfirm);
        if (newPasswordInput === newPassConfirm) {
            setConfirmNewPassError("");
            setIsConfirmNewPassInvalid(false);
        } else {
            setConfirmNewPassError(confirmNewPassStrError);
            setIsConfirmNewPassInvalid(true);
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

    const showPassword = () => {
        setShowPass(!show);
    }

    useEffect(() => {
        if (user !== null) {
            setEmailInput(user.email);
            setUserNameInput(user.name);
        }
    }, [user]);

    useEffect(() => {
        switch (content) {
            case SettingsContent.data: {
                axios.get<User>(serverUrls.user)
                    .then(response => {
                        setUser(response.data);
                        setIsEmailInvalid(false);
                        setEmailError("");
                        setNameInvalid(false);
                        setNameError("");
                    })
                    .catch(error => {
                        console.log(error);
                    });
                axios.get(serverUrls.userAvatar, {responseType: 'blob'})
                    .then(response => {
                        const imageURL = URL.createObjectURL(response.data);
                        setAvatarUrl(imageURL);
                    })
                    .catch(error => {
                        console.log(error);
                    })
                break;
            }
            case SettingsContent.subs: {
                axios.get<Subscription>(serverUrls.userSubscription)
                    .then(response => {
                        setSubscription(response.data);
                    })
                    .catch((error: AxiosError) => {
                        if (error.response?.status == HttpStatusCode.NotFound)
                            setIsSubscriptionError(true);
                    });
                break;
            }
        }

    }, [content]);

    const handleMenuClick = (currentContent: SettingsContent) => {
        setContent(currentContent);
    };

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

    const changeUserData = () => {
        setButton(true);
        setForm(true);
        const newGUID = Guid();
        appDispatch(addAlert({
            status: AlertStatuses.loading,
            description: 'Changing in progress',
            guid: newGUID
        }));
        axios.post(serverUrls.userUpdate,
            {
                name: userNameInput,
                email: emailInput
            })
            .then(response => {
                appDispatch(changeAlert({
                    status: AlertStatuses.success,
                    description: 'Changing success',
                    guid: newGUID
                }));
                console.log(response.data);
            })
            .catch(error => {
                appDispatch(changeAlert({
                    status: AlertStatuses.error,
                    description: 'Changing error: ' + error.message + '. ' + error.response?.data,
                    guid: newGUID
                }));
                console.log(error);
            })
            .finally(() => {
                setButton(false);
                setForm(false);
            });
        if (avatarInput != null) {
            const form: FormData = new FormData();
            form.append('file', avatarInput);
            appDispatch(changeAvatarAction(form));
        }
    };
    const validateOldPassword = (e: ChangeEvent<HTMLInputElement>) => {
        const oldPass = e.target.value;
        setOldPasswordInput(oldPass);
        if (oldPass.length > 0) {
            setOldPassError("");
            setIsOldPassInvalid(false);
        } else {
            setOldPassError(oldPassErrorStr);
            setIsOldPassInvalid(true);
        }
    };
    const changePassword = () => {
        setButton(true);
        setForm(true);
        const newGUID = Guid();
        appDispatch(addAlert({
            status: AlertStatuses.loading,
            description: 'Changing in progress',
            guid: newGUID
        }));
        axios.post(serverUrls.changePassword,
            {
                oldPassword: oldPasswordInput,
                newPassword: newPasswordInput
            })
            .then(response => {
                appDispatch(changeAlert({
                    status: AlertStatuses.success,
                    description: 'Changing success',
                    guid: newGUID
                }));
                console.log(response.data);
            })
            .catch(error => {
                appDispatch(changeAlert({
                    status: AlertStatuses.error,
                    description: 'Changing error: ' + error.message + '. ' + error.response?.data,
                    guid: newGUID
                }));
                console.log(error);
            })
            .finally(() => {
                setButton(false);
                setForm(false);
            });
    };
    const handleBuySubscription = () => {
        openCloseAction();
    };
    const openCloseAction = () => {
        setIsOpenDrawer(!isOpenDrawer);
    };
    return (
        <div className='settings'>
            <div className='settingBtns boxShadowContainer'>
                <Button
                    onClick={() => handleMenuClick(SettingsContent.data)}
                    aria-label={'Data'}>
                    My personal data
                </Button>
                <Divider/>
                <Button
                    onClick={() => handleMenuClick(SettingsContent.password)}
                    aria-label={'Change password'}>
                    Change password
                </Button>
                <Divider/>
                <Button
                    onClick={() => handleMenuClick(SettingsContent.subs)}
                    aria-label={'Subs'}>
                    My subscription
                </Button>
            </div>
            <Drawer
                preserveScrollBarGap={true}
                isFullHeight={true}
                placement='bottom'
                isOpen={isOpenDrawer}
                onClose={openCloseAction}
            >
                <DrawerOverlay min-width="300px"/>
                <DrawerContent gap={2}>
                    <IconButton
                        marginLeft="auto"
                        marginRight="20px"
                        marginTop="20px"
                        w={10}
                        h={10}
                        className="authLogo"
                        variant='outline'
                        colorScheme='gray'
                        aria-label='Call Sage'
                        fontSize='20px'
                        icon={<MdClear/>}
                        onClick={openCloseAction}
                    />
                    <DrawerHeader
                        padding='0'
                        borderBottomWidth='2px'
                        alignSelf="center"
                        fontSize={30}
                        style={{fontFamily: 'RobotoSlab'}}>
                        Choose your subscription
                    </DrawerHeader>
                    <DrawerBody alignSelf="center">
                        <div className='subsList'>
                            {subsList?.map((value, index) => {
                                return <SubscriptionCard subscription={value} key={index}/>
                            })}
                        </div>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            <div className='settingsContent boxShadowContainer'>
                {
                    content === SettingsContent.data ?
                        <FormControl
                            isDisabled={isFormDisabled}
                            isRequired={true}
                            isInvalid={isEmailInvalid || isNewPassInvalid || isNameInvalid || isOldPassInvalid || isConfirmNewPassInvalid}>
                            <FormErrorMessage>{nameError}</FormErrorMessage>
                            <Input
                                id='name'
                                isInvalid={isNameInvalid}
                                value={userNameInput}
                                onChange={validateName}
                                marginBottom='15px'
                                marginTop='5px'
                                type='text'
                                placeholder='Name'/>
                            <FormErrorMessage>{emailError}</FormErrorMessage>
                            <Input
                                id='email'
                                isInvalid={isEmailInvalid}
                                value={emailInput}
                                onChange={validateEmail}
                                marginBottom='15px'
                                marginTop='5px'
                                type='email'
                                placeholder='Email'/>
                            <Input
                                id='avatar'
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
                            <label htmlFor="avatar">
                                <Button
                                    isDisabled={isButtonDisabled}
                                    as="span"
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

                            <div className='newFormBtn'>
                                <Button
                                    isDisabled={
                                        isEmailInvalid || isAvatarInvalid ||
                                        isNameInvalid || isButtonDisabled}
                                    marginTop='20px'
                                    style={{fontFamily: 'RobotoSlab'}}
                                    colorScheme='gray'
                                    variant='outline'
                                    fontSize='20px'
                                    onClick={changeUserData}
                                >
                                    Save
                                </Button>
                            </div>
                        </FormControl>
                        : content === SettingsContent.password ?
                            <FormControl
                                isDisabled={isFormDisabled}
                                isRequired={true}
                                isInvalid={isNewPassInvalid || isOldPassInvalid || isConfirmNewPassInvalid}>
                                <FormErrorMessage>{oldPassError}</FormErrorMessage>
                                <InputGroup>
                                    <Input
                                        id='oldPass'
                                        value={oldPasswordInput}
                                        onChange={validateOldPassword}
                                        isInvalid={isOldPassInvalid}
                                        marginBottom='15px'
                                        marginTop='5px'
                                        type={show ? 'text' : 'password'}
                                        placeholder='Old password'/>
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
                                <FormErrorMessage>{newPassError}</FormErrorMessage>
                                <Input
                                    id='newPass'
                                    value={newPasswordInput}
                                    onChange={validateNewPassword}
                                    isInvalid={isNewPassInvalid}
                                    marginBottom='15px'
                                    marginTop='5px'
                                    type={show ? 'text' : 'password'}
                                    placeholder='New password'/>
                                <FormErrorMessage>{confirmNewPassError}</FormErrorMessage>
                                <Input
                                    value={confirmNewPasswordInput}
                                    id='confirmNewPassRegister'
                                    onChange={validateConfirmNewPassword}
                                    isInvalid={isConfirmNewPassInvalid}
                                    marginBottom='15px'
                                    marginTop='5px'
                                    type={show ? 'text' : 'password'}
                                    placeholder='Confirm new password'/>
                                <div className='newFormBtn'>
                                    <Button
                                        isDisabled={
                                            isNewPassInvalid || isOldPassInvalid || isConfirmNewPassInvalid || isButtonDisabled}
                                        marginTop='20px'
                                        style={{fontFamily: 'RobotoSlab'}}
                                        colorScheme='gray'
                                        variant='outline'
                                        fontSize='20px'
                                        onClick={changePassword}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </FormControl>
                            : content === SettingsContent.subs ?
                                isSubscriptionError ?
                                    <>
                                        <Text>You have no active subscription</Text>
                                        <Button
                                            onClick={handleBuySubscription}>
                                            Buy subscription
                                        </Button>
                                    </>
                                    :
                                    <>
                                        <Text margin={0}>{"Your subscription expires"}</Text>
                                        <Text margin={0}>{formattedDate}</Text>
                                        <Button
                                            onClick={handleBuySubscription}>
                                            Extend subscription
                                        </Button>
                                    </>
                                : <></>
                }
            </div>
        </div>

    )
}

export default Settings;