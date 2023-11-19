import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import OrderScreen from './Main'
import ScreenName from '../../controllers/ScreenName'
import DetailsOrder from './DetailsOrder'

const ContainerOrder = () => {
    const Stack = createStackNavigator()

    return (
        <Stack.Navigator initialRouteName={ScreenName.orderScreen} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={ScreenName.orderScreen} component={OrderScreen} />
            <Stack.Screen name={ScreenName.detailsOrderScreen} component={DetailsOrder} />
        </Stack.Navigator>
    )
}

export default ContainerOrder