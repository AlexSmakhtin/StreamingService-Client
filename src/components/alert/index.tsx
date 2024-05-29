import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {Alert, AlertDescription, AlertIcon, Box, CloseButton} from "@chakra-ui/react";
import {AlertState, removeAlert} from "../../store/alertStore.ts";
import {useEffect} from "react";
import {motion} from "framer-motion";
import './style.css'

const AlertRequest = () => {
    const alerts = useAppSelector((state) => state.alert)
    const appDispatch = useAppDispatch();
    const timeout = 5000;

    useEffect(() => {
        const removeAlertAfterDelay = (alert: AlertState) => {
            setTimeout(() => {
                appDispatch(removeAlert(alert.guid));
            }, timeout);
        };
        alerts.forEach((alert) => {
            removeAlertAfterDelay(alert);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alerts]);

    return (
        <div>
            {alerts.map((alert, index) => (
                <motion.div
                    className="motionDiv"
                    key={index}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.4}}
                >
                    <Alert colorScheme='gray' key={index} status={alert.status} variant='subtle'>
                        <AlertIcon/>
                        <Box>
                            <AlertDescription marginRight='25px'>
                                {alert.description}
                            </AlertDescription>
                        </Box>
                        <CloseButton
                            position='absolute'
                            right='10px'
                            onClick={() => appDispatch(removeAlert(alert.guid))}
                        />
                    </Alert>
                </motion.div>
            ))}
        </div>
    )
};

export default AlertRequest;