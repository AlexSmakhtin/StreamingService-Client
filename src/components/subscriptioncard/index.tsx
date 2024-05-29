import {SubscriptionToBuy} from "../../dto/subscription.ts";
import React, {useState} from "react";
import {Button, Card, CardBody, CardHeader, Divider, Text} from "@chakra-ui/react";
import {v4 as Guid} from "uuid";
import {addAlert, AlertStatuses, changeAlert} from "../../store/alertStore.ts";
import {serverUrls} from "../../constants/serverUrl.ts";
import {useAppDispatch} from "../../store/store.ts";
import axios from "axios";

interface SubscriptionCardProps {
    subscription: SubscriptionToBuy
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({subscription}) => {
    const appDispatch = useAppDispatch();
    const [isButtonDisabled, setButton] = useState<boolean>(false);

    const handlePurchaseSubscription = () => {
        const newGUID = Guid();
        appDispatch(addAlert({
            status: AlertStatuses.loading,
            description: 'Changing in progress',
            guid: newGUID
        }));
        axios.post(serverUrls.purchaseSubscription + `?subscriptionId=${subscription.id}`)
            .then(response => {
                appDispatch(changeAlert({
                    status: AlertStatuses.success,
                    description: 'Purchase success',
                    guid: newGUID
                }));
                console.log(response.data);
            })
            .catch(error => {
                appDispatch(changeAlert({
                    status: AlertStatuses.error,
                    description: 'Purchase error: ' + error.message + '. ' + error.response?.data,
                    guid: newGUID
                }));
                console.log(error);
            })
            .finally(() => {
                setButton(false);
            });
    };

    return (
        <Card
            textAlign={'center'}
            width={'200px'}>
            <CardHeader
                padding={'20px'}>
                <Text
                    fontSize='30px'
                    margin={0}>
                    {subscription.name}
                </Text>
            </CardHeader>
            <Divider/>
            <CardBody
                margin={'auto'}>
                <Button
                    isDisabled={isButtonDisabled}
                    onClick={handlePurchaseSubscription}
                    textAlign={'center'}
                    fontSize='20px'
                    margin={0}>
                    {`$${subscription.cost}`}
                </Button>
            </CardBody>
        </Card>
    )
}
export default SubscriptionCard;